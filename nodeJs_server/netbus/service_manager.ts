import service_interface from "./service_interface";
import {BaseSession} from "./netbus";
import proto_man from "./proto_man";

import log = require("../utils/log");
/**
 * 向外导出 netbus 中 的两个接口
 */
export default class service_manager<T> {

    private static instance: service_manager<any> = null;

    public static getInstance<T>(): service_manager<T> {
        if(!service_manager.instance) {
            service_manager.instance = new service_manager<T>();
        }
        return service_manager.instance;
    }

    private constructor() {}

    // 所有服务保存列表
    private service_modules: {[key: string] : service_interface<T>} = {};

    // 注册服务
    register_service(stype: number, service: service_interface<T>) {
        log.info("register_service stype: " + stype + " " + service.service_name);
        if(this.service_modules[stype]) {
            log.warn(this.service_modules[stype].service_name + "service_modules is registed");
        }

        this.service_modules[stype] = service;
        service.init();
    }
    // 客户端掉线
    on_client_lost_connect(BaseSession: BaseSession) {
        let uid = BaseSession.uid;
        if(!uid || uid == 0) {
            log.error("on_client_lost_connect uid error || uid undefine");
            return ;
        }
        BaseSession.uid = 0;
        for(let key in this.service_modules) {
            this.service_modules[key].on_client_disconnect(parseInt(key), uid);
        }
    }
    // 收到客户端 数据
    on_recv_client_cmd(BaseSession: BaseSession, cmd_buf: Buffer): boolean {
        
        if(BaseSession.is_encrypt) {    // 如果是加密的Session
            cmd_buf = proto_man.decrypt_cmd(cmd_buf);
        }
        let stype: number, ctype: number, utag: number, proto_type: number, body: any;
        // 先解开 协议头
        let cmd = proto_man.decode_cmd_header(cmd_buf);
        if(!cmd) {
            log.error("on_recv_client_cmd error");
            return false;
        }

        stype = cmd[0];
        ctype = cmd[1];
        utag = cmd[2];
        proto_type = cmd[3];

        // 判断服务是否存在
        if(!this.service_modules[stype]) {
            log.error("on_recv_client_cmd service_modules error");
            return false;
        }
        // 判断服务是否是转发模块
        if(this.service_modules[stype].is_transfer) {
            this.service_modules[stype].on_recv_client_cmd(BaseSession, stype, ctype, null, utag, proto_type, cmd_buf);
            return true;
        }
        cmd = proto_man.decode_cmd(proto_type, stype, ctype, cmd_buf);
        if(!cmd) {
            log.error("on_recv_client_cmd cmd undefine");
            return false;
        }

        body = cmd[2];
        this.service_modules[stype].on_recv_client_cmd(BaseSession, stype, ctype, body, utag, proto_type, cmd_buf);
        return true;
    }
    /**
     * ---------------------------------------内部服务器通道------------------------------------------
     */
    // 注册服务器服务

    on_recv_server_return(BaseSession: BaseSession, cmd_buf): boolean {
        if(BaseSession.is_encrypt) {
            cmd_buf = proto_man.decrypt_cmd(cmd_buf);
        }

        let stype: number, ctype: number, utag: number, proto_type: number, body: any;

        let cmd = proto_man.decode_cmd_header(cmd_buf);
        if(!cmd) {
            log.error("on_recv_server_return cmd error");
            return false;
        }
        stype = cmd[0];
        ctype = cmd[1];
        utag = cmd[2];
        proto_type = cmd[3];

        if(this.service_modules[stype].is_transfer) { // 转发模块   进入gateway
            this.service_modules[stype].on_recv_server_return(BaseSession, stype, ctype, null, utag, proto_type, cmd_buf);
            return true;
        }
        cmd = proto_man.decode_cmd(proto_type, stype, ctype, cmd_buf);
        if(!cmd) {
            log.error("on_recv_server_return decode_cmd error");
            return false;
        }
        body = cmd[2];
        
        this.service_modules[stype].on_recv_server_return(BaseSession, stype, ctype, body, utag, proto_type, cmd_buf);
        return true;
    }

}





