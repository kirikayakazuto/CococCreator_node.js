import * as redis from "redis";
import utils from "../utils/utils"
import log = require("../utils/log");
import {user_info} from "../apps/info_interface";
import Response from "../apps/Response";

export default class redis_center {

    static center_redis: redis.RedisClient = null;

    static connect_to_center(host: string, port: number, db_index: number) {    // 连接redis 数据库 服务器
        this.center_redis = redis.createClient({
            host: host,
            port: port,
            db: db_index,
        });

        this.center_redis.on("error", (error) => {
            log.error("connect_to_redis error");
        });
    }
    // 存储用户信息
    static set_uinfo_in_redis(uid: number, uinfo: user_info) {
        if(this.center_redis == null) {
            log.error("center_redis is null");
            return ;
        }
        let user_info: {} = uinfo;
        let key: string = "redis_center_user_uid_" + uid;
        log.info("set_uinfo_in_redis key :" + key);
        this.center_redis.hmset(key, user_info, (error) => {
            if(error) {
                log.error("set_uinfo_in_redis error");
            }
        });
    }
    // 获取用户信息
    static get_uinfo_in_redis(uid: number, callback: (status: number, uinfo: user_info) => void) {
        if(this.center_redis == null) {
            log.error("center_redis is null");
            callback(Response.SYSTEM_ERR, null);
            return ;
        }
        let key: string = "redis_center_user_uid_" + uid;
        log.info("get_uinfo_in_redis key : " + key);

        this.center_redis.hgetall(key, (error, data) => {
            if(error) {
                log.error("get_uinfo_in_redis error");
                callback(Response.SYSTEM_ERR, null);
                return ;
            }
            let uinfo: user_info = this._make_value_string_to_number(data);
            callback(Response.OK, uinfo);
        });
    }  
    // 转换  从redis中取出来的值  string 转为 number
    static _make_value_string_to_number(data): user_info {
        let uinfo: user_info = {};
        for(let key in data) {
            if( key == "uid" ||
                key == "usex" ||
                key == "uface" ||
                key == "uvip" ||
                key == "vip_endtime" ||
                key == "is_guest" ||
                key == "status") {
                    uinfo[key] = parseInt(data[key]);
            }else {
                uinfo[key] = data[key];
            }
        }
        return uinfo;
    }
}