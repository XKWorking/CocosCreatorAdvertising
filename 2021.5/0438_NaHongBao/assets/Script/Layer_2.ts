// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PopupPanel from "./Panel/PopupPanel";
import LayerManger from "./Manager/LayerManger";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    endLight: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    onLoad() {
        super.onResize();
    }

    protected start() {
        AudioManager.play("endGold");
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(1, "结束下载按钮");
        }, this);
        this.ShowRedPacket();
        this.ShowEndLight();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    private ShowRedPacket() {
        cc.tween(this.redPacket)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .start();
    }

    private ShowEndLight() {
        cc.tween(this.endLight)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.endLight)
                    .by(4, { angle: 360 })
                    .union()
                    .repeatForever()
                    .start();
            })
            .start();
    }
}
