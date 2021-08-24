// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GetViewH, GetViewW } from "./Config/SystemConfig";
import BaseLayer from "./Base/BaseLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Background extends BaseLayer {

    @property(cc.Node)
    couplet: cc.Node = null;

    @property(cc.Node)
    title: cc.Node = null;

    @property(cc.Node)
    num: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onResize();
    }

    start() {
        cc.tween(this.couplet)
            .by(0.5, { position: cc.v2(0, -830) })
            .call(() => {
                this.viewContent();
            })
            .start();
    }

    viewContent() {
        cc.tween(this.title)
            .to(0.5, { opacity: 255, easing: 'fade' })
            .start();
        cc.tween(this.num)
            .to(0.5, { opacity: 255, easing: 'fade' })
            .call(() => {
                this.closeContent();
            })
            .start();
    }
    closeContent() {
        this.couplet.active = false;
        this.title.active = false;
        this.num.active = false
    }

}
