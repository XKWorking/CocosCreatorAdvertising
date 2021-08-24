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
    endLight: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Label)
    label_Gold = null;
    //-------------------------------------------------
    private _goldScore: number = 0;
    public get goldScore(): number {
        return this._goldScore;
    }
    public set goldScore(value: number) {
        this._goldScore = Math.floor(value);
        this.label_Gold.string = this._goldScore.toString();
    }

    onLoad() {
        super.onResize();

    }

    protected start() {
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(1, "结束下载按钮");
        }, this);
        this.ShowRedPacket();
        this.ShowEndLight();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    private ShowRedPacket() {
        cc.tween(this.redPacket)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                this.ShowScore();
                this.ShakeRedPacket();
            })
            .start();
    }

    private ShowEndLight() {
        cc.tween(this.endLight)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.endLight)
                    .by(4, { angle: 360 })
                    .union()
                    .repeatForever()
                    .start();
            })
            .start();
    }

    private ShakeRedPacket() {
        cc.tween(this.redPacket)
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

    private ShowScore() {
        // let score: number = 29;//LayerManger.Instance.GetLayer(Layer_1).GetGoldScore();
        cc.tween<Layer_2>(this)
            .to(0.5, { goldScore: 29 })
            .start();
    }
}
