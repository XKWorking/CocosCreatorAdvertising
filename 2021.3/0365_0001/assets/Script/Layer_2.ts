// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PopupPanel from "./Panel/PopupPanel";
import LayerManger from "./Manager/LayerManger";
import CpSDK from "./CpTool/SDK/CpSDK";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    onLoad() {
        super.onResize();

    }

    protected start() {

        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        this.showNode(this.redPacket, false);
        this.showNode(this.light, true);
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    /**
     * 显示放大缓动
     */
    private showNode(node: cc.Node, isDelay: boolean) {
        let t = cc.tween;
        t(node)
            .parallel(
                t().to(0.5, { opacity: 255 }, { easing: 'fade' }),
                t().to(0.5, { scale: 1 })
            )
            .call(() => {
                if (isDelay) {
                    this.rotationLight();
                }
            })
            .start();
    }

    private rotationLight() {
        cc.tween(this.light)
            .by(3, { angle: -360 })
            .repeatForever()
            .start();
    }
}
