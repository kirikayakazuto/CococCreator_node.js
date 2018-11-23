import service_interface from "../../netbus/service_interface"
import {BaseSession} from "../../netbus/netbus";
import { Socket } from "net";

import log = require("../../utils/log");
import proto_man from "../../netbus/proto_man";
import Cmd from "../Cmd"


enum TalkCmd {
    Enter = 1, // 用户进来
	Exit = 2, // 用户离开ia
	UserArrived = 3, // 别人进来;
	UserExit = 4, // 别人离开

	SendMsg = 5, // 自己发送消息,
	UserMsg = 6, // 收到别人的消息
}

enum Response {
    OK = 1,
    IS_IN_TALKROOM = -100, // 玩家已经在聊天室
	NOT_IN_TALKROOM = -101, // 玩家不在聊天室
	INVALD_OPT = -102, // 玩家非法操作
	INVALID_PARAMS = -103, // 命令格式不对
}

let STYPE_TALKROOM: number = 1;

export default class talk_room implements service_interface<Socket> {
    stype = 1;
    service_name = "talk room"
    is_transfer = false;
    
    init() {
        log.info("talk room init");
    }

    on_recv_client_cmd(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {
        log.info("talk room on_recv_client_cmd ctype:" + ctype + " body: " + body);
        switch(ctype) {
            
            case TalkCmd.Enter: // 客户端 用户进入聊天室
                on_user_enter_talkroom(session, body, utag, proto_type);
            break;
            
            case TalkCmd.Exit: // 客户端 用户关闭聊天室
                on_user_exit_talkroom(session, false, utag, proto_type);
            break;
            
            case TalkCmd.SendMsg: // 客户端 用户发送消息
                on_user_send_msg(session, body, utag, proto_type);
            break;

            case Cmd.USER_DISCONNECT:   // 网关发来的消息,  服务器主动关闭客户端
                on_user_exit_talkroom(session, true, utag, proto_type);
            break;

        }

    }

    // 客户端断开连接
    on_client_disconnect(stype: number, uid: number): any {
        log.warn("lost connect with gateway stype: " + stype);
    }

    on_recv_server_return(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any) {
        log.info("on_recv_server_return");
    }
}
// 转发给当前聊天室中的所有人
function broadcast_cmd(ctype: number, body: any, noto_user: number) {
    let json_encoded = null;
    let buf_encoded = null;
    for(let key in room){
        if(room[key].utag != noto_user) {
            let session = room[key].session;
            let utag = room[key].utag;
            let proto_type = room[key].proto_type;

            if(proto_type == proto_man.PROTO_JSON) {
                if(json_encoded == null) {
                    // 获得一个已经编码好的 命令   ,  避免 当前循环 对房间每一个用户发送命令是  重复编码
                    json_encoded = proto_man.encode_cmd(utag, proto_type, STYPE_TALKROOM, ctype, body);
                }
                session.send_encoded_cmd(json_encoded);
            } else if(proto_type == proto_man.PROTO_BUF) {
                if(buf_encoded == null) {
                    // 获得一个已经编码好的 命令   ,  避免 当前循环 对房间每一个用户发送命令是  重复编码
                    buf_encoded = proto_man.encode_cmd(utag, proto_type, STYPE_TALKROOM, ctype, body);
                }
                session.send_encoded_cmd(buf_encoded);
            }
            
        }
    }
}
// 聊天室用户列表
let room:{[key: number] : {session: BaseSession, utag: number, proto_type: number, uinfo: {uname: string, usex: string}}} = {};

function on_user_enter_talkroom(BaseSession: BaseSession, body: {uname: string, usex: string}, utag: number, proto_type: number) {
    if(typeof(body.uname == "undefine" ||
        typeof(body.usex) == "undefined")) {
            BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.Enter, Response.INVALID_PARAMS, utag, proto_type);
    }

    if(room[utag]) {    // 用户已经在聊天室中
        BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.Enter, Response.IS_IN_TALKROOM, utag, proto_type);
        return ;
    }

    BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.Enter, Response.OK, utag, proto_type);

    // 告诉 房间内所有用户(除自己) 发送通知(房间中有其他用户进入)
    broadcast_cmd(TalkCmd.UserArrived, body, utag);
    // 把房间中所有用户(除自己) 向自己发通知 
    for(let key in room){
        BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.UserArrived, room[key].uinfo, utag, proto_type);
    }
    
    let talkman = {
        session : BaseSession,
        utag : utag,
        proto_type : proto_type,
        uinfo : body,
    }
    room[utag] = talkman;
}
// is_lost_connect  这个参数的意思是   判断客户端是否已经断开连接(1, 用户主动退出房间 2, 用户断网了)
function on_user_exit_talkroom(BaseSession: BaseSession, is_lost_connect: boolean, utag: number, proto_type: number) {
    if(!room[utag]) {
        if(!is_lost_connect) {
            BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.Exit, Response.NOT_IN_TALKROOM, utag, proto_type);
        }
        return;
    }
    // 把用户退出房间的消息  通知给房间的其他人
    broadcast_cmd(TalkCmd.UserExit, room[utag].uinfo, utag);

    room[utag] = null;
    delete room[utag];

    if(!is_lost_connect) {
        BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.Exit, Response.OK, utag, proto_type);
    }
}

function on_user_send_msg(BaseSession: BaseSession, msg: any, utag: number, proto_type: number) {
    if(!room[utag]) {
        BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.SendMsg, {
            0: Response.INVALD_OPT,
        }, utag, proto_type);
        return ;
    }

    BaseSession.send_cmd(STYPE_TALKROOM, TalkCmd.SendMsg, {
        0: Response.OK,
        1: room[utag].uinfo.uname,
        2: room[utag].uinfo.usex,
        3: msg,
    }, utag, proto_type);

    broadcast_cmd(TalkCmd.UserMsg, {
        0: room[utag].uinfo.uname,
        1: room[utag].uinfo.usex,
        2: msg,
    }, utag);
}
