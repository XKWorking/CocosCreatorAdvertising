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

    @property(sp.Skeleton)
    openRedPacket: sp.Skeleton = null;

    @property(cc.Prefab)
    redPacket: cc.Prefab = null;

    @property(cc.Prefab)
    gold: cc.Prefab = null;

    @property(cc.Prefab)
    logo: cc.Prefab = null;

    @property(cc.Node)
    createPos: cc.Node = null;

    private arr_Obj: cc.Node[] = [];

    private arr_Logo: cc.Node[] = [];
    onLoad() {
        super.onResize();
        this.schedule(this.playAnim, 4);
        this.createLogo();
        this.scheduleOnce(this.createRedPacket, 2.2);
        this.scheduleOnce(this.createGold, 2.2);
        this.scheduleOnce(this.destroyObj, 4);
        this.scheduleOnce(this.destroyLogo, 4);
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
    }

    playAnim() {
        this.createLogo();
        this.scheduleOnce(this.createRedPacket, 2.2);
        this.scheduleOnce(this.createGold, 2.2);
        this.openRedPacket.clearTracks();
        this.openRedPacket.setAnimation(0, "texiao", false);
        this.openRedPacket.setCompleteListener(() => {
            this.destroyObj();
            this.destroyLogo();
        })
    }

    createLogo() {
        let logo = cc.instantiate(this.logo);
        this.createPos.addChild(logo);
        logo.setPosition(cc.v2(0, -910));
        this.arr_Logo.push(logo);
        cc.tween(logo)
            .by(0.16, { position: cc.v2(0, 650) })
            .delay(2.2)
            .to(1.2, { opacity: 0 })
            .start();
    }

    createRedPacket() {
        AudioManager.play('scatterGold');
        let pack = cc.instantiate(this.redPacket);
        this.createPos.addChild(pack);
        pack.setPosition(cc.v2(0, 0));
        this.arr_Obj.push(pack);
        cc.tween(pack)
            .to(1.2, { opacity: 0 })
            .start();
    }

    createGold() {
        let gold = cc.instantiate(this.gold);
        this.openRedPacket.node.addChild(gold);
        gold.setPosition(cc.v2(0, 0));
        cc.tween(gold)
            .to(1.2, { opacity: 0 })
            .start();
    }

    destroyObj() {
        let objNode = this.arr_Obj.shift();
        objNode.destroy();
    }

    destroyLogo() {
        let objNode = this.arr_Logo.shift();
        objNode.destroy();
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }
}
