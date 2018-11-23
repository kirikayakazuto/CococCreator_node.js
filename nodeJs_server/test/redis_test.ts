import * as redis from "redis";
import {user_info} from "../apps/info_interface"
let client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    db: 0,
});

/* client.set("class_key", "123456");
client.get("class_key", (error, data) => {
    if(error) {
        return ;
    }
    console.log(data);
});

client.hmset("015_class", {
    uname: "kirito",
    upwd: "123",
    uemail: "1099263878@qq.com",
}, (error) => {
    if(error) {
        return ;
    }
});

client.hgetall("015_class", (error, data) => {
    if(error) {
        return ;
    }
    console.log(data);
}); */

client.on("error", (error) => {
    console.log(error);
});

// 存储用户信息
function set_uinfo_in_redis(uid: number, uinfo: user_info) {
    if(client == null) {
        
        return ;
    }
    let user_info: {} = uinfo;
    let key: string = "redis_center_user_uid_" + uid;
    
    client.hmset(key, user_info, (error) => {
        if(error) {
            
        }
    });
}
// 获取用户信息
function get_uinfo_in_redis(uid: number, callback) {
    if(client == null) {
        
        return ;
    }
    let key: string = "redis_center_user_uid_" + uid;
    client.hgetall(key, (error, data) => {
        if(error) {
            
            return ;
        }  
        let uinfo = make_value_string_to_number(data);
        callback(1, uinfo);
    });
}  

function make_value_string_to_number(data): {} {
    let uinfo = {};
    for(let key in data) {
        if(key == "uface" ||
            key == "usex" ||
            key == "uvip" ||
            key == "is_guest") {
                uinfo[key] = parseInt(data[key]);
        }else {
            uinfo[key] = data[key];
        }
    }
    return uinfo;
}

set_uinfo_in_redis(1, {
    unick: "kirito",
    uname: "13007253420",
    usex: 0,
    uface: 0,
    uvip: 0,
    is_guest: 0,
});

get_uinfo_in_redis(1, (status: number, data: user_info) => {
    if(status != 1) {
        console.log("error get_uinfo_in_redis");
        return ;
    }

    console.log(data);
});