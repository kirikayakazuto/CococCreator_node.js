import { game_info, user_info } from "../info_interface";
import { BaseSession } from "../../netbus/netbus";
import log = require("../../utils/log");
import five_chess_room from "./five_chess_room";
import { State } from "./State";
import mysql_game from "../../database/mysql_game";
import redis_game from "../../database/redis_game";

export default class five_chess_player {
    // 个人信息
    uid: number = -1;

    uchip: number = 0;
    uvip: number = 0;
    uexp: number = 0;
    // 游戏信息
    unick = "";
    usex = -1;
    uface = 0;
    // 发送信息接口s
    session: BaseSession = null;
    proto_type = -1;
    // 进入游戏 信息
    zid = 1;    // 区间号
    room_id = -1;   // 房间号
    seatid = -1;    // 座位号 没有坐下时 座位号为-1

    state = State.InView; // 玩家的状态值

    init_ugame_info(ugame_info: game_info) {
        this.uchip = ugame_info.uchip;
        this.uvip = ugame_info.uvip;
        this.uexp = ugame_info.uexp;    
    }

    init_uinfo(uinfo: user_info) {
        this.unick = uinfo.unick;
        this.usex = uinfo.usex;
        this.uface = uinfo.uface;
    }

    init_session(session: BaseSession, proto_type: number) {
        this.session = session;
        this.proto_type = proto_type;
    }

    send_cmd(stype: number, ctype: number, body: any) {
        if(!this.session) {
            log.error("player session is null");
            return ;
        }

        this.session.send_cmd(stype, ctype, body, this.uid, this.proto_type);
    }
    constructor(uid: number) {
        this.uid = uid;
    }

    // 玩家接口
    enter_room(room: five_chess_room) {
        this.state = State.InView;
    }
    // 
    exit_room(room: five_chess_room) {
        this.state = State.InView;
    }

    sitdown(room: five_chess_room) {

    }

    standup(room: five_chess_room) {
        
    }

    do_ready() {
        this.state = State.Ready;
    }

    on_round_start() {
        this.state = State.Playing;
    }

    turn_to_player(room: five_chess_room) {
        
    }
    check_out_game(room: five_chess_room, ret: number, is_winner: boolean) {
        this.state = State.CheckOut;
        if(ret == 2) {  // 平局
            return ;
        }

        let chip = room.bet_chip;

        // 更新数据库中的数据
        mysql_game.add_ugame_uchip(this.uid, chip, is_winner);
        redis_game.add_ugame_uchip(this.uid, chip, is_winner);
        // end

        if(is_winner) {
            this.uchip += chip;
        }else {
            this.uchip -= chip;
        }
    }
    check_out_over(room: five_chess_room) {
        this.state = State.InView;
    }
}