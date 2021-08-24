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

    @property(cc.Node)
    rotatePos: cc.Node = null;

    @property(cc.Node)
    posNode: cc.Node = null;

    @property(cc.Node)
    btn_down: cc.Node = null;

    @property(cc.Prefab)
    redPacket: cc.Prefab = null;

    @property(cc.Prefab)
    gold: cc.Prefab = null;

    private _award: cc.Node[] = [];

    onLoad() {
        super.onResize();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.openRedPacket();
        this.btnShake();
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    openRedPacket() {
        cc.tween(this.rotatePos)
            .to(0.8, { angle: 75 })
            .call(() => {
                this.createGold();
                this.createRedPacket();
            })
            .start();
        cc.tween(this.rotatePos)
            .delay(2.8)
            .call(() => {
                this._award.shift().destroy();
                this._award.shift().destroy();
                this.closeRedPacket();
            })
            .start();
    }

    closeRedPacket() {
        cc.tween(this.rotatePos)
            .to(0.8, { angle: 0 })
            .delay(1)
            .call(() => {
                this.openRedPacket();
            })
            .start();
    }

    createGold() {
        let obj = cc.instantiate(this.gold);
        this.posNode.addChild(obj);
        obj.setPosition(cc.v2(0, -900));
        this._award.push(obj);
    }

    createRedPacket() {
        let obj = cc.instantiate(this.redPacket);
        this.posNode.addChild(obj);
        obj.setPosition(cc.v2(0, -900));
        this._award.push(obj);
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
