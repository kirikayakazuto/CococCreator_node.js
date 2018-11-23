import Stype from "./Stype"

export default class game_config {
    // 网关 配置
    static gateway_config = {
        host : "127.0.0.1",
        ports: [6080, 6081],
    }
    /**
     * webserver
     */
    static webserver = {
		host: "127.0.0.1",
		port: 10001,
	}
    /**
     * ---------------------------- 游戏服务配置 ---------------------------
     */
    // 游戏系统 配置
    static game_system_server = {
        host: "127.0.0.1",
        port: 6087,
        stypes: [Stype.GAME_SYSTEM],
    }
    static game_database = {
        host : "127.0.0.1",
        port: 3306,
        db_name: "nodejs_game",

        uname : "root",
        upwd : "123",
    }

    /**
     * ----------------------------- 中心服务配置 -------------------------------------
     */
    // 中心服务 配置
    static center_server = {
        host : "127.0.0.1",
        port : 6086,
        stypes: [Stype.Auth],
    }
    // 中心数据库 mysql配置
    static center_database = {
        host : "127.0.0.1",
        port: 3306,
        db_name: "nodejs_center",

        uname : "root",
        upwd : "123",
    }
    // 中心数据库 redis配置
    static center_redis = {
        host: "127.0.0.1",
        port: 6379,
        db_index: 0,
    }
    // 游戏数据库 redis
    static game_redis = {
        host: "127.0.0.1",
        port: 6379,
        db_index: 1,
    }


    // 
    static game_server = [
        /*
        {
            stype : Stype.TalkRoom,
            host: "127.0.0.1",
            port: 6084
        },
        */
        {
            stype: Stype.Auth,
            host: "127.0.0.1",
            port: 6086,
        },
        {
            stype: Stype.GAME_SYSTEM,
            host: "127.0.0.1",
            port: 6087,
        },
        {
            stype: Stype.GAME_FIVE_CHESS,
            host: "127.0.0.1",
            port: 6088,
        }

    ]
    // 游戏注册时候的一些数据;
	static game_data = {
		first_uexp: 1000,
        first_uchip: 1000,
        
        login_bonues_config: {
			clear_login_straight: false, // 是否清除连续登录	
			bonues: [100, 200, 300, 400, 500], // 后面都是最多奖励500，
        },
        /**
         * ---------------------------------- 五子棋 ---------------------------
         */
        five_chess_zones: [
            {zid: 1, name: "新手场", vip_level: 0, min_chip: 100, one_round_chip: 3, think_time: 15},
            {zid: 2, name: "高手场", vip_level: 0, min_chip: 5000, one_round_chip: 10, think_time: 10},
            {zid: 3, name: "大师场", vip_level: 0, min_chip: 10000, one_round_chip: 16, think_time: 10},
        ]
	}
}

