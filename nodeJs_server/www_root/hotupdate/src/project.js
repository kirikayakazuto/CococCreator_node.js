__require = function e(t, o, n) {
function r(s, i) {
if (!o[s]) {
if (!t[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!t[a]) {
var u = "function" == typeof __require && __require;
if (!i && u) return u(a, !0);
if (_) return _(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
}
var c = o[s] = {
exports: {}
};
t[s][0].call(c.exports, function(e) {
return r(t[s][1][e] || e);
}, c, c.exports, e, t, o, n);
}
return o[s].exports;
}
for (var _ = "function" == typeof __require && __require, s = 0; s < n.length; s++) r(n[s]);
return r;
}({
Cmd: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "8ce03TmWr9FuYtix4/EmQav", "Cmd");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.USER_DISCONNECT = 1e4;
e.BROADCAST = 10001;
e.Auth = {
GUEST_LOGIN: 1,
RELOGIN: 2,
EDIT_PROFILE: 3,
GUEST_UPGRADE_INDENTIFY: 4,
BIND_PHONE_NUM: 5,
UNAME_LOGIN: 6,
GET_PHONE_REG_VERIFY: 7,
PHONE_REG_ACCOUNT: 8,
GET_FORGET_PWD_VERIFY: 9,
RESET_USER_PWD: 10
};
e.GameSystem = {
GET_GAME_INFO: 1,
LOGIN_BONUES_INFO: 2,
RECV_LOGIN_BUNUES: 3,
GET_WORLD_RANK_INFO: 4
};
e.GameFiveChess = {
ENTER_ZONE: 1,
USER_QUIT: 2,
ENTER_ROOM: 3,
EXIT_ROOM: 4,
SITDOWN: 5,
STANDUP: 6,
USER_ARRIVED: 7,
SEND_PROP: 8,
SEND_DO_READY: 9,
ROUND_START: 10,
TURN_TO_PLAYER: 11,
PUT_CHESS: 12,
CHECKOUT: 13,
CHECKOUT_OVER: 14,
RECONNECT: 15,
GET_PREV_ROUND: 16
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
EXDataView: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "10919y4JTJD6b56lcMh9P8y", "EXDataView");
cc._RF.pop();
}, {} ],
Response: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3d4dfYIuexIA6DPs7Y0KBxO", "Response");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.OK = 1;
e.Auth = {};
e.INVALID_PARAMS = -100;
e.SYSTEM_ERR = -101;
e.ILLEGAL_ACCOUNT = -102;
e.INVALIDI_OPT = -103;
e.PHONE_IS_REG = -104;
e.PHONE_CODE_ERR = -105;
e.UNAME_OR_UPWD_ERR = -106;
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
State: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ac8f3UVmK5IwZqmwssVXHXq", "State");
Object.defineProperty(o, "__esModule", {
value: !0
});
(function(e) {
e[e.InView = 1] = "InView";
e[e.Ready = 2] = "Ready";
e[e.Playing = 3] = "Playing";
e[e.CheckOut = 4] = "CheckOut";
})(o.State || (o.State = {}));
cc._RF.pop();
}, {} ],
Stype: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f91b0sdQdtL25Mz/QQnO2MG", "Stype");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.TalkRoom = 1;
e.Broadcast = 1e4;
e.Auth = 2;
e.GAME_SYSTEM = 3;
e.GAME_FIVE_CHESS = 4;
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
account_forget: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3ebe7RI0hRGkqK2IZ4y7BCn", "account_forget");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../3rd/md5"), r = e("../protobufs/auth"), _ = e("../ugame"), s = cc._decorator, i = s.ccclass, a = s.property, u = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phone_input = null;
t.pwd_input = null;
t.again_pwd_input = null;
t.verify_code_input = null;
t.error_label = null;
return t;
}
t.prototype.onLoad = function() {
this.error_label.node.active = !1;
};
t.prototype.start = function() {};
t.prototype.on_close_click = function() {
this.node.active = !1;
};
t.prototype.show_error_label = function(e) {
var t = this;
this.error_label.node.active = !0;
this.error_label.string = e;
this.unscheduleAllCallbacks();
this.scheduleOnce(function() {
t.error_label.node.active = !1;
}, 2);
};
t.prototype.on_get_forget_pwd_verify_code_click = function() {
this.phone_input.string && 11 == this.phone_input.string.length ? r.default.get_forget_pwd_verify_code(this.phone_input.string) : this.show_error_label("手机号码有误!");
};
t.prototype.on_forget_pwd_commit_click = function() {
if (this.phone_input.string && 11 == this.phone_input.string.length) if (!this.pwd_input.string || this.pwd_input.string.length <= 0) this.show_error_label("密码有误!"); else if (this.pwd_input.string == this.again_pwd_input.string) if (this.verify_code_input.string && 6 == this.verify_code_input.string.length) {
_.default.save_temp_uname_and_upwd(this.phone_input.string, this.pwd_input.string);
var e = n(this.pwd_input.string);
r.default.reset_user_pwd(this.phone_input.string, e, this.verify_code_input.string);
} else this.show_error_label("验证码有误!"); else this.show_error_label("两次输入的密码不相同!"); else this.show_error_label("手机号码有误!");
};
__decorate([ a(cc.EditBox) ], t.prototype, "phone_input", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "pwd_input", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "again_pwd_input", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "verify_code_input", void 0);
__decorate([ a(cc.Label) ], t.prototype, "error_label", void 0);
return t = __decorate([ i ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
}, {
"../../3rd/md5": "md5",
"../protobufs/auth": "auth",
"../ugame": "ugame"
} ],
account_reg: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5fda566/w5IFbhk8gC1vqWz", "account_reg");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../protobufs/auth"), r = e("../../3rd/md5"), _ = e("../ugame"), s = cc._decorator, i = s.ccclass, a = s.property, u = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick_input = null;
t.phone_input = null;
t.pwd_input = null;
t.again_pwd_input = null;
t.verify_code_input = null;
t.error_label = null;
return t;
}
t.prototype.onLoad = function() {
this.error_label.node.active = !1;
};
t.prototype.start = function() {};
t.prototype.show_error_label = function(e) {
var t = this;
this.error_label.node.active = !0;
this.error_label.string = e;
this.unscheduleAllCallbacks();
this.scheduleOnce(function() {
t.error_label.node.active = !1;
}, 2);
};
t.prototype.on_close_click = function() {
this.node.active = !1;
};
t.prototype.on_get_verify_code_click = function() {
this.phone_input.string && 11 == this.phone_input.string.length ? n.default.get_phone_reg_verify_code(this.phone_input.string) : this.show_error_label("手机号码有误");
};
t.prototype.on_reg_account_with_phone_click = function() {
if (this.phone_input.string && 11 == this.phone_input.string.length) if (!this.unick_input.string || this.unick_input.string.length <= 0) this.show_error_label("昵称有误"); else if (!this.pwd_input.string || this.pwd_input.string.length <= 0) this.show_error_label("密码有误"); else if (this.again_pwd_input.string == this.pwd_input.string) if (this.verify_code_input.string && 6 == this.verify_code_input.string.length) {
_.default.save_temp_uname_and_upwd(this.phone_input.string, this.pwd_input.string);
var e = r(this.pwd_input.string);
n.default.reg_phone_account(this.unick_input.string, this.phone_input.string, e, this.verify_code_input.string);
} else this.show_error_label("验证码有误"); else this.show_error_label("密码不一致"); else this.show_error_label("手机号码有误");
};
__decorate([ a(cc.EditBox) ], t.prototype, "unick_input", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "phone_input", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "pwd_input", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "again_pwd_input", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "verify_code_input", void 0);
__decorate([ a(cc.Label) ], t.prototype, "error_label", void 0);
return t = __decorate([ i ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
}, {
"../../3rd/md5": "md5",
"../protobufs/auth": "auth",
"../ugame": "ugame"
} ],
account_uname_login: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0d039qN5OdEVrrfb6Ml+COS", "account_uname_login");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../ugame"), r = e("../protobufs/auth"), _ = cc._decorator, s = _.ccclass, i = _.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phone_input = null;
t.pwd_input = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.start = function() {
if (!n.default.is_guest) {
this.phone_input.string = n.default.uname;
this.pwd_input.string = n.default.upwd;
}
};
t.prototype.on_close_click = function() {
this.node.active = !1;
};
t.prototype.on_uname_upwd_login_click = function() {
if (this.phone_input.string && 11 == this.phone_input.string.length && this.pwd_input.string && !(this.pwd_input.string.length <= 0)) {
n.default.save_temp_uname_and_upwd(this.phone_input.string, this.pwd_input.string);
r.default.uname_login();
}
};
__decorate([ i(cc.EditBox) ], t.prototype, "phone_input", void 0);
__decorate([ i(cc.EditBox) ], t.prototype, "pwd_input", void 0);
return t = __decorate([ s ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {
"../protobufs/auth": "auth",
"../ugame": "ugame"
} ],
action_time: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "247abUNaLROXoJqfCTnY+uV", "action_time");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, r = n.ccclass, _ = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.total_time = 10;
t.is_running = !1;
t.sprite = null;
t.now_time = 0;
return t;
}
t.prototype.onLoad = function() {
this.is_running = !1;
this.sprite = this.getComponent(cc.Sprite);
};
t.prototype.start_action_time = function(e) {
this.total_time = e;
this.is_running = !0;
this.now_time = 0;
this.node.active = !0;
};
t.prototype.start = function() {};
t.prototype.update = function(e) {
if (0 != this.is_running) {
this.now_time += e;
var t = this.now_time / this.total_time;
t > 1 && (t = 1);
this.sprite.fillRange = t;
if (this.now_time >= this.total_time) {
this.is_running = !1;
this.node.active = !1;
}
}
};
__decorate([ _(Number) ], t.prototype, "total_time", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
auth_proto: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "8eb4dkKSdhN3rmrQKOCXL+G", "auth_proto");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Stype"), r = e("../Response"), _ = e("../../modules/proto_tools"), s = e("../../modules/proto_man"), i = e("../Cmd");
s.default.reg_encoder(n.default.Auth, i.default.Auth.GUEST_LOGIN, _.default.encode_str_cmd);
s.default.reg_decoder(n.default.Auth, i.default.Auth.GUEST_LOGIN, function(e) {
var t = [];
t[0] = _.default.read_int16(e, 0);
t[1] = _.default.read_int16(e, 2);
var o = {};
t[2] = o;
var n = _.default.header_size;
o.status = _.default.read_int16(e, n);
if (o.status != r.default.OK) return t;
n += 2;
o.uid = _.default.read_uint32(e, n);
n += 4;
var s = _.default.read_str_inbuf(e, n);
o.unick = s[0];
n = s[1];
o.usex = _.default.read_int16(e, n);
n += 2;
o.uface = _.default.read_int16(e, n);
n += 2;
o.uvip = _.default.read_int16(e, n);
n += 2;
var i = _.default.read_str_inbuf(e, n);
o.guest_key = i[0];
n = i[1];
return t;
});
s.default.reg_decoder(n.default.Auth, i.default.Auth.RELOGIN, _.default.decode_empty_cmd);
s.default.reg_decoder(n.default.Auth, i.default.Auth.EDIT_PROFILE, function(e) {
var t = [];
t[0] = _.default.read_int16(e, 0);
t[1] = _.default.read_int16(e, 2);
var o = {};
t[2] = o;
var n = _.default.header_size;
o.status = _.default.read_int16(e, n);
n += 2;
if (o.status != r.default.OK) return t;
var s = _.default.read_str_inbuf(e, n);
o.unick = s[0];
n = s[1];
o.usex = _.default.read_int16(e, n);
return t;
});
s.default.reg_encoder(n.default.Auth, i.default.Auth.EDIT_PROFILE, function(e, t, o) {
var n = o.unick.utf8_byte_len(), r = _.default.header_size + (2 + n) + 2, s = _.default.alloc_DataView(r), i = _.default.write_cmd_header_inbuf(s, e, t);
i = _.default.write_str_inbuf(s, i, o.unick, n);
_.default.write_int16(s, i, o.usex);
i += 2;
return s;
});
s.default.reg_encoder(n.default.Auth, i.default.Auth.GUEST_UPGRADE_INDENTIFY, function(e, t, o) {
var n = o[1].utf8_byte_len(), r = o[2].utf8_byte_len(), s = _.default.header_size + 2 + (2 + n) + (2 + r), i = _.default.alloc_DataView(s), a = _.default.write_cmd_header_inbuf(i, e, t);
_.default.write_int16(i, a, o[0]);
a += 2;
a = _.default.write_str_inbuf(i, a, o[1], n);
_.default.write_str_inbuf(i, a, o[2], r);
return i;
});
s.default.reg_decoder(n.default.Auth, i.default.Auth.GUEST_UPGRADE_INDENTIFY, _.default.decode_status_cmd);
s.default.reg_encoder(n.default.Auth, i.default.Auth.BIND_PHONE_NUM, function(e, t, o) {
var n = o[0].utf8_byte_len(), r = o[1].utf8_byte_len(), s = o[2].utf8_byte_len(), i = _.default.header_size + (2 + n) + (2 + r) + (2 + s), a = _.default.alloc_DataView(i), u = _.default.write_cmd_header_inbuf(a, e, t);
u = _.default.write_str_inbuf(a, u, o[0], n);
u = _.default.write_str_inbuf(a, u, o[1], r);
u = _.default.write_str_inbuf(a, u, o[2], s);
return a;
});
s.default.reg_decoder(n.default.Auth, i.default.Auth.BIND_PHONE_NUM, _.default.decode_status_cmd);
s.default.reg_decoder(n.default.Auth, i.default.Auth.UNAME_LOGIN, function(e) {
var t = {};
t[0] = _.default.read_int16(e, 0);
t[1] = _.default.read_int16(e, 2);
var o = {};
t[2] = o;
var n = _.default.header_size;
o.status = _.default.read_int16(e, n);
if (o.status != r.default.OK) return t;
n += 2;
o.uid = _.default.read_uint32(e, n);
n += 4;
var s = _.default.read_str_inbuf(e, n);
o.unick = s[0];
n = s[1];
o.usex = _.default.read_int16(e, n);
n += 2;
o.uface = _.default.read_int16(e, n);
n += 2;
o.uvip = _.default.read_int16(e, n);
n += 2;
return t;
});
s.default.reg_encoder(n.default.Auth, i.default.Auth.UNAME_LOGIN, function(e, t, o) {
var n = o[0].utf8_byte_len(), r = o[1].utf8_byte_len(), s = _.default.header_size + (2 + n) + (2 + r), i = _.default.alloc_DataView(s), a = _.default.write_cmd_header_inbuf(i, e, t);
a = _.default.write_str_inbuf(i, a, o[0], n);
a = _.default.write_str_inbuf(i, a, o[1], r);
return i;
});
function a(e, t, o) {
var n = o[1].utf8_byte_len(), r = _.default.header_size + 2 + (2 + n), s = _.default.alloc_DataView(r), i = _.default.write_cmd_header_inbuf(s, e, t);
_.default.write_int16(s, i, o[0]);
i += 2;
i = _.default.write_str_inbuf(s, i, o[1], n);
return s;
}
s.default.reg_encoder(n.default.Auth, i.default.Auth.GET_PHONE_REG_VERIFY, a);
s.default.reg_decoder(n.default.Auth, i.default.Auth.GET_PHONE_REG_VERIFY, _.default.decode_status_cmd);
s.default.reg_encoder(n.default.Auth, i.default.Auth.PHONE_REG_ACCOUNT, function(e, t, o) {
var n = o[0].utf8_byte_len(), r = o[1].utf8_byte_len(), s = o[2].utf8_byte_len(), i = o[3].utf8_byte_len(), a = _.default.header_size + (2 + n) + (2 + r) + (2 + s) + (2 + i), u = _.default.alloc_DataView(a), c = _.default.write_cmd_header_inbuf(u, e, t);
c = _.default.write_str_inbuf(u, c, o[0], n);
c = _.default.write_str_inbuf(u, c, o[1], r);
c = _.default.write_str_inbuf(u, c, o[2], s);
c = _.default.write_str_inbuf(u, c, o[3], i);
return u;
});
s.default.reg_decoder(n.default.Auth, i.default.Auth.PHONE_REG_ACCOUNT, _.default.decode_status_cmd);
s.default.reg_encoder(n.default.Auth, i.default.Auth.GET_FORGET_PWD_VERIFY, a);
s.default.reg_decoder(n.default.Auth, i.default.Auth.GET_FORGET_PWD_VERIFY, _.default.decode_status_cmd);
s.default.reg_encoder(n.default.Auth, i.default.Auth.RESET_USER_PWD, function(e, t, o) {
var n = o[0].utf8_byte_len(), r = o[1].utf8_byte_len(), s = o[2].utf8_byte_len(), i = _.default.header_size + (2 + n) + (2 + r) + (2 + s), a = _.default.alloc_DataView(i), u = _.default.write_cmd_header_inbuf(a, e, t);
u = _.default.write_str_inbuf(a, u, o[0], n);
u = _.default.write_str_inbuf(a, u, o[1], r);
u = _.default.write_str_inbuf(a, u, o[2], s);
return a;
});
s.default.reg_decoder(n.default.Auth, i.default.Auth.RESET_USER_PWD, _.default.decode_status_cmd);
cc._RF.pop();
}, {
"../../modules/proto_man": "proto_man",
"../../modules/proto_tools": "proto_tools",
"../Cmd": "Cmd",
"../Response": "Response",
"../Stype": "Stype"
} ],
auth: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d80f1VhLDFFlJUkcWufJ/YH", "auth");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../modules/websocket"), r = e("../Stype"), _ = e("../Cmd"), s = e("../ugame"), i = e("../../3rd/md5");
e("./auth_proto");
var a = function() {
function e() {}
e.guest_login = function() {
var e = s.default.guest_key;
n.default.send_cmd(r.default.Auth, _.default.Auth.GUEST_LOGIN, e);
};
e.uname_login = function() {
var e = i(s.default.upwd), t = {
0: s.default.uname,
1: e
};
n.default.send_cmd(r.default.Auth, _.default.Auth.UNAME_LOGIN, t);
};
e.edit_profile = function(e, t) {
var o = {};
o.unick = e;
o.usex = t;
n.default.send_cmd(r.default.Auth, _.default.Auth.EDIT_PROFILE, o);
};
e.get_guess_upgrade_verify_code = function(e, t) {
var o = {
0: 0,
1: e,
2: t
};
n.default.send_cmd(r.default.Auth, _.default.Auth.GUEST_UPGRADE_INDENTIFY, o);
};
e.guest_bind_phone = function(e, t, o) {
var s = {
0: e,
1: t,
2: o
};
n.default.send_cmd(r.default.Auth, _.default.Auth.BIND_PHONE_NUM, s);
};
e.get_phone_reg_verify_code = function(e) {
var t = {
0: 1,
1: e
};
n.default.send_cmd(r.default.Auth, _.default.Auth.GET_PHONE_REG_VERIFY, t);
};
e.reg_phone_account = function(e, t, o, s) {
var i = {
0: t,
1: o,
2: s,
3: e
};
n.default.send_cmd(r.default.Auth, _.default.Auth.PHONE_REG_ACCOUNT, i);
};
e.get_forget_pwd_verify_code = function(e) {
var t = {
0: 2,
1: e
};
n.default.send_cmd(r.default.Auth, _.default.Auth.GET_FORGET_PWD_VERIFY, t);
};
e.reset_user_pwd = function(e, t, o) {
var s = {
0: e,
1: t,
2: o
};
n.default.send_cmd(r.default.Auth, _.default.Auth.RESET_USER_PWD, s);
};
return e;
}();
o.default = a;
cc._RF.pop();
}, {
"../../3rd/md5": "md5",
"../../modules/websocket": "websocket",
"../Cmd": "Cmd",
"../Stype": "Stype",
"../ugame": "ugame",
"./auth_proto": "auth_proto"
} ],
check_box: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "fff4bqVXtJPJYVjgVLGBZXB", "check_box");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, r = n.ccclass, _ = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.normal = null;
t.select = null;
t.b_cheched = !1;
t.sp = null;
return t;
}
t.prototype.onLoad = function() {
this.sp = this.node.getComponent(cc.Sprite);
this.set_checked(this.b_cheched);
};
t.prototype.set_checked = function(e) {
this.b_cheched = e;
this.b_cheched ? this.sp.spriteFrame = this.select : this.sp.spriteFrame = this.normal;
};
t.prototype.is_checked = function() {
return this.b_cheched;
};
t.prototype.start = function() {};
__decorate([ _(cc.SpriteFrame) ], t.prototype, "normal", void 0);
__decorate([ _(cc.SpriteFrame) ], t.prototype, "select", void 0);
__decorate([ _(cc.String) ], t.prototype, "b_cheched", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
checkhotupdate: [ function(require, module, exports) {
"use strict";
cc._RF.push(module, "71194l65dNOpYUKAiTefEof", "checkhotupdate");
var _http = require("../../modules/http.js"), _http2 = _interopRequireDefault(_http);
function _interopRequireDefault(e) {
return e && e.__esModule ? e : {
default: e
};
}
cc.Class({
extends: cc.Component,
properties: {
url: "http://127.0.0.1:10001"
},
onLoad: function() {},
set_hotupdate_search_path: function() {
var e = jsb.fileUtils.getSearchPaths(), t = this._storagePath + "/hotupdate";
jsb.fileUtils.isDirectoryExist(t) || jsb.fileUtils.createDirectory(t);
e.unshift(t);
jsb.fileUtils.setSearchPaths(e);
this.hotpath = t;
},
local_hotupdate_download_list: function local_hotupdate_download_list(hotpath) {
var json = {}, str;
if (jsb.fileUtils.isFileExist(hotpath + "/hotupdate.json")) {
str = jsb.fileUtils.getStringFromFile(hotpath + "/hotupdate.json");
json = eval("(" + str + ")");
}
return json;
},
download_item: function(e, t, o) {
t.file.indexOf(".json") >= 0 ? _http2.default.get(this.url, "/" + t.file, null, function(n, r) {
if (n) o && o(); else {
var _ = new Array();
_ = t.dir.split("/");
for (var s = e, i = 0; i < _.length; i++) {
s = s + "/" + _[i];
jsb.fileUtils.isDirectoryExist(s) || jsb.fileUtils.createDirectory(s);
}
jsb.fileUtils.writeStringToFile(r, e + "/" + t.file);
o && o();
}
}) : _http2.default.download(this.url, "/" + t.file, null, function(n, r) {
if (n) o && o(); else {
var _ = new Array();
_ = t.dir.split("/");
for (var s = e, i = 0; i < _.length; i++) {
s = s + "/" + _[i];
jsb.fileUtils.isDirectoryExist(s) || jsb.fileUtils.createDirectory(s);
}
jsb.fileUtils.writeDataToFile(r, e + "/" + t.file);
o && o();
}
});
},
start: function start() {
console.log("hotupdate start");
this._storagePath = jsb.fileUtils.getWritablePath();
console.log(this._storagePath);
console.log("end..");
this.set_hotupdate_search_path();
var now_list = this.local_hotupdate_download_list(this.hotpath);
console.log(now_list);
console.log("end..");
var server_list = null;
_http2.default.get(this.url, "/hotupdate/hotupdate.json", null, function(err, data) {
console.log(data);
console.log("end...");
if (err) this.node.removeFromParent(); else {
console.log(data);
server_list = eval("(" + data + ")");
var i = 0, download_array = [];
for (var key in server_list) now_list[key] && now_list[key].md5 === server_list[key].md5 || download_array.push(server_list[key]);
if (download_array.length <= 0) {
console.log("下载列表为空");
this.node.removeFromParent();
} else {
var i = 0, callback = function() {
if (++i >= download_array.length) {
jsb.fileUtils.writeStringToFile(data, this.hotpath + "/hotupdate.json");
this.node.removeFromParent();
cc.audioEngine.stopAll();
cc.game.restart();
} else this.download_item(this._storagePath, download_array[i], callback);
}.bind(this);
this.download_item(this._storagePath, download_array[i], callback);
}
}
}.bind(this));
}
});
cc._RF.pop();
}, {
"../../modules/http.js": "http"
} ],
checkout: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "12133euUkdOAbRWmOwMcdZt", "checkout");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, r = n.ccclass, _ = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.result = null;
t.score = null;
return t;
}
t.prototype.start = function() {};
t.prototype.show_checkout_result = function(e, t) {
this.node.active = !0;
if (2 == e) {
this.result.string = "平局";
this.score.string = "本次得分 0 !!!";
} else if (1 == e) {
this.result.string = "胜利!";
this.score.string = "本次赢了 " + t + " 分!";
} else if (0 == e) {
this.result.string = "失败!";
this.score.string = "本次输了 " + t + " 分!";
}
};
t.prototype.hide_checkout_result = function() {
this.node.active = !1;
};
__decorate([ _(cc.Label) ], t.prototype, "result", void 0);
__decorate([ _(cc.Label) ], t.prototype, "score", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
chess_disk: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "a960bNC+lpMPIPtG1I1l707", "chess_disk");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../protobufs/five_chess"), r = cc._decorator, _ = r.ccclass, s = r.property, i = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.chess_prefab = [];
t.your_turn = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.your_turn = !1;
this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
var o = t.getLocation(), r = e.node.convertToNodeSpaceAR(o);
r.x += 287;
r.y += 287;
var _ = Math.floor((r.x + 20.5) / 41), s = Math.floor((r.y + 20.5) / 41);
_ < 0 || _ > 14 || s < 0 || s > 14 || n.default.send_put_chess(_, s);
});
};
t.prototype.put_chess_at = function(e, t, o) {
var n = cc.instantiate(this.chess_prefab[e - 1]);
n.parent = this.node;
var r = 41 * t - 287, _ = 41 * o - 287;
n.setPosition(cc.p(r, _));
};
t.prototype.set_your_turn = function(e) {
this.your_turn = e;
};
t.prototype.clear_disk = function() {
this.node.removeAllChildren();
};
t.prototype.start = function() {};
__decorate([ s([ cc.Prefab ]) ], t.prototype, "chess_prefab", void 0);
return t = __decorate([ _ ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {
"../protobufs/five_chess": "five_chess"
} ],
edit_profile: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c502cYrPWNDRp7j6oJuIWMH", "edit_profile");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../component/check_box"), r = e("../ugame"), _ = e("../protobufs/auth"), s = cc._decorator, i = s.ccclass, a = s.property, u = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick_input = null;
t.man_checkbox = null;
t.woman_checkbox = null;
t.usex = null;
return t;
}
t.prototype.start = function() {
this.unick_input.string = r.default.unick;
this.set_ckeck_sex(r.default.usex);
};
t.prototype.on_ckeck_click = function(e, t) {
t = parseInt(t);
this.set_ckeck_sex(t);
};
t.prototype.set_ckeck_sex = function(e) {
this.usex = e;
if (0 == e) {
this.man_checkbox.set_checked(!0);
this.woman_checkbox.set_checked(!1);
} else if (1 == e) {
this.man_checkbox.set_checked(!1);
this.woman_checkbox.set_checked(!0);
}
};
t.prototype.on_subcommit_click = function() {
"" != this.unick_input.string ? _.default.edit_profile(this.unick_input.string, this.usex) : console.log("unick is null");
};
__decorate([ a(cc.EditBox) ], t.prototype, "unick_input", void 0);
__decorate([ a(n.default) ], t.prototype, "man_checkbox", void 0);
__decorate([ a(n.default) ], t.prototype, "woman_checkbox", void 0);
return t = __decorate([ i ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
}, {
"../../component/check_box": "check_box",
"../protobufs/auth": "auth",
"../ugame": "ugame"
} ],
extends: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "494b7/yboVGw69U1OK5xhDm", "extends");
String.prototype.utf8_byte_len = function() {
var e, t, o = 0;
for (e = 0; e < this.length; e++) (t = this.charCodeAt(e)) < 127 ? o += 1 : 128 <= t && t <= 2047 ? o += 2 : 2048 <= t && t <= 65535 && (o += 3);
return o;
};
DataView.prototype.write_utf8 = function(e, t) {
for (var o = e, n = 0; n < t.length; n++) {
var r = t.charCodeAt(n);
if (r < 128) {
this.setUint8(o, r);
o++;
} else if (r < 2048) {
this.setUint8(o, 192 | r >> 6);
o++;
this.setUint8(o, 128 | 63 & r);
o++;
} else if (r < 55296 || r >= 57344) {
this.setUint8(o, 224 | r >> 12);
o++;
this.setUint8(o, 128 | r >> 6 & 63);
o++;
this.setUint8(o, 128 | 63 & r);
o++;
} else {
n++;
r = 65536 + ((1023 & r) << 10 | 1023 & t.charCodeAt(n));
this.setUint8(o, 240 | r >> 18);
o++;
this.setUint8(o, 128 | r >> 12 & 63);
o++;
this.setUint8(o, 128 | r >> 6 & 63);
o++;
this.setUint8(o, 128 | 63 & r);
o++;
}
}
};
DataView.prototype.read_utf8 = function(e, t) {
var o, n, r, _, s, i;
o = "";
r = e + t;
n = e;
for (;n < r; ) {
_ = this.getUint8(n);
n++;
switch (_ >> 4) {
case 0:
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
o += String.fromCharCode(_);
break;

case 12:
case 13:
s = Array[n++];
o += String.fromCharCode((31 & _) << 6 | 63 & s);
break;

case 14:
s = this.getUint8(n);
n++;
i = this.getUint8(n);
n++;
o += String.fromCharCode((15 & _) << 12 | (63 & s) << 6 | (63 & i) << 0);
}
}
return o;
};
cc._RF.pop();
}, {} ],
five_chess_proto: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5de51zNhdZEw65YiO5LqAhu", "five_chess_proto");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../modules/proto_man"), r = e("../Stype"), _ = e("../Cmd"), s = e("../../modules/proto_tools"), i = e("../Response");
n.default.reg_encoder(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.ENTER_ZONE, s.default.encode_status_cmd);
n.default.reg_decoder(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.ENTER_ZONE, s.default.decode_status_cmd);
n.default.reg_encoder(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.USER_QUIT, s.default.encode_empty_cmd);
n.default.reg_decoder(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.USER_QUIT, s.default.decode_status_cmd);
n.default.reg_encoder(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.ENTER_ROOM, s.default.encode_int32_cmd);
n.default.reg_decoder(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.ENTER_ROOM, function(e) {
var t = [];
t[0] = s.default.read_int16(e, 0);
t[1] = s.default.read_int16(e, 2);
var o = [];
t[2] = o;
var n = s.default.header_size;
o[0] = s.default.read_int16(e, n);
if (o[0] != i.default.OK) return t;
n += 2;
o[1] = s.default.read_int16(e, n);
n += 2;
o[2] = s.default.read_int32(e, n);
n += 4;
return t;
});
cc._RF.pop();
}, {
"../../modules/proto_man": "proto_man",
"../../modules/proto_tools": "proto_tools",
"../Cmd": "Cmd",
"../Response": "Response",
"../Stype": "Stype"
} ],
five_chess: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "28e09cvSKJBcpaV6dgBxIiL", "five_chess");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../modules/websocket"), r = e("../Stype"), _ = e("../Cmd");
e("./five_chess_proto");
var s = function() {
function e() {}
e.enter_zone = function(e) {
n.default.send_cmd(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.ENTER_ZONE, e);
};
e.user_quit = function() {
n.default.send_cmd(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.USER_QUIT, null);
};
e.send_prop = function(e, t) {
var o = [ t, e ];
n.default.send_cmd(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.SEND_PROP, o);
};
e.send_do_ready = function() {
n.default.send_cmd(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.SEND_DO_READY, null);
};
e.send_put_chess = function(e, t) {
var o = [ e, t ];
n.default.send_cmd(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.PUT_CHESS, o);
};
e.send_get_prev_round = function() {
n.default.send_cmd(r.default.GAME_FIVE_CHESS, _.default.GameFiveChess.GET_PREV_ROUND, null);
};
return e;
}();
o.default = s;
cc._RF.pop();
}, {
"../../modules/websocket": "websocket",
"../Cmd": "Cmd",
"../Stype": "Stype",
"./five_chess_proto": "five_chess_proto"
} ],
frame_anim: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "8694eVU+r5IvLS5Brq1KEzr", "frame_anim");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, r = n.ccclass, _ = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.sprite_frames = [];
t.duration = .1;
t.loop = !1;
t.play_onload = !1;
t.sprite = null;
t.is_playing = !1;
t.play_time = 0;
t.is_loop = !1;
t.end_func = null;
return t;
}
t.prototype.onLoad = function() {
var e = this.node.getComponent(cc.Sprite);
e || (e = this.node.addComponent(cc.Sprite));
this.sprite = e;
this.is_playing = !1;
this.play_time = 0;
this.is_loop = !1;
this.end_func = null;
this.sprite_frames.length > 0 && (this.sprite.spriteFrame = this.sprite_frames[0]);
this.play_onload && (this.loop ? this.play_loop() : this.play_once(null));
};
t.prototype.play_once = function(e) {
this.play_time = 0;
this.is_playing = !0;
this.is_loop = !1;
this.end_func = e;
};
t.prototype.play_loop = function() {
this.play_time = 0;
this.is_playing = !0;
this.is_loop = !0;
};
t.prototype.stop_anim = function() {
this.play_time = 0;
this.is_playing = !1;
this.is_loop = !1;
};
t.prototype.start = function() {};
t.prototype.update = function(e) {
if (0 != this.is_playing) {
this.play_time += e;
var t = Math.floor(this.play_time / this.duration);
if (0 == this.is_loop) {
if (t >= this.sprite_frames.length) {
this.sprite.spriteFrame = this.sprite_frames[this.sprite_frames.length - 1];
this.is_playing = !1;
this.play_time = 0;
this.end_func && this.end_func();
return;
}
this.sprite.spriteFrame = this.sprite_frames[t];
} else {
for (;t >= this.sprite_frames.length; ) {
t -= this.sprite_frames.length;
this.play_time -= this.duration * this.sprite_frames.length;
}
this.sprite.spriteFrame = this.sprite_frames[t];
}
}
};
__decorate([ _([ cc.SpriteFrame ]) ], t.prototype, "sprite_frames", void 0);
__decorate([ _(Number) ], t.prototype, "duration", void 0);
__decorate([ _(Boolean) ], t.prototype, "loop", void 0);
__decorate([ _(Boolean) ], t.prototype, "play_onload", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
friend_ctl: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "25030tmvf9EDJtF4kp9MlMQ", "friend_ctl");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../ugame"), r = cc._decorator, _ = r.ccclass, s = r.property, i = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick = null;
t.main_list = null;
t.back = null;
t.title_label = null;
t.second_ui = null;
return t;
}
t.prototype.start = function() {
this.sync_info();
};
t.prototype.sync_info = function() {
this.unick.string = n.default.unick;
};
t.prototype.show_main_list = function() {
this.back.active = !1;
this.main_list.active = !0;
this.title_label.string = "我";
};
t.prototype.hide_main_list = function(e) {
this.back.active = !0;
this.main_list.active = !1;
this.title_label.string = e;
};
t.prototype.go_back = function() {
if (null != this.second_ui) {
this.second_ui.removeFromParent();
this.second_ui = null;
}
this.show_main_list();
};
__decorate([ s(cc.Label) ], t.prototype, "unick", void 0);
__decorate([ s(cc.Node) ], t.prototype, "main_list", void 0);
__decorate([ s(cc.Node) ], t.prototype, "back", void 0);
__decorate([ s(cc.Label) ], t.prototype, "title_label", void 0);
return t = __decorate([ _ ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {
"../ugame": "ugame"
} ],
game_prop: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "638bdKjeblMlLTjpOcrS20X", "game_prop");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, r = n.ccclass, _ = n.property, s = function() {
function e() {
this.icon = null;
this.anim_frames = [];
}
__decorate([ _(cc.SpriteFrame) ], e.prototype, "icon", void 0);
__decorate([ _([ cc.SpriteFrame ]) ], e.prototype, "anim_frames", void 0);
return e = __decorate([ r("prop_skin") ], e);
}(), i = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.skin_set = [];
t.frame_anim = null;
t.anim_sprite = null;
return t;
}
t.prototype.onLoad = function() {
this.frame_anim = this.node.getChildByName("anim").getComponent("frame_anim");
this.anim_sprite = this.node.getChildByName("anim").getComponent(cc.Sprite);
};
t.prototype.play_prop_anim = function(e, t, o) {
var n = this;
if (!(o <= 0 || o > 5)) {
this.anim_sprite.spriteFrame = this.skin_set[o - 1].icon;
this.node.setPosition(e);
var r = cc.moveTo(.5, t).easing(cc.easeCubicActionOut()), _ = cc.callFunc(function() {
n.frame_anim.sprite_frames = n.skin_set[o - 1].anim_frames;
n.frame_anim.play_once(function() {
n.node.removeFromParent();
});
}), s = cc.sequence(r, _);
this.node.runAction(s);
}
};
t.prototype.start = function() {};
__decorate([ _([ s ]) ], t.prototype, "skin_set", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {} ],
game_scene: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "df0e5rZmrxIJIdGRAZte2qn", "game_scene");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../modules/websocket"), r = e("../Stype"), _ = e("../Cmd"), s = e("../protobufs/five_chess"), i = e("../ugame"), a = e("../Response"), u = e("./game_seat"), c = e("../State"), d = e("./chess_disk"), l = e("./checkout"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.seatA = null;
t.seatB = null;
t.prop_prefab = null;
t.chess_disk = null;
t.checkout = null;
t.do_ready_button = null;
t.service_handlers = {};
t.load_flag = 0;
return t;
}
t.prototype.onLoad = function() {
this.service_handlers[r.default.GAME_FIVE_CHESS] = this.on_five_chess_server_return.bind(this);
n.default.register_services_handler(this.service_handlers);
};
t.prototype.start = function() {
s.default.enter_zone(i.default.zid);
};
t.prototype.on_five_chess_server_return = function(e, t, o) {
console.log(e + " " + t + " " + o);
switch (t) {
case _.default.GameFiveChess.ENTER_ZONE:
this.enter_zone_return(o);
break;

case _.default.GameFiveChess.USER_QUIT:
this.user_quit_return(o);
break;

case _.default.GameFiveChess.ENTER_ROOM:
this.enter_room_return(o);
break;

case _.default.GameFiveChess.EXIT_ROOM:
break;

case _.default.GameFiveChess.SITDOWN:
this.on_sitdown_return(o);
break;

case _.default.GameFiveChess.STANDUP:
this.on_standup_return(o);
break;

case _.default.GameFiveChess.USER_ARRIVED:
this.on_user_arrived_return(o);
break;

case _.default.GameFiveChess.SEND_PROP:
this.on_send_prop_return(o);
break;

case _.default.GameFiveChess.SEND_DO_READY:
this.on_player_do_ready_return(o);
break;

case _.default.GameFiveChess.ROUND_START:
this.on_game_start_return(o);
break;

case _.default.GameFiveChess.TURN_TO_PLAYER:
this.turn_to_player_return(o);
break;

case _.default.GameFiveChess.PUT_CHESS:
this.player_put_chess_return(o);
break;

case _.default.GameFiveChess.CHECKOUT:
this.game_checkout_return(o);
break;

case _.default.GameFiveChess.CHECKOUT_OVER:
this.game_check_out_over_return(o);
break;

case _.default.GameFiveChess.RECONNECT:
this.do_reconnect_return(o);
break;

case _.default.GameFiveChess.GET_PREV_ROUND:
this.on_get_prev_round(o);
}
};
t.prototype.enter_zone_return = function(e) {
console.log("enter_zone_return status : " + e);
};
t.prototype.user_quit_return = function(e) {
console.log("user_quit_return status: " + e);
cc.director.loadScene("home_scene");
};
t.prototype.enter_room_return = function(e) {
e[0] == a.default.OK ? console.log("enter_room_return success zid: " + e[1] + " room_id : " + e[2]) : console.log("enter_room_return error status : " + e[0]);
};
t.prototype.on_sitdown_return = function(e) {
if (e[0] == a.default.OK) {
var t = e[1];
console.log("sv_seat : " + t);
var o = {
unick: i.default.unick,
usex: i.default.usex,
uface: i.default.uface,
uvip: i.default.game_info.uvip,
uchip: i.default.game_info.uchip,
uexp: i.default.game_info.uexp,
state: c.State.InView,
sv_seatid: t
};
this.seatA.on_sitdowm(o, !0);
} else console.log("on_sitdown_return error");
};
t.prototype.on_user_arrived_return = function(e) {
console.log("on_user_arrived_return success ! sv_seat_id: " + e[0]);
var t = {
unick: e[1],
usex: e[2],
uface: e[3],
uvip: e[6],
uchip: e[4],
uexp: e[5],
state: e[7],
sv_seatid: e[0]
};
this.seatB.on_sitdowm(t, !1);
};
t.prototype.on_standup_return = function(e) {
if (e[0] == a.default.OK) {
console.log("on_standup_return success");
var t = e[1];
this.seatA.get_sv_seatid() == t ? this.seatA.on_standup() : this.seatB.get_sv_seatid() == t && this.seatB.on_standup();
} else console.log("on_standup_return error");
};
t.prototype.on_send_prop_return = function(e) {
if (e[0] == a.default.OK) {
console.log("on_send_prop_return toseat_id ", e[1] + " seat_id" + e[2] + " prop id" + e[3]);
var t = cc.instantiate(this.prop_prefab);
t.parent = this.node;
var o, n, r = t.getComponent("game_prop");
if (e[1] == this.seatA.get_sv_seatid()) {
o = this.seatA.node.getPosition();
n = this.seatB.node.getPosition();
} else {
o = this.seatB.node.getPosition();
n = this.seatA.node.getPosition();
}
r.play_prop_anim(o, n, e[3]);
} else console.log("on_send_prop_return error");
};
t.prototype.on_player_do_ready_return = function(e) {
if (e[0] == a.default.OK) {
console.log("on_player_do_ready_return success : " + e[1]);
this.seatA.get_sv_seatid() == e[1] ? this.seatA.on_do_ready() : this.seatB.on_do_ready();
} else {
this.do_ready_button.active = !0;
console.log("on_player_do_ready_return error");
}
};
t.prototype.on_game_start_return = function(e) {
this.seatA.on_game_start(e);
this.seatB.on_game_start(e);
};
t.prototype.turn_to_player_return = function(e) {
console.log("turn_to_player_return success!");
var t = e[0];
e[1] == this.seatA.get_sv_seatid() ? this.seatA.turn_to_player(t) : this.seatB.turn_to_player(t);
};
t.prototype.player_put_chess_return = function(e) {
if (e[0] == a.default.OK) {
console.log("player_put_chess_return success!");
var t = e[1], o = e[2], n = e[3];
this.chess_disk.put_chess_at(n, t, o);
this.seatA.hide_timebar();
this.seatB.hide_timebar();
} else console.log("player_put_chess_return error!");
};
t.prototype.game_checkout_return = function(e) {
console.log("game_checkout_return success");
var t = e[0], o = e[1];
if (-1 == t) this.checkout.show_checkout_result(2, 0); else if (t == this.seatA.get_sv_seatid()) {
this.checkout.show_checkout_result(1, o);
i.default.game_info.uchip += o;
} else if (t == this.seatB.get_sv_seatid()) {
this.checkout.show_checkout_result(0, o);
i.default.game_info.uchip -= o;
}
};
t.prototype.game_check_out_over_return = function(e) {
console.log("game_check_out_over_return success!");
this.checkout.hide_checkout_result();
this.seatA.on_checkout_over();
this.seatB.on_checkout_over();
this.chess_disk.clear_disk();
this.do_ready_button.active = !0;
};
t.prototype.do_reconnect_return = function(e) {
console.log("do_reconnect_return success!");
var t = e[0], o = e[1][0], n = e[2], r = e[3], _ = e[4];
this.do_ready_button.active = !1;
this.on_sitdown_return({
0: a.default.OK,
1: t
});
this.on_user_arrived_return(o);
this.on_game_start_return(n);
for (var s = 0; s < 15; s++) for (var i = 0; i < 15; i++) 0 != r[15 * s + i] && this.chess_disk.put_chess_at(r[15 * s + i], i, s);
var u = _[0], c = _[1];
if (-1 != u) if (u == this.seatA.get_sv_seatid()) {
this.seatA.turn_to_player(c);
this.chess_disk.set_your_turn(!0);
} else {
this.seatB.turn_to_player(c);
this.chess_disk.set_your_turn(!1);
}
};
t.prototype.on_get_prev_round = function(e) {
if (e[0] == a.default.OK) {
console.log("on_get_prev_round success!!");
this.on_user_quit();
n.default.register_services_handler(null);
i.default.prev_round_data = e[1];
cc.director.loadScene("replay_scene");
} else console.log("on_get_prev_round error");
};
t.prototype.on_user_quit = function() {
if (1 != this.load_flag) {
this.load_flag = 1;
s.default.user_quit();
}
};
t.prototype.on_do_ready_click = function() {
this.do_ready_button.active = !1;
s.default.send_do_ready();
};
t.prototype.on_do_prev_round_click = function() {
s.default.send_get_prev_round();
};
__decorate([ h(u.default) ], t.prototype, "seatA", void 0);
__decorate([ h(u.default) ], t.prototype, "seatB", void 0);
__decorate([ h(cc.Prefab) ], t.prototype, "prop_prefab", void 0);
__decorate([ h(d.default) ], t.prototype, "chess_disk", void 0);
__decorate([ h(l.default) ], t.prototype, "checkout", void 0);
__decorate([ h(cc.Node) ], t.prototype, "do_ready_button", void 0);
return t = __decorate([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
}, {
"../../modules/websocket": "websocket",
"../Cmd": "Cmd",
"../Response": "Response",
"../State": "State",
"../Stype": "Stype",
"../protobufs/five_chess": "five_chess",
"../ugame": "ugame",
"./checkout": "checkout",
"./chess_disk": "chess_disk",
"./game_seat": "game_seat"
} ],
game_seat: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "da90bYlRzVJyb3k3lX3rRht", "game_seat");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../State"), r = e("../../component/action_time"), _ = cc._decorator, s = _.ccclass, i = _.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick = null;
t.timebar = null;
t.show_uinfo_prefab = null;
t.ready_icon = null;
t.black_chess = null;
t.white_chess = null;
t.player_info = null;
t.is_self = !1;
t.state = -1;
t.black_seat = -1;
t.action_time = -1;
return t;
}
t.prototype.onLoad = function() {
this.timebar.node.active = !1;
this.node.active = !1;
this.is_self = !1;
this.ready_icon.active = !1;
this.black_chess.active = !1;
this.white_chess.active = !1;
this.state = n.State.InView;
};
t.prototype.start = function() {};
t.prototype.on_sitdowm = function(e, t) {
this.player_info = e;
this.node.active = !0;
this.black_chess.active = !1;
this.white_chess.active = !1;
this.state = n.State.InView;
this.unick.string = e.unick;
this.is_self = t;
this.ready_icon.active = !1;
e.state == n.State.Ready && this.on_do_ready();
};
t.prototype.on_standup = function() {
this.state = n.State.InView;
this.timebar.node.active = !1;
this.node.active = !1;
this.player_info = null;
this.ready_icon.active = !1;
};
t.prototype.get_sv_seatid = function() {
return this.player_info.sv_seatid;
};
t.prototype.on_show_info_click = function() {
var e = cc.instantiate(this.show_uinfo_prefab);
e.parent = this.node.parent;
e.getComponent("game_show_info").show_user_info(this.player_info, this.is_self);
};
t.prototype.on_do_ready = function() {
this.ready_icon.active = !0;
};
t.prototype.on_game_start = function(e) {
this.black_seat = e[2];
this.action_time = e[0];
this.ready_icon.active = !1;
this.timebar.node.active = !1;
this.state = n.State.Playing;
if (this.black_seat == this.player_info.sv_seatid) {
this.black_chess.active = !0;
this.white_chess.active = !1;
} else {
this.white_chess.active = !0;
this.black_chess.active = !1;
}
};
t.prototype.turn_to_player = function(e) {
this.timebar.node.active = !0;
this.timebar.start_action_time(e);
};
t.prototype.hide_timebar = function() {
this.timebar.node.active = !1;
};
t.prototype.on_checkout_over = function() {
this.timebar.node.active = !1;
this.black_chess.active = !1;
this.white_chess.active = !1;
};
__decorate([ i(cc.Label) ], t.prototype, "unick", void 0);
__decorate([ i(r.default) ], t.prototype, "timebar", void 0);
__decorate([ i(cc.Prefab) ], t.prototype, "show_uinfo_prefab", void 0);
__decorate([ i(cc.Node) ], t.prototype, "ready_icon", void 0);
__decorate([ i(cc.Node) ], t.prototype, "black_chess", void 0);
__decorate([ i(cc.Node) ], t.prototype, "white_chess", void 0);
return t = __decorate([ s ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {
"../../component/action_time": "action_time",
"../State": "State"
} ],
game_show_info: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e488axsyrBGWZIvwVl3nRWi", "game_show_info");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../ulevel"), r = e("../protobufs/five_chess"), _ = cc._decorator, s = _.ccclass, i = _.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick = null;
t.uchip = null;
t.ulevel = null;
t.uexp_process = null;
t.usex = null;
t.usex_sp = [];
t.uvip = null;
t.props_root = null;
t.is_self = !1;
t.sv_seatid = -1;
return t;
}
t.prototype.start = function() {};
t.prototype.on_close_click = function() {
this.close_dlg();
};
t.prototype.close_dlg = function() {
this.node.removeFromParent();
};
t.prototype.show_user_info = function(e, t) {
this.unick.string = e.unick;
this.uchip.string = "" + e.uchip;
this.usex.spriteFrame = this.usex_sp[e.usex];
this.uvip.string = "VIP " + e.uvip;
var o = n.default.get_level(e.uexp);
this.ulevel.string = "LV " + o[0];
this.uexp_process.progress = o[1];
this.is_self = t;
this.sv_seatid = e.sv_seatid;
this.props_root.active = !t;
};
t.prototype.on_prop_item_click = function(e, t) {
t = parseInt(t);
var o = this.sv_seatid;
r.default.send_prop(o, t);
this.close_dlg();
};
__decorate([ i(cc.Label) ], t.prototype, "unick", void 0);
__decorate([ i(cc.Label) ], t.prototype, "uchip", void 0);
__decorate([ i(cc.Label) ], t.prototype, "ulevel", void 0);
__decorate([ i(cc.ProgressBar) ], t.prototype, "uexp_process", void 0);
__decorate([ i(cc.Sprite) ], t.prototype, "usex", void 0);
__decorate([ i([ cc.SpriteFrame ]) ], t.prototype, "usex_sp", void 0);
__decorate([ i(cc.Label) ], t.prototype, "uvip", void 0);
__decorate([ i(cc.Node) ], t.prototype, "props_root", void 0);
return t = __decorate([ s ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {
"../protobufs/five_chess": "five_chess",
"../ulevel": "ulevel"
} ],
game_system_proto: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "56969Xfe5FB2bwYmuyic39r", "game_system_proto");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Stype"), r = e("../Response"), _ = e("../../modules/proto_tools"), s = e("../../modules/proto_man"), i = e("../Cmd");
s.default.reg_encoder(n.default.GAME_SYSTEM, i.default.GameSystem.GET_GAME_INFO, _.default.encode_empty_cmd);
s.default.reg_decoder(n.default.GAME_SYSTEM, i.default.GameSystem.GET_GAME_INFO, function(e) {
var t = [];
t[0] = _.default.read_int16(e, 0);
t[1] = _.default.read_int16(e, 2);
var o = {};
t[2] = o;
var n = _.default.header_size;
o.status = _.default.read_int16(e, n);
if (o.status != r.default.OK) return t;
n += 2;
o.uchip = _.default.read_int32(e, n);
n += 4;
o.uexp = _.default.read_int32(e, n);
n += 4;
o.uvip = _.default.read_int16(e, n);
n += 2;
return t;
});
s.default.reg_encoder(n.default.GAME_SYSTEM, i.default.GameSystem.LOGIN_BONUES_INFO, _.default.encode_empty_cmd);
s.default.reg_decoder(n.default.GAME_SYSTEM, i.default.GameSystem.LOGIN_BONUES_INFO, function(e) {
var t = [];
t[0] = _.default.read_int16(e, 0);
t[1] = _.default.read_int16(e, 2);
var o = {};
t[2] = o;
var n = _.default.header_size;
o.status = _.default.read_int16(e, n);
if (o.status != r.default.OK) {
console.log("decode_login_bonues_info status error");
return t;
}
n += 2;
o.b_has = _.default.read_int16(e, n);
n += 2;
o.id = _.default.read_int32(e, n);
n += 4;
o.bonues = _.default.read_int32(e, n);
n += 4;
o.days = _.default.read_int16(e, n);
n += 2;
return t;
});
s.default.reg_encoder(n.default.GAME_SYSTEM, i.default.GameSystem.RECV_LOGIN_BUNUES, _.default.encode_int32_cmd);
s.default.reg_decoder(n.default.GAME_SYSTEM, i.default.GameSystem.RECV_LOGIN_BUNUES, function(e) {
var t = [];
t[0] = _.default.read_int16(e, 0);
t[1] = _.default.read_int16(e, 2);
var o = {};
t[2] = o;
var n = _.default.header_size;
o.status = _.default.read_int16(e, n);
if (o.status != r.default.OK) return t;
n += 2;
o.bonues = _.default.read_int32(e, n);
n += 4;
return t;
});
s.default.reg_encoder(n.default.GAME_SYSTEM, i.default.GameSystem.GET_WORLD_RANK_INFO, _.default.encode_empty_cmd);
s.default.reg_decoder(n.default.GAME_SYSTEM, i.default.GameSystem.GET_WORLD_RANK_INFO, function(e) {
var t = [];
t[0] = _.default.read_int16(e, 0);
t[1] = _.default.read_int16(e, 2);
var o = {};
t[2] = o;
var n = _.default.header_size;
o[0] = _.default.read_int16(e, n);
n += 2;
o[1] = _.default.read_int32(e, n);
n += 4;
for (var r = [], s = 0; s < o[1]; s++) r.push([]);
for (s = 0; s < o[1]; s++) {
var i = _.default.read_str_inbuf(e, n);
r[s][0] = i[0];
n = i[1];
r[s][1] = _.default.read_int16(e, n);
n += 2;
r[s][2] = _.default.read_int16(e, n);
n += 2;
r[s][3] = _.default.read_int32(e, n);
n += 4;
}
o[2] = r;
o[3] = _.default.read_int32(e, n);
n += 4;
return t;
});
cc._RF.pop();
}, {
"../../modules/proto_man": "proto_man",
"../../modules/proto_tools": "proto_tools",
"../Cmd": "Cmd",
"../Response": "Response",
"../Stype": "Stype"
} ],
game_system: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9e930XBs+FGxLaT5HFZYtmX", "game_system");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../modules/websocket"), r = e("../Stype"), _ = e("../Cmd");
e("./game_system_proto");
var s = function() {
function e() {}
e.get_game_info = function() {
n.default.send_cmd(r.default.GAME_SYSTEM, _.default.GameSystem.GET_GAME_INFO, null);
};
e.get_login_bonues_today = function() {
n.default.send_cmd(r.default.GAME_SYSTEM, _.default.GameSystem.LOGIN_BONUES_INFO, null);
};
e.send_recv_login_bonues = function(e) {
n.default.send_cmd(r.default.GAME_SYSTEM, _.default.GameSystem.RECV_LOGIN_BUNUES, e);
};
e.get_world_rank_info = function() {
n.default.send_cmd(r.default.GAME_SYSTEM, _.default.GameSystem.GET_WORLD_RANK_INFO, null);
};
return e;
}();
o.default = s;
cc._RF.pop();
}, {
"../../modules/websocket": "websocket",
"../Cmd": "Cmd",
"../Stype": "Stype",
"./game_system_proto": "game_system_proto"
} ],
guest_upgrade: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c12578lkw5O67Ixq06M6TeQ", "guest_upgrade");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../ugame"), r = e("../../3rd/md5"), _ = e("../protobufs/auth"), s = cc._decorator, i = s.ccclass, a = s.property, u = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.input_phone_numer = null;
t.input_new_pwd = null;
t.input_again_pwd = null;
t.input_indetifying_code = null;
t.error_desic_label = null;
return t;
}
t.prototype.onLoad = function() {
this.error_desic_label.node.active = !1;
};
t.prototype.show_error_tip = function(e) {
var t = this;
this.error_desic_label.node.active = !0;
this.error_desic_label.string = e;
this.unscheduleAllCallbacks();
this.scheduleOnce(function() {
t.error_desic_label.node.active = !1;
}, 3);
};
t.prototype.on_get_identifying_code = function() {
this.error_desic_label.node.active = !1;
var e = this.input_phone_numer.string;
if (e && 11 == e.length) {
console.log(e);
_.default.get_guess_upgrade_verify_code(e, n.default.guest_key);
} else this.show_error_tip("无效的电活号码!");
};
t.prototype.on_guest_upgrade_click = function() {
var e = this.input_phone_numer.string;
if (e && 11 == e.length) {
var t = this.input_new_pwd.string;
if (t == this.input_again_pwd.string) {
n.default.guest_key;
var o = this.input_indetifying_code.string;
if (o && 6 == o.length) {
n.default.save_temp_uname_and_upwd(e, t);
t = r(t);
_.default.guest_bind_phone(e, t, o);
} else this.show_error_tip("验证码错误!");
} else this.show_error_tip("两次输入的密码不一致!");
} else this.show_error_tip("无效的电活号码!");
};
t.prototype.start = function() {};
__decorate([ a(cc.EditBox) ], t.prototype, "input_phone_numer", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "input_new_pwd", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "input_again_pwd", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "input_indetifying_code", void 0);
__decorate([ a(cc.Label) ], t.prototype, "error_desic_label", void 0);
return t = __decorate([ i ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
}, {
"../../3rd/md5": "md5",
"../protobufs/auth": "auth",
"../ugame": "ugame"
} ],
home_ctl: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "99801dONiJKKYRxCJhDOYHP", "home_ctl");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../ugame"), r = e("../ulevel"), _ = cc._decorator, s = _.ccclass, i = _.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick = null;
t.uchip = null;
t.ulevel = null;
t.uexp_process = null;
t.usex = null;
t.usex_sp = [];
t.uvip = null;
t.main_list = null;
t.back = null;
t.title_label = null;
t.second_ui = null;
return t;
}
t.prototype.start = function() {
this.sync_info();
};
t.prototype.sync_info = function() {
this.unick.string = n.default.unick;
this.uchip.string = "" + n.default.game_info.uchip;
this.usex.spriteFrame = this.usex_sp[n.default.usex];
this.uvip.string = "VIP " + n.default.game_info.uvip;
var e = r.default.get_level(n.default.game_info.uexp);
this.ulevel.string = "LV " + e[0];
this.uexp_process.progress = e[1];
};
t.prototype.show_main_list = function() {
this.back.active = !1;
this.main_list.active = !0;
this.title_label.string = "我";
};
t.prototype.hide_main_list = function(e) {
this.back.active = !0;
this.main_list.active = !1;
this.title_label.string = e;
};
t.prototype.go_back = function() {
if (null != this.second_ui) {
this.second_ui.removeFromParent();
this.second_ui = null;
}
this.show_main_list();
};
t.prototype.on_enter_zone_click = function(e, t) {
if ((t = parseInt(t)) <= 0 || t > 3) console.log(t); else {
n.default.enter_zone(t);
cc.director.loadScene("game_scene");
}
};
__decorate([ i(cc.Label) ], t.prototype, "unick", void 0);
__decorate([ i(cc.Label) ], t.prototype, "uchip", void 0);
__decorate([ i(cc.Label) ], t.prototype, "ulevel", void 0);
__decorate([ i(cc.ProgressBar) ], t.prototype, "uexp_process", void 0);
__decorate([ i(cc.Sprite) ], t.prototype, "usex", void 0);
__decorate([ i([ cc.SpriteFrame ]) ], t.prototype, "usex_sp", void 0);
__decorate([ i(cc.Label) ], t.prototype, "uvip", void 0);
__decorate([ i(cc.Node) ], t.prototype, "main_list", void 0);
__decorate([ i(cc.Node) ], t.prototype, "back", void 0);
__decorate([ i(cc.Label) ], t.prototype, "title_label", void 0);
return t = __decorate([ s ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {
"../ugame": "ugame",
"../ulevel": "ulevel"
} ],
home_scene: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "91d4e3/EMNC7LdPcin3WKX2", "home_scene");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Stype"), r = e("../../modules/websocket"), _ = e("../Cmd"), s = e("../Response"), i = e("../ugame"), a = e("./mine_ctl"), u = e("../protobufs/game_system"), c = e("./home_ctl"), d = e("./system_ctl"), l = e("./friend_ctl"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.tab_buttons = [];
t.tab_content = [];
t.mine_ctl = null;
t.home_ctl = null;
t.system_ctl = null;
t.friend_ctl = null;
t.login_bonues_prefab = null;
t.tab_button_com_set = [];
t.service_handlers = {};
return t;
}
t.prototype.onLoad = function() {
for (var e = 0; e < this.tab_buttons.length; e++) {
var t = this.tab_buttons[e].getComponent("tab_button");
this.tab_button_com_set.push(t);
}
this.service_handlers[n.default.Auth] = this.on_auth_server_return.bind(this);
this.service_handlers[n.default.GAME_SYSTEM] = this.on_system_server_return.bind(this);
r.default.register_services_handler(this.service_handlers);
};
t.prototype.on_system_server_return = function(e, t, o) {
switch (t) {
case _.default.GameSystem.LOGIN_BONUES_INFO:
this.on_get_login_bonues_today_return(o);
break;

case _.default.GameSystem.RECV_LOGIN_BUNUES:
this.on_recv_login_bonues_return(o);
break;

case _.default.GameSystem.GET_WORLD_RANK_INFO:
this.on_get_world_rank_info_return(o);
}
};
t.prototype.on_get_login_bonues_today_return = function(e) {
if (e.status == s.default.OK) {
console.log("on_get_login_bonues_today_return success !");
if (0 != e.b_has) {
var t = cc.instantiate(this.login_bonues_prefab);
t.parent = this.node;
t.getComponent("login_bonues").show_login_bonues(e.id, e.bonues, e.days);
}
} else console.log("on_get_login_bonues_today_return error status : " + e.status);
};
t.prototype.on_recv_login_bonues_return = function(e) {
if (e.status == s.default.OK) {
console.log("on_recv_login_bonues_return success bonues : " + e.bonues);
i.default.game_info.uchip += e.bonues;
this.home_ctl.sync_info();
} else console.log("on_recv_login_bonues_return err:", e.status);
};
t.prototype.on_get_world_rank_info_return = function(e) {
if (e[0] == s.default.OK) {
console.log("on_get_world_rank_info_return success!");
console.log(e);
this.system_ctl.on_get_world_rank_data(e[3], e[2]);
} else console.log("on_get_world_rank_info_return error status : " + status);
};
t.prototype.on_auth_server_return = function(e, t, o) {
switch (t) {
case _.default.Auth.RELOGIN:
console.log("error on_auth_server_return 游客账号已在别处登录");
break;

case _.default.Auth.EDIT_PROFILE:
this.on_edit_profile_server_return(o);
break;

case _.default.Auth.GUEST_UPGRADE_INDENTIFY:
this.on_get_upgrade_indentify_return(o);
break;

case _.default.Auth.BIND_PHONE_NUM:
this.on_guest_bind_phone_return(o);
}
};
t.prototype.on_edit_profile_server_return = function(e) {
if (e.status == s.default.OK) {
i.default.edit_profile_success(e.unick, e.usex);
this.mine_ctl.go_back();
this.mine_ctl.sync_info();
this.home_ctl.sync_info();
this.system_ctl.sync_info();
this.friend_ctl.sync_info();
} else console.log("edit_profile error");
};
t.prototype.on_get_upgrade_indentify_return = function(e) {
e == s.default.OK ? console.log("on_get_upgrade_indentify_return sucess") : console.log("get upgrade_indentify error : status = " + e);
};
t.prototype.on_guest_bind_phone_return = function(e) {
if (e == s.default.OK) {
console.log("on_guest_bind_phone_return sucess !");
i.default.guest_bind_phone_success();
} else console.log("on_guest_bind_phone_return error status: " + e);
};
t.prototype.start = function() {
this.on_tab_button_click(null, "0");
this.get_login_bonues_today();
};
t.prototype.get_login_bonues_today = function() {
u.default.get_login_bonues_today();
};
t.prototype.on_tab_button_click = function(e, t) {
t = parseInt(t);
for (var o = 0; o < this.tab_buttons.length; o++) o == t ? this.enable_tab(o) : this.disable_tab(o);
};
t.prototype.enable_tab = function(e) {
this.tab_button_com_set[e].set_actived(!0);
this.tab_buttons[e].interactable = !1;
this.tab_content[e].active = !0;
};
t.prototype.disable_tab = function(e) {
this.tab_button_com_set[e].set_actived(!1);
this.tab_buttons[e].interactable = !0;
this.tab_content[e].active = !1;
};
__decorate([ h([ cc.Button ]) ], t.prototype, "tab_buttons", void 0);
__decorate([ h([ cc.Node ]) ], t.prototype, "tab_content", void 0);
__decorate([ h(a.default) ], t.prototype, "mine_ctl", void 0);
__decorate([ h(c.default) ], t.prototype, "home_ctl", void 0);
__decorate([ h(d.default) ], t.prototype, "system_ctl", void 0);
__decorate([ h(l.default) ], t.prototype, "friend_ctl", void 0);
__decorate([ h(cc.Prefab) ], t.prototype, "login_bonues_prefab", void 0);
return t = __decorate([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
}, {
"../../modules/websocket": "websocket",
"../Cmd": "Cmd",
"../Response": "Response",
"../Stype": "Stype",
"../protobufs/game_system": "game_system",
"../ugame": "ugame",
"./friend_ctl": "friend_ctl",
"./home_ctl": "home_ctl",
"./mine_ctl": "mine_ctl",
"./system_ctl": "system_ctl"
} ],
http: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7b0117KINdKqo2RibD5WcXO", "http");
var n = {
get: function(e, t, o, n) {
var r = cc.loader.getXMLHttpRequest();
r.timeout = 5e3;
var _ = e + t;
o && (_ = _ + "?" + o);
r.open("GET", _, !0);
cc.sys.isNative && r.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
r.onreadystatechange = function() {
if (4 == r.readyState && r.status >= 200 && r.status < 300) {
console.log("http res(" + r.responseText.length + "):" + r.responseText);
try {
var e = r.responseText;
null !== n && n(null, e);
return;
} catch (e) {
n(e, null);
}
}
};
r.send();
return r;
},
post: function(e, t, o, n, r) {
var _ = cc.loader.getXMLHttpRequest();
_.timeout = 5e3;
var s = e + t;
o && (s = s + "?" + o);
_.open("POST", s, !0);
cc.sys.isNative && _.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
if (n) {
_.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
_.setRequestHeader("Content-Length", n.length);
}
_.onreadystatechange = function() {
if (4 === _.readyState && _.status >= 200 && _.status < 300) try {
var e = _.responseText;
null !== r && r(null, e);
return;
} catch (e) {
r(e, null);
}
};
n && _.send(n);
return _;
},
download: function(e, t, o, n) {
var r = cc.loader.getXMLHttpRequest();
r.timeout = 5e3;
var _ = e + t;
o && (_ = _ + "?" + o);
r.responseType = "arraybuffer";
r.open("GET", _, !0);
cc.sys.isNative && r.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
r.onreadystatechange = function() {
if (4 === r.readyState && r.status >= 200 && r.status < 300) {
for (var e = r.response, t = new DataView(e), o = new Uint8Array(e.byteLength), _ = 0; _ < o.length; _++) o[_] = t.getUint8(_);
n(null, o);
}
};
r.send();
return r;
}
};
t.exports = n;
cc._RF.pop();
}, {} ],
info_interface: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3421bq693lPYLHnx+WAz/4K", "info_interface");
Object.defineProperty(o, "__esModule", {
value: !0
});
cc._RF.pop();
}, {} ],
loading: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0b4ecELdK1FjamsoECndLEP", "loading");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./protobufs/auth"), r = e("./ugame"), _ = e("./Cmd"), s = e("./Stype"), i = e("../modules/websocket"), a = e("./Response"), u = e("../game/protobufs/game_system"), c = cc._decorator, d = c.ccclass, l = c.property, p = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.account_reg = null;
t.account_forget_pwd = null;
t.account_uname_locin = null;
return t;
}
t.prototype.onLoad = function() {
var e = {};
e[s.default.Auth] = this.on_auth_server_return.bind(this);
e[s.default.GAME_SYSTEM] = this.on_game_system_server_return.bind(this);
i.default.register_services_handler(e);
};
t.prototype.start = function() {};
t.prototype.guest_login_return = function(e) {
console.log(e);
if (e.status == a.default.OK) {
r.default.guest_login_success(e.unick, e.usex, e.uface, e.uvip, e.guest_key);
this.on_auth_login_success();
} else console.log("error guest_login_return");
};
t.prototype.uname_login_return = function(e) {
if (e.status == a.default.OK) {
r.default.uname_login_success(e.unick, e.usex, e.uface, e.uvip);
r.default.save_uname_and_upwd();
this.on_auth_login_success();
} else console.log(e);
};
t.prototype.on_auth_login_success = function() {
u.default.get_game_info();
};
t.prototype.on_get_phone_reg_verify_return = function(e) {
e == a.default.OK ? console.log("on_get_phone_reg_verify_return success!") : console.log("on_get_phone_reg_verify_return error status : " + e);
};
t.prototype.on_reg_phone_account_return = function(e) {
if (e == a.default.OK) {
console.log("on_reg_phone_account_return success!");
r.default.save_uname_and_upwd();
n.default.uname_login();
} else console.log("on_reg_phone_account_return error status : " + e);
};
t.prototype.on_get_forget_pwd_verify_return = function(e) {
e == a.default.OK ? console.log("on_get_forget_pwd_verify_return success!") : console.log("on_get_forget_pwd_verify_return error status : " + e);
};
t.prototype.on_reset_pwd_return = function(e) {
if (e == a.default.OK) {
r.default.save_uname_and_upwd();
n.default.uname_login();
} else console.log("on_reset_pwd_return error status: " + e);
};
t.prototype.on_get_game_info_return = function(e) {
if (e.status == a.default.OK) {
r.default.save_user_game_data(e);
cc.director.loadScene("home_scene");
} else console.log("on_get_game_info_return error status: " + status);
};
t.prototype.on_game_system_server_return = function(e, t, o) {
switch (t) {
case _.default.GameSystem.GET_GAME_INFO:
this.on_get_game_info_return(o);
}
};
t.prototype.on_auth_server_return = function(e, t, o) {
console.log("on_auth_server_return ctype : " + t);
switch (t) {
case _.default.Auth.GUEST_LOGIN:
this.guest_login_return(o);
break;

case _.default.Auth.RELOGIN:
console.log("error on_auth_server_return 游客账号已在别处登录");
break;

case _.default.Auth.UNAME_LOGIN:
this.uname_login_return(o);
break;

case _.default.Auth.GET_PHONE_REG_VERIFY:
this.on_get_phone_reg_verify_return(o);
break;

case _.default.Auth.PHONE_REG_ACCOUNT:
this.on_reg_phone_account_return(o);
break;

case _.default.Auth.GET_FORGET_PWD_VERIFY:
this.on_get_forget_pwd_verify_return(o);
break;

case _.default.Auth.RESET_USER_PWD:
this.on_reset_pwd_return(o);
}
};
t.prototype.on_quick_login_click = function() {
console.log("是否是游客 : " + r.default.is_guest);
r.default.is_guest ? n.default.guest_login() : n.default.uname_login();
};
t.prototype.on_register_account_click = function() {
this.account_reg.active = !0;
};
t.prototype.on_forget_pwd_click = function() {
this.account_forget_pwd.active = !0;
};
t.prototype.on_uname_login_click = function() {
this.account_uname_locin.active = !0;
};
t.prototype.on_wechat_login_click = function() {};
__decorate([ l(cc.Node) ], t.prototype, "account_reg", void 0);
__decorate([ l(cc.Node) ], t.prototype, "account_forget_pwd", void 0);
__decorate([ l(cc.Node) ], t.prototype, "account_uname_locin", void 0);
return t = __decorate([ d ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
}, {
"../game/protobufs/game_system": "game_system",
"../modules/websocket": "websocket",
"./Cmd": "Cmd",
"./Response": "Response",
"./Stype": "Stype",
"./protobufs/auth": "auth",
"./ugame": "ugame"
} ],
login_bonues: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7ee98BUl5VOFornTJL2Kfw2", "login_bonues");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../protobufs/game_system"), r = cc._decorator, _ = r.ccclass, s = r.property, i = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.chip_label = [];
t.zw_icon = [];
t.bonues_info = null;
t.bonues_id = null;
return t;
}
t.prototype.onLoad = function() {
this.bonues_info = [ "100", "200", "300", "400", "500" ];
for (var e = 0; e < this.bonues_info.length; e++) {
this.chip_label[e].string = this.bonues_info[e];
this.chip_label[e].node.color = new cc.Color(0, 0, 0, 255);
this.zw_icon[e].active = !0;
}
};
t.prototype.start = function() {};
t.prototype.show_login_bonues = function(e, t, o) {
0 == this.node.active && (this.node.active = !0);
this.bonues_id = e;
var n = 0;
o >= this.bonues_info.length && (o = this.bonues_info.length);
for (n = 0; n < o; n++) {
this.chip_label[n].node.color = new cc.Color(255, 0, 0, 255);
this.zw_icon[n].active = !0;
}
for (;n < this.bonues_info.length; n++) {
this.chip_label[n].node.color = new cc.Color(0, 0, 0, 255);
this.zw_icon[n].active = !1;
}
this.zw_icon[o - 1].active = !0;
};
t.prototype.on_close_click = function() {
this.node.removeFromParent();
};
t.prototype.on_recv_cmd_click = function() {
n.default.send_recv_login_bonues(this.bonues_id);
this.node.removeFromParent();
};
__decorate([ s([ cc.Label ]) ], t.prototype, "chip_label", void 0);
__decorate([ s([ cc.Node ]) ], t.prototype, "zw_icon", void 0);
return t = __decorate([ _ ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {
"../protobufs/game_system": "game_system"
} ],
md5: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6bea2uDlXJIeqs4Smw2JLNf", "md5");
var n = 0, r = 8;
function _(e) {
return f(s(p(e), e.length * r));
}
function s(e, t) {
e[t >> 5] |= 128 << t % 32;
e[14 + (t + 64 >>> 9 << 4)] = t;
for (var o = 1732584193, n = -271733879, r = -1732584194, _ = 271733878, s = 0; s < e.length; s += 16) {
var i = o, p = n, f = r, h = _;
n = d(n = d(n = d(n = d(n = c(n = c(n = c(n = c(n = u(n = u(n = u(n = u(n = a(n = a(n = a(n = a(n, r = a(r, _ = a(_, o = a(o, n, r, _, e[s + 0], 7, -680876936), n, r, e[s + 1], 12, -389564586), o, n, e[s + 2], 17, 606105819), _, o, e[s + 3], 22, -1044525330), r = a(r, _ = a(_, o = a(o, n, r, _, e[s + 4], 7, -176418897), n, r, e[s + 5], 12, 1200080426), o, n, e[s + 6], 17, -1473231341), _, o, e[s + 7], 22, -45705983), r = a(r, _ = a(_, o = a(o, n, r, _, e[s + 8], 7, 1770035416), n, r, e[s + 9], 12, -1958414417), o, n, e[s + 10], 17, -42063), _, o, e[s + 11], 22, -1990404162), r = a(r, _ = a(_, o = a(o, n, r, _, e[s + 12], 7, 1804603682), n, r, e[s + 13], 12, -40341101), o, n, e[s + 14], 17, -1502002290), _, o, e[s + 15], 22, 1236535329), r = u(r, _ = u(_, o = u(o, n, r, _, e[s + 1], 5, -165796510), n, r, e[s + 6], 9, -1069501632), o, n, e[s + 11], 14, 643717713), _, o, e[s + 0], 20, -373897302), r = u(r, _ = u(_, o = u(o, n, r, _, e[s + 5], 5, -701558691), n, r, e[s + 10], 9, 38016083), o, n, e[s + 15], 14, -660478335), _, o, e[s + 4], 20, -405537848), r = u(r, _ = u(_, o = u(o, n, r, _, e[s + 9], 5, 568446438), n, r, e[s + 14], 9, -1019803690), o, n, e[s + 3], 14, -187363961), _, o, e[s + 8], 20, 1163531501), r = u(r, _ = u(_, o = u(o, n, r, _, e[s + 13], 5, -1444681467), n, r, e[s + 2], 9, -51403784), o, n, e[s + 7], 14, 1735328473), _, o, e[s + 12], 20, -1926607734), r = c(r, _ = c(_, o = c(o, n, r, _, e[s + 5], 4, -378558), n, r, e[s + 8], 11, -2022574463), o, n, e[s + 11], 16, 1839030562), _, o, e[s + 14], 23, -35309556), r = c(r, _ = c(_, o = c(o, n, r, _, e[s + 1], 4, -1530992060), n, r, e[s + 4], 11, 1272893353), o, n, e[s + 7], 16, -155497632), _, o, e[s + 10], 23, -1094730640), r = c(r, _ = c(_, o = c(o, n, r, _, e[s + 13], 4, 681279174), n, r, e[s + 0], 11, -358537222), o, n, e[s + 3], 16, -722521979), _, o, e[s + 6], 23, 76029189), r = c(r, _ = c(_, o = c(o, n, r, _, e[s + 9], 4, -640364487), n, r, e[s + 12], 11, -421815835), o, n, e[s + 15], 16, 530742520), _, o, e[s + 2], 23, -995338651), r = d(r, _ = d(_, o = d(o, n, r, _, e[s + 0], 6, -198630844), n, r, e[s + 7], 10, 1126891415), o, n, e[s + 14], 15, -1416354905), _, o, e[s + 5], 21, -57434055), r = d(r, _ = d(_, o = d(o, n, r, _, e[s + 12], 6, 1700485571), n, r, e[s + 3], 10, -1894986606), o, n, e[s + 10], 15, -1051523), _, o, e[s + 1], 21, -2054922799), r = d(r, _ = d(_, o = d(o, n, r, _, e[s + 8], 6, 1873313359), n, r, e[s + 15], 10, -30611744), o, n, e[s + 6], 15, -1560198380), _, o, e[s + 13], 21, 1309151649), r = d(r, _ = d(_, o = d(o, n, r, _, e[s + 4], 6, -145523070), n, r, e[s + 11], 10, -1120210379), o, n, e[s + 2], 15, 718787259), _, o, e[s + 9], 21, -343485551);
o = l(o, i);
n = l(n, p);
r = l(r, f);
_ = l(_, h);
}
return Array(o, n, r, _);
}
function i(e, t, o, n, r, _) {
return l(function(e, t) {
return e << t | e >>> 32 - t;
}(l(l(t, e), l(n, _)), r), o);
}
function a(e, t, o, n, r, _, s) {
return i(t & o | ~t & n, e, t, r, _, s);
}
function u(e, t, o, n, r, _, s) {
return i(t & n | o & ~n, e, t, r, _, s);
}
function c(e, t, o, n, r, _, s) {
return i(t ^ o ^ n, e, t, r, _, s);
}
function d(e, t, o, n, r, _, s) {
return i(o ^ (t | ~n), e, t, r, _, s);
}
function l(e, t) {
var o = (65535 & e) + (65535 & t);
return (e >> 16) + (t >> 16) + (o >> 16) << 16 | 65535 & o;
}
function p(e) {
for (var t = Array(), o = (1 << r) - 1, n = 0; n < e.length * r; n += r) t[n >> 5] |= (e.charCodeAt(n / r) & o) << n % 32;
return t;
}
function f(e) {
for (var t = n ? "0123456789ABCDEF" : "0123456789abcdef", o = "", r = 0; r < 4 * e.length; r++) o += t.charAt(e[r >> 2] >> r % 4 * 8 + 4 & 15) + t.charAt(e[r >> 2] >> r % 4 * 8 & 15);
return o;
}
t.exports = _;
cc._RF.pop();
}, {} ],
mine_ctl: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "524e2JZgJxBbJS3AmosurN6", "mine_ctl");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../ugame"), r = cc._decorator, _ = r.ccclass, s = r.property, i = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick = null;
t.guest_bind_button = null;
t.edit_prefab = null;
t.guest_upgrade_prefab = null;
t.main_list = null;
t.back = null;
t.title_label = null;
t.second_ui = null;
return t;
}
t.prototype.start = function() {
this.sync_info();
this.back.active = !1;
console.log(n.default.is_guest);
n.default.is_guest ? this.guest_bind_button.active = !0 : this.guest_bind_button.active = !1;
};
t.prototype.go_back = function() {
if (null != this.second_ui) {
this.second_ui.removeFromParent();
this.second_ui = null;
}
this.show_main_list();
};
t.prototype.on_edit_profile_click = function() {
this.second_ui = cc.instantiate(this.edit_prefab);
this.second_ui.parent = this.node;
this.hide_main_list("个人信息");
};
t.prototype.sync_info = function() {
this.unick.string = n.default.unick;
};
t.prototype.on_guest_upgrade_click = function() {
this.second_ui = cc.instantiate(this.guest_upgrade_prefab);
this.second_ui.parent = this.node;
this.hide_main_list("游客升级");
};
t.prototype.show_main_list = function() {
this.back.active = !1;
this.main_list.active = !0;
this.title_label.string = "我";
};
t.prototype.hide_main_list = function(e) {
this.back.active = !0;
this.main_list.active = !1;
this.title_label.string = e;
};
__decorate([ s(cc.Label) ], t.prototype, "unick", void 0);
__decorate([ s(cc.Node) ], t.prototype, "guest_bind_button", void 0);
__decorate([ s(cc.Prefab) ], t.prototype, "edit_prefab", void 0);
__decorate([ s(cc.Prefab) ], t.prototype, "guest_upgrade_prefab", void 0);
__decorate([ s(cc.Node) ], t.prototype, "main_list", void 0);
__decorate([ s(cc.Node) ], t.prototype, "back", void 0);
__decorate([ s(cc.Label) ], t.prototype, "title_label", void 0);
return t = __decorate([ _ ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {
"../ugame": "ugame"
} ],
net_connect: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "1c5e5R3ItlNwISEMC4zparJ", "net_connect");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../modules/http.js"), r = e("../modules/websocket"), _ = e("../modules/proto_man"), s = cc._decorator, i = s.ccclass, a = s.property, u = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.is_proto_json = !0;
t.server_info = null;
return t;
}
t.prototype.start = function() {
this.get_server_info();
};
t.prototype.get_server_info = function() {
var e = this;
n.get("http://127.0.0.1:10001", "/server_info", null, function(t, o) {
if (t) {
console.log(t);
e.scheduleOnce(e.get_server_info.bind(e), 3);
} else {
var n = JSON.parse(o);
e.server_info = n;
e.connect_to_server();
}
});
};
t.prototype.connect_to_server = function() {
this.is_proto_json ? r.default.connect("ws://" + this.server_info.host + ":" + this.server_info.ws_port + "/ws", _.default.PROTO_JSON) : r.default.connect("ws://" + this.server_info.host + ":" + this.server_info.tcp_port + "/ws", _.default.PROTO_BUF);
};
__decorate([ a(Number) ], t.prototype, "is_proto_json", void 0);
return t = __decorate([ i ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
}, {
"../modules/http.js": "http",
"../modules/proto_man": "proto_man",
"../modules/websocket": "websocket"
} ],
proto_man: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5bf31oCvOlH3avPyOFsA4Mi", "proto_man");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./proto_tools"), r = function() {
function e() {}
e.PROTO_JSON = 1;
e.PROTO_BUF = 2;
e.decoders = {};
e.encoders = {};
e.GW_Disconnect = 1e4;
e.encode_cmd = c;
e.decode_cmd = d;
e.reg_decoder = a;
e.reg_encoder = i;
e.encrypt_cmd = _;
e.decrypt_cmd = s;
return e;
}();
o.default = r;
function _(e) {
return e;
}
function s(e) {
return e;
}
function i(e, t, o) {
var n = u(e, t);
r.encoders[n] && console.log("encoder is register  stype: " + e + " ctype: " + t);
r.encoders[n] = o;
}
function a(e, t, o) {
var n = u(e, t);
r.decoders[n] && console.log("decoder is register stype: " + e + " ctype: " + t);
r.decoders[n] = o;
}
function u(e, t) {
return 65536 * e + t;
}
function c(e, t, o, s) {
var i = null, a = null;
if (e == r.PROTO_JSON) a = function(e, t, o) {
var r = {};
r[0] = o;
var _ = JSON.stringify(r);
return n.default.encode_str_cmd(e, t, _);
}(t, o, s); else if (e == r.PROTO_BUF) {
var c = u(t, o);
if (!r.encoders[c]) {
console.log("encode_cmd not exist error");
return null;
}
a = r.encoders[c](t, o, s);
}
n.default.write_prototype_inbuf(a, e);
(i = a.buffer) && (i = _(i));
return i;
}
function d(e, t) {
t = s(t);
var o = new DataView(t);
if (t.byteLength < n.default.header_size) {
console.log("decode_cmd error");
return null;
}
if (e == r.PROTO_JSON) return function(e) {
var t = n.default.decode_str_cmd(e), o = t[2];
try {
var r = JSON.parse(o);
t[2] = r[0];
} catch (e) {
console.log("_json_decode parse error");
return null;
}
if (!t || "undefined" == typeof t[0] || "undefined" == typeof t[1] || "undefined" == typeof t[2]) {
console.log("json_decode error");
return null;
}
return t;
}(o);
if (e == r.PROTO_BUF) {
var _ = u(n.default.read_int16(o, 0), n.default.read_int16(o, 2));
if (!r.decoders[_]) {
console.log("decode_cmd decoder[key] error");
return null;
}
return r.decoders[_](o);
}
}
cc._RF.pop();
}, {
"./proto_tools": "proto_tools"
} ],
proto_tools: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "620caHdPndNaba0Rhs/MsqF", "proto_tools");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.read_int8 = function(e, t) {
return e.getInt8(t);
};
e.write_int8 = function(e, t, o) {
e.setInt8(t, o);
};
e.read_int16 = function(e, t) {
return e.getInt16(t, !0);
};
e.write_int16 = function(e, t, o) {
e.setInt16(t, o, !0);
};
e.read_int32 = function(e, t) {
return e.getInt32(t, !0);
};
e.write_int32 = function(e, t, o) {
e.setInt32(t, o, !0);
};
e.read_uint32 = function(e, t) {
return e.getUint32(t, !0);
};
e.write_uint32 = function(e, t, o) {
e.setUint32(t, o, !0);
};
e.read_str = function(e, t, o) {
return e.read_utf8(t, o);
};
e.write_str = function(e, t, o) {
e.write_utf8(t, o);
};
e.read_float = function(e, t) {
return e.getFloat32(t, !0);
};
e.write_float = function(e, t, o) {
e.setFloat32(t, o, !0);
};
e.alloc_DataView = function(e) {
var t = new ArrayBuffer(e);
return new DataView(t);
};
e.write_cmd_header_inbuf = function(t, o, n) {
e.write_int16(t, 0, o);
e.write_int16(t, 2, n);
e.write_uint32(t, 4, 0);
return e.header_size;
};
e.read_cmd_header_inbuf = function(t) {
var o = [];
o[0] = e.read_int16(t, 0);
o[1] = e.read_int16(t, 1);
return [ o, e.header_size ];
};
e.write_prototype_inbuf = function(e, t) {
this.write_int16(e, 8, t);
};
e.write_utag_inbuf = function(e, t) {
this.write_uint32(e, 4, t);
};
e.clear_utag_inbuf = function(e) {
this.write_uint32(e, 4, 0);
};
e.write_str_inbuf = function(t, o, n, r) {
e.write_int16(t, o, r);
o += 2;
e.write_str(t, o, n);
return o += r;
};
e.read_str_inbuf = function(t, o) {
var n = e.read_int16(t, o);
o += 2;
return [ e.read_str(t, o, n), o += n ];
};
e.decode_empty_cmd = function(t) {
var o = [];
o[0] = e.read_int16(t, 0);
o[1] = e.read_int16(t, 2);
o[2] = null;
return o;
};
e.encode_empty_cmd = function(t, o, n) {
var r = e.alloc_DataView(e.header_size);
e.write_cmd_header_inbuf(r, t, o);
return r;
};
e.encode_status_cmd = function(t, o, n) {
var r = e.alloc_DataView(e.header_size + 2);
e.write_cmd_header_inbuf(r, t, o);
e.write_int16(r, e.header_size, n);
return r;
};
e.decode_status_cmd = function(t) {
var o = [];
o[0] = e.read_int16(t, 0);
o[1] = e.read_int16(t, 2);
o[2] = e.read_int16(t, e.header_size);
return o;
};
e.encode_str_cmd = function(t, o, n) {
var r = n.utf8_byte_len(), _ = e.header_size + 2 + r, s = e.alloc_DataView(_), i = e.write_cmd_header_inbuf(s, t, o);
i = e.write_str_inbuf(s, i, n, r);
return s;
};
e.decode_str_cmd = function(t) {
var o = [];
o[0] = e.read_int16(t, 0);
o[1] = e.read_int16(t, 2);
var n = e.read_str_inbuf(t, e.header_size);
o[2] = n[0];
return o;
};
e.encode_int32_cmd = function(t, o, n) {
var r = e.alloc_DataView(e.header_size + 4);
e.write_cmd_header_inbuf(r, t, o);
e.write_int32(r, e.header_size, n);
return r;
};
e.decode_int32_cmd = function(t) {
var o = [];
o[0] = e.read_int16(t, 0);
o[1] = e.read_int16(t, 2);
o[2] = e.read_int32(t, e.header_size);
return o;
};
e.header_size = 10;
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
rank_item: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "957adkXw3ZJmLqVjJ/Up7wv", "rank_item");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, r = n.ccclass, _ = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rank_label = null;
t.unick_label = null;
t.uchip_label = null;
t.usex = null;
t.usex_sp = [];
return t;
}
t.prototype.start = function() {};
t.prototype.show_rank_info = function(e, t, o, n, r) {
this.rank_label.string = "" + e;
this.unick_label.string = t;
this.uchip_label.string = "" + r;
this.usex.spriteFrame = this.usex_sp[o];
};
__decorate([ _(cc.Label) ], t.prototype, "rank_label", void 0);
__decorate([ _(cc.Label) ], t.prototype, "unick_label", void 0);
__decorate([ _(cc.Label) ], t.prototype, "uchip_label", void 0);
__decorate([ _(cc.Sprite) ], t.prototype, "usex", void 0);
__decorate([ _([ cc.SpriteFrame ]) ], t.prototype, "usex_sp", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
replay_scene: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "fe74cPxsnxMIJCc/UobONCh", "replay_scene");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Cmd"), r = e("../protobufs/five_chess"), _ = e("../ugame"), s = e("../Response"), i = e("../game_scene/game_seat"), a = e("../State"), u = e("../game_scene/chess_disk"), c = e("../game_scene/checkout"), d = cc._decorator, l = d.ccclass, p = d.property, f = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.seatA = null;
t.seatB = null;
t.prop_prefab = null;
t.chess_disk = null;
t.checkout = null;
t.cmd_set = null;
t.cur_cmd = 0;
t.prev_time = -1;
t.service_handlers = {};
t.load_flag = 0;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.start = function() {
var e = _.default.prev_round_data, t = e[0];
this.on_user_arrived_return(t[0], !0);
this.on_user_arrived_return(t[1], !1);
this.cmd_set = e[1];
this.cur_cmd = 0;
this.prev_time = -1;
this.exec_cmd();
};
t.prototype.on_five_chess_server_return = function(e, t, o) {
console.log(e + " " + t + " " + o);
switch (t) {
case n.default.GameFiveChess.ENTER_ZONE:
this.enter_zone_return(o);
break;

case n.default.GameFiveChess.USER_QUIT:
this.user_quit_return(o);
break;

case n.default.GameFiveChess.ENTER_ROOM:
this.enter_room_return(o);
break;

case n.default.GameFiveChess.EXIT_ROOM:
break;

case n.default.GameFiveChess.SITDOWN:
this.on_sitdown_return(o);
break;

case n.default.GameFiveChess.STANDUP:
this.on_standup_return(o);
break;

case n.default.GameFiveChess.USER_ARRIVED:
this.on_user_arrived_return(o, null);
break;

case n.default.GameFiveChess.SEND_PROP:
this.on_send_prop_return(o);
break;

case n.default.GameFiveChess.SEND_DO_READY:
this.on_player_do_ready_return(o);
break;

case n.default.GameFiveChess.ROUND_START:
this.on_game_start_return(o);
break;

case n.default.GameFiveChess.TURN_TO_PLAYER:
this.turn_to_player_return(o);
break;

case n.default.GameFiveChess.PUT_CHESS:
this.player_put_chess_return(o);
break;

case n.default.GameFiveChess.CHECKOUT:
this.game_checkout_return(o);
break;

case n.default.GameFiveChess.CHECKOUT_OVER:
this.game_check_out_over_return(o);
}
};
t.prototype.exec_cmd = function() {
if (!(this.cur_cmd >= this.cmd_set.length)) {
var e = this.cmd_set[this.cur_cmd];
this.cur_cmd++;
if (e) {
var t = e[1], o = e[2], n = e[3];
this.on_five_chess_server_return(t, o, n);
if (this.cur_cmd < this.cmd_set.length) {
var r = this.cmd_set[this.cur_cmd][0] - e[0];
this.scheduleOnce(this.exec_cmd.bind(this), r);
} else this.scheduleOnce(this.game_check_out_over_return.bind(this), 5);
}
}
};
t.prototype.enter_zone_return = function(e) {};
t.prototype.user_quit_return = function(e) {
cc.director.loadScene("home_scene");
};
t.prototype.enter_room_return = function(e) {
e[0], s.default.OK;
};
t.prototype.on_sitdown_return = function(e) {
console.log(e);
if (e[0] == s.default.OK) {
var t = e[1], o = {
unick: _.default.unick,
usex: _.default.usex,
uface: _.default.uface,
uvip: _.default.game_info.uvip,
uchip: _.default.game_info.uchip,
uexp: _.default.game_info.uexp,
state: a.State.InView,
sv_seatid: t
};
console.log(o);
this.seatA.on_sitdowm(o, !0);
}
};
t.prototype.on_user_arrived_return = function(e, t) {
var o = {
unick: e[1],
usex: e[2],
uface: e[3],
uvip: e[6],
uchip: e[4],
uexp: e[5],
state: e[7],
sv_seatid: e[0]
};
t ? this.seatA.on_sitdowm(o, !1) : this.seatB.on_sitdowm(o, !1);
};
t.prototype.on_standup_return = function(e) {
if (e[0] == s.default.OK) {
var t = e[1];
this.seatA.get_sv_seatid() == t ? this.seatA.on_standup() : this.seatB.get_sv_seatid() == t && this.seatB.on_standup();
}
};
t.prototype.on_send_prop_return = function(e) {
if (e[0] == s.default.OK) {
var t = cc.instantiate(this.prop_prefab);
t.parent = this.node;
var o, n, r = t.getComponent("game_prop");
if (e[1] == this.seatA.get_sv_seatid()) {
o = this.seatA.node.getPosition();
n = this.seatB.node.getPosition();
} else {
o = this.seatB.node.getPosition();
n = this.seatA.node.getPosition();
}
r.play_prop_anim(o, n, e[3]);
}
};
t.prototype.on_player_do_ready_return = function(e) {
e[0] == s.default.OK && (this.seatA.get_sv_seatid() == e[1] ? this.seatA.on_do_ready() : this.seatB.on_do_ready());
};
t.prototype.on_game_start_return = function(e) {
this.seatA.on_game_start(e);
this.seatB.on_game_start(e);
};
t.prototype.turn_to_player_return = function(e) {
var t = e[0];
if (e[1] == this.seatA.get_sv_seatid()) {
this.seatA.turn_to_player(t);
this.chess_disk.set_your_turn(!0);
} else {
this.seatB.turn_to_player(t);
this.chess_disk.set_your_turn(!1);
}
};
t.prototype.player_put_chess_return = function(e) {
if (e[0] == s.default.OK) {
var t = e[1], o = e[2], n = e[3];
this.chess_disk.put_chess_at(n, t, o);
this.seatA.hide_timebar();
this.seatB.hide_timebar();
}
};
t.prototype.game_checkout_return = function(e) {
var t = e[0], o = e[1];
if (-1 == t) this.checkout.show_checkout_result(2, 0); else if (t == this.seatA.get_sv_seatid()) {
this.checkout.show_checkout_result(1, o);
_.default.game_info.uchip += o;
} else if (t == this.seatB.get_sv_seatid()) {
this.checkout.show_checkout_result(0, o);
_.default.game_info.uchip -= o;
}
};
t.prototype.game_check_out_over_return = function(e) {
this.checkout.hide_checkout_result();
this.seatA.on_checkout_over();
this.seatB.on_checkout_over();
this.chess_disk.clear_disk();
};
t.prototype.on_user_quit = function() {
if (1 != this.load_flag) {
this.load_flag = 1;
r.default.user_quit();
}
};
t.prototype.on_do_ready_click = function() {
r.default.send_do_ready();
};
__decorate([ p(i.default) ], t.prototype, "seatA", void 0);
__decorate([ p(i.default) ], t.prototype, "seatB", void 0);
__decorate([ p(cc.Prefab) ], t.prototype, "prop_prefab", void 0);
__decorate([ p(u.default) ], t.prototype, "chess_disk", void 0);
__decorate([ p(c.default) ], t.prototype, "checkout", void 0);
return t = __decorate([ l ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
}, {
"../Cmd": "Cmd",
"../Response": "Response",
"../State": "State",
"../game_scene/checkout": "checkout",
"../game_scene/chess_disk": "chess_disk",
"../game_scene/game_seat": "game_seat",
"../protobufs/five_chess": "five_chess",
"../ugame": "ugame"
} ],
system_ctl: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9b19drCINtIQqvNib3bqYQy", "system_ctl");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../ugame"), r = cc._decorator, _ = r.ccclass, s = r.property, i = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.unick = null;
t.main_list = null;
t.back = null;
t.world_rank_prefab = null;
t.title_label = null;
t.second_ui = null;
return t;
}
t.prototype.start = function() {
this.back.active = !1;
this.sync_info();
};
t.prototype.sync_info = function() {
this.unick.string = n.default.unick;
};
t.prototype.on_get_world_rank_click = function() {
null != this.second_ui && this.second_ui.removeFromParent();
this.second_ui = cc.instantiate(this.world_rank_prefab);
this.second_ui.parent = this.node;
this.hide_main_list("排行榜");
};
t.prototype.on_get_world_rank_data = function(e, t) {
if (null != this.second_ui) {
this.second_ui.getComponent("world_rank").show_world_rank(e, t);
}
};
t.prototype.show_main_list = function() {
this.back.active = !1;
this.main_list.active = !0;
this.title_label.string = "系统";
};
t.prototype.hide_main_list = function(e) {
this.back.active = !0;
this.main_list.active = !1;
this.title_label.string = e;
};
t.prototype.go_back = function() {
if (null != this.second_ui) {
this.second_ui.removeFromParent();
this.second_ui = null;
}
this.show_main_list();
};
__decorate([ s(cc.Label) ], t.prototype, "unick", void 0);
__decorate([ s(cc.Node) ], t.prototype, "main_list", void 0);
__decorate([ s(cc.Node) ], t.prototype, "back", void 0);
__decorate([ s(cc.Prefab) ], t.prototype, "world_rank_prefab", void 0);
__decorate([ s(cc.Label) ], t.prototype, "title_label", void 0);
return t = __decorate([ _ ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {
"../ugame": "ugame"
} ],
tab_button: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5dbafxbrn9LcL6oSIVsWSSV", "tab_button");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, r = n.ccclass, _ = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.icon_normal = null;
t.icon_selected = null;
t.icon = null;
t.label = null;
t.is_active = null;
return t;
}
t.prototype.onLoad = function() {
this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
this.label = this.node.getChildByName("name");
this.is_active = !1;
};
t.prototype.start = function() {};
t.prototype.set_actived = function(e) {
this.is_active = e;
if (this.is_active) {
this.icon.spriteFrame = this.icon_selected;
this.label.color = new cc.Color(64, 155, 226, 255);
} else {
this.icon.spriteFrame = this.icon_normal;
this.label.color = new cc.Color(118, 118, 118, 255);
}
};
__decorate([ _(cc.SpriteFrame) ], t.prototype, "icon_normal", void 0);
__decorate([ _(cc.SpriteFrame) ], t.prototype, "icon_selected", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
talk_room_proto: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3acfft9PtNIPr8PK68rYv00", "talk_room_proto");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../modules/proto_man"), r = e("../../modules/proto_tools"), _ = {
OK: 1,
IS_IN_TALKROOM: -100,
NOT_IN_TALKROOM: -101,
INVALD_OPT: -102,
INVALID_PARAMS: -103
};
n.default.reg_decoder(1, 3, function(e) {
var t = {};
t[0] = r.default.read_int16(e, 0);
t[1] = r.default.read_int16(e, 2);
var o = r.default.header_size;
t[2] = null;
var n = r.default.read_str_inbuf(e, o);
null.uname = n[0];
o = n[1];
null.usex = r.default.read_int16(e, o);
o += 2;
return t;
});
n.default.reg_decoder(1, 4, function(e) {
var t = {};
t[0] = r.default.read_int16(e, 0);
t[1] = r.default.read_int16(e, 2);
var o = r.default.header_size;
t[2] = null;
var n = r.default.read_str_inbuf(e, o);
null.uname = n[0];
o = n[1];
null.usex = r.default.read_int16(e, o);
o += 2;
return t;
});
n.default.reg_encoder(1, 1, function(e, t, o) {
var n = o.uname.utf8_byte_len(), _ = r.default.header_size + 2 + n + 2, s = r.default.alloc_DataView(_), i = r.default.write_cmd_header_inbuf(s, e, t);
i = r.default.write_str_inbuf(s, i, o.uname, n);
r.default.write_int16(s, i, o.usex);
return s;
});
n.default.reg_decoder(1, 1, r.default.decode_status_cmd);
n.default.reg_encoder(1, 2, r.default.encode_empty_cmd);
n.default.reg_decoder(1, 2, r.default.decode_status_cmd);
n.default.reg_encoder(1, 5, r.default.encode_str_cmd);
n.default.reg_decoder(1, 5, function(e) {
var t = {};
t[0] = r.default.read_int16(e, 0);
t[1] = r.default.read_int16(e, 2);
var o = r.default.header_size, n = {}, s = r.default.read_int16(e, o);
o += 2;
n[0] = s;
t[2] = n;
if (s != _.OK) return t;
var i = r.default.read_str_inbuf(e, o);
n[1] = i[0];
o = i[1];
n[2] = r.default.read_int16(e, o);
o += 2;
i = r.default.read_str_inbuf(e, o);
n[3] = i[0];
return t;
});
n.default.reg_decoder(1, 6, function(e) {
var t = {};
t[0] = r.default.read_int16(e, 0);
t[1] = r.default.read_int16(e, 2);
var o = r.default.header_size, n = {};
t[2] = n;
var _ = r.default.read_str_inbuf(e, o);
n[0] = _[0];
o = _[1];
n[1] = r.default.read_int16(e, o);
o += 2;
_ = r.default.read_str_inbuf(e, o);
n[2] = _[0];
return t;
});
t.exports = {
stype: 1,
cmd: {
Enter: 1,
Exit: 2,
UserArrived: 3,
UserExit: 4,
SendMsg: 5,
UserMsg: 6
},
respones: _
};
cc._RF.pop();
}, {
"../../modules/proto_man": "proto_man",
"../../modules/proto_tools": "proto_tools"
} ],
ugame: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "30efc9QA31Fwp79SC+baYeD", "ugame");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../utils/utils"), r = function() {
function e() {}
e.guest_login_success = function(e, t, o, n, r) {
this.unick = e;
this.usex = t;
this.uface = o;
this.uvip = n;
this.is_guest = !0;
console.log("guest_login_success : " + r);
if (this.guest_key != r) {
this.guest_key = r;
console.log("guest_key : " + r);
cc.sys.localStorage.setItem("guest_key", r);
}
};
e.edit_profile_success = function(e, t) {
this.unick = e;
this.usex = t;
};
e.save_temp_uname_and_upwd = function(e, t) {
this.uname = e;
this.upwd = t;
};
e.uname_login_success = function(e, t, o, n) {
this.unick = e;
this.usex = t;
this.uface = o;
this.uvip = n;
this.is_guest = !1;
this._save_uname_and_upwd();
};
e.guest_bind_phone_success = function() {
e.is_guest = !1;
this._save_uname_and_upwd();
};
e._save_uname_and_upwd = function() {
var e = {
uname: this.uname,
upwd: this.upwd
}, t = JSON.stringify(e);
cc.sys.localStorage.setItem("uname_upwd", t);
};
e.save_uname_and_upwd = function() {
e.is_guest = !1;
this._save_uname_and_upwd();
};
e.save_user_game_data = function(t) {
console.log("save_user_game_data" + t);
e.game_info = t;
};
e.enter_zone = function(e) {
this.zid = e;
};
e.unick = "";
e.usex = -1;
e.uface = 0;
e.uvip = 0;
e.uname = null;
e.upwd = null;
e.is_guest = !1;
e.guest_key = null;
e.zid = 0;
e.prev_round_data = null;
e.game_info = null;
return e;
}();
o.default = r;
var _ = cc.sys.localStorage.getItem("uname_upwd");
if (_) {
var s = JSON.parse(_);
r.is_guest = !1;
r.uname = s.uname;
r.upwd = s.upwd;
} else {
r.is_guest = !0;
r.guest_key = cc.sys.localStorage.getItem("guest_key");
r.guest_key || (r.guest_key = n.default.random_string(32));
}
console.log("ugame guest_key : " + r.guest_key + " uname_upwd : " + r.uname + " " + r.upwd);
cc._RF.pop();
}, {
"../utils/utils": "utils"
} ],
ulevel: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "78c75dikE5P34k5tP7JnGJV", "ulevel");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.get_level = function(e) {
for (var t = [ 0, 0 ], o = e, n = 0, r = 1; r < this.level_exp.length; r++) {
if (o < this.level_exp[r]) {
t[0] = n;
t[1] = o / this.level_exp[r];
return t;
}
o -= this.level_exp[r];
n = r;
}
t[0] = n;
t[1] = 1;
return t;
};
e.level_exp = [ 0, 1500, 2e3, 2e3, 3e3, 3e3, 4e3, 4e3, 5e3, 5e3, 8e3, 8e3, 8e3, 9e3, 9e3, 9e3 ];
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
utils: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6a880Ox12FCmo0Z7OOzZSKf", "utils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.random_string = function(e) {
for (var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", o = t.length, n = "", r = 0; r < e; r++) n += t.charAt(Math.floor(Math.random() * o));
return n;
};
e.randon_int_str = function(e) {
for (var t = "0123456789".length, o = "", n = 0; n < e; n++) o += "0123456789".charAt(Math.floor(Math.random() * t));
return o;
};
e.random_int = function(e, t) {
var o = e + Math.random() * (t - e + 1);
(o = Math.floor(o)) > t && (o = t);
return o;
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
websocket: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "68bc09AMclMFZ7sC2HyWZGY", "websocket");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./proto_man"), r = function() {
function e() {}
e._on_opened = function(e) {
console.log("ws connect server success");
this.is_connected = !0;
};
e._on_recv_data = function(e) {
var t = e.data;
if (!this.services_handler) return null;
var o = n.default.decode_cmd(this.proto_type, t);
if (!o) return null;
var r = o[0];
this.services_handler[r] && this.services_handler[r](o[0], o[1], o[2]);
};
e._on_socket_close = function(e) {
this.sock && this.sock.close();
};
e._on_socket_err = function(e) {
this.sock.close();
};
e.connect = function(e, t) {
this.sock = new WebSocket(e);
this.sock.binaryType = "arraybuffer";
this.sock.onopen = this._on_opened.bind(this);
this.sock.onmessage = this._on_recv_data.bind(this);
this.sock.onclose = this._on_socket_close.bind(this);
this.sock.onerror = this._on_socket_err.bind(this);
this.proto_type = t;
};
e.send_cmd = function(e, t, o) {
if (!this.sock || !this.is_connected) {
console.log("send_cmd error");
return null;
}
var r = n.default.encode_cmd(this.proto_type, e, t, o);
this.sock.send(r);
};
e.close = function() {
this.is_connected = !1;
if (null !== this.sock) {
this.sock.close();
this.sock = null;
}
};
e.register_services_handler = function(e) {
this.services_handler = e;
};
e.sock = null;
e.services_handler = null;
e.proto_type = null;
e.is_connected = !1;
return e;
}();
o.default = r;
cc._RF.pop();
}, {
"./proto_man": "proto_man"
} ],
world_rank: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e22fdrwfLlNv4oB9Ft5fcIc", "world_rank");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../protobufs/game_system"), r = cc._decorator, _ = r.ccclass, s = r.property, i = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.not_in_rank = null;
t.my_rank_label = null;
t.rank_item_prefab = null;
t.content = null;
return t;
}
t.prototype.start = function() {
n.default.get_world_rank_info();
};
t.prototype.show_world_rank = function(e, t) {
for (var o = 0; o < t.length; o++) {
var n = t[o], r = cc.instantiate(this.rank_item_prefab);
r.parent = this.content;
r.getComponent("rank_item").show_rank_info(o + 1, n[0], n[1], n[2], n[3]);
}
if (e <= 0) {
this.not_in_rank.active = !0;
this.my_rank_label.node.active = !1;
} else {
this.not_in_rank.active = !1;
this.my_rank_label.node.active = !0;
this.my_rank_label.string = "" + e;
}
};
__decorate([ s(cc.Node) ], t.prototype, "not_in_rank", void 0);
__decorate([ s(cc.Label) ], t.prototype, "my_rank_label", void 0);
__decorate([ s(cc.Prefab) ], t.prototype, "rank_item_prefab", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return t = __decorate([ _ ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {
"../protobufs/game_system": "game_system"
} ]
}, {}, [ "extends", "md5", "action_time", "check_box", "frame_anim", "net_connect", "Cmd", "Response", "State", "Stype", "checkout", "chess_disk", "game_prop", "game_scene", "game_seat", "game_show_info", "edit_profile", "friend_ctl", "guest_upgrade", "home_ctl", "home_scene", "login_bonues", "mine_ctl", "rank_item", "system_ctl", "tab_button", "world_rank", "info_interface", "loading", "account_forget", "account_reg", "account_uname_login", "checkhotupdate", "auth", "auth_proto", "five_chess", "five_chess_proto", "game_system", "game_system_proto", "talk_room_proto", "replay_scene", "ugame", "ulevel", "EXDataView", "http", "proto_man", "proto_tools", "websocket", "utils" ]);