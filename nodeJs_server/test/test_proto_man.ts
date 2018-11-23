import log = require("../utils/log");
import {netbus} from "../netbus/netbus"
import proto_man from "../netbus/proto_man"

interface data {
    uname: string;
    upwd: string;
}

let buf = proto_man.encode_cmd(1, proto_man.PROTO_JSON, 1, 1, {
    uname: "denglang",
    upwd: "123456"
});
log.info(buf);

let cmd = proto_man.decode_cmd(proto_man.PROTO_JSON, 1, 1, buf);
log.info(cmd);


// 对发出数据进行编码 buf
function encode_cmd_1_1(body: data): Buffer {
    let stype = 1;
    let ctype = 1;
    // 长度信息(2个字节) 数据(data.length个字节) 长度信息 数据
    // stype ctype data.length data data.length data
    let total_len = 2 + 2 + 2 + body.uname.length + 2 + body.upwd.length;
    let buf = Buffer.allocUnsafe(total_len);
    buf.writeUInt16LE(stype, 0);
    buf.writeUInt16LE(ctype, 2);

    buf.writeUInt16LE(body.uname.length, 4);
    buf.write(body.uname, 6);

    let offset = 6 + body.uname.length; 
    buf.writeUInt16LE(body.upwd.length, offset);
    buf.write(body.upwd, offset + 2);

    return buf;
}
// 对收到数据进行解码 buf
function decode_cmd_1_1(cmd_buf: Buffer) {
    let stype = 1;
    let ctype = 1;
    // 从第4位 开始读取2个字节的数据   uname的长度信息
    let uname_len = cmd_buf.readUInt16LE(4);
    if((uname_len + 2 + 2 + 2) > cmd_buf.length) {
        log.error("decode_cmd_1_1 cmd_buf error");
        return null;
    }

    let uname = cmd_buf.toString("utf8", 6, 6 + uname_len);
    if(!uname) {
        log.error("decode_cmd_1_1 uname error");
        return null;
    }

    let offset = 6 + uname_len;
    let upwd_len = cmd_buf.readUInt16LE(offset);
    if((offset + upwd_len + 2) > cmd_buf.length) {
        log.error("decode_cmd_1_1 upwd error");
        return null;
    }

    let upwd = cmd_buf.toString("utf8", offset + 2, offset + 2 + upwd_len);

    let cmd = {
        0: 1,
        1: 1,
        2: {
            "uname" : uname,
            "upwd" : upwd,
        }
    };

    return cmd;
}

proto_man.reg_encoder(1, 1, encode_cmd_1_1);
proto_man.reg_decoder(1, 1, decode_cmd_1_1);

let proto_cmd_buf = proto_man.encode_cmd(1, proto_man.PROTO_BUF, 1, 1, {
    uname : "denglang",
    upwd : "123456"
});
log.info(proto_cmd_buf);

cmd = proto_man.decode_cmd(proto_man.PROTO_BUF, 1, 1, proto_cmd_buf);
log.info(cmd);