import { game_info, bonues_info } from "../info_interface";
import Response from "../Response";
import proto_tools from "../../netbus/proto_tools";
import proto_man from "../../netbus/proto_man";
import Stype from "../Stype";
import Cmd from "../Cmd";

/**
 * 玩家进入区间
 * 1, 接收值
 * 服务号(4), 命令号(1)
 * body = {
 *     zid: number,   //  区间号
 * }
 * 2, 返回值
 * 服务号(4), 命令号(1)
 * body = {
 *  status: number, // 返回一个状态值
 * }
 */
proto_man.reg_decoder(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ENTER_ZONE, proto_tools.decode_status_cmd);
proto_man.reg_encoder(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ENTER_ZONE, proto_tools.encode_status_cmd);

 /**
  * 玩家主动退出
  * 1, 接收值
  * 服务号(4), 命令号(2)
  * body = {
  *     null
  * }
  * 2, 返回值
  * 服务号(4), 命令号(2)
  * body = {
  *     status: number // 返回一个状态值
  * }
  */
proto_man.reg_decoder(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.USER_QUIT, proto_tools.decode_empty_cmd);
proto_man.reg_encoder(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.USER_QUIT, proto_tools.encode_status_cmd);

/**
 * 玩家进入房间
 * 1, 接收值
 * 服务号(4), 命令号(3)
 * body = {
 *  room_id: number, // 房间号 玩家主动进入某一个房间是调用
 * }
 * 2, 返回值
 * 服务号(4), 命令号(3)
 * body = {
 * status : Response.OK,
 * zid: this.zid,
 * room_id : this.room_id,
 * }
 */

function encode_enter_room(stype: number ,ctype: number, body: any) {
  if(body[0] != Response.OK) {
    return proto_tools.encode_status_cmd(stype, ctype, body.status);
  }

  let total_len = proto_tools.header_size + 2 + 2 + 4;
	let cmd_buf = proto_tools.alloc_buffer(total_len);

	let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
	proto_tools.write_int16(cmd_buf, offset, body[0]);
	offset += 2;
	proto_tools.write_int16(cmd_buf, offset, body[1]);
	offset += 2;
	proto_tools.write_int32(cmd_buf, offset, body[2]);
	offset += 4;

	return cmd_buf;

}
proto_man.reg_decoder(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ENTER_ROOM, proto_tools.decode_int32_cmd);
proto_man.reg_encoder(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ENTER_ROOM, encode_enter_room);


/**
 * 玩家坐下
 * 1, 接收值
 * 服务号(4), 命令号(5) SITDOWN: 5, // 玩家坐下		
 * body = {
      seat_id: number, // 座位号
 * }
 * 2, 返回值
 * body = {
 *  0: Response.OK,
 *  1: sv_seat,
 * }
 */
/**
 * 其他玩家坐下
 * user_arrived
 * /*var body = {
		0: p.seatid,
		
		1: p.unick, 
		2: p.usex,
		3: p.uface,

		4: p.uchip,
		5: p.uexp,
		6: p.uvip,
		7: p.state, // 当前玩家的状态
	};
 */

/**
* 玩家站起
* 服务号(4), 命令号(6) STANDUP: 6, // 玩家站起,
*/

/**
 * 玩家 准备开始游戏
 * Response.OK,
 * player.seatid
 */

/**
* 通知房间 开始游戏 
* this.think_time,
* 3,
* this.black_seatid
*/

/**
 * 切换下棋的玩家
 * this.think_time,
 * seatid,
 */

/**
 * 玩家下棋
 * 0: Response.ok
 * 1: block_x,
 * 2: block_y,
 * 3: this.chess_disk[index]  // 棋子的类型
 */

/**
 * 游戏结算
 * 0: winner_seat  // 赢家的座位号, 平局则为-1
 * 1: winner_score // 得分
 */

/**
 * 游戏结算完毕, 清理游戏
 * Cmd.GameFiveChess.CHECKOUT_OVER
 * null
 */


/**
 * 玩家断线重连
 * RECONNECT: 15, // 玩家断线重连
 * 0: player.seatid
 * 1: 座位的数据
 * 2: round_info // 游戏开始得数据
 * 3: 当前棋盘的数据
 * 4: 游戏的进程数据
 */

/**
 * 上局回顾
 * GET_PREV_ROUND
 * 
 * 
 * 0: Response.OK,
 * 1: this.prev_round_data,
 */