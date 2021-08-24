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
import GlobalData from "./GlobalData";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {
    @property(cc.Node)
    winInterface: cc.Node = null;

    @property(cc.Node)
    winRotateLight: cc.Node = null;

    @property(cc.Node)
    winLogo: cc.Node = null;

    @property(cc.Node)
    failInterface: cc.Node = null;

    @property(cc.Node)
    failRotateLight: cc.Node = null;

    @property(cc.Node)
    failLogo: cc.Node = null;

    @property(cc.Node)
    scatterGold: cc.Node = null;

    @property(cc.Node)
    scatterDiamond: cc.Node = null;

    @property(sp.Skeleton)
    scatterColouredRibbon: sp.Skeleton = null;

    onLoad() {
        super.onResize();
        this.init();
    }

    private init() {

    }

    protected start() {
        this.showSelf();
        CpSDK.EnterSection(5, "游戏结束界面");
        CpSDK.GameEnd();
    }

    private showSelf() {
        let t = cc.tween;
        t(this.node)
            .parallel(
                t().to(0.5, { scale: 1 }, { easing: 'backOut' }),
                t().to(0.5, { opacity: 255 }, { easing: 'fade' })
            )
            .call(() => {
                if (GlobalData.instance.getIsWin()) {
                    AudioManager.play('win');
                    this.scatterDiamond.active = true;
                    this.scatterGold.active = true;
                    this.winInterface.active = true;
                    this.rotateNode(this.winRotateLight);
                    this.scatterColouredRibbon.clearTracks();
                    this.scatterColouredRibbon.setAnimation(0, 'texiao', false);
                    this.scatterColouredRibbon.setCompleteListener(() => {
                        this.scatterColouredRibbon.node.destroy();
                    });
                    this.winLogo.active = true;
                    t(this.winLogo)
                        .delay(0.1)
                        .to(0.6, { scale: 1 }, { easing: 'quartOut' })
                        .start();
                } else {
                    AudioManager.play('fail');
                    this.failInterface.active = true;
                    this.rotateNode(this.failRotateLight);
                    this.failLogo.active = true;
                    t(this.failLogo)
                        .delay(0.1)
                        .to(0.6, { scale: 1 }, { easing: 'quartOut' })
                        .start();
                }
            })
            .start();

    }

    private rotateNode(node: cc.Node) {
        node.active = true;
        cc.tween(node)
            .by(2, { angle: -360 })
            .union()
            .repeatForever()
            .start();
    }

    public clickWinBtn() {
        AudioManager.play('click');
        CpSDK.ClickFinishDownloadBar(1, "成功结束下载按钮");
    }

    public clickFailBtn() {
        AudioManager.play('click');
        CpSDK.ClickFinishDownloadBar(2, "失败结束下载按钮");
    }
}
