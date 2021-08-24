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

    @property([cc.Node])
    arr_Ball: cc.Node[] = [];

    @property(cc.Node)
    button_02: cc.Node = null;

    @property(cc.Node)
    button_down: cc.Node = null;

    @property(cc.Node)
    rotateNode: cc.Node = null;

    @property(cc.Node)
    ball_up: cc.Node = null;

    @property(cc.Node)
    ball_down: cc.Node = null;

    @property(cc.Node)
    redPacketPos: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    @property(cc.Node)
    caidai: cc.Node = null;

    private _isRotate = false;

    private _rotateSpeed = -500;

    onLoad() {
        super.onResize();
        this.shake();

    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.btnRotate();
    }


    update(dt) {
        if (this._isRotate) {
            this.rotateNode.angle += dt * this._rotateSpeed;
        }
    }

    btnRotate() {
        cc.tween(this.button_02)
            .delay(0.5)
            .to(0.5, { angle: -90 })
            .call(() => {
                this.startRotate();
            })
            .start();
    }

    startRotate() {
        this._isRotate = true;
        cc.tween(this.node)
            .delay(3)
            .call(() => {
                this.stopRotate();
            })
            .start();
    }

    stopRotate() {
        this._isRotate = false;
        let obj = Util.randomArray(this.arr_Ball);
        obj.opacity = 0;
        cc.tween(this.ball_up)
            .to(0.5, { scale: 1, opacity: 255 }, { easing: 'fade' })
            .by(0.5, { position: cc.v2(0, 160) })
            .start();
        cc.tween(this.ball_down)
            .to(0.5, { scale: 1, opacity: 255 }, { easing: 'fade' })
            .by(0.5, { position: cc.v2(0, -160) })
            .start();
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.showLight();
                this.showCaidai();
                this.showRedPacket();
            })
            .start();
    }

    showRedPacket() {
        cc.tween(this.redPacket)
            .to(0.5, { scale: 1, opacity: 255 }, { easing: 'fade' })
            .call(() => {
                this.redPacketPos.active = true;
            })
            .start();
    }

    showLight() {
        cc.tween(this.light)
            .to(0.5, { scale: 1, opacity: 255 }, { easing: 'fade' })
            .start();
    }

    showCaidai() {
        cc.tween(this.caidai)
            .to(0.5, { scale: 1, opacity: 255 }, { easing: 'fade' })
            .start();
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

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }
}
