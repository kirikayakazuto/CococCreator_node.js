import * as net from "net";
import proto_man from "../netbus/proto_man";
import tcppkg from "../netbus/tcppkg";

import "../apps/talkroom/talk_room_proto";

var sock = net.connect({
	port: 6084,
	host: "127.0.0.1",
}, function() {
	console.log('connected to server!');
});

interface data {
    uname: string;
    upwd: string;
}

sock.on("connect",function() {
    console.log("connect success");
    let cmd_buf: Buffer = proto_man.encode_cmd(1, proto_man.PROTO_BUF, 1, 1, {
        uname: "denglang",
        upwd: "123456",
    });

    console.log(cmd_buf);

    let cmd = proto_man.decode_cmd(proto_man.PROTO_BUF, 1, 1, cmd_buf);
    console.log(cmd);
    
    cmd_buf = tcppkg.package_data(cmd_buf);
    setTimeout(() => {
        sock.write(cmd_buf);
    }, 3000);
	
});



sock.on("error", function(e) {
	console.log("error", e);
});


sock.on("close", function() {
	console.log("close");
});


sock.on("end", function() {
	console.log("end event");
});

sock.on("data", function(data) {
	console.log(data);
});