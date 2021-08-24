// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:

import BaseLayer from "./Base/BaseLayer";
import { globalData, GetViewW } from "./Config/SystemConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Banner extends BaseLayer {

    @property(cc.Node)
    img_bg: cc.Node = null;

    @property(cc.Size)
    size = cc.size(720, 1280);
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onResize();

        this.resizeBanner();

        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.resizeBanner();
        });
    }

    resizeBanner() {
        this.img_bg.width = GetViewW() + GetViewW() * globalData.scale;
        this.img_bg.parent.y = -this.size.height * 0.5 + this.img_bg.height * globalData.scale * 0.5;
    }

    // update (dt) {}
}
