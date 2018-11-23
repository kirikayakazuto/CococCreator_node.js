import log = require("../../utils/log");
import proto_man from "../../netbus/proto_man"
import proto_tools from "../../netbus/proto_tools"

interface data {
    uname: string;
    upwd: string;
}
proto_man.reg_decoder(1, 1, decode_cmd_1_1);
proto_man.reg_encoder(1, 1, encode_cmd_1_1);

// 对发出数据进行编码 buf
function encode_cmd_1_1(stype: number, ctype: number, body: data): Buffer {
    log.warn("encode_cmd_1_1 : " + body.uname + body.upwd);
    // 长度信息(2个字节) 数据(data.length个字节) 长度信息 数据
    // stype ctype data.length data data.length data
    let total_len = proto_tools.header_size + 2 + body.uname.length + 2 + body.upwd.length;
    
    let buf = Buffer.allocUnsafe(total_len);

    proto_tools.write_cmd_header_inbuf(buf, stype, ctype);

    proto_tools.write_int16(buf, 10, body.uname.length);
    proto_tools.write_str(buf, 12, body.uname);

    let offset = proto_tools.header_size + 2 + body.uname.length; 
    proto_tools.write_int16(buf, offset, body.upwd.length);
    proto_tools.write_str(buf, offset + 2, body.upwd);

    return buf;
}
// 对收到数据进行解码 buf
function decode_cmd_1_1(cmd_buf: Buffer) {
    // 从第4位 开始读取2个字节的数据   uname的长度信息
    let uname_len = proto_tools.read_int16(cmd_buf, proto_tools.header_size);

    if((uname_len + 2 + 2) > cmd_buf.length) {
        log.error("decode_cmd_1_1 cmd_buf error");
        return null;
    }

    let uname = cmd_buf.toString("utf8", 12, 12 + uname_len);
    
    if(!uname) {
        log.error("decode_cmd_1_1 uname error");
        return null;
    }

    let offset = 12 + uname_len;
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