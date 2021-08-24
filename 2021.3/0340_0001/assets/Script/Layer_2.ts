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
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {
    @property(cc.Node)
    shade: cc.Node = null;

    @property(cc.Animation)
    success: cc.Animation = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    onLoad() {
        super.onResize();

    }

    protected start() {
        AudioManager.play('gameOver');
        this.showNode(this.node);

        this.btn_DownLoad.on("click", () => {
            AudioManager.play('click');
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);

        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    showNode(node: cc.Node) {
        node.active = true;
        let t = cc.tween;
        t(node)
            .parallel(
                t().to(0.5, { opacity: 255 }, { easing: 'fade' }),
                t().to(0.5, { scale: 1 }, { easing: 'backOut' })
            )
            .call(() => {
                this.showSuccess();
            })
            .start();
    }
    showSuccess() {
        cc.tween(this.success.node)
            .to(0.3, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                let animState = this.success.play();
                animState.wrapMode = cc.WrapMode.Loop;
                animState.repeatCount = Infinity;
            })
            .start();
        cc.tween(this.shade)
            .to(0.3, { opacity: 80 }, { easing: 'fade' })
            .start();

    }
}
