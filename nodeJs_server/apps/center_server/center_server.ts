import "../../init"

import game_config from "../game_config"
import {netbus} from "../../netbus/netbus"
import service_manager from "../../netbus/service_manager"
import Stype from "../Stype"
import auth_service from "./auth_service"

import mysql_center from "../../database/mysql_center"
import redis_center from "../../database/redis_center";
import mysql_game from "../../database/mysql_game";


let center = game_config.center_server;
netbus.start_tcp_server(center.host, center.port, false);

service_manager.getInstance().register_service(Stype.Auth, new auth_service());


/**
 * ---------------------------------- 连接中心服务器的 mysql ----------------------------------------
 */
let database = game_config.center_database;
mysql_center.connect_to_center(database.host, database.port, database.db_name, database.uname, database.upwd);

/**
 * ---------------------------------- 连接中心服务器的 redis ---------------------------------------------
 */
let center_redis_config = game_config.center_redis;
redis_center.connect_to_center(center_redis_config.host, center_redis_config.port, center_redis_config.db_index);

/**
 * --------------------------------- 连接游戏数据库 mysql ----------------------------------------------
 */
let game_mysql_config = game_config.game_database;
mysql_game.connect_to_game(game_mysql_config.host, game_mysql_config.port, game_mysql_config.db_name, game_mysql_config.uname, game_mysql_config.upwd);