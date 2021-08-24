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
import Layer_1 from "./Layer_1";
import GlobalData from "./GlobalData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    btn_AgainGame: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    endLightFx: cc.Node = null;

    @property(cc.Label)
    label_GoldScore: cc.Label = null;

    private _goldScore: number = 0;

    onLoad() {
        super.onResize();

    }

    protected start() {
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(2, "可以再试一次的结束下载按钮");
        }, this);

        this.btn_AgainGame.on("click", () => {
            this.node.active = false;
            GlobalData.instance.setIsOpenLayer_2(false);
            LayerManger.Instance.GetLayer(Layer_1).againGame();
        }, this);
        this.redPacket.scale = 0;
        this._goldScore = LayerManger.Instance.GetLayer(Layer_1).getGoldScore();
        console.log(LayerManger.Instance.GetLayer(Layer_1).getGoldScore());
        this.label_GoldScore.string = this._goldScore.toString();
        this.showRedPacket();
        CpSDK.EnterSection(2, "可以再试一次的结束界面");
        CpSDK.GameEnd();
    }

    showRedPacket() {
        cc.tween(this.redPacket)
            .delay(0.3)
            .to(0.5, { scale: 1.1 }, { easing: 'backOut' })
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                cc.tween(this.endLightFx)
                    .by(2, { angle: -360 })
                    .repeatForever()
                    .start();
            })
            .start();
    }

}
