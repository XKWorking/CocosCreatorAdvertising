import PopupPanel from "./Panel/PopupPanel";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";
import { globalData } from "./Config/SystemConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    over: cc.Node = null;

    @property(cc.Animation)
    anim: cc.Animation = null;

    onLoad() {
        super.onResize();
    }

    protected start() {
        AudioManager.play('explode');
        this.btn_DownLoad.on("click", () => {
            AudioManager.play('click');
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);

        let animState = this.anim.play();
        //设置循环模式为Normal
        animState.wrapMode = cc.WrapMode.Normal;
        this.showOver();
        CpSDK.EnterSection(5, "结束界面");
        CpSDK.GameEnd();
    }

    showOver() {
        let t = cc.tween;
        t(this.over)
            .parallel(
                t().to(0.5, { scale: 0.95 }),
                t().to(0.5, { opacity: 255 }, { easing: 'fade' })
            )
            .delay(0.3)
            .call(() => {
                this.anim.node.active = false;
            })
            .start();
    }

}
