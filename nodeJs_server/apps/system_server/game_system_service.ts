import service_interface from "../../netbus/service_interface"
import {BaseSession} from "../../netbus/netbus"
import { Socket } from "net";
import log from "../../utils/log"
import Cmd from "../Cmd";
import Stype from "../Stype"
import Response from "../Response"

import game_system_model from "./game_system_model"
import "./game_system_proto"


export default class game_system_service implements service_interface<Socket>{
    // 服务号
    stype: number = 3;
    // 服务名 
    service_name: string = "game_system_service";
    // 是否转发
    is_transfer: boolean = false;

    init(): any{

    }

    on_recv_client_cmd(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {
        log.info(stype, ctype, body);
        switch(ctype) {
            case Cmd.GameSystem.GET_GAME_INFO:    // 登录 游戏 服务器
                get_game_info(session, utag, proto_type, body);
            break;
            case Cmd.GameSystem.LOGIN_BONUES_INFO:  // 获取 每日登录奖励
                get_login_bonues_info(session, utag, proto_type, body);
            break;
            case Cmd.GameSystem.RECV_LOGIN_BUNUES:
                recv_login_bonues(session, utag, proto_type, body);
            break;
            case Cmd.GameSystem.GET_WORLD_RANK_INFO:
                get_world_rank_info(session, utag, proto_type, body);
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
//  
function get_game_info(session: BaseSession, uid: number, proto_type: number, body: any) {
    game_system_model.get_game_info(uid, (body) => {
        // log.warn(body);
        session.send_cmd(Stype.GAME_SYSTEM, Cmd.GameSystem.GET_GAME_INFO, body, uid, proto_type);
    });
}

function get_login_bonues_info(session: BaseSession, uid: number, proto_type: number, body: any) {
    game_system_model.get_login_bonues_info(uid, (body) => {
        session.send_cmd(Stype.GAME_SYSTEM, Cmd.GameSystem.LOGIN_BONUES_INFO, body, uid, proto_type);
    });
}

function recv_login_bonues(session: BaseSession, uid: number, proto_type: number, body: any) {
    if(!body) {
        session.send_cmd(Stype.GAME_SYSTEM, Cmd.GameSystem.RECV_LOGIN_BUNUES, Response.INVALID_PARAMS, uid, proto_type);
        return ;
    }

    let bonues_id: number = body;
    game_system_model.recv_login_bonues(uid, bonues_id, (body) => {
        session.send_cmd(Stype.GAME_SYSTEM, Cmd.GameSystem.RECV_LOGIN_BUNUES, body, uid, proto_type);
    });
}

function get_world_rank_info(session: BaseSession, uid: number, proto_type: number, body: any) {
    game_system_model.get_world_rank_info(uid, (body) => {      //let ret = {};ret[0] = Response.OK;ret[1] = rank_array.length;ret[2] = rank_array;
        session.send_cmd(Stype.GAME_SYSTEM, Cmd.GameSystem.GET_WORLD_RANK_INFO, body, uid, proto_type);
    });
}
