
import Response from "../Response"
import utils from "../../utils/utils"
import mysql_center from "../../database/mysql_center";
import log from "../../utils/log"
import {user_info} from "../info_interface"
import phone_msg from "../phone_msg";
import redis_center from "../../database/redis_center"

export default class auth_model {

    static guest_login(guest_key: string, ret_func: (user_info: user_info) => void) {
       
        mysql_center.get_guest_uinfo_by_ukey(guest_key, (status: number, data: Array<any>) => {
            
            if(status != Response.OK) {
                this.write_err(status, ret_func);
                return ;
            }

            if(data.length <= 0) {    // 如果查询的结果 不匹配   那么插入一个新的用户

                let unick: string = "游客" + utils.random_int_str(4);
                let usex: number = utils.random_int(0, 1);
                let uface: number = 0;

                mysql_center.insert_guest_user(unick, uface, usex, guest_key, (status) => {
                    // log.warn("insert_guest_user : " + status);
                    if(status != Response.OK) {
                        this.write_err(status, ret_func);
                        return ;
                    }
                    this.guest_login(guest_key, ret_func);
                });
            }else {
                let sql_uinfo: user_info = data[0];
                // log.info(sql_uinfo.unick);
                if(sql_uinfo.status != 0) {  // 账号被封了
                    this.write_err(Response.ILLEGAL_ACCOUNT, ret_func);
                    return ;
                }

                if(!sql_uinfo.is_guest) {   // 不是一个游客账号
                    this.write_err(Response.INVALIDI_OPT, ret_func);
                    return ;
                }
                this.guest_login_success(guest_key, sql_uinfo, ret_func);
            }
        });
    }
    // 游客登录成功
    static guest_login_success(guest_key, data: user_info, ret_func: (ret: user_info) => void) {
        let ret: user_info = {};
        ret.status = Response.OK;
        ret.uid = data.uid;
        ret.unick = data.unick;
        ret.usex = data.usex;
        ret.uface = data.uface;
        ret.uvip = data.uvip;
        ret.guest_key = guest_key;

        // 将用户信息存入redis中
        redis_center.set_uinfo_in_redis(data.uid, {
            unick: data.unick,
            uface: data.uface,
            usex: data.usex,
            uvip: data.uvip,
            is_guest: 1,
        });
        // 调用回调
        ret_func(ret);
    }

    // 修改个人资料
    static edit_profile(uid: number, unick: string, usex: number, ret_func: (ret: user_info) => void) {
        mysql_center.edit_profile(uid, unick, usex, (status: number) => {
            if(status != Response.OK) {
                this.write_err(status, ret_func);
                return ;
            }
            let ret: user_info = {};
            ret.status = status;
            ret.unick = unick;
            ret.usex = usex;
            ret_func(ret);
        });
    }
    // 正式用户 登录 成功
    static uname_login_success(data: user_info, ret_func: (ret: user_info) => void) {
        let ret: user_info = {};
        ret.status = Response.OK;
        ret.uid = data.uid;
        ret.unick = data.unick;
        ret.usex = data.usex;
        ret.uface = data.uface;
        ret.uvip = data.uvip;

        // 将用户信息存入redis中
        redis_center.set_uinfo_in_redis(data.uid, {
            unick: data.unick,
            uface: data.uface,
            usex: data.usex,
            uvip: data.uvip,
            is_guest: 0,
        });
        
        ret_func(ret);
    }

    // 报错
    static write_err(status, ret_func: (ret: user_info) => void) {
        log.error("write_err : " + status);
        let ret: user_info = {};
        ret.status = status;
        ret_func(ret);
    }
    // 发送验证码给手机
    static _send_indentify_code(phone_num: string, opt: number, end_duration: number, ret_func: (status: number) => void) {
        let code = utils.random_int_str(6);
        
        mysql_center.update_phone_indetify(code, phone_num, opt, end_duration, (status: number) => {
            if(status != Response.OK) { // 发送短信
                log.error("_send_indentify_code phone_msg error");
                return ;
            }
            phone_msg.send_indentify_code(phone_num, code);
            ret_func(status);
        });
    }

    static get_upgrade_indentify(uid: number, phone: string, opt: number, ret_func: (status: number) => void) {
        mysql_center.is_exist_guest(uid, (status) => {
            if(status != Response.OK) {
                log.error("get_upgrade_indentify status error");
                ret_func(Response.INVALIDI_OPT);
                return ;
            }

            this._send_indentify_code(phone, opt, 60, ret_func);
        });
    }
    /**
     * ------------------------------------------------ 游客账号 绑定 手机号 -------------------------------------------
     * @param uid 
     * @param phone_num 
     * @param pwd_md5 
     * @param phone_code 
     * @param ret_func 
     */
    // 游客账号绑定电话号码
    static guest_bind_phone_number(uid: number, phone_num: string, pwd_md5: string, phone_code: string, ret_func: (status: any) => void) {
        mysql_center.is_exist_guest(uid, (status: number) => {
            if(status != Response.OK) {
                ret_func(Response.INVALIDI_OPT);
                return ;
            }

            this._check_phone_is_binder(uid, phone_num, pwd_md5, phone_code, ret_func);
        });
    }
    // 检查电话号码是否绑定了
    static _check_phone_is_binder(uid: number, phone_number: string, pwd_md5: string, phone_code: string, ret_func: (status: any) => void) {
        mysql_center.check_phone_unuse(phone_number, (status: number) => {
            if(status != Response.OK) {
                ret_func(Response.INVALIDI_OPT);
                return ;
            }
            this._check_guest_upgrade_phone_code_valid(uid, phone_number, pwd_md5, phone_code, ret_func);
        });
    }
    // 检查验证码的值 是否正确
    static _check_guest_upgrade_phone_code_valid(uid: number, phone_num: string, pwd_md5: string, phone_code, ret_func: (status: any) => void) {
        mysql_center.check_phone_code_valid(phone_num, phone_code, 0, (status: number) => {
            if(status != Response.OK) {
                ret_func(Response.INVALIDI_OPT);
                return ;
            }
            this._do_bind_guest_account(uid, phone_num, pwd_md5, phone_code, ret_func);
        });
    }
    // 绑定游客账号
    static _do_bind_guest_account(uid: number, phone_num: string, pwd_md5: string, phone_code: string, ret_func: (status: any) => void) {
        mysql_center.do_upgrade_guest_account(uid, phone_num, pwd_md5, (status: number) => {
            ret_func(status);
        });
    }

    /**
     * ---------------------------------------------------- 正式用户登录 --------------------------------------
     */

    static uname_login(uname: string, upwd: string, ret_func: any) {
        mysql_center.get_uinfo_by_uname_upwd(uname, upwd, (status, data: Array<user_info>) => {
            if(status != Response.OK) {
                this.write_err(status, ret_func);
                return ;
            }
            if(data.length <= 0) {          // 没有这个用户
                this.write_err(Response.UNAME_OR_UPWD_ERR, ret_func);
            }else {
                let sql_uinfo = data[0];
                if(sql_uinfo.status != 0) { // 账号被封了 
                    this.write_err(Response.ILLEGAL_ACCOUNT, ret_func);
                    return ;
                }

                this.uname_login_success(sql_uinfo, ret_func);
            }
        });
    }

    /**
     * -----------------------------------------------  正式用户  注册  ------------------------------------------
     */
    // 获取  电话 号码 的验证码
    static get_phone_reg_verify_code(phone_num: string, ret_func: (status: number) => void) {
        mysql_center.check_phone_unuse(phone_num, (status: number) => {
            
            if(status != Response.OK) {
                ret_func(Response.PHONE_IS_REG);
                return ;
            }
            this._send_indentify_code(phone_num, 1, 60, ret_func);
        });
    }
    // 注册  正式用户  - 电话
    static reg_phone_account(phone_num: string, pwd_md5: string, verify_code: string, unick: string, ret_func: (status: number) => void) {
        mysql_center.check_phone_unuse(phone_num, (status: number) => {
            if(status != Response.OK) {
                ret_func(Response.PHONE_IS_REG);
                return ;
            }
            this._check_reg_phone_account_verify_code(phone_num, pwd_md5, verify_code, unick, ret_func);
        });
    }

    static _check_reg_phone_account_verify_code(phone_num: string, pwd_md5: string, verify_code: string, unick: string, ret_func: (status: number) => void) {
        mysql_center.check_phone_code_valid(phone_num, verify_code, 1, (status: number) => {
            if(status != Response.OK) {
                ret_func(Response.PHONE_CODE_ERR);
                return ;
            }
            log.warn("_check_reg_phone_account_verify_code");
            this._do_reg_phone_account(phone_num, pwd_md5, unick, ret_func);
        });
    }
    // 将正式账号 存入数据库
    static _do_reg_phone_account(phone_num: string, pwd_md5: string, unick: string, ret_func: any) {
        let usex = utils.random_int(0, 1);
        let uface = 0;
        mysql_center.insert_phone_account_user(unick, uface, usex, phone_num, pwd_md5, (status: number) => {
            if(status != Response.OK) {
                ret_func(status);
                return ;
            }
            ret_func(status);
        });
        
    }

    /**
     * ----------------------------------------------- 重置密码 ------------------------------------------ 
     */
    static get_forget_pwd_verify_code(phone_num: string, ret_func: (status: number) => void) {
        mysql_center.check_phone_is_reged(phone_num, (status: number) => {
            if(status != Response.OK) {
                ret_func(status);
                return ;
            }
            this._send_indentify_code(phone_num, 2, 60, ret_func);
        });
    }
    // 重置密码
    static reset_user_pwd(phone_num: string, pwd_md5: string, verify_code: string, ret_func: (status: number) => void) {

        mysql_center.check_phone_is_reged(phone_num, (status: number) => {
            if(status != Response.OK) {
                ret_func(Response.PHONE_IS_NOT_REG);
                return ;
            }
        });
        this._check_reset_pwd_verify_code(phone_num, pwd_md5, verify_code, ret_func);
    }
    // 检查验证码
    static _check_reset_pwd_verify_code(phone_num: string, pwd_md5: string, verify_code: string, ret_func: (status: number) => void) {
        mysql_center.check_phone_code_valid(phone_num, verify_code, 2, (status: number) => {
            if(status != Response.OK) {
                ret_func(Response.PHONE_CODE_ERR);
                return ;
            }
            this._do_account_reset_pwd(phone_num, pwd_md5, ret_func);
        });
    }
    // 重置密码
    static _do_account_reset_pwd(phone_num: string, pwd_md5: string, ret_func: (status: number) => void) {
        mysql_center.reset_account_pwd(phone_num, pwd_md5, (status: number) => {
            if(status != Response.OK) {
                ret_func(status);
                return ;
            }
            ret_func(status);
        });
    }

}