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
    bg_1: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onResize();
        this.node.scale = 1;
        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.resizeBg();
        });
        this.resizeBg();
    }

    start() {
    }

    resizeBg() {
        if (GetViewW() > GetViewH()) {
            this.bg_1.scale = GetViewW() / GetViewH();
        } else {
            this.node.scale = this.bg_1.scale = 1;
            this.bg_1.width = 1280;
            this.bg_1.height = GetViewH();
        }
    }

}
