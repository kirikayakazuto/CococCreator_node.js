import * as redis from "redis";
import utils from "../utils/utils"
import log = require("../utils/log");
import {game_info} from "../apps/info_interface";
import Response from "../apps/Response";

export default class redis_game {
    static game_redis: redis.RedisClient = null;

    static connect_to_game(host: string, port: number, db_index: number) {    // 连接redis 数据库 服务器
        this.game_redis = redis.createClient({
            host: host,
            port: port,
            db: db_index,
        });

        this.game_redis.on("error", (error) => {
            log.error("connect_to_redis error");
        });
    }

    static set_ugame_info_in_redis(uid: number, ugame: game_info) {
        if(this.game_redis == null) {
            log.error("game_redis is null");
            return ;
        }

        let key = "redis_game_user_uid_" + uid;
        let ugame_info: {} = ugame;
        log.info("set_ugame_in_redis key :" + key);
        this.game_redis.hmset(key, ugame_info, (error) => {
            if(error) {
                log.error("set_ugame_in_redis error");
            }
        });
    }

    static get_ugame_info_in_redis(uid: number, callback: (status: number, ugame: game_info) => void) {
        if(this.game_redis == null) {
            log.error("game_redis is null");
            callback(Response.SYSTEM_ERR, null);
            return ;
        }

        let key = "redis_game_user_uid_" + uid;
        this.game_redis.hgetall(key, (error, data) => {
            if(error) {
                log.error("get_ugame_info_in_redis error");
                callback(Response.SYSTEM_ERR, null);
                return ;
            }

            let ugame_info = this._make_value_string_to_number(data);
            callback(Response.OK, ugame_info);
        });
    }

    static add_ugame_uchip(uid: number, uchip: number, is_add: boolean) {
        this.get_ugame_info_in_redis(uid, (status: number, ugame: game_info) => {
            if(status != Response.OK) {
                return ;
            }

            if(!is_add) {
                uchip = -uchip;
            }

            ugame.uchip += uchip;
            this.set_ugame_info_in_redis(uid, ugame);
        });
    }

    // 转换  从redis中取出来的值  string 转为 number
    static _make_value_string_to_number(data): game_info {
        let ugame: game_info = {};
        for(let key in data) {
            if( key == "id" ||
                key == "uid" ||
                key == "uexp" ||
                key == "status" ||
                key == "uchip" ||
                key == "udata" ||
                key == "uvip" ||
                key == "uvip_endtime") {
                    ugame[key] = parseInt(data[key]);
            }else {
                ugame[key] = data[key];
            }
        }
        return ugame;
    }
    // 更新世界排行榜
    static update_game_world_rank(rank_name: string, uid: number, uchip: number) {
        this.game_redis.zadd(rank_name, uchip, "" + uid);
    }
    // 获取世界排行榜信息
    static get_world_rank_info(rank_name: string, rank_num: number, callback: (status: number, data: Array<number>) => void) {
        this.game_redis.zrevrange(rank_name, 0, rank_num, "withscores", (err, data) => {
            if(err) {
                log.error("get_world_rank_info error");
                callback(Response.SYSTEM_ERR, null);
                return ;
            }

            if(!data || data.length <= 0) {
                callback(Response.RANK_IS_EMPTY, null);
                return ;
            }
            let data_num_array: Array<number> = [];
            for(let i = 0; i < data.length; i ++) {
                data_num_array[i] = parseInt(data[i]);
            }
            callback(Response.OK, data_num_array);
        });
    }
}