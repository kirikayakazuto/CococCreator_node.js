import mysql from "mysql"
import util from "util";
import log from "../utils/log"
import response from "../apps/Response"
import {game_info, bonues_info} from "../apps/info_interface";
import utils from "../utils/utils";

export default class mysql_game {

    static conn_pool: mysql.Pool = null;
    static connect_to_game(host: string, port: number, db_name: string, uname: string, upwd: string) {
        mysql_game.conn_pool = mysql.createPool({
            host: host,
            port: port,
            database: db_name,
            user: uname,
            password: upwd,
        });
    }

    // 执行mysql的通用方法
    static mysql_exec(sql: string, callback: (error: any, sql_result: Array<any>, fields_desic: any) => void) {    
        mysql_game.conn_pool.getConnection((error: mysql.MysqlError, conn: mysql.PoolConnection) => {
            if(error) {
                if(callback) {
                    callback(error, null, null);
                }
            }
            conn.query(sql, (sql_err, sql_result: Array<game_info>, fields_desic: mysql.FieldInfo[]) => {
                conn.release();
                if(sql_err) {
                    log.error("mysql_exec query error");
                    if(callback) {
                        callback(sql_err, null, null);
                    }
                    return ;
                }
                if(callback) {
                    callback(null, sql_result, fields_desic);
                    return ;
                }
                log.error("mysql_exec callback error"); 
            });
        });
    }
    /**
     * --------------------------------------- 操作游戏数据库信息 ---------------------------------------------
     * get_ugame_info_by_uid(uid: number, callback: (status: number, data: Array<game_info>) => void);
     * insert_ugame_user(uid: number, uexp: number, uchip: number, callback: (status: number) => void);
     */
    // 获取游戏数据库 中的 信息
    static get_ugame_info_by_uid(uid: number, callback: (status: number, data: Array<game_info>) => void) {
        let sql = "select uexp, uid, uchip, uvip, status from ugame where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (err: any, sql_ret: Array<game_info>, fields_desic) => {
            if(err) {
                log.error("get_ugame_info_by_uid error");
                callback(response.SYSTEM_ERR, null);
                return ;
            }
            if(callback) {
                callback(response.OK, sql_ret);
                return ;
            }
            log.error("get_guest_uinfo_by_ukey callback error");
        });
    }
    // 插入一个 游戏用户
    static insert_ugame_user(uid: number, uexp: number, uchip: number, callback: (status: number) => void) {
        let sql = "insert into ugame(`uid`, `uexp`, `uchip`)values(%d, %d, %d)";
        let sql_cmd = util.format(sql, uid, uexp, uchip);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (err: any, sql_ret: Array<game_info>, fields_desic) => {
            if(err) {
                log.error("get_ugame_info_by_uid error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            if(callback) {
                callback(response.OK);
                return ;
            }
            log.error("get_guest_uinfo_by_ukey callback error");
        });
    }

    /**
     * ------------------------------------------ 每日登录奖励 ----------------------------------------
     * 获取奖励信息
     * 方法一: get_login_bonues_info(uid: number, callback: (status: number, ret: Array<bonues_info>) => void);
     * 
     * 插入一个新的 登录奖励用户
     * 方法二: insert_user_login_bonues(uid: number, bonues: number, callback: (status: number) => void);
     * 
     * 更新用户的 登录奖励 信息
     * 方法三: update_user_login_bonues(uid: number, bonues: number, days: number, callback: any);
     */
    //  获取奖励信息
    static get_login_bonues_info(uid: number, callback: (status: number, ret: Array<bonues_info>) => void) {
        let sql = "select days, bonues_time, id, bonues, status from login_bonues where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (err: any, sql_ret: Array<bonues_info>, fields_desic) => {
            if(err) {
                log.error("get_login_bonues_info error");
                callback(response.SYSTEM_ERR, null);
                return ;
            }
            if(callback) {
                callback(response.OK, sql_ret);
                return ;
            }
            log.error("get_login_bonues_info callback error");
        });
    }
    // 添加一个登录用户
    static insert_user_login_bonues(uid: number, bonues: number, callback: (status: number) => void) {
        let time = utils.timestamp();
        let sql = "insert into login_bonues(`days`, `bonues_time`, `bonues`, `uid`)values(%d, %d, %d, %d)";
        let sql_cmd = util.format(sql, 1, time, bonues, uid);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (err: any, sql_ret: Array<bonues_info>, fields_desic) => {
            if(err) {
                log.error("insert_user_login_bonues error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            if(callback) {
                callback(response.OK);
                return ;
            }
            log.error("insert_user_login_bonues callback error");
        });
    }
    // 更新用户登录奖励
    static update_user_login_bonues(uid: number, bonues: number, days: number, callback: (status: number) => void) {
        let time = utils.timestamp();
        let sql = "update login_bonues set days = %d, bonues_time = %d, status = 0, bonues = %d where uid = %d";
        let sql_cmd = util.format(sql, days, time, bonues, uid);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (err: any, sql_ret: Array<bonues_info>, fields_desic) => {
            if(err) {
                log.error("update_user_login_bonues error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            if(callback) {
                callback(response.OK);
                return ;
            }
            log.error("update_user_login_bonues callback error");
        });
    }
    // 更新奖励领取 信息
    static update_login_bonues_recved(bonues_id: number) {
        let sql = "update login_bonues set status = 1 where id = %d";
        let sql_cmd = util.format(sql, bonues_id);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (err: any, sql_ret: Array<bonues_info>, fields_desic) => {
            if(err) {
                log.error("update_login_bonues_recved error");
                return ;
            }
        });
    }
    // 更新游戏用户信息, 增加金币数目
    static add_ugame_uchip(uid: number, uchip: number, is_add: boolean) {
        if(!is_add) {
            uchip = -uchip;
        }

        let sql = "update ugame set uchip = uchip + %d where uid = %d";
        let sql_cmd = util.format(sql, uchip, uid);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (err: any, sql_ret: Array<bonues_info>, fields_desic) => {
            if(err) {
                log.error("add_ugame_uchip error");
                return ;
            }
        });
    }


}