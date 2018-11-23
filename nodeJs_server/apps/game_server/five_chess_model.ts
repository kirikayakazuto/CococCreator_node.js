import Response from "../Response"
import utils from "../../utils/utils"
import log from "../../utils/log"
import {game_info, user_info} from "../info_interface"

import redis_game from "../../database/redis_game"
import mysql_game from "../../database/mysql_game";
import game_config from "../game_config"
import redis_center from "../../database/redis_center";
import five_chess_player from "./five_chess_player";
import five_chess_room from "./five_chess_room";
import { BaseSession } from "../../netbus/netbus";
import QuitReason from "./QuitReason"


// 房间类型,  name: 新手场, 高手场, 大师场
class zone {
    public config: {
        zid: number, 
        name: string, 
        vip_level: number, 
        min_chip: number,
        one_round_chip: number,
        think_time: number
    } = null;     // zid: 1, name: "新手场", vip_level: 0, min_chip: 100, one_round_chip: 3, think_time: 15},

    public autoinc_roomid = 1;  // 房间id , 没创建一个房间 则房间号+1

    public wait_list: {[key: string]: five_chess_player} = {};    // 玩家的等待列表;
    public room_list: {[key: string]: five_chess_room} = {};  // 房间ID-->房间列表;

    constructor(config) {
        this.config = config;
    }
}

export default class five_chess_model {

    // 游戏房间等级
    static zones: {[key: string]: zone} = {};
    // 玩家表 uid -> player
    static player_set: {[key: string] : five_chess_player} = {};

    // 处理错误
    static write_err(status: number, ret_func: (ret: game_info) => void) {
        log.error("write_err : " + status);
        let ret = {
            status: status,
        };
        ret_func(ret);

        
    }

    // 初始化
    static init_zones() {
        let zones_config = game_config.game_data.five_chess_zones;
        
        for(let i=0; i<zones_config.length; i++) {
            let zid: number = zones_config[i].zid;    
            let z = new zone(zones_config[i]);

            this.zones[zid] = z;
        }
    }

    /**
     * -------------------------- 分配玩家 进入房间 ------------------------------
     */
    // 得到一个player
    static get_player(uid: number) {
        if(this.player_set[uid]) {
            return this.player_set[uid];
        }
        // log.error("get_player error uid : " + uid);
        return null;
    }
    // 生成一个player
    static alloc_player(uid: number, session: BaseSession, proto_type: number) {
        if(this.player_set[uid]) {
            log.warn("alloc_player  player id exist !");
            return this.player_set[uid];
        }

        let player = new five_chess_player(uid);
        player.init_session(session, proto_type);
        return player;
    }
    // 删除player
    static delete_player(uid: number) {

        if(this.player_set[uid]) {
            this.player_set[uid].init_session(null, -1);

            this.player_set[uid] = null;
            delete this.player_set[uid];
        }else {
            log.warn("delete_player warn uid : " + uid);
        }
    }
    // 加入
    static player_enter_zone(player: five_chess_player, zid: number, ret_func: (status: number) => void) {
        let zone = this.zones[zid];

        if(!zone) {
            log.error("player_enter_zone zone error");
            ret_func(Response.INVALID_ZONE);
            return ;
        }

        if(player.uchip < zone.config.min_chip) {   // 金币数目不够 
            ret_func(Response.CHIP_IS_NOT_ENOUGH);
            return ;
        }

        if(player.uvip < zone.config.vip_level) {   // vip等级不够
            ret_func(Response.VIP_IS_NOT_ENOUGH);
            return ;
        }

        player.zid = zid;
        player.room_id = -1;
        zone.wait_list[player.uid] = player;
        ret_func(Response.OK);
        
    }
    // 获取玩家个人信息  存入player
    static get_uinfo_in_redis(uid: number, player: five_chess_player, zid: number, ret_func: (status: number) => void) {
        redis_center.get_uinfo_in_redis(uid, (status: number, data: user_info) => {
            if(status != Response.OK) {
                ret_func(status);
                return ;
            }

            player.init_uinfo(data);
            this.player_set[uid] = player;

            this.player_enter_zone(player, zid, ret_func);
        })
    }
    // 进入zid区块
    static enter_zone(uid: number, zid: number, session: BaseSession, proto_type: number, ret_func: (status: number) => void) {
        
        let player = this.get_player(uid);

        if(!player) {
            player = this.alloc_player(uid, session, proto_type);
            // 获取用户信息
            mysql_game.get_ugame_info_by_uid(uid, (status: number, data: Array<game_info>) => {
                
                if(status != Response.OK) {
                    ret_func(status);
                    return ;
                }

                if(data.length <= 0) {
                    ret_func(Response.ILLEGAL_ACCOUNT);
                    return ;
                }

                let ugame_info = data[0];
                if(ugame_info.status != 0) {
                    ret_func(Response.ILLEGAL_ACCOUNT);
                    return ;
                }

                player.init_ugame_info(ugame_info);

                this.get_uinfo_in_redis(uid, player, zid, ret_func);
                
            });
        }else {
            if(player.zid != -1 && player.room_id != -1) {  // 表示当前玩家是 属于 掉线了的, 服务器还保留这当前玩家的 zid和roomid
                let zone = this.zones[player.zid];
                let room = zone.room_list[player.room_id];

                player.init_session(session, proto_type);
                // 把当前的游戏进度 发送给 当前进入房间的玩家
                room.do_reconnect(player);
            }else {
                this.player_enter_zone(player, zid, ret_func);
            }
            
        }
    }

    /**
     * ------------------------- 玩家退出 ---------------------------
     */
    // 玩家主动断线
    static user_quit(uid: number, ret_func: any) {
        this.do_user_quit(uid, QuitReason.UserQuit)
        ret_func(Response.OK)
    }
    // 玩家被动断线
    static user_lost_connect(uid: number) {
        this.do_user_quit(uid, QuitReason.UserLostConn);
    }
    // 断线逻辑
    static do_user_quit(uid: number, quit_reason: number) {
        let player = this.get_player(uid);

        if(!player) {
            log.warn("do_user_quit warn");
            return ;
        }

        if(quit_reason == QuitReason.UserLostConn) {   // 玩家断线 清理session
            player.init_session(null, -1);
        }
        
        log.info("player uid = " + uid + " quit game_server reason: " + quit_reason);
        if(player.zid != -1 && this.zones[player.zid]) { // 玩家已经在游戏区间里面了,从区间里面离开
            let zone = this.zones[player.zid];
            if(player.room_id != -1) {  // 玩家已经进入房间了, 从房间退出
                log.info("player uid : " + uid + "exit zone : " + player.zid + "room id : " + player.room_id);
                let room = zone.room_list[player.room_id];
                if(room) {
                    if(!room.do_exit_room(player, quit_reason)) {   // 如果正在游戏, 那么不允许退出
                        return ;
                    } 
                }else {
                    player.room_id = -1;
                }

                player.zid = -1;
            }else {
                if(zone.wait_list[uid]) {   // 玩家在等待列表中, 从等待列表退出
                    log.info("player uid : " + uid + " remove wait list zid: " + player.zid);
                    player.zid = -1;
                    player.room_id = -1;
                    zone.wait_list[uid] = null;
                    delete zone.wait_list[uid];
                }
            }
        }
        this.delete_player(uid);
    }

    /**
     * --------------------------------- 游戏房间  管理 -------------------------
     */
    // 分配的房间 可能是其他区间的 ?
    static do_assign_room() {     
        
        for(let i in this.zones) {  // 遍历所有的区间
            let zone = this.zones[i];            
            for(let key in zone.wait_list) {

                let player = zone.wait_list[key];

                let room = this.do_search_room(zone);   // 找到一个最适合的房间
                if(room) {
                    room.do_enter_room(player);
                    // 玩家进入房间后, 则将等待列表中的玩家删除
                    zone.wait_list[key] = null;
                    delete zone.wait_list[key];
                }
            }
        }
    }
    // 自动分配一个房间
    static alloc_room(zone: zone) {
        let room = new five_chess_room(zone.autoinc_roomid ++, zone.config);
        zone.room_list[room.room_id] = room;

        return room;
    }
    static do_search_room(zone: zone) {
        let min_empty = 1000000;    // 最小的空位数目
        let min_room: five_chess_room = null;   // 最适合的房间
        let room: five_chess_room = null;

        for(let key in zone.room_list) {    // 遍历当前区块的所有房间 找到一个空位最少的房间

            room = zone.room_list[key];
            let empty_num = room.empty_seat();  // 当前房间的空位数目

            if(room && empty_num >= 1) {    // 如果当前房间的空位数目大于1
                if(empty_num < min_empty) {
                    min_room = room;
                    min_empty = empty_num;
                }
            }
        }

        if(min_room) {
            return min_room;
        }
        // 没有一个合适的房间 , 则返回一个新的房间
        min_room = this.alloc_room(zone);
        return min_room;
    }
    // 发送道具
    static send_prop(uid: number, to_seatid: number, prop_id: number, ret_func: any) {
        let body = this._check_player_and_zone_and_room(uid, ret_func);

        body.room.send_prop(body.player, to_seatid, prop_id, ret_func);

    }

    static do_player_ready(uid: number, ret_func: (body: any) => void) {
        let body = this._check_player_and_zone_and_room(uid, ret_func);
        body.room.do_player_ready(body.player, ret_func);

    }
    // 下棋
    static do_player_put_chess(uid: number, block_x: number, block_y: number, ret_func: any) {
        let body = this._check_player_and_zone_and_room(uid, ret_func);
        body.room.do_player_put_chess(body.player, block_x, block_y, ret_func);
    }
    static do_player_get_prev_round_data(uid: number, ret_func: any) {
        let body = this._check_player_and_zone_and_room(uid, ret_func);
        body.room.do_player_get_prev_round_data(body.player, ret_func);
    }

    // 检验玩家是否在房间内
    static _check_player_and_zone_and_room(uid: number, ret_func) {
        let player = this.get_player(uid);
        if(!player) {
            log.error("do_player_ready player error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        if(player.zid == -1 || player.room_id == -1) {
            log.error("do_player_ready player zid or room_id error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        let zone = this.zones[player.zid];
        if(!zone) {
            log.error("do_player_ready zone error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        let room = zone.room_list[player.room_id];
        if(!room) {
            log.error("do_player_ready room error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        let body = {
            player: player,
            zone: zone,
            room: room
        }

        return body;
    }
    // 
    static kick_player_chip_not_enough(uid: number) {
        this.do_user_quit(uid, QuitReason.CHIP_IS_NOT_ENOUGH);
    }
    static kick_offline_player(uid: number) {
        this.do_user_quit(uid, QuitReason.SystemKick);
    }

    
}

setInterval(five_chess_model.do_assign_room.bind(five_chess_model), 500);

five_chess_model.init_zones();

