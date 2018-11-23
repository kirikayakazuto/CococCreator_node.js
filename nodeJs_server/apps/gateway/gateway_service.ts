import service_interface from "../../netbus/service_interface"
import {BaseSession, netbus} from "../../netbus/netbus";
import { Socket } from "net";
import log from "../../utils/log"
import proto_tools from "../../netbus/proto_tools";
import proto_man from "../../netbus/proto_man";
import Cmd from "../Cmd"
import Stype from "../Stype";
import Response from "../Response";
import "./gateway_proto"

/**
 * gateway  网关 用户都连接到这个服务, 再与其他服务进行交互
 */
export default class gateway_service implements service_interface<Socket>{

    private static instance: gateway_service = null;
    public static getInstance(): gateway_service {
        if(!gateway_service.instance) {
            gateway_service.instance = new gateway_service();
        }
        return gateway_service.instance;
    }

    // 服务号
    stype: number = 0;
    // 服务名 
    service_name: string = "gateway_service";
    // 是否转发
    is_transfer: boolean = true;

    uid_session_map: {[key: string] : any} = {};

    init(): any {
    }
    // 判断是否是登录命令
    is_login_cmd(stype: number, ctype: number) {
        if(stype != Stype.Auth) {
            // log.error("is_login_cmd err");
            return false;
        }
        if(ctype == Cmd.Auth.GUEST_LOGIN) {
            return true;
        }else if(ctype == Cmd.Auth.UNAME_LOGIN) {
            return true;
        }
        return false;
    }
    // 还没有登录
    is_befor_login_cmd(stype: number, ctype: number) {
        if(stype != Stype.Auth) {
            // log.error("is_befor_login_cmd err");
            return false;
        }
        let cmd_set = [Cmd.Auth.GUEST_LOGIN, Cmd.Auth.UNAME_LOGIN, 
                        Cmd.Auth.GET_PHONE_REG_VERIFY, Cmd.Auth.PHONE_REG_ACCOUNT,
                        Cmd.Auth.GET_FORGET_PWD_VERIFY, Cmd.Auth.RESET_USER_PWD];
        for(let i=0; i<cmd_set.length; i++) {
            if(ctype == cmd_set[i]) {
                return true;
            }
        }
        return false;
    }
    // 获取用户session
    get_session_by_uid(uid: number): BaseSession {
        if(this.uid_session_map[uid]) {
            return this.uid_session_map[uid];
        }

        return null;
    }
    // 存储用户session
    save_session_with_uid(uid: number, session: BaseSession, proto_type: number) {
        this.uid_session_map[uid] = session;
        session.proto_type = proto_type;
    }
    // 删除用户session'
    clear_session_with_uid(uid: number) {
        this.uid_session_map[uid] = null;
        delete this.uid_session_map[uid];
    }
    // 接到客户端的数据
    on_recv_client_cmd(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {
        log.info(stype, ctype, body);
        let server_session: BaseSession = netbus.get_server_session(stype);
        if(!server_session) {
            log.error("on_recv_client_cmd server_session error");
            return ;
        }
        if(this.is_befor_login_cmd(stype, ctype)) {
            utag = session.session_key;
        }else {
            if(!session.uid) {
                return ;
            }
            utag = session.uid;
        }
        proto_tools.write_utag_inbuf(raw_cmd, utag);
        server_session.send_encoded_cmd(raw_cmd);
    }
    // 服务器发送给gateway的转发数据 数据还没解码 在 raw_cmd中
    on_recv_server_return(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {

        log.info("gateway_service stype: " + stype + " ctype: " + ctype);
        let client_session: BaseSession = null;
        if(this.is_befor_login_cmd(stype, ctype)) {
            client_session = netbus.get_client_session(utag);
            if(!client_session) {
                log.error("on_recv_server_return client_session errot");
                return ;
            }
            if(this.is_login_cmd(stype, ctype)) {
                let cmd_ret = proto_man.decode_cmd(proto_type, stype, ctype, raw_cmd);
                body = cmd_ret[2];
                if(body.status == Response.OK) {
                    let prev_session = this.get_session_by_uid(body.uid);
                    if(prev_session) {
                        prev_session.send_cmd(stype, Cmd.Auth.RELOGIN, null, 0, prev_session.proto_type);
                        prev_session.uid  = 0;
                        netbus.session_close(prev_session);
                    }

                    client_session.uid = body.uid;
                    this.save_session_with_uid(body.uid, client_session, proto_type)
                    body.uid = 0;
                    raw_cmd = proto_man.encode_cmd(utag, proto_type, stype, ctype, body);
                }
            }
        }else {
            client_session = this.get_session_by_uid(utag);
            
            if(!client_session){
                return ;
            }
        }
        // 服务器的数据 不需要utag  utag是用来标识客户端
        proto_tools.clear_utag_inbuf(raw_cmd);
        client_session.send_encoded_cmd(raw_cmd);
    }

    // 客户端断开连接    断线重连的入口
    on_client_disconnect(stype: number, uid: number): any {
        
        if(stype == Stype.Auth) {
            this.clear_session_with_uid(uid);
        }
        log.warn("on_client_disconnect stype: " + stype);
        let server_session = netbus.get_server_session(stype);
        if(!server_session) {
            log.error("on_client_disconnect server_session error");
            return ;
        }
    
        let utag = uid;
        server_session.send_cmd(stype, Cmd.USER_DISCONNECT, null, utag, proto_man.PROTO_JSON);

    }
}