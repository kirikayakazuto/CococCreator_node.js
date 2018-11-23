import http from "http"
import util from "util"
import log from "../utils/log"

export default class phone_msg {
    static send_phone_chat(phone_num: string, content: string) {
        let cmd_url = "http://api.cnsms.cn/?ac=send&uid=117000&pwd=9A27BF288337541C87D3EE9FE3A18ACA&mobile=%s&content=%s&encode=utf8";
	    content = encodeURI(content);

	    let url = util.format(cmd_url, phone_num, content);
/*
        http.get(url, (incoming_msg) => {
            log.info("respones status " + incoming_msg.statusCode);
            incoming_msg.on("data", function(data) {
                if (incoming_msg.statusCode === 200) {
                    log.info(data.toString());
                }
                else {

                }
            });
        });
*/
    }

    static send_indentify_code(phone_num: string, code: string) {
        let content = "你通过手机号码注册<<鱼乐圈>>账号，验证码为%s,如果不是本人操作，可以不用理会。";
        content = util.format(content, code);
        this.send_phone_chat(phone_num, content);
    }
}