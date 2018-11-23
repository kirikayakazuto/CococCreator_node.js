export default class tcppkg {
	// 根据封包协议我们读取包体的长度;
	static read_pkg_size(pkg_data: any, offset: number): number {
		if (offset > pkg_data.length - 2) { // 没有办法获取长度信息的;
			return -1; 
		}

		let len: number = pkg_data.readUInt16LE(offset);
		return len;
	}

	static package_data(data: any): Buffer {
		let buf: Buffer = Buffer.allocUnsafe(2 + data.length);
		buf.writeInt16LE(2 + data.length, 0);
		buf.fill(data, 2);

		return buf;
	}
}

