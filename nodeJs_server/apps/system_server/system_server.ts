import "../../init"

import game_config from "../game_config"
import {netbus} from "../../netbus/netbus"
import service_manager from "../../netbus/service_manager"
import Stype from "../Stype"
import game_system_service from "./game_system_service"
import redis_center from "../../database/redis_center";
import mysql_game from "../../database/mysql_game";
import redis_game from "../../database/redis_game";

let game_system = game_config.game_system_server;
netbus.start_tcp_server(game_system.host, game_system.port, false);

// 注册 游戏系统服务
service_manager.getInstance().register_service(Stype.GAME_SYSTEM, new game_system_service());

/**
 * ------------------------------- 连接用户中心 redis -------------------------------
 */
let center_redis_config = game_config.center_redis;
redis_center.connect_to_center(center_redis_config.host, center_redis_config.port, center_redis_config.db_index);

/**
 * ------------------------------ 连接游戏中心 redis ---------------------------------
 */
let game_redis_config = game_config.game_redis;
redis_game.connect_to_game(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);

/**
 * ------------------------------- 连接游戏中心数据库 ---------------------------------
 */
let game_mysql_config = game_config.game_database;
mysql_game.connect_to_game(game_mysql_config.host, game_mysql_config.port,
                            game_mysql_config.db_name, game_mysql_config.uname,
                            game_mysql_config.upwd);