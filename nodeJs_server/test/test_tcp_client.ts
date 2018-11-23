import * as net from "net";
import * as netpkg from "./netpkg";

var sock = net.connect({
	port: 6080,
	host: "127.0.0.1",
}, function() {
	console.log('connected to server!');
});

sock.on("connect",function() {
    console.log("connect success");
    
	// sock.write(netpkg.package_data("Hello!"));
	// sock.write(netpkg.default.test_pkg_two_action("start", "stop"));
	let buf_set = netpkg.default.test_pkg_two_slice("deng", "lang");

	sock.write(buf_set[0]); // 
	setTimeout(function() {
		sock.write(buf_set[1]);
	}, 5000);
	
});



sock.on("error", function(e) {
	console.log("error", e);
});


sock.on("close", function() {
	console.log("close");
});


sock.on("end", function() {
	console.log("end event");
});

sock.on("data", function(data) {
	console.log(data);
});