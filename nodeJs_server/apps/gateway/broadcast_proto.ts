import proto_tools from "../../netbus/proto_tools";
import proto_man from "../../netbus/proto_man";
import Stype from "../Stype";
import Cmd from "../Cmd";

/**
 * 服务号: Stype.Broadcast
 * 命令号: Cmd.BROADCAST
 * 
 * body: {
 * cmd_buf: <Buffer> 要发送给用户的命令
 * users: [uid1, uid2, uid3, ...], 要接收的用户, 
 * }
 */

interface BROADCAST_interface{
    cmd_buf: Buffer,
    users: Array<number>;   
}
function encode_broadcast(stype: number, ctype: number, body: BROADCAST_interface) {
    let buffer_len: number = body.cmd_buf.length;
    let user_num: number = body.users.length;

    let total_len = proto_tools.header_size + (2 + buffer_len) + (2 + user_num * 4);
    let cmd_buf = proto_tools.alloc_buffer(total_len);

    let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
    proto_tools.write_int16(cmd_buf, offset, (2 + buffer_len));
	offset += 2;

	body.cmd_buf.copy(cmd_buf, offset, 0, buffer_len);
	offset += buffer_len;

	proto_tools.write_int16(cmd_buf, offset, user_num);
	offset += 2;
    
    for(let i=0; i<body.users.length; i++) {
        proto_tools.write_uint32(cmd_buf, offset, body.users[i]);
		offset += 4;
    }
	return cmd_buf;
}

function decode_broadcast(cmd_buf: Buffer) {

    let cmd: Array<any> = [];
    cmd[0] = proto_tools.read_int16(cmd_buf, 0);
    cmd[1] = proto_tools.read_int16(cmd_buf, 2);
    

    let offset = proto_tools.header_size;
	// 解码cmd_buf
	let buffer_len = proto_tools.read_int16(cmd_buf, offset);
	offset += 2;
	
	let body_cmd_buf = Buffer.allocUnsafe(buffer_len - 2);
	cmd_buf.copy(body_cmd_buf, 0, offset, offset + buffer_len - 2);
	offset += (buffer_len - 2);
	// end 

	let body_users = [];
	let user_num = proto_tools.read_int16(cmd_buf, offset);
	offset += 2;

	for(let i = 0; i < user_num; i ++) {
		let uid = proto_tools.read_uint32(cmd_buf, offset);
		body_users.push(uid);
		offset += 4;
    }
    
    let body: BROADCAST_interface = {
        cmd_buf: body_cmd_buf,
        users: body_users,
    }
    cmd[2] = body;
	return cmd;
}
proto_man.reg_encoder(Stype.Broadcast, Cmd.BROADCAST, encode_broadcast);
proto_man.reg_decoder(Stype.Broadcast, Cmd.BROADCAST, decode_broadcast);