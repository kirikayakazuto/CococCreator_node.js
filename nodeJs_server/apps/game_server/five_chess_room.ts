import game_config from "../game_config";
import five_chess_player from "./five_chess_player";
import log = require("../../utils/log");
import Response from "../Response";
import Stype from "../Stype";
import Cmd from "../Cmd";
import { BaseSession } from "../../netbus/netbus";
import proto_man from "../../netbus/proto_man";
import { State } from "./State";
import five_chess_model from "./five_chess_model";
import QuitReason from "./QuitReason";
import utils from "../../utils/utils";

enum ChessType {
    NONE = 0,
    BLACK = 1,
    WHITE = 2,

}


export default class five_chess_room {
    
    public zid = -1;    // 区间号
    public room_id = -1;    // 房间号
    public think_time = -1; // 思考时间
    public min_chip = 0;    // 进入房间的最少金币
    public bet_chip = 0;    // 每一场需要的金币数
    public INVIEW_SEAT = 20;    // 最大的观战人数

    public GAME_SEAT = 2;   // 游戏的对战人数
    public DISK_SIZE = 15;  // 棋盘的大小

    public chess_disk = new Array<number>(this.DISK_SIZE * this.DISK_SIZE).fill(ChessType.NONE);

    public state = State.Ready;   // 房间的状态值

    public inview_players: Array<five_chess_player> = new Array(this.INVIEW_SEAT); // 观战玩家列表
    public seats: Array<five_chess_player> = new Array(this.GAME_SEAT);// 游戏对战的玩家列表

    public black_rand = true;   // 随机生成的黑旗
    public black_seatid = -1;   // 黑旗的座位
    public cur_seatid = -1; // 当前轮到的 这个玩家

    public action_timer = null; // 定时器对象 玩家超时
    public action_timeout_timestamp = 0;    // 玩家超时的时间戳

    public prev_round_data = null;
    public round_data = {};

    
    constructor(room_id: number, config: {
        zid: number,
        name: string,
        vip_level: number, 
        min_chip: number,
        one_round_chip: number,
        think_time: number
    }) {
        this.zid = config.zid;
        this.room_id = room_id;
        this.think_time = config.think_time;
        this.min_chip = config.min_chip;
        this.bet_chip = config.one_round_chip;
    }
    write_err(status: number, ret_func: any) {
        var ret = {};
        ret[0] = status;
        ret_func(ret);
    }

    reset_chess_disk() {    // 清理 棋盘
        this.chess_disk.fill(ChessType.NONE);
    }

    // 进入房间
    do_enter_room(player: five_chess_player) {
        let inview_seat = this.search_empty_seat_inview();
        if(inview_seat < 0) {
            log.warn("do_enter_room inview seat error");
            return ;
        }
        this.inview_players[inview_seat] = player;
        player.room_id = this.room_id;
        player.enter_room(this);
        
        // 玩家进入房间后, 首先将房间内信息 发给玩家 
        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i]) {
                continue;
            }
            let other = this.seats[i];
            
            let body = this.get_user_arrived(other);
            player.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.USER_ARRIVED, body);
        }
        // end

        log.info("player_id : " + player.uid + " in room room_id : " + this.room_id);

        let body: Array<any> = [
            Response.OK, 
            player.zid, 
            player.room_id
        ];

        player.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ENTER_ROOM, body);
        // 自动分配一个座位给玩家  
        this.do_sitdown(player);
    }

    // 玩家坐下
    do_sitdown(player: five_chess_player) {
        
        if(player.seatid != -1) {   // 玩家已经坐下
            console.log(player.zid);
            return ;
        }

        let sv_seat = this.search_empty_seat();

        if(sv_seat == -1) { // 没有可以坐下的位置
            return ;
        }

        this.seats[sv_seat] = player;
        player.seatid = sv_seat;
        player.sitdown(this);

        log.info("player do_sitdown player seats : " + player.seatid);
        let body: Array<any> = [
            Response.OK,
            sv_seat,
        ]
        // 通知客户端, 玩家坐下
        player.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.SITDOWN, body);

        // 广播给房间内的其他人, 玩家坐下
        let body_data = this.get_user_arrived(player);
        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.USER_ARRIVED, body_data, player.uid)
        // end

    }
    // 寻找一个可以坐下对战的空位
    search_empty_seat() {
        for(let i=0; i<this.seats.length; i++) {
            if(this.seats[i] == null) {
                return i;
            }
        }
        return -1;
    }
    // 寻找一个观战席的空位
    search_empty_seat_inview() {
        for(let i=0; i<this.INVIEW_SEAT; i++) {
            if(this.inview_players[i] == null) {    // 找到一个空位
                return i;
            }
        }
        return -1;
    }
    // 玩家是否已经准备好了
    do_player_ready(player: five_chess_player, ret_func: (body: any) => void) {
        // 玩家是否已经在房间内坐下了
        if(player != this.seats[player.seatid]) {
            log.error("do_player_ready seats");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        if(this.state != State.Ready || player.state != State.InView) {
            log.error("do_player_ready player state");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        player.do_ready();

        let body = [
            Response.OK,
            player.seatid
        ];

        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.SEND_DO_READY, body, null);

        this.check_game_start();
    }  
    // 获取游戏开始信息
    get_round_start_info() {
        let wait_client_time = 3000;    // 毫秒
        let body = [
            this.think_time,
            wait_client_time,
            this.black_seatid
        ];
        return body;
    }
    // 开始 游戏
    game_start() {
        // 改变房间的状态
        this.state = State.Playing;
        // end

        // 清理棋盘
        this.reset_chess_disk();
        // end

        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i] || this.seats[i].state != State.Ready) {
                continue;
            }
            this.seats[i].on_round_start();
        }
        
        // 判断谁先 开始游戏 谁先手
        if(this.black_rand) {
            this.black_rand = false;
            this.black_seatid = Math.random() * 2;
            this.black_seatid = Math.floor(this.black_seatid);
        }else {
            this.black_seatid = this.next_seat(this.black_seatid);
        }

        let body = this.get_round_start_info();
        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ROUND_START, body, null)
        // end
        this.cur_seatid = -1;
        // 切换下棋玩家
        setTimeout(this.turn_to_player.bind(this), body[1], this.black_seatid);

        // 保存一下当前的 开局信息 ... 上局回顾
        let seats_data = [];
        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i] || this.seats[i].state != State.Playing) {
                continue;
            }

            let data = this.get_user_arrived(this.seats[i]);
            seats_data.push(data);
        }
        this.round_data[0] = seats_data;    // 座位信息
        this.round_data[1] = [];
        let action_cmd = [utils.timestamp(), Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.ROUND_START, body];
        this.round_data[1].push(action_cmd);
        // end
    }
    // 轮换下棋的玩家
    turn_to_player(seatid) {
        if(this.action_timer != null) {
            clearTimeout(this.action_timer);
            this.action_timer = null;
        }
        
        if(!this.seats[seatid] || this.seats[seatid].state != State.Playing) {
            log.error("turn_to_player: ", seatid, "seat is invalid!!!!");
            return ;
        }

        this.action_timer = setTimeout(this.do_player_action_timeout.bind(this), 1000 * this.think_time, seatid)
        this.action_timeout_timestamp = utils.timestamp() + this.think_time;

        
        let player = this.seats[seatid];
        player.turn_to_player(this);

        this.cur_seatid =  seatid;

        let body = [
            this.think_time,
            seatid,
        ];

        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.TURN_TO_PLAYER, body, null);
        let action_time = [utils.timestamp(), Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.TURN_TO_PLAYER, body];
        this.round_data[1].push(action_time);
    }
    // 玩家超时
    do_player_action_timeout(seatid: number) {
        this.action_timer = null;
        
        /**
        玩家超时 直接失败
        let winner_seatid = this.GAME_SEAT - seatid - 1;
        let winner = this.seats[winner_seatid];
        if(winner) {
            this.check_out_game(1, winner);
        }
         */

        // 转换到下一个玩家
        this.turn_to_next();
    }
    turn_to_next() {
        let next_seat = this.get_next_seat();
        if(next_seat == -1) {
            log.error("trun_to_next error");
            return ;
        }
        this.turn_to_player(next_seat);
    }
    // 下一个开始游戏 先下棋 位置
    next_seat(cur_seatid: number) {
        let i = cur_seatid;
        for(i=cur_seatid + 1; i<this.GAME_SEAT; i++) {
            if(this.seats[i] && this.seats[i].state == State.Playing) {
                return i;
            }
        }

        for(let i=0; i<cur_seatid; i++) {
            if(this.seats[i] && this.seats[i].state == State.Playing) {
                return i;
            }
        }

        return -1;
    }
    // 检查是否可以开始游戏
    check_game_start() {
        let ready_num = 0;
        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i] || this.seats[i].state != State.Ready) {
                continue;
            }

            ready_num ++;
        }

        if(ready_num >= this.GAME_SEAT) {
            this.game_start();
        }
    }
    // 退出房间
    do_exit_room(player: five_chess_player, quit_reason: number) {
        // 如果玩家处于游戏状态 则不允许玩家退出
        if(quit_reason == QuitReason.UserLostConn &&
            this.state == State.Playing &&
            player.state == State.Playing) {
            return false;
        }
        let winner = null;
        // ...
        if(player.seatid != -1) {
            if(player.state == State.Playing) {
                let winner_seatid = this.GAME_SEAT - player.seatid - 1;
                winner = this.seats[winner_seatid]
                if(winner) {
                    this.check_out_game(1, winner);
                }
            }
            let seatid = player.seatid;
            player.standup(this);
            this.seats[player.seatid] = null;
            player.seatid = -1;
            
            // 广播给所有的玩家 , 玩家退出房间
            let body = {
                0: Response.OK,
                1: seatid,
            }

            this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.STANDUP, body, null);
            // end
        }
        // end

        for(let i=0; i<this.inview_players.length; i++) {
            if(this.inview_players[i] == player) {
                this.inview_players[i] = null;
            }
        }
        player.exit_room(this);
        player.room_id = -1;

        log.info("player_id : " + player.uid + " exit room room_id : " + this.room_id);

        return true;
    }
    // 房间内还有的 空位数目
    empty_seat() {
        let num = 0;
        for(let i=0; i<this.seats.length; i++) {
            if(this.seats[i] == null) {
                num ++;
            }
        }
        return num;
    }
    // 发送道具 
    send_prop(player: five_chess_player, to_seatid: number, propid: number, ret_func: any) {
        if(player.seatid == -1) {
            log.error("send_prop player seatid error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        if(player != this.seats[player.seatid]) {
            log.error("send_prop player seats list error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        if(!this.seats[to_seatid]) {
            log.error("send_prop player seats error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        if(propid <= 0 || propid > 5) {
            log.error("send_prop prop id error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        let body = [
            Response.OK,
            player.seatid,
            to_seatid,
            propid
        ];

        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.SEND_PROP, body, null)
    }
    do_player_put_chess(player: five_chess_player, block_x: number, block_y: number, ret_func: any) {
        if(player != this.seats[player.seatid]) {
            log.error("send_prop player seats list error");
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        if(player.seatid != this.cur_seatid) {  // 判断当前轮 是否是这个玩家下棋 
            this.write_err(Response.NOT_YOUR_TURN, ret_func);
            return ;
        }

        if(this.state != State.Playing || player.state != State.Playing) {  // 判断状态
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        if(block_x < 0 || block_x > 14 || block_y < 0 || block_y > 14) {    // 判断块的合法性
            this.write_err(Response.INVALID_PARAMS, ret_func);
            return ;
        }

        let index = block_y * 15 + block_x;
        if(this.chess_disk[index] != ChessType.NONE) {  // 下棋的位置已经有一个棋子了
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }
        if(player.seatid == this.black_seatid) {    // 黑棋
            this.chess_disk[index] = ChessType.BLACK;
        }else {
            this.chess_disk[index] = ChessType.WHITE;
        }

        let body = [
            Response.OK,
            block_x,
            block_y,
            this.chess_disk[index]
        ];

        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.PUT_CHESS, body, null);
        let action_cmd = [utils.timestamp(), Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.PUT_CHESS, body];
        this.round_data[1].push(action_cmd);

        if(this.action_timer != null) {
            clearTimeout(this.action_timer);
            this.action_timer = null;
        }

        // 判断是否需要结算
        let check_ret = this.check_game_over(block_x, block_y, this.chess_disk[index]);
        if(check_ret != 0) {    // 游戏结束了
            log.info("game over! : " + this.chess_disk[index] + " result: " + check_ret);
            this.check_out_game(check_ret, player);
            return ;
        }
        // end
        // 玩家超时, 切换到下一个玩家 继续
        this.turn_to_next();
        // end

    }
    // 结算
    check_out_game(check_ret: number, winner: five_chess_player) {
        
        this.state = State.CheckOut;
        for(let i=0; i<this.GAME_SEAT; i++) {
            if(this.seats[i] == null || this.seats[i].state != State.Playing) {
                continue;
            }
            this.seats[i].check_out_game(this, check_ret, this.seats[i] == winner);
        }

        let winner_score = this.bet_chip;
        let winner_seat = winner.seatid;
        if(check_ret == 2) {    // 平局
            winner_seat = -1;
        }
        let body = [
            winner_seat,
            winner_score
        ];

        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.CHECKOUT, body, null);
        let action_cmd = [utils.timestamp(), Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.CHECKOUT, body];
        this.round_data[1].push(action_cmd);

        this.prev_round_data = this.round_data;
        this.round_data = {};

        // 踢出 掉线的玩家
        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i]) {
                continue;
            }

            if(this.seats[i].session == null) {
                five_chess_model.kick_offline_player(this.seats[i].uid);
                continue;
            }
        }
        // 4秒后结算结束
        let check_time = 4000;
        setTimeout(this.check_out_over.bind(this), check_time);
    }
    // 结算结算
    check_out_over() {
        this.state = State.Ready;

        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i] || this.seats[i].state != State.CheckOut) {
                continue;
            }

            this.seats[i].check_out_over(this);
        }

        this.room_broadcast(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.CHECKOUT_OVER, null, null);

        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i]) {
                continue;
            }

            if(this.seats[i].uchip < this.min_chip) {
                five_chess_model.kick_player_chip_not_enough(this.seats[i].uid);
                continue;
            }
        }
    }
    check_game_over(block_x: number, block_y: number, chess_type: number) {   // 每下一个子, 判断是否成了5个
        
        if(this.left_to_right(block_x, block_y, chess_type) == 1 ||
           this.top_to_bottom(block_x, block_y, chess_type) == 1 ||
           this.lt_to_rb(block_x, block_y, chess_type) == 1 ||
           this.lb_to_rt(block_x, block_y, chess_type) == 1) {
            return 1;
        }

        for(let i=0; i<this.DISK_SIZE * this.DISK_SIZE; i++) {
            if(this.chess_disk[i] == ChessType.NONE) {
                return 0;
            }
        }
        return 2;
    }
    // 寻找下一个下棋的玩家
    get_next_seat() {           
        
        for(let i=this.cur_seatid + 1; i<this.GAME_SEAT; i++) {
            if(!this.seats[i] || this.seats[i].state != State.Playing) {
                continue;
            }
            return i;
        }

        for(let i=0; i<this.cur_seatid; i++) {
            if(!this.seats[i] || this.seats[i].state != State.Playing) {
                continue;
            }
            return i;
        }

        return -1;
    }
    // 断线重连, 
    do_reconnect(player: five_chess_player) {
        if(this.state != State.Playing &&
            player.state != State.Playing) {
                return ;
        }

        let seats_data = [];    // 其他玩家的数据
        for(let i=0; i<this.GAME_SEAT; i++) {
            if(!this.seats[i] || 
                this.seats[i] == player ||
                this.seats[i].state != State.Playing) {
                    continue;
            }
            let arrived_data = this.get_user_arrived(this.seats[i]);
            seats_data.push(arrived_data);
        }

        let round_start_info = this.get_round_start_info();

        let game_ctrl = [
            this.cur_seatid,
            this.action_timeout_timestamp - utils.timestamp()
            
        ];

        let body = {
            0: player.seatid,
            1: seats_data,
            2: round_start_info,
            3: this.chess_disk,
            4: game_ctrl
        };

        player.send_cmd(Stype.GAME_FIVE_CHESS, Cmd.GameFiveChess.RECONNECT, body);
    }
    get_user_arrived(other: five_chess_player) {
        let body = [
            other.seatid,
			
            other.unick, 
            other.usex,
            other.uface,

            other.uchip,
            other.uexp,
            other.uvip,
            other.state, // 玩家当前游戏状态
        ];
        return body;
    }
    // 上局回顾
    do_player_get_prev_round_data(player: five_chess_player, ret_func: any) {
        if(!this.prev_round_data || player.state == State.Playing || player.state == State.Ready) {
            this.write_err(Response.INVALIDI_OPT, ret_func);
            return ;
        }

        let body = {
            0: Response.OK,
            1: this.prev_round_data,
        }

        ret_func(body);
    }
    // 房间内广播   对数据进行 进行封装,  走service_manager 进on_recv_server_return 将数据转发到 broadcast_service
    // broadcast_service在将数据发出给个个客户端
    room_broadcast(stype: number, ctype: number, body: any, not_to_uid: number) {
        let json_uid = [];
        let buf_uid = [];

        let cmd_json = null;
        let cmd_buf = null;

        let gw_session: BaseSession = null;

        for(let i=0; i<this.inview_players.length; i++) {
            if(!this.inview_players[i] || 
                this.inview_players[i].session == null ||
                this.inview_players[i].uid == not_to_uid
                ) {   // 如果
                continue;
            }
            gw_session = this.inview_players[i].session;

            if(this.inview_players[i].proto_type == proto_man.PROTO_JSON) {
                json_uid.push(this.inview_players[i].uid);
                if(!cmd_json) {
                    cmd_json = proto_man.encode_cmd(0, proto_man.PROTO_JSON, stype, ctype, body);
                }
            }else if(this.inview_players[i].proto_type == proto_man.PROTO_BUF) {
                buf_uid.push(this.inview_players[i].uid);
                if(!cmd_buf) {
                    cmd_buf = proto_man.encode_cmd(0, proto_man.PROTO_BUF, stype, ctype, body);
                }
            }

        }
        if(json_uid.length > 0) {   // 走的json协议
            let body: BROADCAST_interface = {
                cmd_buf: cmd_json,
                users: json_uid,
            }
            
            gw_session.send_cmd(Stype.Broadcast, Cmd.BROADCAST, body, 0, proto_man.PROTO_BUF);

        }else if(buf_uid.length > 0) {  // 走动buf协议
            let body: BROADCAST_interface = {
                cmd_buf: cmd_buf,
                users: buf_uid,
            }
            
            gw_session.send_cmd(Stype.Broadcast, Cmd.BROADCAST, body, 0, proto_man.PROTO_BUF);
        }
    }

     // 检查 左右边的 // block_y * 15 + block_x;
     left_to_right(block_x: number, block_y: number, chess_type: number) {
        let count = 1;
        let pos_x = block_x;
        while(1) {
            pos_x --;
            if(pos_x < 0) break;
            if(this.chess_disk[block_y * 15 + pos_x] == chess_type) count ++;
            else break;
        }
        pos_x = block_x;
        while(1) {
            pos_x ++;
            if(pos_x > 14) break;
            if(this.chess_disk[block_y * 15 + pos_x] == chess_type) count ++
            else break;   
        }
        if(count >= 5) return 1;
        return -1;
    }

    // 检查 上下边的
    top_to_bottom(block_x: number, block_y: number, chess_type: number) {
        let count = 1;
        let pos_y = block_y;
        while(1) {
            pos_y --;
            if(pos_y < 0) break;
            if(this.chess_disk[pos_y * 15 + block_x] == chess_type) count ++;
            else break;
        }
        pos_y = block_x;
        while(1) {
            pos_y ++;
            if(pos_y > 14) break;
            if(this.chess_disk[pos_y * 15 + block_x] == chess_type) count ++
            else break;   
        }
        if(count >= 5) return 1;
        return -1;
    }
    // 检查左下 到 右上
    lb_to_rt(block_x: number, block_y: number, chess_type: number) {
        let count = 1;
        let pos_x = block_x;
        let pos_y = block_y;
        while(1) {
            pos_x ++;
            pos_y ++;
            if(pos_x > 14) break;
            if(pos_y > 14) break;
            if(this.chess_disk[pos_y * 15 + pos_x] == chess_type) count ++;
            else break;
        }
        pos_x = block_x;
        pos_y = block_y;
        while(1) {
            pos_x --;
            pos_y --;
            if(pos_x < 0) break;
            if(pos_y < 0) break;
            if(this.chess_disk[pos_y * 15 + pos_x] == chess_type) count ++;
            else break;
        }
        if(count >= 5)  return 1;
        return -1;
    }
    // 检查左上 到 右下
    lt_to_rb(block_x: number, block_y: number, chess_type: number) {
        let count = 1;
        let pos_x = block_x;
        let pos_y = block_y;
        while(1) {
            pos_x ++;
            pos_y --;
            if(pos_x > 14) break;
            if(pos_y < 0) break;
            if(this.chess_disk[pos_y * 15 + pos_x] == chess_type) count ++;
            else break;
        }
        pos_x = block_x;
        pos_y = block_y;
        while(1) {
            pos_x --;
            pos_y ++;
            if(pos_x < 0) break;
            if(pos_y > 14) break;
            if(this.chess_disk[pos_y * 15 + pos_x] == chess_type) count ++;
            else break;
        }
        if(count >= 5) return 1;
        return -1;
    }

   

    
}

interface BROADCAST_interface{
    cmd_buf: Buffer,
    users: Array<number>;   
}