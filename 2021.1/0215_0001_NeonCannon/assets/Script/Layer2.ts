import CpSDK from "./SDK/CpSDK";
import PopupPanel from "./Panel/PopupPanel";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer2 extends PopupPanel {

    @property(cc.Node)
    img_RedBag: cc.Node = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    onLoad() {
        super.onResize()
    }

    protected start() {
        this.shake(this.img_RedBag);
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickArea(1, "结束下载按钮");
        }, this);
        CpSDK.EnterSection(1, "结束界面");
        CpSDK.GameEnd();
    }
    shake(node: cc.Node) {
        cc.tween(node)
            .by(0.1, { angle: 3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: 3 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }
}

