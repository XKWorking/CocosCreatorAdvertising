// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseLayer from "./Base/BaseLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Background extends BaseLayer {

    @property(cc.Node)
    img_Bg_1: cc.Node = null;

    @property(cc.Node)
    bgParent: cc.Node = null;

    @property(cc.Prefab)
    pre_Bg: cc.Prefab = null;

    @property(cc.Node)
    img_Mount_1: cc.Node = null;

    @property(cc.Node)
    img_Mount_2: cc.Node = null;

    @property(cc.Node)
    img_Beach_1: cc.Node = null;

    @property(cc.Node)
    img_Beach_2: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    private moveSpeed_1: number = 300;
    private moveSpeed_2: number = 360;

    onLoad() {

    }

    start() {
        for (let index = 0; index < 10; index++) {
            this.CreateBg();
        }

    }

    update(dt) {
        this.img_Bg_1.x += dt * this.moveSpeed_1;
        // this.img_Bg_2.x += dt * this.moveSpeed_1;
        this.img_Mount_1.x += dt * this.moveSpeed_2;
        this.img_Mount_2.x += dt * this.moveSpeed_2;

        // if (this.img_Bg_1.x >= 1270) {
        //     this.img_Bg_1.x = -1280;
        // }
        // if (this.img_Bg_2.x >= 1270) {
        //     this.img_Bg_2.x = -1280;
        // }
        if (this.img_Mount_1.x >= 1280) {
            this.img_Mount_1.x = -1280;
        }
        if (this.img_Mount_2.x >= 1280) {
            this.img_Mount_2.x = -1280;
        }

    }


    public SetBgMoveSpeed(value: number) {
        this.moveSpeed_1 = value;
        this.moveSpeed_2 = Math.floor(value * 1.2);
    }

    private CreateBg() {
        let obj = cc.instantiate(this.pre_Bg);
        obj.setParent(this.bgParent);
    }

}
