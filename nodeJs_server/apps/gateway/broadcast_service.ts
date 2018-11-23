import "./broadcast_proto"
import { BaseSession } from "../../netbus/netbus";
import log = require("../../utils/log");
import service_interface from "../../netbus/service_interface";
import { Socket } from "net";
import gateway_service from "./gateway_service";
/**
 *  ----------------  广播服务 -------------------
 */
interface BROADCAST_interface{
    cmd_buf: Buffer,                // 命令内容
    users: Array<number>;          // userid数组
}
export default class broadcast_service implements service_interface<Socket>{
    
    stype: number = 10000;
    // 服务名 
    service_name: string = "broadcast_service";
    // 是否转发
    is_transfer: boolean = false;

    init(): any{

    }

    on_recv_client_cmd(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {
        
        

    }
    // 客户端断开连接
    on_client_disconnect(stype: number, uid: number): any {
    }

    // 接收到服务器发送来的数据
    on_recv_server_return(session: BaseSession, stype: number, ctype: number, body: BROADCAST_interface, utag: number, proto_type: number, raw_cmd: any): any {
        log.info(stype, ctype);
        let cmd_buf = body.cmd_buf;
        let users = body.users;
        for(let i in users) {
            let client_session =  gateway_service.getInstance().get_session_by_uid(users[i]);
            if(!client_session) {
                continue;
            }
            client_session.send_encoded_cmd(cmd_buf);
        }
    }
}