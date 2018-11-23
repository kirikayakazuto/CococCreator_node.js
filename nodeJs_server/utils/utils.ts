
export default class utils {
    static random_string(len: number): string {
        let $chars: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 

        let maxPos: number = $chars.length;
        let str: string = '';
        for (let i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }

    static random_int_str(len: number): string {
        let $chars:string = '0123456789'; 
        let maxPos = $chars.length;
        let str: string = '';
        for(let i=0; i<len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }

    static random_int(begin: number, end: number): number {
        let num: number = begin + Math.random() * (end - begin + 1);
        num = Math.floor(num);
        if (num > end) {
            num = end;
        }
        return num;
    }
    // 返回当前的时间戳
    static timestamp(): number {
        let date = new Date();
        let time = Date.parse(date.toString());

        time /= 1000;
        return time;
    }
    // 
    static timestamp2date(time: number): Array<any> {
        let date = new Date();
        date.setTime(time * 1000);
        return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
    }
    // 
    static date2timestamp(strtime: string): number {
        let date = new Date(strtime.replace(/-/g, '/'));
        let time = Date.parse(date.toString());
        return (time/1000);
    }
    // 返回当前的时间戳
    static timestamp_today(): number {
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);

        let time = Date.parse(date.toString());
        time /= 1000;
        return time;
    }
    // 返回昨天的时间戳
    static timestamp_yesterday(): number {
        let time = this.timestamp_today();
        return (time  - 24 * 60 * 60);
    }

    
    static check_params_len(body: any, len: number) {
        if(!body) {
            return false;
        }

        if(body.length == len) {
            return true;
        }

        return false;
    }

}