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
import Layer_1 from "./Layer_1";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btn: cc.Node = null;

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


        this.btn.on("click", () => {
            CpSDK.ClickArea(1, '立即下载');
            AudioManager.play("click");
        });

        AudioManager.play("win");
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    protected start() {
        this.ShowScore();
    }


    private ShowScore() {
        let score: number = LayerManger.Instance.GetLayer(Layer_1).GetGoldScore();
        cc.tween<Layer_2>(this)
            .to(0.5, { goldScore: score })
            .start();
    }

    // update (dt) {}


    closePanel2() {
        this.CloseForTween();
    }
}
