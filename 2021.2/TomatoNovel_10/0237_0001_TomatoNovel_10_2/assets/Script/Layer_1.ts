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
import PoolManager from "./Manager/PoolManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Prefab)
    redPacket: cc.Prefab = null;

    @property(cc.Node)
    redPacketPos: cc.Node = null;

    @property(cc.Node)
    btnRedPacket: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    sprite_RedPacket: cc.Node = null;

    @property(cc.Node)
    btn_down: cc.Node = null;

    private _isCreate: boolean = false;

    private _beginTime: number = 0;

    private _endingTime: number = 3;

    private arr_Node: cc.Node[] = [];
    onLoad() {
        super.onResize();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.showShack();
        this.showFingerClick();
    }

    update(dt: number) {
        if (this._isCreate) {
            this._beginTime += dt;
            if (this._beginTime >= this._endingTime) {
                this.arr_Node.shift().destroy();
                this.showFingerClick();
                this._beginTime = 0;
                this._isCreate = false;
            }
        }
    }

    showFingerClick() {
        this.sprite_RedPacket.opacity = 255;
        cc.tween(this.finger)
            .to(0.5, { scale: 0.7 })
            .to(0.5, { scale: 1 })
            .call(() => {
                this.showOpenRedPacket();
            })
            .start();
    }

    showOpenRedPacket() {
        cc.tween(this.btnRedPacket)
            .to(0.3, { scale: 0.8 })
            .to(0.3, { scale: 1.2 })
            .to(0.3, { scale: 0.8 })
            .to(0.3, { scale: 1.2 })
            .to(0.3, { scale: 0.8 })
            .call(() => {
                this.hideRedPacket();
            })
            .start();
    }

    hideRedPacket() {
        cc.tween(this.sprite_RedPacket)
            .to(0.8, { opacity: 0, easing: 'fade' })
            .call(() => {
                this._isCreate = true;
                this.createRedpacket();
            })
            .start();
    }

    createRedpacket() {
        let obj = cc.instantiate(this.redPacket);
        this.redPacketPos.addChild(obj);
        this.arr_Node.push(obj);
    }

    showShack() {
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

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }
}
