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

    @property([sp.Skeleton])
    arr_RedPacket: sp.Skeleton[] = [];

    @property([cc.Node])
    arr_Zi: cc.Node[] = [];

    @property([cc.Node])
    arr_Gold: cc.Node[] = [];

    private _index = 0;

    private num_1: number[] = [];

    private num_2: number[] = [];
    onLoad() {
        super.onResize();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");

        for (let i: number = 0; i < 3; i++) {
            this.num_2.push(i);
        }
        this.showTime();
    }

    initRedPacket() {
        this.arr_Zi.forEach((temp) => {
            temp.active = true;
        });

        this.arr_RedPacket.forEach((temp) => {

            temp.clearTracks();
            temp.setAnimation(0, 'texiao01', true);
        });

        cc.tween(this.node)
            .delay(1)
            .call(() => {
                this.showTime();
            })
            .start();
    }

    showTime() {
        if (this.num_1.length >= 8) {
            this.initRedPacket();
            this.num_1 = [];
            return;
        }
        while (this.num_1.includes(this._index)) {
            console.log(this.num_1.includes(this._index));
            this._index = Util.randomInteger(0, 7);
        }
        this.num_1.push(this._index);
        let obj = this.arr_RedPacket[this._index];
        cc.tween(this.arr_Gold[this._index])
            .delay(1)
            .to(0.5, { opacity: 255 })
            .start();
        this.arr_Zi[this._index].active = false;
        obj.clearTracks();
        obj.setAnimation(0, 'texiao02', false);
        cc.tween(this.arr_Gold[this._index])
            .delay(2)
            .to(0.2, { opacity: 0 })
            .delay(0.3)
            .call(() => {
                this.showTime();
            })
            .start();
        if (this.num_1.length >= 7) return;
        let num = Util.randomArray(this.num_2);
        if (num == 3) {
            while (this.num_1.includes(this._index)) {
                console.log(this.num_1.includes(this._index));
                this._index = Util.randomInteger(0, 7);
            }
            this.num_1.push(this._index);
            let obj = this.arr_RedPacket[this._index];
            cc.tween(this.arr_Gold[this._index])
                .delay(1)
                .to(0.5, { opacity: 255 })
                .start();
            this.arr_Zi[this._index].active = false;
            obj.clearTracks();
            obj.setAnimation(0, 'texiao02', false);
            cc.tween(this.arr_Gold[this._index])
                .delay(2)
                .to(0.2, { opacity: 0 })
                .delay(0.3)
                .start();

        }
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

}
