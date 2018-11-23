import service_interface from "../../netbus/service_interface"
import {BaseSession} from "../../netbus/netbus"
import { Socket } from "net";
import log from "../../utils/log"
import Cmd from "../Cmd";
import Stype from "../Stype"
import Response from "../Response"

import auth_model from "./auth_model"
import "./auth_proto"



export default class auth_service implements service_interface<Socket>{
    // 服务号
    stype: number = 2;
    // 服务名 
    service_name: string = "auth_service";
    // 是否转发
    is_transfer: boolean = false;

    init(): any{

    }
    // 接到客户端的数据
    on_recv_client_cmd(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {
        // log.info("" + stype + ctype + body);
        switch(ctype) {
            case Cmd.Auth.GUEST_LOGIN:                          // 游客登录
                guest_login(session, utag, proto_type, body);
            break;
            case Cmd.Auth.EDIT_PROFILE:                         // 更改用户资料
                edit_profile(session, utag, proto_type, body)
            break;
            case Cmd.Auth.GUEST_UPGRADE_INDENTIFY:              // 游客账号升级
                get_guest_upgrade_indentify(session, utag, proto_type, body);
            break;
            case Cmd.Auth.BIND_PHONE_NUM:                       // 游客账号绑定电话号码 
                guest_bind_phone_num(session, utag, proto_type, body);
            break;
            case Cmd.Auth.UNAME_LOGIN:                          // 正式用户登录
                uname_login(session, utag, proto_type, body);
            break;
            case Cmd.Auth.GET_PHONE_REG_VERIFY:                 // 获取用户注册 的验证码
                get_phone_reg_verify_code(session, utag, proto_type, body);    
            break;
            case Cmd.Auth.PHONE_REG_ACCOUNT:                    // 用户注册
                reg_phone_account(session, utag, proto_type, body);
            break;
            case Cmd.Auth.GET_FORGET_PWD_VERIFY:                // 获取 忘记密码的 验证码
                get_forget_pwd_verify_code(session, utag, proto_type, body);
            break;
            case Cmd.Auth.RESET_USER_PWD:                       // 重置密码 
                reset_user_pwd(session, utag, proto_type, body);
            break;


        }
    }
    // 客户端断开连接
    on_client_disconnect(stype: number, uid: number): any {

    }
    // 接收到服务器发送来的数据
    on_recv_server_return(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {

    }
}
// 游客登录入口
function guest_login(session: BaseSession, utag: number, proto_type: number, body: any) {
    if(!body) {
        session.send_cmd(Stype.Auth, Cmd.Auth.GUEST_LOGIN, Response.INVALID_PARAMS, utag, proto_type);
        return false;
    }

    let ukey = body;
    // log.info("ukey : " + body);
    auth_model.guest_login(ukey, (ret) => {
        session.send_cmd(Stype.Auth, Cmd.Auth.GUEST_LOGIN, ret, utag, proto_type);
    });
}
// 修改资料
function edit_profile(session: BaseSession, uid: number, proto_type: number, body: {unick: string, usex: number, }) {
    if(!body || !body.unick || (body.usex != 0 && body.usex != 1)) {
        session.send_cmd(Stype.Auth, Cmd.Auth.EDIT_PROFILE, Response.INVALID_PARAMS, uid, proto_type);
        return ;
    }
    auth_model.edit_profile(uid, body.unick, body.usex, (body: any) => {
        session.send_cmd(Stype.Auth, Cmd.Auth.EDIT_PROFILE, body, uid, proto_type);
    });
}

// 验证码拉取
function get_guest_upgrade_indentify(session: BaseSession, uid: number, proto_type: number, body: any) {
    if(!body || typeof(body[0]) == "undefined"
             || typeof(body[1]) == "undefined" || !is_phone_number(body[1])
             || typeof(body[2]) == "undefined"
    ) {
        session.send_cmd(Stype.Auth, Cmd.Auth.GUEST_UPGRADE_INDENTIFY, Response.INVALID_PARAMS, uid, proto_type);
        return ;
    }
    // 发送信息给客户端
    auth_model.get_upgrade_indentify(uid, body[1], body[0], (body) => {
        // log.info("#############");
        session.send_cmd(Stype.Auth, Cmd.Auth.GUEST_UPGRADE_INDENTIFY, body, uid, proto_type);
    });
        
}
// 绑定手机号
function guest_bind_phone_num(session: BaseSession, uid: number, proto_type: number, body: any) {
    if(!body ||!body[0] || !body[1] || !body[2]) {
        session.send_cmd(Stype.Auth, Cmd.Auth.BIND_PHONE_NUM, Response.INVALID_PARAMS, uid, proto_type);
        return ;
    }

    auth_model.guest_bind_phone_number(uid, body[0], body[1], body[2], (body) => {
        session.send_cmd(Stype.Auth, Cmd.Auth.BIND_PHONE_NUM, body, uid, proto_type);
    });
    
}

function is_phone_number(phone_num: string): boolean {
    
    if(phone_num.length != 11) {
        log.error("is_phone_number 电话号码错误!");
        return false;
    }
    for(let i=0; i<phone_num.length; i++) {
        let ch = phone_num.charAt(i);
        if(ch < '0' || ch > '9') {
            log.error("is_phone_number 电话号码错误!");
            return false;
        }
    }

    return true;
}
// 正式账号登录
function uname_login(session: BaseSession, utag: number, proto_type: number, body: any) {
    if(!body || !body[0] || !body[1]) {
        session.send_cmd(Stype.Auth, Cmd.Auth.UNAME_LOGIN, Response.INVALID_PARAMS, utag, proto_type);
        return ;
    }

    let uname = body[0];
    let upwd = body[1];

    auth_model.uname_login(uname, upwd, (ret: any) => {
        session.send_cmd(Stype.Auth, Cmd.Auth.UNAME_LOGIN, ret, utag, proto_type);
    });
    
}
/**
 * --------------------------------------------正式用户注册--------------------------------------------------------------
 */
// 手机注册  获取验证码
function get_phone_reg_verify_code(session: BaseSession, utag: number, proto_type: number, body: any) {
    if(!body || typeof(body[0]) == "undefined" 
             || typeof(body[1]) == "undefined") {
        session.send_cmd(Stype.Auth, Cmd.Auth.GET_PHONE_REG_VERIFY, Response.INVALID_PARAMS, utag, proto_type);
        return ;
    }

    auth_model.get_phone_reg_verify_code(body[1], (body: number) => {   // body是一个 状态码 status
        session.send_cmd(Stype.Auth, Cmd.Auth.GET_PHONE_REG_VERIFY, body, utag, proto_type);
    });

}
// 正式用户注册
function reg_phone_account(session: BaseSession, utag: number, proto_type: number, body: any) {
    log.warn("reg_phone_account");
    if(!body || !body[0] || !body[1] || !body[2] || !body[3]) {
        session.send_cmd(Stype.Auth, Cmd.Auth.PHONE_REG_ACCOUNT, Response.INVALID_PARAMS, utag, proto_type);
        return ;
    }
    
    auth_model.reg_phone_account(body[0], body[1], body[2], body[3], (body: number) => {    // body是一个 状态码 status
        session.send_cmd(Stype.Auth, Cmd.Auth.PHONE_REG_ACCOUNT, body, utag, proto_type);
    });
}
/**
 * -----------------------------------------------------重置密码-------------------------------------------------------------
 */
// 获取忘记密码的验证码
function get_forget_pwd_verify_code(session: BaseSession, utag: number, proto_type: number, body: any) {
    if(!body || typeof(body[0]) == "undefined" 
             || typeof(body[1]) == "undefined") {
        session.send_cmd(Stype.Auth, Cmd.Auth.GET_FORGET_PWD_VERIFY, Response.INVALID_PARAMS, utag, proto_type);
        return ;
    }

    auth_model.get_forget_pwd_verify_code(body[1], (body: number) => {   // body是一个 状态码 status
        session.send_cmd(Stype.Auth, Cmd.Auth.GET_FORGET_PWD_VERIFY, body, utag, proto_type);
    });
}
// 重置密码
function reset_user_pwd(session: BaseSession, utag: number, proto_type: number, body: any) {
    if(!body || !body[0] || !body[1] || !body[2]) {
		session.send_cmd(Stype.Auth, Cmd.Auth.RESET_USER_PWD, Response.INVALID_PARAMS, utag, proto_type);
		return;
    }

    auth_model.reset_user_pwd(body[0], body[1], body[2], (body: number) => { // body是一个 状态码 status
        session.send_cmd(Stype.Auth, Cmd.Auth.RESET_USER_PWD, body, utag, proto_type);
    });
}
