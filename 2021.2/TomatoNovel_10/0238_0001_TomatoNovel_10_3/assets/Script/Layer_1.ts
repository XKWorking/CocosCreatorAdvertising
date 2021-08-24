// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import BaseLayer from "./Base/BaseLayer";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";
import Util from "./Utils/Util";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    button_down: cc.Node = null;

    @property(cc.Node)
    cowLaugh: cc.Node = null;

    @property(sp.Skeleton)
    redPacket: sp.Skeleton = null;

    onLoad() {
        super.onResize();
        this.shake();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.cowLaugh.active = false;
        this.showAnim();
    }



    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    showAnim() {
        this.redPacket.clearTracks();
        this.redPacket.setStartListener(() => {
            this.cowLaugh.active = true;
            this.redPacket.node.opacity = 255;
        });
        this.redPacket.setAnimation(0, 'texiao', false);
        this.redPacket.setCompleteListener(() => {
            this.cowLaugh.active = false;
            this.redPacket.node.opacity = 0;
            cc.tween(this.node)
                .delay(1)
                .call(() => {
                    this.showAnim();
                })
                .start();
        });
    }

    shake() {
        cc.tween(this.button_down)
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
