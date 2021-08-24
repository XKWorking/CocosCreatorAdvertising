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
import Util from "./Utils/Util";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    button_down: cc.Node = null;

    @property(cc.Node)
    createPos: cc.Node = null;


    @property(cc.Prefab)
    redPacket: cc.Prefab = null;

    @property(cc.Prefab)
    star: cc.Prefab = null;

    // private arr_RedPacketAnim: sp.Skeleton[] = [];

    private arr_Pos: number[] = [];

    private _beginTime: number = 0;

    private _endingTime: number = 0.5;

    onLoad() {
        super.onResize();
        this.shake();
        for (let i: number = -800; i < 201; i += 10) {
            this.arr_Pos.push(i);
        }
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");

        this.createRedPacket();
    }

    update(dt: number) {
        // this._beginTime += dt;
        // if (this._beginTime >= this._endingTime) {
        //     let num = Util.randomInteger(2, 3);
        //     let anim = this.arr_RedPacketAnim[num];
        //     console.log(anim);
        //     anim.clearTracks();
        //     anim.setAnimation(0, 'texiao02', false);
        //     cc.tween(this.node)
        //         .delay(0.3)
        //         .call(() => {
        //             this.arr_RedPacketAnim.slice(num, 1);
        //             // anim.node.destroy();
        //         })
        //         .start();
        //     this._beginTime = 0;
        // }
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    createRedPacket() {
        let num = Util.randomInteger(0, 1);
        let obj = cc.instantiate(this.redPacket);
        this.createPos.addChild(obj);
        // let anim = obj.getComponent(sp.Skeleton);
        // this.arr_RedPacketAnim.push(anim);
        let index = Util.randomArray(this.arr_Pos);
        obj.setPosition(cc.v2(index, 0));
        this.redPacketMove(obj);
        cc.tween(this.node)
            .delay(0.2)
            .call(() => {
                this.createStar();
            })
            .start();
        if (num == 0) return;

        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                let anim = obj.getComponent(sp.Skeleton);
                anim.clearTracks();
                anim.setAnimation(0, 'texiao02', false);
                anim.setCompleteListener(() => {
                    anim.node.destroy();
                });
            })
            .start();
    }

    createStar() {
        let obj = cc.instantiate(this.star);
        this.createPos.addChild(obj);
        let index = Util.randomArray(this.arr_Pos);
        obj.setPosition(cc.v2(index, 0));
        this.starMove(obj);
        cc.tween(this.node)
            .delay(0.2)
            .call(() => {
                this.createRedPacket();
            })
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

    redPacketMove(redPacketNode: cc.Node) {
        cc.tween(redPacketNode)
            .by(2, { position: cc.v2(1000, 1000) })
            .call(() => {
                // this.arr_RedPacketAnim.shift();
                redPacketNode.destroy();
            })
            .start();
    }

    starMove(starNode: cc.Node) {
        cc.tween(starNode)
            .by(1.5, { position: cc.v2(1000, 1000) })
            .call(() => {
                starNode.destroy();
            })
            .start();
    }
}
