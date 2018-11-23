import log = require("../utils/log");
import proto_man from "./proto_man";

import * as net from "net";
import * as ws from "ws";
import tcppkg from "./tcppkg";
import service_manager from "./service_manager";


export class netbus {
    public static start_tcp_server = start_tcp_server;
    public static start_ws_server = start_ws_server;
    // public static session_send = session_send;
    public static session_close = session_close;

    public static connect_tcp_server = connect_tcp_server;

    public static get_client_session = get_client_session;
    public static get_server_session = get_server_session;

    // connect_stp_server: 
}

export class BaseSession {
    // 是否是websocket
    public is_ws: boolean = null;
    // tcp 处理包
    public last_pkg: any = null;
    // 是否 加密
    public is_encrypt: boolean = null;
    // 是否 在连接中
    public is_connected = true;
    // 协议类型
    public proto_type: number = null;
    // session
    public session_key: number = null;
    public session: net.Socket | WebSocket = null;
    // 用户标识
    public uid: number = null;

    // 扩展session的方法
    send_encoded_cmd(cmd) {
        if(!this.is_connected) {
            return null;
        }

        if(this.is_encrypt) {
            cmd = proto_man.encrypt_cmd(cmd);
        }

        if(!this.is_ws) {
            cmd = tcppkg.package_data(cmd);
            this.session = <net.Socket>this.session;
            this.session.write(cmd);
        }else {
            this.session = <WebSocket>this.session;
            this.session.send(cmd);
        }
    }

    send_cmd(stype: number, ctype: number, body: any, utag: number, proto_type: number) {
        if(!this.is_connected) {
            log.error("send_cmd  error");
            return ;
        }
        let cmd = proto_man.encode_cmd(utag, proto_type, stype, ctype, body)
        if(cmd) {
            this.send_encoded_cmd(cmd);
        }
    }

    constructor(socket: net.Socket | WebSocket, is_ws: boolean) {

        this.session = socket;
        this.is_ws = is_ws;
        if(is_ws) {
            this.session = <WebSocket>this.session;
        }else{
            this.session = <net.Socket>this.session;
        }
        
        
    }   
}

let global_session_list:{[key: number] : BaseSession} = {};
let global_session_key: number = 1;
/**
 * -----------------------------------------tcpsocket--------------------------------------------------
 */
// 添加客户端事件
function add_client_session_event(BaseSession: BaseSession, is_encrypt: boolean) {

    BaseSession.session = <net.Socket>BaseSession.session
    log.info("client coming ip: ", BaseSession.session.remoteAddress + " port:" + BaseSession.session.remotePort);

    BaseSession.session.on("close", () => {
        log.info("close socket");
    });

    BaseSession.session.on("error", (e: any) => {
        log.error("session error ", e);
    });

    BaseSession.session.on("data", (data:Buffer|string) => {
        if(!Buffer.isBuffer(data)) {
            session_close(BaseSession);
            return ;
        }
        let last_pkg = BaseSession.last_pkg;
		if (last_pkg != null) { // 上一次剩余没有处理完的半包;
			let buf = Buffer.concat([last_pkg, data], last_pkg.length + data.length);
			last_pkg = buf;
		}
		else {
			last_pkg = data;	
		}

		let offset = 0;
		let pkg_len = tcppkg.read_pkg_size(last_pkg, offset);
		if (pkg_len < 0) {
			return;
		}

		while(offset + pkg_len <= last_pkg.length) { // 判断是否有完整的包;
			// 根据长度信息来读取我们的数据,架设我们穿过来的是文本数据
			let cmd_buf: Buffer = null; 

            // 收到了一个完整的数据包
            /*
			if (BaseSession.proto_type == proto_man.PROTO_JSON) {
				let json_str = last_pkg.toString("utf8", offset + 2, offset + pkg_len);
				if (!json_str) {
					session_close(BaseSession);
					return;
				}
				on_session_recv_cmd(BaseSession, json_str);	
			}
			else {
                */
            cmd_buf = Buffer.allocUnsafe(pkg_len - 2); // 2个长度信息
            last_pkg.copy(cmd_buf, 0, offset + 2, offset + pkg_len);
            on_session_recv_cmd(BaseSession, cmd_buf);	
			
			

			offset += pkg_len;
			if (offset >= last_pkg.length) { // 正好我们的包处理完了;
				break;
			}

			pkg_len = tcppkg.read_pkg_size(last_pkg, offset);
			if (pkg_len < 0) {
				break;
			}
		}

		// 能处理的数据包已经处理完成了,保存 0.几个包的数据
		if (offset >= last_pkg.length) {
			last_pkg = null;
		}
		else { // offset, length这段数据拷贝到新的Buffer里面
			let buf = Buffer.allocUnsafe(last_pkg.length - offset);
			last_pkg.copy(buf, 0, offset, last_pkg.length);
			last_pkg = buf;
		}

		BaseSession.last_pkg = last_pkg;

    });

    on_session_enter(BaseSession, is_encrypt);

}

function start_tcp_server(ip: string, port: number, is_encrypt: boolean) {

    log.info("start tcp server .. ", ip + " " + port);

    let server = net.createServer((client_socket: net.Socket) => {
        add_client_session_event(new BaseSession(client_socket, false), is_encrypt);
    });

    server.on("error", (e) => {
        log.error("start server error " + e);
    });

    server.on("close", () => {
        log.error("server close");
    });

    server.listen({
        // host: ip,
        port: port,
        exclusive: true,
    });
}

function isString(obj: any): boolean {
    return obj.prototype.toString.call(obj) === "[object String]";
}

/**
 * ---------------------------------------------websocket------------------------------------------------------------
 */

function start_ws_server(ip: string, port: number, is_encrypt: boolean) {
     log.info("start ws server .. ", ip + " " + port);
     let server = new ws.Server({
        //host: ip,
        port: port
     });

     function on_server_client_comming(client_socket: WebSocket) {
        ws_add_client_session_event(new BaseSession(client_socket, true), is_encrypt);
     }
     server.on("connection", on_server_client_comming);

     function on_server_listen_error(err: any) {
        log.error("ws server error ", err);
     }
     server.on("error", on_server_listen_error);

 }

function ws_add_client_session_event(BaseSession: BaseSession, is_encrypt: boolean) {

    BaseSession.session = <WebSocket>BaseSession.session;
    BaseSession.session.addEventListener("close", () => {
        on_session_exit(BaseSession);
    });

    BaseSession.session.addEventListener("error", (error: any) => {
        log.error("ws error");
    });

    BaseSession.session.addEventListener("message", (event: MessageEvent) => {
        
            
        if(!Buffer.isBuffer(event.data)) {
            log.error("ws_add_client_session_event message error");
            session_close(BaseSession);
            return ;
        }

        on_session_recv_cmd(BaseSession, event.data);
    });
    on_session_enter(BaseSession, is_encrypt);    
 }
/**
 * ----------------------------- net.Socket 和 WebSocket 公共的方法
 */
function get_client_session(session_key: number): BaseSession {
    return global_session_list[session_key];
}
// 发送数据
function session_send(BaseSession: BaseSession, cmd: any) {
    if(!BaseSession.is_ws) {  // 判断参数BaseSession是否是 net.Socket | WebSocket 进入if表示是net.Socket
        let data = tcppkg.package_data(cmd);
        BaseSession.session = <net.Socket>BaseSession.session;
        BaseSession.session.write(data);
        return ;
    }else {         // WebSocket
        BaseSession.session = <WebSocket>BaseSession.session;
        BaseSession.session.send(cmd);
    }
}
// 发送编码好的命令
function session_send_encode_cmd(cmd) {
    if(!this.is_connected) {
        log.error("session_send_encode_cmd session close");
        return null;
    }

    if(this.is_encrypt) {
        cmd = proto_man.encrypt_cmd(cmd);
    }

    if(!this.is_ws) {
        let data = tcppkg.package_data(cmd);
    }
}
 // session 关闭
function session_close(BaseSession: BaseSession) {
    log.info("session close ..");
    if(!BaseSession.is_ws) {
        BaseSession.session = <net.Socket>BaseSession.session;
        BaseSession.session.end();
        return;
    } else {
        BaseSession.session = <WebSocket>BaseSession.session;
        BaseSession.session.close();
        return ;
    }
}
// session退出
function on_session_exit(BaseSession: BaseSession) {
    log.info("session exit...");
    BaseSession.is_connected = false;
    // 获取单例
    service_manager.getInstance().on_client_lost_connect(BaseSession);

    BaseSession.last_pkg = null;
    // 将这个session从列表中删除
    if(global_session_list[BaseSession.session_key]) {
        global_session_list[BaseSession.session_key] = null;
        delete global_session_list[BaseSession.session_key];
        // BaseSession.session_key = null;
    }
}
// 收到消息, 将消息转发
function on_session_recv_cmd(BaseSession: any, str_or_buf: any) {
    log.info("on_session_recv_cmd ", str_or_buf);
    if(!service_manager.getInstance().on_recv_client_cmd(BaseSession, str_or_buf)) {
        session_close(BaseSession);
    }
}

// session 进入
function on_session_enter(BaseSession: BaseSession, is_encrypt: boolean): void {
    if(BaseSession.is_ws) {
        log.info("ws session enter session_key : " + global_session_key);
    }else {
        log.info("tcp session enter session_key : " + global_session_key);
    }
    
    BaseSession.is_connected = true;
    BaseSession.last_pkg  = null;
    BaseSession.is_encrypt = is_encrypt;

    global_session_list[global_session_key] = BaseSession;
    BaseSession.session_key = global_session_key;
    global_session_key ++;
}
/**
 *    ------------------------------------ session  内部连接通道-----------------------------------
 */

// server_connect_list   中存入的是   由netbus 连接到 其他服务器的  session连接
let server_connect_list:{ [key: number]: BaseSession} = {};
function get_server_session(stype: number):BaseSession {
    return server_connect_list[stype];
}
// 连接
function on_session_connected(stype:number, BaseSession: BaseSession, is_ws, is_encrypt) {
    if(BaseSession.is_ws) {
        BaseSession.session = <WebSocket>BaseSession.session;
        log.info("server session connect: websocket");
    }else {
        log.info("server session connect: net.Socket");
    }

    BaseSession.last_pkg = null;
    BaseSession.is_connected = true;
    BaseSession.is_ws = is_ws;
    BaseSession.is_encrypt = is_encrypt;
    
    server_connect_list[stype] = BaseSession;

    log.info("on_session_connected : " + stype + " " + server_connect_list[stype]);

    BaseSession.session_key = stype;
}
// 断开连接
function on_session_disconnect(BaseSession: BaseSession) {
    BaseSession.is_connected = false;
    let stype = BaseSession.session_key;

    BaseSession.last_pkg = null;
    BaseSession.session_key = null;

    if(server_connect_list[stype]) {    // 如果在服务器连接列表中存在 当前连接, 则删除
        server_connect_list[stype] = null;
        delete server_connect_list[stype];
    }
}

// 通过tcp连接 自己的  服务器
function connect_tcp_server(stype: number, host: string, port: number, is_encrypt: boolean) {
    
    let session:net.Socket = net.connect({
        port: port,
        host: host,
    });

    let NetSession = new BaseSession(session, false);
    NetSession.session = <net.Socket>NetSession.session;
    
    NetSession.is_connected = false;

    NetSession.session.on("connect", () => {
        log.info("Server_Session connect");
        on_session_connected(stype, NetSession, false, is_encrypt);
    });

    NetSession.session.on("close", () => {
        if(NetSession.is_connected == true) {
            on_session_disconnect(NetSession);
        }
        session.end();

        setTimeout(() => {
            log.warn("connect_tcp_server reconnect: ", stype, host, port, is_encrypt);
            connect_tcp_server(stype, host, port, is_encrypt);
        }, 3000)    
    }); 

    NetSession.session.on("data", (data) => {
        // 
		if (!Buffer.isBuffer(data)) { // 不合法的数据
			session_close(NetSession);
			return;
		}
		// end 

		let last_pkg = NetSession.last_pkg;
		if (last_pkg != null) { // 上一次剩余没有处理完的半包;
			let buf = Buffer.concat([last_pkg, data], last_pkg.length + data.length);
			last_pkg = buf;
		}
		else {
			last_pkg = data;	
		}

		let offset = 0;
		let pkg_len = tcppkg.read_pkg_size(last_pkg, offset);
		if (pkg_len < 0) {
			return;
		}

		while(offset + pkg_len <= last_pkg.length) { // 判断是否有完整的包;
			// 根据长度信息来读取我们的数据,架设我们穿过来的是文本数据
			let cmd_buf; 

			// 收到了一个完整的数据包
            cmd_buf = Buffer.allocUnsafe(pkg_len - 2); // 2个长度信息
            last_pkg.copy(cmd_buf, 0, offset + 2, offset + pkg_len);
            on_recv_cmd_server_return(session, cmd_buf);	
			
			offset += pkg_len;
			if (offset >= last_pkg.length) { // 正好我们的包处理完了;
				break;
			}

			pkg_len = tcppkg.read_pkg_size(last_pkg, offset);
			if (pkg_len < 0) {
				break;
			}
		}

		// 能处理的数据包已经处理完成了,保存 0.几个包的数据
		if (offset >= last_pkg.length) {
			last_pkg = null;
		}
		else { // offset, length这段数据拷贝到新的Buffer里面
			let buf = Buffer.allocUnsafe(last_pkg.length - offset);
			last_pkg.copy(buf, 0, offset, last_pkg.length);
			last_pkg = buf;
		}

		NetSession.last_pkg = last_pkg;
    });

    NetSession.session.on("error", (e) => {
        // 等待走重连 通道
    });

   
    
}

// 数据转发
function on_recv_cmd_server_return(BaseSession, str_or_buf) {
    
    if(!service_manager.getInstance().on_recv_server_return(BaseSession, str_or_buf)) {
		session_close(BaseSession);
	}
}



// start_tcp_server("127.0.0.1", 6080, 1);