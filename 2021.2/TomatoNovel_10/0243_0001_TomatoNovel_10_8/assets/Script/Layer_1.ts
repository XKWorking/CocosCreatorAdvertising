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
import Util from "./Utils/Util";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    btnScale: cc.Node = null;

    @property([cc.Node])
    arr_RedPacks: cc.Node[] = [];


    onLoad() {
        super.onResize();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.arr_RedPacks.forEach((temp) => {
            temp.opacity = 0;
        })
        this.showBtnScale();
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    showBtnScale() {
        cc.tween(this.btnScale)
            .to(0.3, { scale: 0.6 })
            .to(0.3, { scale: 1 })
            .call(() => {
                this.showRedPacket();
            })
            .start();
    }

    showRedPacket() {
        cc.tween(this.getRedPacket(0))
            .to(0.2, { opacity: 255 })
            .by(0.2, { position: cc.v2(-294, 113) })
            .call(() => {
                cc.tween(this.getRedPacket(1))
                    .to(0.2, { opacity: 255 })
                    .by(0.2, { position: cc.v2(-241, 275) })
                    .call(() => {
                        cc.tween(this.getRedPacket(2))
                            .to(0.2, { opacity: 255 })
                            .by(0.2, { position: cc.v2(-127, 360) })
                            .call(() => {
                                cc.tween(this.getRedPacket(3))
                                    .to(0.2, { opacity: 255 })
                                    .by(0.2, { position: cc.v2(0, 410) })
                                    .call(() => {
                                        cc.tween(this.getRedPacket(4))
                                            .to(0.2, { opacity: 255 })
                                            .by(0.2, { position: cc.v2(127, 360) })
                                            .call(() => {
                                                cc.tween(this.getRedPacket(5))
                                                    .to(0.2, { opacity: 255 })
                                                    .by(0.2, { position: cc.v2(241, 275) })
                                                    .call(() => {
                                                        cc.tween(this.getRedPacket(6))
                                                            .to(0.2, { opacity: 255 })
                                                            .by(0.2, { position: cc.v2(294, 113) })
                                                            .delay(1)
                                                            .call(() => {
                                                                this.hideRedPacket();
                                                            })
                                                            .start();
                                                    })
                                                    .start();
                                            })
                                            .start();
                                    })
                                    .start();

                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    hideRedPacket() {
        cc.tween(this.getRedPacket(0))
            .to(0.2, { position: cc.v2(0, 0) })
            .to(0.2, { opacity: 0 })
            .call(() => {
                cc.tween(this.getRedPacket(1))
                    .to(0.2, { position: cc.v2(0, 0) })
                    .to(0.2, { opacity: 0 })
                    .call(() => {
                        cc.tween(this.getRedPacket(2))
                            .to(0.2, { position: cc.v2(0, 0) })
                            .to(0.2, { opacity: 0 })
                            .call(() => {
                                cc.tween(this.getRedPacket(3))
                                    .to(0.2, { position: cc.v2(0, 0) })
                                    .to(0.2, { opacity: 0 })
                                    .call(() => {
                                        cc.tween(this.getRedPacket(4))
                                            .to(0.2, { position: cc.v2(0, 0) })
                                            .to(0.2, { opacity: 0 })
                                            .call(() => {
                                                cc.tween(this.getRedPacket(5))
                                                    .to(0.2, { position: cc.v2(0, 0) })
                                                    .to(0.2, { opacity: 0 })
                                                    .call(() => {
                                                        cc.tween(this.getRedPacket(6))
                                                            .to(0.2, { position: cc.v2(0, 0) })
                                                            .to(0.2, { opacity: 0 })
                                                            .delay(1)
                                                            .call(() => {
                                                                this.showBtnScale();
                                                            })
                                                            .start();
                                                    })
                                                    .start();
                                            })
                                            .start();
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    getRedPacket(num: number): cc.Node {
        return this.arr_RedPacks[num];
    }

}
