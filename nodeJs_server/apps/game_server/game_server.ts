import "../../init"

import game_config from "../game_config"
import {netbus} from "../../netbus/netbus"
import service_manager from "../../netbus/service_manager"
import Stype from "../Stype"
import redis_center from "../../database/redis_center";
import mysql_game from "../../database/mysql_game";
import redis_game from "../../database/redis_game";

import five_chess_service from "./five_chess_service"

let game_server = game_config.game_server;
netbus.start_tcp_server(game_server[2].host, game_server[2].port, false);

service_manager.getInstance().register_service(Stype.GAME_FIVE_CHESS, new five_chess_service());

// 连接中心 redis
let center_redis_config = game_config.center_redis;
redis_center.connect_to_center(center_redis_config.host, center_redis_config.port, center_redis_config.db_index);

// 连接游戏 redis
let game_redis_config = game_config.game_redis;
redis_game.connect_to_game(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);

// 连接游戏数据库
let game_mysql_config = game_config.game_database;
mysql_game.connect_to_game(game_mysql_config.host, game_mysql_config.port, game_mysql_config.db_name, game_mysql_config.uname, game_mysql_config.upwd);