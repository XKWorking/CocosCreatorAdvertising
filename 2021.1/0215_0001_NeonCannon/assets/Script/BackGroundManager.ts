import { GetViewH, GetViewW } from "./Config/SystemConfig";
import BaseLayer from "./Base/BaseLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BackGroundManager extends BaseLayer {

    @property(cc.Node)
    bg1: cc.Node = null;

    @property(cc.Node)
    bg2: cc.Node = null;

    @property
    moveSpeed: number = 500;



    onLoad() {
        super.onResize();
        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.resizeBg();
        });
        this.resizeBg();
    }

    start() {

    }

    update(dt) {
        this.bg1.y -= this.moveSpeed * dt;
        this.bg2.y -= this.moveSpeed * dt;
        if (this.bg1.y <= -1280) {
            this.bg1.y = 0;
        }
        if (this.bg2.y <= 0) {
            this.bg2.y = 1280;
        }
    }

    resizeBg() {
        if (GetViewW() > GetViewH()) {
            this.bg1.scale = this.bg2.scale = this.node.scale = GetViewW() / GetViewH();
        } else {
            this.node.scale = this.bg1.scale = this.bg2.scale = 1;
            this.node.width = this.bg1.width = this.bg2.width = 1200;
            this.node.height = this.bg2.height = this.bg2.height = GetViewH();
        }
    }
}
