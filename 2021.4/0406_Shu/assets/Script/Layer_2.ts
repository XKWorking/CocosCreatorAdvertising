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
import Util from "./Utils/Util";
import AudioManager from "./Manager/AudioManager";
import Layer_1 from "./Layer_1";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {
    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    //-------------------------------------------------
    private _goldScore: number = 0;
    public get goldScore(): number {
        return this._goldScore;
    }
    public set goldScore(value: number) {
        this._goldScore = Math.floor(value) / 10;
        this.label_Gold.string = this._goldScore.toString();
    }

    onLoad() {
        super.onResize();

    }

    protected start() {
        this.btn_DownLoad.on("click", () => {
            AudioManager.play('click');
            CpSDK.ClickFinishDownloadBar(1, "显示红包界面按钮");
        }, this);
        this.ShowSlef();
        this.ShowScore();
        CpSDK.EnterSection(2, "显示红包界面");
    }

    update(dt) {
    }

    private ShowSlef() {
        cc.tween(this.node)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .call(() => {

            })
            .start();
    }

    private ShowScore() {
        let score = 1034;
        cc.tween<Layer_2>(this)
            .to(0.5, { goldScore: score })
            .start();
    }

    public ClickClose() {
        LayerManger.Instance.GetLayer(Layer_1).GameOver();
        this.node.active = false;
    }
}
