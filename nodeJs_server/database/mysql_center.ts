import mysql from "mysql"
import util from "util";
import log from "../utils/log"
import response from "../apps/Response"
import {user_info} from "../apps/info_interface";
import utils from "../utils/utils";


export default class mysql_center {

    static conn_pool: mysql.Pool = null;
    static connect_to_center(host: string, port: number, db_name: string, uname: string, upwd: string) {
        mysql_center.conn_pool = mysql.createPool({
            host: host,
            port: port,
            database: db_name,
            user: uname,
            password: upwd,
        });
    }

    static mysql_exec(sql: string, callback: (error: any, sql_result: Array<any>, fields_desic: any) => void) {
        
        mysql_center.conn_pool.getConnection((error: mysql.MysqlError, conn: mysql.PoolConnection) => {
            if(error) {
                if(callback) {
                    callback(error, null, null);
                }
            }
            conn.query(sql, (sql_err, sql_result: Array<user_info>, fields_desic: mysql.FieldInfo[]) => {
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
    // 获取游客信息
    static get_guest_uinfo_by_ukey(ukey: string, callback: (response: number, sql_ret: Array<any>) => void) {
        let sql = "select uid, unick, usex, uface, uvip, status, is_guest from uinfo where guest_key = \"%s\" limit 1";
        let sql_cmd = util.format(sql, ukey);
        log.info(sql_cmd);
        mysql_center.mysql_exec(sql_cmd, (err: any, sql_ret: Array<user_info>, fields_desic) => {
            if(err) {
                log.error("get_guest_uinfo_by_ukey error");
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
    // 添加游客
    static insert_guest_user(unick: string, uface: number, usex: number, ukey: string, callback: (response: number) => void) {
        let sql = "insert into uinfo(`guest_key`, `unick`, `uface`, `usex`, `is_guest`)values(\"%s\", \"%s\", %d, %d, 1)";
        let sql_cmd = util.format(sql, ukey, unick, uface, usex);
        log.info(sql_cmd);
        mysql_center.mysql_exec(sql_cmd, (err, sql_ret: Array<user_info>, fields_desic) => {
            if(err) {
                log.error("insert_guest_user error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            if(callback) {
                callback(response.OK);
                return ;
            }
            log.error("insert_guest_user callback error");   
        });
    }
    // 修改游客信息
    static edit_profile(uid: number, unick: string, usex: number, callback: (response: number) => void) {
        let sql = "update uinfo set unick = \"%s\", usex = %d where uid = %d";
        let sql_cmd = util.format(sql, unick, usex, uid);
        log.info(sql_cmd);
        mysql_center.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("edit_profile");
                callback(response.SYSTEM_ERR);
                return ;
            }
            if(callback) {
                callback(response.OK);
                return ;
            }
            log.error("edit_profile callback error");
        }); 
    }
    /**
     * -------------------------------------------------------游客 获取 验证码 ----------------------------------------------
     */
    // 判断是否为游客账号
    static is_exist_guest(uid: number, callback: (status: number) => void) {
        let sql = "select is_guest, status from uinfo where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        log.info(sql_cmd);
        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("is_exist_guest error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            if(sql_ret.length <= 0) {
                callback(response.INVALID_PARAMS);
                return ;
            }

            if(sql_ret[0].is_guest == 1 && sql_ret[0].status == 0) {
                callback(response.OK);
                return;
            }
            callback(response.INVALID_PARAMS);
        });
    }
    // 查询数据库中是否有这个号码
    static _is_phone_indetify_exist(phone: string, opt: number, callback: (status: boolean) => void) {
        let sql = "select id from phone_chat where phone = \"%s\" and opt_type = %d";;
        let sql_cmd = util.format(sql, phone, opt);
        log.info(sql_cmd);
        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("_is_phone_indetify_exist error");
                callback(false);
                return ;
            }
            if(sql_ret.length <= 0) {
                callback(false);
                return ;
            }
            callback(true);
        });
    }
    // 更新手机验证码
    static _update_phone_indetify_time(code: string, phone: string, opt: number, end_duration: number) {
        let end_time = utils.timestamp() + end_duration;
        let sql = "update phone_chat set code = \"%s\", end_time=%d, count=count+1 where phone = \"%s\" and opt_type = %d";
        let sql_cmd = util.format(sql, code, end_time, phone, opt);
        log.info(sql_cmd);
        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {

        });
    }
    // 添加手机号
    static _insert_phone_indetify(code: string, phone: string, opt: number, end_duration: number) {
        let end_time = utils.timestamp() + end_duration;
        let sql = "insert into phone_chat(`code`, `phone`, `opt_type`, `end_time`, `count`)values(\"%s\", \"%s\", %d, %d, 1)";
        let sql_cmd = util.format(sql, code, phone, opt, end_time);
        log.info(sql_cmd);
        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {

        });
    }
    // 更新号码数据库
    static update_phone_indetify(code: string, phone: string, opt: number, end_duration: number, callback: (status: number) => void) {
        this._is_phone_indetify_exist(phone, opt, (b_exisit: boolean) => {
            if(b_exisit) {
                this._update_phone_indetify_time(code, phone, opt, end_duration);
            }else {
                this._insert_phone_indetify(code, phone, opt, end_duration);
            }
            callback(response.OK);
        });
    }

    /**
     * -----------------------------------------游客账号绑定手机号-------------------------------------
     */
    static check_phone_code_valid(phone: string, phone_code: string, opt_type: number, callback: (status: number) => void) {
        let sql = "select id from phone_chat where phone = \"%s\" and opt_type = %d and code = \"%s\" and end_time >= %d limit 1";
        let t = utils.timestamp();
        let sql_cmd = util.format(sql, phone, opt_type, phone_code, t);

        log.info(sql_cmd);
        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("check_phone_code_valid error");
                return ;
            }
            if(sql_ret.length <= 0) {
                callback(response.PHONE_CODE_ERR);
                return ;
            }
            callback(response.OK);
        });
    }
    // 检查电话号码 是否被绑定了
    static check_phone_unuse(phone_num: string, callback: (status: number) => void) {
        let sql = "select uid from uinfo where uname = \"%s\" limit 1";
        let sql_cmd = util.format(sql, phone_num);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("check_phone_unuse error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            
            if(sql_ret.length <= 0) {
                callback(response.OK);
                return ;
            }

            callback(response.PHONE_IS_REG);
        });
    }
    // 更新游客账号信息,   游客账号 变为  正式用户信息
    static do_upgrade_guest_account(uid: number, phone_num: string, pwd_md5: string, callback: (status: number) => void) {
        let sql = "update uinfo set uname = \"%s\", upwd = \"%s\", is_guest = 0 where uid = %d";
        let sql_cmd = util.format(sql, phone_num, pwd_md5, uid);
        log.info(sql_cmd);
        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("do_upgrade_guest_account error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            callback(response.OK);
        });
    }

    /**
     * ------------------------------------------正式用户  登录 -----------------------------------------
     */
    static get_uinfo_by_uname_upwd(uname: string, upwd: string, callback: (status: number, ret: Array<user_info>) => void) {
        let sql = "select uid, unick, usex, uface, uvip, status from uinfo where uname = \"%s\" and upwd = \"%s\" and is_guest = 0 limit 1";
        let sql_cmd = util.format(sql, uname, upwd);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("get_uinfo_by_uname_upwd error");
                callback(response.SYSTEM_ERR, null);
                return ;
            }
            callback(response.OK, sql_ret);
        });
    }

    // 新建一个  正式用户 账号
    static insert_phone_account_user(unick: string, uface: number, usex: number, phone_num: string, pwd_md5: string, callback: (status: number) => void) {
        let sql = "insert into uinfo(`uname`, `upwd`, `unick`, `uface`, `usex`, `is_guest`)values(\"%s\", \"%s\", \"%s\", %d, %d, 0)";
        let sql_cmd = util.format(sql, phone_num, pwd_md5, unick, uface, usex);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("insert_phone_account_user error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            callback(response.OK);
        });

    }
    /**
     * ------------------------------------------------- 重置密码 ---------------------------------------------
     */
    static check_phone_is_reged(phone_num: string, callback: (status: number) => void) {
        let sql = "select uid from uinfo where uname = \"%s\" limit 1";
        let sql_cmd = util.format(sql, phone_num);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("check_phone_is_reged error");
                callback(response.SYSTEM_ERR);
                return ;
            }

            if(sql_ret.length <= 0) {
                callback(response.PHONE_IS_NOT_REG);
                return ;
            }
// log.warn("check_phone_is_reged status");
            callback(response.OK);
        });
    }
    // 重置密码
    static reset_account_pwd(phone_num: string, pwd_md5: string, callback: (status: number) => void) {
        let sql = "update uinfo set upwd = \"%s\" where uname = \"%s\"";
        let sql_cmd = util.format(sql, pwd_md5, phone_num);
        log.info(sql_cmd);

        this.mysql_exec(sql_cmd, (error, sql_ret: Array<user_info>, fields_desic) => {
            if(error) {
                log.error("reset_account_pwd error");
                callback(response.SYSTEM_ERR);
                return ;
            }
            callback(response.OK);
        });
    }
}