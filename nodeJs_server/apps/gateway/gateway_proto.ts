import proto_tools from "../../netbus/proto_tools"
import Response from "../Response";
import {user_info} from "../info_interface";
import proto_man from "../../netbus/proto_man"
import Stype from "../Stype";
import Cmd from "../Cmd";

function decode_guest_login(cmd_buf: Buffer) {
    let cmd: Array<any> = [];
    cmd[0] = proto_tools.read_int16(cmd_buf, 0);
    cmd[1] = proto_tools.read_int16(cmd_buf, 2);
    let body: user_info = {};
    cmd[2] = body;

    let offset = proto_tools.header_size;
    body.status = proto_tools.read_int16(cmd_buf, offset);
    if (body.status != Response.OK) {
        return cmd;
    }
    offset += 2;

    body.uid = proto_tools.read_uint32(cmd_buf, offset);
    offset += 4;

    let ret = proto_tools.read_str_inbuf(cmd_buf, offset);
    body.unick = ret[0];
    offset = ret[1];
    
    body.usex = proto_tools.read_int16(cmd_buf, offset);
    offset += 2;

    body.uface = proto_tools.read_int16(cmd_buf, offset);
    offset += 2;

    body.uvip = proto_tools.read_int16(cmd_buf, offset);
    offset += 2;
    
    let ret2 = proto_tools.read_str_inbuf(cmd_buf, offset);
    body.guest_key = ret2[0];
    offset = ret2[1];

    return cmd;
}
proto_man.reg_decoder(Stype.Auth, Cmd.Auth.GUEST_LOGIN, decode_guest_login);

function encode_guest_login(stype: number, ctype: number, body: user_info) {
    if(body.status != Response.OK) {
       return proto_tools.encode_status_cmd(stype, ctype, body.status);
    }
 
    let unick_len = body.unick["utf8_byte_len"]();
    let ukey_len = body.guest_key["utf8_byte_len"]();
 
    let total_len = proto_tools.header_size + 2 + 4 + (2 + unick_len) + 2 + 2 + 2 + (2 + ukey_len);
    let cmd_buf = proto_tools.alloc_buffer(total_len);
    let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
    proto_tools.write_int16(cmd_buf, offset, body.status);
    offset += 2;
 
    proto_tools.write_uint32(cmd_buf, offset, body.uid);
    offset += 4;
 
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body.unick, unick_len);
 
    proto_tools.write_int16(cmd_buf, offset, body.usex);
    offset += 2;
 
    proto_tools.write_int16(cmd_buf, offset, body.uface);
    offset += 2;
 
    proto_tools.write_int16(cmd_buf, offset, body.uvip);
    offset += 2;
 
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body.guest_key, ukey_len);
 
    return cmd_buf;
 }
 proto_man.reg_encoder(Stype.Auth, Cmd.Auth.GUEST_LOGIN, encode_guest_login);

 function decode_uname_login(cmd_buf: Buffer) {
    let cmd: Array<any> = [];
    cmd[0] = proto_tools.read_int16(cmd_buf, 0);
    cmd[1] = proto_tools.read_int16(cmd_buf, 2);
    let body: user_info = {};
    cmd[2] = body;

    let offset = proto_tools.header_size;
    body.status = proto_tools.read_int16(cmd_buf, offset);
    if (body.status != Response.OK) {
        return cmd;
    }
    offset += 2;

    body.uid = proto_tools.read_uint32(cmd_buf, offset);
    offset += 4;

    let ret = proto_tools.read_str_inbuf(cmd_buf, offset);
    body.unick = ret[0];
    offset = ret[1];
    
    body.usex = proto_tools.read_int16(cmd_buf, offset);
    offset += 2;

    body.uface = proto_tools.read_int16(cmd_buf, offset);
    offset += 2;

    body.uvip = proto_tools.read_int16(cmd_buf, offset);
    offset += 2;

    return cmd;
}
proto_man.reg_decoder(Stype.Auth, Cmd.Auth.UNAME_LOGIN, decode_uname_login);

function encode_uname_login(stype: number, ctype: number, body: user_info) {
   if(body.status != Response.OK) {
      return proto_tools.encode_status_cmd(stype, ctype, body.status);
   }

   let unick_len = body.unick["utf8_byte_len"]();
   
   let total_len = proto_tools.header_size + 2 + 4 + (2 + unick_len) + 2 + 2 + 2;
   let cmd_buf = proto_tools.alloc_buffer(total_len);
   let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
   proto_tools.write_int16(cmd_buf, offset, body.status);
   offset += 2;

   proto_tools.write_uint32(cmd_buf, offset, body.uid);
   offset += 4;

   offset = proto_tools.write_str_inbuf(cmd_buf, offset, body.unick, unick_len);

   proto_tools.write_int16(cmd_buf, offset, body.usex);
   offset += 2;

   proto_tools.write_int16(cmd_buf, offset, body.uface);
   offset += 2;

   proto_tools.write_int16(cmd_buf, offset, body.uvip);
   offset += 2;

   return cmd_buf;
}

proto_man.reg_encoder(Stype.Auth, Cmd.Auth.UNAME_LOGIN, encode_uname_login);

 
