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
    btn_down: cc.Node = null;

    @property(cc.Node)
    rotateNode: cc.Node = null;

    @property(cc.Node)
    redPacketPos: cc.Node = null;

    @property(cc.Prefab)
    redPacket: cc.Prefab = null;


    // private _isCreate = false;

    private _isRotate = false;

    private _beginTime = 0;

    private _endingTime = 2;

    private _angle = 0;


    onLoad() {
        super.onResize();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.showBtnShack();
        this.showRotate();
        // this.showRedPacket();
    }

    update(dt: number) {
        if (this._isRotate) {
            this._beginTime += dt;
            this.rotateNode.angle -= 180;
            if (this._beginTime >= this._endingTime) {
                this._beginTime = 0;
                this._angle = this.rotateNode.angle % 360;
                if (this._angle == 0) {
                    this.showRedPacket();
                } else {
                    this.showFade();
                }
                this._isRotate = false;
            }
        }
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    showRotate() {
        this._endingTime = Util.random(1, 2.5);
        this._isRotate = true;
    }

    showRedPacket() {
        let obj = cc.instantiate(this.redPacket);
        this.redPacketPos.addChild(obj);
        obj.setPosition(cc.v2(0, 0));
        cc.tween(this.node)
            .delay(1.5)
            .call(() => {
                this.rotateNode.angle = 0;
                this.showRotate();
            })
            .start();
    }

    showFade() {
        let t = cc.tween;
        t(this.rotateNode)
            .delay(1)
            .parallel(
                t().to(0.5, { scale: 10 }),
                t().to(0.5, { opacity: 0, easing: 'fade' })
            )
            .call(() => {
                this.rotateNode.scale = 0.9;
                this.rotateNode.opacity = 255;
                this.rotateNode.angle = 0;
                this.showRotate();
            })
            .start();
    }

    showBtnShack() {
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
