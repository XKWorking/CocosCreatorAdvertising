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


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {
    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    private _goldScore: number = 0;
    public get goldScore(): number {
        return this._goldScore;
    }
    public set goldScore(value: number) {
        this._goldScore = Math.floor(value * 100) / 100;
        this.label_Gold.string = this._goldScore + 'Y';
    }

    onLoad() {
        super.onResize();

    }

    protected start() {
        AudioManager.play('gold');
        this.btn_DownLoad.on("click", () => {
            AudioManager.play('button');
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        this.ShowSlef();
        this.ShowScore();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    update(dt) {
    }

    private ShowSlef() {
        cc.tween(this.node)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                this.ShowFinger();
            })
            .start();
    }

    private ShowFinger() {
        this.finger.parent = this.btn_DownLoad.parent;
        this.finger.setPosition(cc.v2(100, -420));
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.finger.active = true;
                cc.tween(this.finger)
                    .by(0.3, { position: cc.v3(30, -30) })
                    .by(0.3, { position: cc.v3(-30, 30) })
                    .by(0.3, { position: cc.v3(30, -30) })
                    .by(0.3, { position: cc.v3(-30, 30) })
                    .delay(0.3)
                    .union()
                    .repeatForever()
                    .start();

            })
            .start();
    }

    private ShowScore() {
        let score = Util.random(50, 168);
        cc.tween<Layer_2>(this)
            .to(0.5, { goldScore: score })
            .start();
    }

}
