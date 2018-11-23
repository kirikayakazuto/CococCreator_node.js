export default class Response {
    static OK: number = 1;
    static Auth = {

    };

    static INVALID_PARAMS: number = -100; // 表示用户传递的参数错误
	static SYSTEM_ERR: number = -101; // 系统错误
    static ILLEGAL_ACCOUNT: number = -102; // 非法的账号
    static INVALIDI_OPT: number = -103; // 非法的操作
    static PHONE_IS_REG: number = -104; // 手机已经被绑定
    static PHONE_CODE_ERR: number =  -105; // 验证码错误
    static UNAME_OR_UPWD_ERR: number = -106; // 用户名后密码错误
    static PHONE_IS_NOT_REG: number = -107; // 手机号为非法的账号
    static RANK_IS_EMPTY: number = -108;
    static INVALID_ZONE =  -109; // 非法的游戏空间
	static CHIP_IS_NOT_ENOUGH = -110; // 金币不足 
    static VIP_IS_NOT_ENOUGH = -111; // vip等级不足
    static NOT_YOUR_TURN = -112; // 没有轮到你
}