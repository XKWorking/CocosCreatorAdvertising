// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GetViewH, GetViewW } from "./Config/SystemConfig";
import BaseLayer from "./Base/BaseLayer";
import CpSDK from "./CpTool/SDK/CpSDK";
import GoldData from "./GoldData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Background extends BaseLayer {

    @property(cc.Node)
    img_bg: cc.Node = null;

    @property(cc.Node)
    btn_DownLoad_1: cc.Node = null;


    onLoad() {
        super.onResize();
        this.node.scale = 1;

        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.resizeBg();
        });


        this.btn_DownLoad_1.on("click", () => {
            CpSDK.ClickFinishDownloadBar(1, "竖屏游戏界面下载按钮");
        }, this);

        this.resizeBg();
    }

    start() {
    }

    resizeBg() {
        if (GetViewW() > GetViewH()) {
            this.img_bg.scale = GetViewW() / GetViewH();
            GoldData.instance.setIsPortrait(false);
        } else {
            this.node.scale = this.img_bg.scale = 1;
            this.img_bg.width = 1280;
            this.img_bg.height = GetViewH();
            GoldData.instance.setIsPortrait(true);
        }
        this.btn_DownLoad_1.active = true;
    }

}
