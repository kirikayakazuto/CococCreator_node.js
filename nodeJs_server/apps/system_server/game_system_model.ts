import Response from "../Response"
import utils from "../../utils/utils"
import log from "../../utils/log"
import {game_info, bonues_info, user_info} from "../info_interface"
import phone_msg from "../phone_msg";

import redis_game from "../../database/redis_game"
import mysql_game from "../../database/mysql_game";
import game_config from "../../apps/game_config"
import redis_center from "../../database/redis_center";

let login_bonues_config = game_config.game_data.login_bonues_config;

export default class game_system_model {

    // 处理错误
    static write_err(status: number, ret_func: (ret: game_info) => void) {
        log.error("write_err : " + status);
        let ret = {
            status: status,
        };
        ret_func(ret);
    }
    /**
     * -------------------------- 用户游戏信息处理 -----------------------------------
     */
    static get_game_info(uid: number, ret_func: any) {
        mysql_game.get_ugame_info_by_uid(uid, (status: number, data: Array<game_info>) => {
            if(status != Response.OK) {
                this.write_err(status, ret_func);
                return ;
            }

            if(data.length <= 0) {  // 没有在游戏数据库查询到玩家信息
                mysql_game.insert_ugame_user(uid, 
                    game_config.game_data.first_uexp,
                    game_config.game_data.first_uchip, (status: number) => {
                        if(status != Response.OK) {
                            this.write_err(status, ret_func);
                            return ;
                        }
                        // 成功插入了一个游戏用户
                        // 获取其信息
                        this.get_game_info(uid, ret_func);
                    });
            }else {
                let sql_ugame = data[0];
                // log.warn(sql_ugame.status);
                if(sql_ugame.status != 0) { // 账号被封了
                    this.write_err(Response.ILLEGAL_ACCOUNT, ret_func);
                    return ;
                }
                this.get_ugame_info_success(uid, sql_ugame, ret_func);
                
            }

        });
    }
    // 成功获取游戏用户的信息
    static get_ugame_info_success(uid: number, data: game_info, ret_func: any) {
        
        let ret: game_info = {};
        ret.status = Response.OK;
        ret.uchip = data.uchip;
        ret.uexp = data.uexp;
        ret.uvip = data.uvip;

        // 将游戏用户信息 存入数据库
        redis_game.set_ugame_info_in_redis(uid, {
            uchip: data.uchip,
            uexp: data.uexp,
            uvip: data.uvip,
        });
        
        // 更新世界排行榜
        redis_game.update_game_world_rank("NODE_GAME_WORLD_RANK", uid, data.uchip);
        // 检查是否发放 连续登录奖励
        this.check_login_bonues(uid);

        ret_func(ret);
        
    }
    /**
     * ----------------------------- 每日登录奖励 领取 --------------------------------------
     */
    // 检查是否要发放登录奖励
    static check_login_bonues(uid: number) {
        mysql_game.get_login_bonues_info(uid, (status: number, data: Array<bonues_info>) => {
            if(status != Response.OK) {
                log.error("check_login_bonues error: status = " + status);
                return ;
            }

            if(data.length <= 0) {  // 数据库中没有这个用户的  登录奖励 信息, 那么就在数据库中插入一个
                let bonues = login_bonues_config.bonues[0];
                mysql_game.insert_user_login_bonues(uid, bonues, (status: number) => {
                    if(status != Response.OK) {
                        log.error("insert_user_login_bonues error status: " + status);
                        return ;
                    }
                    return;
                });
            }else {
                let sql_login_bonues = data[0];
                let has_bonues = sql_login_bonues.bonues_time < utils.timestamp_today();
                if(has_bonues) { // 更新本次登录奖励
                    let days = 1;
                    let is_straight = (sql_login_bonues.bonues_time >= utils.timestamp_yesterday());
                    if(is_straight) {   // 是否连续登录
                        days = sql_login_bonues.days + 1;
                    }
                    let index = days - 1;   // 奖励索引
                    if(days > login_bonues_config.bonues.length) {  // 登录次数 大于 最大连续登录值
                        if(login_bonues_config.clear_login_straight) {  // 是否清楚连续登录信息
                            days = 1;
                            index = 0;
                        }else {
                            index = login_bonues_config.bonues.length - 1;
                        }
                    }
                    // 更新 奖励领取的状态
                    mysql_game.update_user_login_bonues(uid, login_bonues_config.bonues[index], days, (status: number) => {
                        if(status != Response.OK) {
                            log.error("update_user_login_bonues error status: " + status);
                            return ;
                        }
                    });
                }
            }
        });
    }
    // 获取登录奖励信息
    static get_login_bonues_info(uid: number, ret_func: (ret: bonues_info) => void) {
        mysql_game.get_login_bonues_info(uid, (status: number, data: Array<bonues_info>) => {
            if(status != Response.OK) {
                this.write_err(status, ret_func);
                return ;
            }

            if(data.length <= 0) {  // 没有这个用户的 信息
                this.get_login_bonues_info_success(uid, 0, null, ret_func); 
            }else {
                let sql_bonues_info = data[0];
                if(sql_bonues_info.status != 0) {   // 今天已经领取了登录奖励
                    this.get_login_bonues_info_success(uid, 0, null, ret_func);
                    return ;
                }

                this.get_login_bonues_info_success(uid, 1, sql_bonues_info, ret_func);
            }
        });
    }
    // 成功获取 登录奖励信息 将其转发给客户端
    static get_login_bonues_info_success(uid: number, b_has: number, data: bonues_info, ret_func: (ret: bonues_info) => void) {
        let ret: bonues_info = {};
        ret.status = Response.OK;
        ret.b_has = b_has;

        if(b_has !== 1) {
            ret_func(ret);
            return ;
        }

        ret.id = data.id;
        ret.bonues = data.bonues;
        ret.days = data.days;

        ret_func(ret);
    }
    // 发放登录奖励 
    static recv_login_bonues(uid: number, bonues_id: number, ret_func: any) {
        mysql_game.get_login_bonues_info(uid, (status: number, data: Array<bonues_info>) => {
            if(status != Response.OK) {
                log.error("recv_login_bonues error");
                this.write_err(status, ret_func);
                return ;
            }

            if(data.length <= 0) {  //
                log.error("recv_login_bonues data.length error"); 
                this.write_err(Response.INVALIDI_OPT, ret_func);
            }else {
                let sql_bonues_info = data[0];

                if(sql_bonues_info.status != 0 || sql_bonues_info.id != bonues_id) {
                    this.write_err(Response.INVALIDI_OPT, ret_func);
                    return ;
                }

                this.recv_login_bonues_success(uid, bonues_id, sql_bonues_info.bonues, ret_func);
            }
        });
    }
    // 返回登录奖励
    static recv_login_bonues_success(uid: number, bonues_id: number, bonues: number, ret_func: any) {
        // 更新登录奖励已经被领取
        mysql_game.update_login_bonues_recved(bonues_id);
        // 添加玩家数据库的 金币数
        mysql_game.add_ugame_uchip(uid, bonues, true);
        // 更新数据库金币
        redis_game.get_ugame_info_in_redis(uid, (status: number, ugame_info: game_info) => {
            if(status != Response.OK) {
                log.error("get_ugame_info_in_redis error status: ", status);
                return;
            }
            ugame_info.uchip += bonues;
            redis_game.set_ugame_info_in_redis(uid, ugame_info);
        });

        let ret: bonues_info = {};
        ret.status = Response.OK;
        ret.bonues = bonues;

        ret_func(ret);
    }

    /**
     * -------------------------------  世界排行榜 ----------------------------
     */
    static get_world_rank_info(uid: number, ret_func) {
        redis_game.get_world_rank_info("NODE_GAME_WORLD_RANK", 30, (status: number, data: Array<number>) => {
            if(status != Response.OK) {
                log.error("get_world_rank_info error");
                this.write_err(status, ret_func);
                return ;
            }

            this.get_players_rank_info(uid, data, ret_func)
        })
    }
    //   获取玩家排行榜信息
    static get_players_rank_info(my_uid: number, data: Array<number>, ret_func) {
        let rank_array = [];    // 一个双层的数组 [[unick, usex, uface, uchip], [], [],] 保存所有玩家的信息
        let total_len = Math.floor(data.length / 2);    // 排行榜上的 人的个数   因为data中包含权重 所有除2
        let is_sended = false;
        let loaded = 0;  // 加载的数目
        let my_rank_num = -1;   // uid这个玩家的排名

        for(let i=0; i<total_len; i++) {
            rank_array.push([]);
        }

        let call_func = (uid: number, uchip: number, out_array: Array<any>) => {
            redis_center.get_uinfo_in_redis(uid, (status: number, data: user_info) => {
                if(status != Response.OK) {
                    if(!is_sended) {
                        log.error("get_uinfo_in_redis error");
                        this.write_err(status, ret_func);
                        is_sended = true;
                    }
                    return ;
                }

                out_array.push(data.unick);
                out_array.push(data.usex);
                out_array.push(data.uface);
                out_array.push(uchip);
                loaded ++;
                if(loaded >= total_len) {   // 加载完毕
                    this.get_rank_info_success(my_rank_num, rank_array, ret_func);
                    return ;
                }
            });
        }

        for(let i=0, j=0; i<data.length; i+=2, j++) {
            if(my_uid == data[i]) {
                my_rank_num = (i + 1);
            }
            call_func(data[i], data[i + 1], rank_array[j]);
        }
        
    }
    // 成功获取排行榜信息
    static get_rank_info_success(my_rank_num: number, rank_array: Array<any>, ret_func) {
        let ret: Array<any> = [];
        ret[0] = Response.OK;
        ret[1] = rank_array.length;
        ret[2] = rank_array;
        ret[3] = my_rank_num;

        ret_func(ret);
    }
}