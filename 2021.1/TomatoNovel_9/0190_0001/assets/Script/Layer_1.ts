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
    btn_want: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    gold: cc.Prefab = null;


    @property(cc.Node)
    redPacketPos: cc.Node = null;

    @property(cc.Prefab)
    redPacket: cc.Prefab = null;

    @property(cc.SpriteFrame)
    arr_Sprite: cc.SpriteFrame[] = [];

    private num: number = 0;

    private arr_Node: cc.Node[] = [];

    onLoad() {
        super.onResize();

    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.wantRedPacket();
        this.schedule(this.wantRedPacket, 6.5);
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    wantRedPacket() {
        if (this.arr_Node.length != 0) {
            let obj = this.arr_Node.shift();
            obj.destroy();
        }
        cc.tween(this.btn_want)
            .to(0.2, { scale: 0.8 })
            .to(0.2, { scale: 1 })
            .call(() => {
                this.runPos();
                this.schedule(this.runPos, 0.2);
            })
            .start();
    }

    runPos() {
        if (this.num < 20) {
            this.num++;
            let obj = cc.instantiate(this.gold);
            this.content.addChild(obj);
            obj.setPosition(cc.v2(-300, 0));
            let sp = obj.getComponent(cc.Sprite);
            sp.spriteFrame = Util.randomArray(this.arr_Sprite);
            cc.tween(obj)
                .to(0.7, { position: cc.v2(300, 0) })
                .call(() => {
                    obj.destroy();
                })
                .start();
        } else {
            this.num = 0;
            let obj = cc.instantiate(this.gold);
            this.content.addChild(obj);
            obj.setPosition(cc.v2(-300, 0));
            let sp = obj.getComponent(cc.Sprite);
            sp.spriteFrame = Util.randomArray(this.arr_Sprite);
            cc.tween(obj)
                .to(0.7, { position: cc.v2(0, 0) })
                .call(() => {
                    this.createRedPacket();
                    this.arr_Node.push(obj);
                })
                .start();
            this.unschedule(this.runPos);
        }
    }

    createRedPacket() {
        AudioManager.play('scatterGold');
        let obj_1 = cc.instantiate(this.redPacket);
        this.redPacketPos.addChild(obj_1);
        obj_1.setPosition(cc.v2(-205, -45));
        let obj_2 = cc.instantiate(this.redPacket);
        this.redPacketPos.addChild(obj_2);
        obj_2.scaleX = -1;
        obj_2.setPosition(cc.v2(250, -45));
    }
}
