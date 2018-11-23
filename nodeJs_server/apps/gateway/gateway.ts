import "../../init"

import game_config from "../game_config"
import {netbus} from "../../netbus/netbus"
import service_manager from "../../netbus/service_manager"
import gateway_service from "./gateway_service"
import broadcast_service from "./broadcast_service"
import Stype from "../Stype";

let host = game_config.gateway_config.host;
let posts = game_config.gateway_config.ports;

netbus.start_tcp_server(host, posts[0], true);  // port 6080
netbus.start_ws_server(host, posts[1], true);   // port 6081

service_manager.getInstance().register_service(Stype.Broadcast, new broadcast_service());

// 连接  自己的 服务器
let game_server = game_config.game_server;
let gate_way = gateway_service.getInstance();



game_server.forEach(server => {
    netbus.connect_tcp_server(server.stype, server.host, server.port, false);
    service_manager.getInstance().register_service(server.stype, gate_way);
});
