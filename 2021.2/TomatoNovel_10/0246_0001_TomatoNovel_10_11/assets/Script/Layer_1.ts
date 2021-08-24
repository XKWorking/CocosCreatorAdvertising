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


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    btn_down: cc.Node = null;

    @property(cc.Node)
    egg: cc.Node = null;

    @property(cc.Node)
    egg_1: cc.Node = null;

    @property(cc.Node)
    egg_2: cc.Node = null;

    @property(cc.Node)
    hammer: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    golds: cc.Node = null;

    @property(cc.Prefab)
    gold: cc.Prefab = null;

    onLoad() {
        super.onResize();
        this.btnShake();
        this.eggShake();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.btnShake();
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    eggShake() {
        cc.tween(this.egg)
            .to(0.1, { angle: 8 })
            .to(0.1, { angle: -8 })
            .to(0.1, { angle: -8 })
            .to(0.1, { angle: 8 })
            .to(0.1, { angle: 0 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .call(() => {
                this.showHammer();
                this.egg_1.opacity = 255;
                this.egg_2.opacity = 255;
                this.egg.opacity = 0;
            })
            .start();
    }

    showHammer() {
        cc.tween(this.hammer)
            .to(0.5, { opacity: 255 })
            .to(0.5, { angle: -90 })
            .to(0.2, { angle: 0 })
            .call(() => {
                this.showEggRotate();
                this.hammerMove();
            })
            .start();
    }

    hammerMove() {
        cc.tween(this.hammer)
            .by(0.5, { position: cc.v2(180, 0) })
            .to(0.1, { opacity: 0, easing: 'fade' })
            .by(0.1, { position: cc.v2(-180, 0) })
            .to(0.2, { angle: -30 })
            .start();
    }

    showEggRotate() {
        let t1 = cc.tween;
        t1(this.egg_1)
            // 同时执行两个 cc.tween
            .parallel(
                t1().to(0.5, { angle: 45 }),
                t1().by(0.5, { position: cc.v2(-100, 0) })
            )
            .to(0.1, { opacity: 0, easing: 'fade' })
            .to(0.1, { angle: 0 })
            .by(0.1, { position: cc.v2(100, 0) })
            .start()
        let t2 = cc.tween;
        t2(this.egg_2)
            // 同时执行两个 cc.tween
            .parallel(
                t2().to(0.5, { angle: -45 }),
                t2().by(0.5, { position: cc.v2(100, 0) })
            )
            .to(0.1, { opacity: 0, easing: 'fade' })
            .to(0.1, { angle: 0 })
            .by(0.1, { position: cc.v2(-100, 0) })
            .start()
            
            this.createGold();
        // cc.tween(this.node)
        //     .delay(0.1)
        //     .call(() => {
        //     })
        //     .start();
    }

    showRedPacket() {
        cc.tween(this.redPacket)
            .delay(0.8)
            .to(0.5, { opacity: 255 })
            .delay(1)
            .call(() => {
                this.redPacket.opacity = 0;
                this.egg.opacity = 255;
                this.eggShake();
            })
            .start();
    }

    createGold() {
        let obj = cc.instantiate(this.gold)
        this.golds.addChild(obj);
        obj.setPosition(cc.v2(0, 0));
        this.showRedPacket();
    }



    btnShake() {
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
