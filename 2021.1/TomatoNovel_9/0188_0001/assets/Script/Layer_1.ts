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
import PoolManager from "./Manager/PoolManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    button_down: cc.Node = null;

    @property(cc.Node)
    redPackets: cc.Node = null;

    @property(cc.Node)
    stars: cc.Node = null;


    @property(cc.Prefab)
    redPacket: cc.Prefab = null;

    @property(cc.Prefab)
    star: cc.Prefab = null;

    onLoad() {
        super.onResize();
        this.shake();
        this.createObj();
        this.schedule(this.createObj, 1.5);
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    createObj() {
        this.createRedPacket();
        this.createStar();
    }

    createRedPacket() {
        let obj = PoolManager.instance.getNode(this.redPacket, this.redPackets);
        obj.setPosition(cc.v2(500, 700));
        this.redPacketMove(obj);
    }

    createStar() {
        let obj = cc.instantiate(this.star);
        this.stars.addChild(obj);
        obj.setPosition(cc.v2(500, 700));
        this.starMove(obj);
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

    redPacketMove(redPacketNode: cc.Node) {
        cc.tween(redPacketNode)
            .to(2, { position: cc.v2(-800, -700) })
            .call(() => { redPacketNode.destroy() })
            .start();
    }

    starMove(starNode: cc.Node) {
        cc.tween(starNode)
            .to(1.5, { position: cc.v2(-800, -700) })
            .call(() => { starNode.destroy() })
            .start();
    }
}
