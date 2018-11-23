import {netbus, BaseSession} from "../../netbus/netbus";
import porto_man from "../../netbus/proto_man"
import service_manager from "../../netbus/service_manager"
import log = require("../../utils/log");

import talk_room from "./talk_room";
import "../../init"

log.info("-- tcp 监听 --\n 6080 PROTO_JSON -- 6081 PROTO_BUF");
// 开启tcp监听
netbus.start_tcp_server("127.0.0.1", 6084, false);
// netbus.start_ws_server("127.0.0.1", 6085, false);

// log.info("\n-- ws 监听 --\n 6082 PROTO_JSON -- 6083 PROTO_BUF");
// 开启ws 监听
// netbus.start_ws_server("127.0.0.1", 6082, porto_man.PROTO_JSON, false);
// netbus.start_ws_server("127.0.0.1", 6083, porto_man.PROTO_BUF, false);




// 服务
let service = service_manager.getInstance();
service.register_service(1, new talk_room());