import ugame from "../ugame";
import ulevel from "../ulevel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    unick: cc.Label = null;
    @property(cc.Label)
    uchip: cc.Label = null;
    @property(cc.Label)
    ulevel: cc.Label = null;
    @property(cc.ProgressBar)
    uexp_process: cc.ProgressBar = null;
    @property(cc.Sprite)
    usex: cc.Sprite = null;
    @property([cc.SpriteFrame])
    usex_sp: Array<cc.SpriteFrame> = [];
    @property(cc.Label)
    uvip: cc.Label = null;

    @property(cc.Node)
    main_list: cc.Node = null;
    @property(cc.Node)
    back: cc.Node = null;
    @property(cc.Label)
    title_label: cc.Label = null;
    // 二级页面
    second_ui: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.sync_info();
    }

    sync_info() {
        this.unick.string = ugame.unick;    
        this.uchip.string = "" + ugame.game_info.uchip;
        this.usex.spriteFrame = this.usex_sp[ugame.usex];
        this.uvip.string = "VIP " + ugame.game_info.uvip;
        
        let ret = ulevel.get_level(ugame.game_info.uexp);
        this.ulevel.string = "LV " + ret[0];
        this.uexp_process.progress = ret[1];
    }

    

    // 显示主ui
    show_main_list() {
        this.back.active = false;
        this.main_list.active = true;
        this.title_label.string = "我";
    }
    hide_main_list(title: string) {
        this.back.active = true;
        this.main_list.active = false;
        this.title_label.string = title;
    }

    go_back() {
        if(this.second_ui != null) {
            this.second_ui.removeFromParent();
            this.second_ui = null;
        }
        this.show_main_list();
    }
    // 进入某个游戏区间块
    on_enter_zone_click(e, zid) {
        zid = parseInt(zid);
        if(zid <=0 || zid > 3) {
            console.log(zid);
            return ;
        }

        ugame.enter_zone(zid);
        cc.director.loadScene("game_scene");
    }

    // update (dt) {}
}
