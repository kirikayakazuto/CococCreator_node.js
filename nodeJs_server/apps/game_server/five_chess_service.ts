import service_interface from "../../netbus/service_interface"
import {BaseSession} from "../../netbus/netbus"
import { Socket } from "net";
import log from "../../utils/log"
import Cmd from "../Cmd";
import Stype from "../Stype"
import Response from "../Response"

import "./five_chess_proto"
import "../gateway/broadcast_proto"
import five_chess_model from "./five_chess_model";


export default class five_chess_service implements service_interface<Socket>{
    // 服务号 GAME_FIVE_CHESS: number = 4;
    stype: number = 4;
    // 服务名 
    service_name: string = "five_chess_service";
    // 是否转发
    is_transfer: boolean = false;

    init(): any{

    }

    on_recv_client_cmd(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any {
        log.info(stype, ctype, body);
        switch(ctype) {
            case Cmd.GameFiveChess.ENTER_ZONE:
                enter_zone(session, utag, proto_type, body);
            break;
            case Cmd.GameFiveChess.USER_QUIT:
                user_quit(session, utag, proto_type, body);
            break;
            case Cmd.USER_DISCONNECT:
                user_lost_connect(session, utag, proto_type, body);
            break;
            case Cmd.GameFiveChess.SEND_PROP:
                send_prop(session, utag, proto_type, body);
            break;
            case Cmd.GameFiveChess.SEND_DO_READY:
                do_player_ready(session, utag, proto_type, body);
            break;
            case Cmd.GameFiveChess.PUT_CHESS:
                do_player_put_chess(session, utag, proto_type, body);
            break;
            case Cmd.GameFiveChess.GET_PREV_ROUND:
                do_player_get_prev_round_data(session, utag, proto_type, body);
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
// 进入某个五子棋游戏区块
function enter_zone(session: BaseSession, uid: number, proto_type: number, body: any) { // body是一个zid
    if(!body) {
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ENTER_ZONE, Response.INVALID_PARAMS, uid, proto_type);
        return ;
    }
    let zid = body;
    five_chess_model.enter_zone(uid, zid, session, proto_type, (body: number) => {   // body是一个status 
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ENTER_ZONE, body, uid, proto_type);
    });
}
// 玩家退出
function user_quit(session: BaseSession, uid: number, proto_type: number, body: any) {  // body  为空
    five_chess_model.user_quit(uid, (body) => {
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.USER_QUIT, body, uid, proto_type);
    });
}
function user_lost_connect(session: BaseSession, uid: number, proto_type: number, body: any) {
    five_chess_model.user_lost_connect(uid);
}
//
function send_prop(session: BaseSession, uid: number, proto_type: number, body: any) {
    if(!body) {
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.SEND_PROP, Response.INVALID_PARAMS, uid, proto_type);
        return ;
    }

    let prop_id = body[0];
    let to_seatid = body[1];
    five_chess_model.send_prop(uid, to_seatid, prop_id, (body) => { // let body = [  Response.OK,player.seatid,to_seatid,propid];
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.SEND_PROP, body, uid, proto_type);
    });
}

// 玩家和房间都准备好了
function do_player_ready(session: BaseSession, uid: number, proto_type: number, body: any) {
    five_chess_model.do_player_ready(uid, (body: any) => {
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.SEND_DO_READY, body, uid, proto_type);
    });
}

function do_player_put_chess(session: BaseSession, uid: number, proto_type: number, body: any) {
    if(!body) {
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.PUT_CHESS, body, uid, proto_type);
        return ;
    }

    let block_x = body[0];
    let block_y = body[1];
    five_chess_model.do_player_put_chess(uid, block_x, block_y, (body) => { // ok, block_x, block_y, chess_type
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.PUT_CHESS, body, uid, proto_type);
    });
}

function do_player_get_prev_round_data(session: BaseSession, uid: number, proto_type: number, body: any) {
    five_chess_model.do_player_get_prev_round_data(uid, (body: any) => {
        session.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.GET_PREV_ROUND, body, uid, proto_type);
    });
}





