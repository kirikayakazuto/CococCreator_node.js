import {BaseSession} from "./netbus";

/**
 * 服务接口 有两个必要的方法 (1)接到客户端的数据  (2)客户端断开连接
 */
// interface
export default interface service_interface<T> {
    // 服务号
    stype: number;
    // 服务名 
    service_name: string;
    // 是否转发
    is_transfer: boolean;

    init(): any;
    // 接到客户端的数据
    on_recv_client_cmd(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any;

    // 客户端断开连接
    on_client_disconnect(stype: number, uid: number): any;

    on_recv_server_return(session: BaseSession, stype: number, ctype: number, body: any, utag: number, proto_type: number, raw_cmd: any): any;


}