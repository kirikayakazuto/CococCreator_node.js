import ws from "ws";

let sock = new ws("ws://127.0.0.1:6081");

sock.on("open", () => {
    console.log("connect success !!! ");
    // let bufstr = new Buffer("hello");
    // sock.send(bufstr);
    // sock.send("hello world");
    sock.send(Buffer.alloc(5, 'a'));
});

sock.on("error", (e) => {
    console.log("error : ", e);
});

sock.on("close", () => {
    console.log("ws client close");
});

sock.on("message", (data) => {
    console.log("data ", data);
});