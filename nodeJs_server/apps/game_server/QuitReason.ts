export default class QuitReason {
    static UserQuit = 0; // 主动离开
    static UserLostConn = 1; // 用户掉线
    static VipKick = 2; // VIP踢人
    static SystemKick = 3; // 系统踢人
    static CHIP_IS_NOT_ENOUGH = 4;  // 金币不足, 自动t出房间
}