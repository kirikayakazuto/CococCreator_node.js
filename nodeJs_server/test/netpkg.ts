export default class netpkg {
    
    static read_pkg_size(pkg_data:Buffer, offset): number {
        if(offset > pkg_data.length - 2) {
            return -1;
        }

        let len = pkg_data.readUInt16LE(offset);
        return len;
    }

    static package_data(data): Buffer {
        let buf = Buffer.allocUnsafe(2 + data.length);
		buf.writeInt16LE(2 + data.length, 0);
		buf.fill(data, 2);

		return buf;
    }

    // 模拟底层TCP 粘包的问题
	static test_pkg_two_action(action1, action2): Buffer {
		var buf = Buffer.allocUnsafe(2 + 2 + action1.length + action2.length);
		buf.writeInt16LE(2 + action1.length, 0);
		buf.fill(action1, 2);

		var offset = 2 + action1.length;
		buf.writeInt16LE(2 + action2.length, offset);
		buf.fill(action2, offset + 2);

		return buf;
	}

	// 模拟的一个大的数据包，分两次发送到客户端;
	// one cmd half_cmd + half_cmd2
	static test_pkg_two_slice(half_cmd1, half_cmd2): Array<Buffer> {
		// 
		var buf1 = Buffer.allocUnsafe(2 + half_cmd1.length);
		buf1.writeInt16LE(2 + half_cmd1.length +　half_cmd2.length, 0);
		buf1.fill(half_cmd1, 2);

		var buf2 = Buffer.allocUnsafe(half_cmd2.length);
		buf2.fill(half_cmd2, 0);

		return [buf1, buf2];
	}
    
}
