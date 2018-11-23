import { game_info, bonues_info } from "../info_interface";
import Response from "../Response";
import proto_tools from "../../netbus/proto_tools";
import proto_man from "../../netbus/proto_man";
import Stype from "../Stype";
import Cmd from "../Cmd";

/**
 * 用户账号 登录到游戏服务器 
 * 
 * 1, 接收值
 * 服务号(3), 命令号 GameSystem.UGAME_LOGIN: 1,
 * body = null
 * 
 * 2, 返回值
 * 服务号(3), 命令号 GameSystem.UGAME_LOGIN: 1,
 * body = {
 * 0: status,
 * 1: uchip,
 * 2: uexp,
 * 3: game_uvip,
 * }
 */

function encode_get_uname_info(stype: number, ctype: number, body: game_info) {
    
    if(body.status != Response.OK) {
        return proto_tools.encode_status_cmd(stype, ctype, body.status);
    }

    let total_len = proto_tools.header_size + 2 + 4 + 4 + 2;
    let cmd_buf = proto_tools.alloc_buffer(total_len);

    let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
    proto_tools.write_int16(cmd_buf, offset, body.status);
    offset += 2;

    proto_tools.write_int32(cmd_buf, offset, body.uchip);
    offset += 4;

    proto_tools.write_int32(cmd_buf, offset, body.uexp);
    offset += 4;

    proto_tools.write_int16(cmd_buf, offset, body.uvip);
    offset += 2;

    return cmd_buf;
}

proto_man.reg_decoder(Stype.GAME_SYSTEM, Cmd.GameSystem.GET_GAME_INFO, proto_tools.decode_empty_cmd);
proto_man.reg_encoder(Stype.GAME_SYSTEM, Cmd.GameSystem.GET_GAME_INFO, encode_get_uname_info);

/**
 * 每日登录登录奖励  GameSystem.LOGIN_BONUES_INFO
 * 1, 接收值
 * 服务号(3), 命令号 GameSystem.LOGIN_BONUES_INFO 
 * body = {
 * }
 * 2, 返回值
 * body = {
 *  0: status,
 *  1: 是否可以领取奖励,
 *  2: id号,
 *  3: bonues, 奖励多少
 *  4: days, 连续登录的天数
 * }
 */
function encode_login_bonues_info(stype: number, ctype: number, body: bonues_info) {
    // console.log(body);
    if(body.status != Response.OK) {
        return proto_tools.encode_status_cmd(stype, ctype, body.status);
    }

    let total_len = proto_tools.header_size + 2 + 2 + 4 + 4 + 2;
    let cmd_buf = proto_tools.alloc_buffer(total_len);

    let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
    proto_tools.write_int16(cmd_buf, offset, body.status);
    offset += 2;

    proto_tools.write_int16(cmd_buf, offset, body.b_has);
    offset += 2;

    proto_tools.write_int32(cmd_buf, offset, body.id);
    offset += 4;

    proto_tools.write_int32(cmd_buf, offset, body.bonues);
    offset += 4;

    proto_tools.write_int16(cmd_buf, offset, body.days);
    offset += 2;

    return cmd_buf;
}
proto_man.reg_decoder(Stype.GAME_SYSTEM, Cmd.GameSystem.LOGIN_BONUES_INFO, proto_tools.decode_empty_cmd);
proto_man.reg_encoder(Stype.GAME_SYSTEM, Cmd.GameSystem.LOGIN_BONUES_INFO, encode_login_bonues_info);

/**
 * 领取今日的登录奖励
 * 服务号(3), 命令号GameSystem.RECV_LOGIN_BUNUES: 3, // 发放登录奖励
 * body = {
 *  bonues_id: number,
 * }
 * 返回值:
 * 服务号(3), 命令号GameSystem.RECV_LOGIN_BUNUES: 3, // 发放登录奖励
 * body = {
 *  status: number,
 *  bonues: number,
 * }
 */

function encode_recv_login_bonues(stype: number, ctype: number, body: bonues_info) {
    if(body.status != Response.OK) {
        return proto_tools.encode_status_cmd(stype, ctype, body.status);
    }
    let total_len = proto_tools.header_size + 2 + 4;
    let cmd_buf = proto_tools.alloc_buffer(total_len);

    let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
    proto_tools.write_int16(cmd_buf, offset, body.status);
    offset += 2;

    proto_tools.write_int32(cmd_buf, offset, body.bonues);
    offset += 4;


    return cmd_buf;
}
proto_man.reg_decoder(Stype.GAME_SYSTEM, Cmd.GameSystem.RECV_LOGIN_BUNUES, proto_tools.decode_int32_cmd);
proto_man.reg_encoder(Stype.GAME_SYSTEM, Cmd.GameSystem.RECV_LOGIN_BUNUES, encode_recv_login_bonues);

/**
 * 世界排行榜
 * 1,接收值
 * 服务号(3), 命令号,GET_WORLD_RANK_INFO: 4, // 获取世界全局的排行榜信息
 * body = {
 *  
 * }
 * 2, 返回值
 * 服务号(3), 命令号,GET_WORLD_RANK_INFO: 4, // 获取世界全局的排行榜信息
 * body = {
 *  //let ret = {};
 * ret[0] = Response.OK;
 * ret[1] = rank_array.length;
 * ret[2] = rank_array; (unick, usex, uface, uchip)
 * ret[3] = my_rank_num
 * }
 */
function encode_world_rank_info(stype: number, ctype: number, body: Array<any>) {
    if(body[0] != Response.OK) {
        return proto_tools.encode_status_cmd(stype, ctype, body[0]);
    }
    let unick_len = 0;
    let array_info:Array<[string, number, number, number]> = body[2];

    for(let i=0; i<body[1]; i++) {
        unick_len += array_info[i][0]["utf8_byte_len"]() + 2;
    }

    let total_len = proto_tools.header_size + 2 + 4 + (body[1] * (2 + 2 + 4)) + unick_len + 4;
    let cmd_buf = proto_tools.alloc_buffer(total_len);

    let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
    proto_tools.write_int16(cmd_buf, offset, body[0]);
    offset += 2;

    proto_tools.write_int32(cmd_buf, offset, body[1]);
    offset += 4;

    for(let i=0; i<body[1]; i++) {
        
        offset = proto_tools.write_str_inbuf(cmd_buf, offset, array_info[i][0], array_info[i][0]["utf8_byte_len"]());
        

        proto_tools.write_int16(cmd_buf, offset, array_info[i][1]);
        offset += 2;

        proto_tools.write_int16(cmd_buf, offset, array_info[i][2]);
        offset += 2;

        proto_tools.write_int32(cmd_buf, offset, array_info[i][3]);
        offset += 4;
    }

    proto_tools.write_int32(cmd_buf, offset, body[3]);
    offset += 4;

    return cmd_buf;
}

proto_man.reg_decoder(Stype.GAME_SYSTEM, Cmd.GameSystem.GET_WORLD_RANK_INFO, proto_tools.decode_empty_cmd);
proto_man.reg_encoder(Stype.GAME_SYSTEM, Cmd.GameSystem.GET_WORLD_RANK_INFO, encode_world_rank_info);

