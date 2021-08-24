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


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {


    @property(cc.Node)
    btn_down: cc.Node = null;

    @property(sp.Skeleton)
    tree: sp.Skeleton = null;

    @property([cc.Node])
    arr_RedPackets: cc.Node[] = [];

    onLoad() {
        super.onResize();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.showBtnShake();
        this.showTreeShake();

    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    update(dt: number) {

    }

    showTreeShake() {
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.showRedPacketDown();
            })
            .start();
        this.tree.setAnimation(0, 'texiao', false);
    }

    showRedPacketDown() {
        cc.tween(this.arr_RedPackets[0])
            .by(1.5, { position: cc.v2(0, -1000), easing: 'quadIn' })
            .to(0.1, { opacity: 0 })
            .by(0.1, { position: cc.v2(0, 1000) })
            .start();
        cc.tween(this.arr_RedPackets[1])
            .delay(0.4)
            .by(1.5, { position: cc.v2(0, -1000), easing: 'quadIn' })
            .to(0.1, { opacity: 0 })
            .by(0.1, { position: cc.v2(0, 1000) })
            .start();
        cc.tween(this.arr_RedPackets[2])
            .delay(0.8)
            .by(1.5, { position: cc.v2(0, -1000), easing: 'quadIn' })
            .to(0.1, { opacity: 0 })
            .by(0.1, { position: cc.v2(0, 1000) })
            .start();
        cc.tween(this.arr_RedPackets[3])
            .delay(1.2)
            .by(1.5, { position: cc.v2(0, -1000), easing: 'quadIn' })
            .to(0.1, { opacity: 0 })
            .by(0.1, { position: cc.v2(0, 1000) })
            .start();
        cc.tween(this.arr_RedPackets[4])
            .delay(1.6)
            .by(1.5, { position: cc.v2(0, -1000), easing: 'quadIn' })
            .to(0.1, { opacity: 0 })
            .by(0.1, { position: cc.v2(0, 1000) })
            .start();
        cc.tween(this.arr_RedPackets[5])
            .delay(2)
            .by(1.5, { position: cc.v2(0, -1000), easing: 'quadIn' })
            .to(0.1, { opacity: 0 })
            .by(0.1, { position: cc.v2(0, 1000) })
            .call(() => {
                this.arr_RedPackets.forEach((temp) => {
                    temp.opacity = 255;
                });
                this.showTreeShake();
            })
            .start();
    }

    showBtnShake() {
        cc.tween(this.btn_down)
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
