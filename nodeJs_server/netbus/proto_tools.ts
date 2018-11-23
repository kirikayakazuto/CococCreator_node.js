export default class proto_tools {

    static header_size: number = 10; // 头长度 2 stype + 2 ctype + 4 utag + 2 buf or json

    static read_int8(cmd_buf: Buffer, offset: number): number {
        return cmd_buf.readInt8(offset);
    }
    
    static write_int8(cmd_buf: Buffer, offset: number, value: number): void {
        cmd_buf.writeInt8(value, offset);
    }
    
    static read_int16(cmd_buf: Buffer, offset: number): number {
        return cmd_buf.readInt16LE(offset);
    }
    
    static write_int16(cmd_buf: Buffer, offset: number, value: number): void {
        cmd_buf.writeInt16LE(value, offset);
    }
    
    static read_int32(cmd_buf: Buffer, offset: number): number {
        return cmd_buf.readInt32LE(offset);
    }
    
    static write_int32(cmd_buf: Buffer, offset: number, value: number):void {
        cmd_buf.writeInt32LE(value, offset);
    }

    static read_uint32(cmd_buf: Buffer, offset: number): any {
        return cmd_buf.readUInt32LE(offset);
    }
    
    static write_uint32(cmd_buf: Buffer, offset: number, value: number): void {
        cmd_buf.writeUInt32LE(value, offset);
    }
    
    static read_str(cmd_buf: Buffer, offset: number, byte_len: number): string {
        return cmd_buf.toString("utf8", offset, offset + byte_len);
    }
    
    // 性能考虑
    static write_str(cmd_buf: Buffer, offset: number, str: string): void {
        cmd_buf.write(str, offset);
    }
    
    static read_float(cmd_buf: Buffer, offset: number): any {
        return cmd_buf.readFloatLE(offset);
    }
    
    static write_float(cmd_buf: Buffer, offset: number, value: number): void {
        cmd_buf.writeFloatLE(value, offset);
    }
    
    static alloc_buffer(total_len: number): Buffer {
        return Buffer.allocUnsafe(total_len);
    }
    
    static write_cmd_header_inbuf(cmd_buf: Buffer, stype: number, ctype: number): number {
        proto_tools.write_int16(cmd_buf, 0, stype);
        proto_tools.write_int16(cmd_buf, 2, ctype);
        proto_tools.write_uint32(cmd_buf, 4, 0);
    
        return proto_tools.header_size;
    }

    static read_cmd_header_inbuf(cmd_buf: Buffer): Array<any> {
        let cmd: Array<any> = [];
        cmd[0] = proto_tools.read_int16(cmd_buf, 0);
        cmd[1] = proto_tools.read_int16(cmd_buf, 1);

        let ret = [cmd, proto_tools.header_size];
        return ret;
    }
    
    static write_prototype_inbuf(cmd_buf: Buffer, proto_type: number) {
        this.write_int16(cmd_buf, 8, proto_type);
    }

    static write_utag_inbuf(cmd_buf: Buffer, utag: number) {
        this.write_uint32(cmd_buf, 4, utag);
    }

    static clear_utag_inbuf(cmd_buf: Buffer) {
        this.write_uint32(cmd_buf, 4, 0);	
    }
    

    static write_str_inbuf(cmd_buf: Buffer, offset: number, str: string, byte_len: number): number {
        // 写入2个字节字符串长度信息;
        proto_tools.write_int16(cmd_buf, offset, byte_len);
        offset += 2;
    
        proto_tools.write_str(cmd_buf, offset, str);
        offset += byte_len;
    
        return offset;
    }
    
    // 返回 str, offset
    static read_str_inbuf(cmd_buf: Buffer, offset: number) {
        let byte_len = proto_tools.read_int16(cmd_buf, offset);
        offset += 2;
        let str = proto_tools.read_str(cmd_buf, offset, byte_len);
        offset += byte_len;
        let ret: [string, number] = [str, offset];
        return ret;
    }
    
    static decode_empty_cmd(cmd_buf: Buffer) {
        let cmd: Array<any> = [];
        cmd[0] = proto_tools.read_int16(cmd_buf, 0);
        cmd[1] = proto_tools.read_int16(cmd_buf, 2);
        cmd[2] = null;
        return cmd;
    }
    
    static encode_empty_cmd(stype: number, ctype: number, body: any): Buffer {
        let cmd_buf = proto_tools.alloc_buffer(proto_tools.header_size);
        proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
        return cmd_buf;
    }
    
    static encode_status_cmd(stype: number, ctype: number, status: number): Buffer {
        let cmd_buf = proto_tools.alloc_buffer(proto_tools.header_size + 2);
        proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
        proto_tools.write_int16(cmd_buf, proto_tools.header_size, status);
    
        return cmd_buf;
    }
    
    static decode_status_cmd(cmd_buf: Buffer) {
        let cmd: Array<any> = [];
        cmd[0] = proto_tools.read_int16(cmd_buf, 0);
        cmd[1] = proto_tools.read_int16(cmd_buf, 2);
        cmd[2] = proto_tools.read_int16(cmd_buf, proto_tools.header_size);
    
        return cmd;
    }
    
    static encode_str_cmd(stype: number, ctype: number, str: any) {
        let byte_len = str.utf8_byte_len();
        let total_len = proto_tools.header_size + 2 + byte_len;
        let cmd_buf = proto_tools.alloc_buffer(total_len);
    
        let offset = proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
        offset = proto_tools.write_str_inbuf(cmd_buf, offset, str, byte_len);
    
        return cmd_buf;
    }
    
    static decode_str_cmd(cmd_buf: Buffer) {
        let cmd: Array<any> = [];
        cmd[0] = proto_tools.read_int16(cmd_buf, 0);
        cmd[1] = proto_tools.read_int16(cmd_buf, 2);
    
        let ret = proto_tools.read_str_inbuf(cmd_buf, proto_tools.header_size);
        cmd[2] = ret[0];
    
        return cmd;
    }

    static encode_int32_cmd(stype: number, ctype: number, value: number) {
        var cmd_buf = proto_tools.alloc_buffer(proto_tools.header_size + 4);
        proto_tools.write_cmd_header_inbuf(cmd_buf, stype, ctype);
        proto_tools.write_int32(cmd_buf, proto_tools.header_size, value);
        return cmd_buf;
    }
    
    static decode_int32_cmd(cmd_buf: Buffer) {
        let cmd: Array<any> = [];
        cmd[0] = proto_tools.read_int16(cmd_buf, 0);
        cmd[1] = proto_tools.read_int16(cmd_buf, 2);
        cmd[2] = proto_tools.read_int32(cmd_buf, proto_tools.header_size);
    
        return cmd;
    }
    

 
    
}

