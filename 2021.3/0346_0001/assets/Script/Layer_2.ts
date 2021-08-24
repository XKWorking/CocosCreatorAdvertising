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
import GlobalData from "./GlobalData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    onLoad() {
        super.onResize();
    }

    protected start() {
        this.showNode(this.node);
        this.showRedPacket();
        this.btn_DownLoad.on("click", () => {
            AudioManager.play('click');
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        this.label_Gold.string = GlobalData.instance.getScore().toString();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    private showNode(node: cc.Node) {
        node.active = true;
        let t = cc.tween;
        t(node)
            .parallel(
                t().to(0.5, { opacity: 255 }, { easing: 'fade' }),
                t().to(0.5, { scale: 1 }, { easing: 'backOut' })
            )
            .start();
    }
    private showRedPacket() {
        let t = cc.tween;
        t(this.redPacket)
            .parallel(
                t().to(0.6, { opacity: 255 }, { easing: 'fade' }),
                t().to(0.6, { scale: 1.2 }, { easing: 'backOut' })
            )
            .start();
        t(this.redPacket)
            .delay(0.6)
            .to(0.1, { scale: 1 }, { easing: 'backOut' })
            .start();
    }
}
