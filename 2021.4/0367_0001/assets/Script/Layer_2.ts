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
    endLight: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    onLoad() {
        super.onResize();

    }

    protected start() {

        this.showEndLight();
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    /**
     * 红包和光效渐现放大
     */
    private showEndLight() {
        let t = cc.tween;
        t(this.endLight)
            .parallel(
                t().to(0.5, { opacity: 255 }, { easing: 'fade' }),
                t().to(0.5, { scale: 1 },{easing:'backOut'})
            )
            .call(() => {
                this.shake(this.redPacket);
            })
            .start();
    }

    /**
     * 摇晃缓动
     * @param node 摇晃的节点
     */
    private shake(node: cc.Node) {
        cc.tween(node)
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
}
