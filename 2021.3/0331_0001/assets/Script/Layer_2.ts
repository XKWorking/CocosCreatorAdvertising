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
import CpSDK from "./CpTool/SDK/CpSDK";
import GlobalData from "./GlobalData";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {
    @property(cc.Label)
    label_Score: cc.Label = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(sp.Skeleton)
    scatterFlower: sp.Skeleton = null;

    private _goldScore: number = 0;

    onLoad() {
        super.onResize();
        this.hideNode();
    }

    protected start() {
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        this.showNode(this.node);
        this._goldScore = GlobalData.instance.getScore() / 100;
        this.label_Score.string = 'R' + this._goldScore;

        AudioManager.play('ending');
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }


    showNode(node: cc.Node) {
        node.active = true;
        let t = cc.tween;
        t(node)
            .parallel(
                t().to(0.5, { opacity: 255 }, { easing: 'fade' }),
                t().to(0.5, { scale: 1 }, { easing: 'backOut' })
            )
            .delay(0.3)
            .call(() => {
                this.showRedPacket();
            })
            .start();
    }
    showRedPacket() {
        this.redPacket.active = true;
        this.scatterFlower.node.active = true;
        let t = cc.tween;
        t(this.redPacket)
            .parallel(
                t().to(0.5, { opacity: 255 }, { easing: 'fade' }),
                t().to(0.5, { scale: 1 }, { easing: 'backOut' })
            )
            .start();
        this.scatterFlower.clearTracks();
        this.scatterFlower.setAnimation(0, 'texiao', false)
        this.scatterFlower.setCompleteListener(() => {
            this.scatterFlower.node.active = false;
        });
    }
    hideNode() {
        this.node.opacity = 0;
        this.node.scale = 0;
        this.redPacket.opacity = 0;
        this.redPacket.scale = 0;
    }

}
