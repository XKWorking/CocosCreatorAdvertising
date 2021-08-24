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
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    endLight: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    btn_Again: cc.Node = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;
    //===================================================

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
        this.ShowRedPacket();
        this.ShowEndLight();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    public InitGame() {
        AudioManager.play("gameOver");
        this.ShowRedPacket();
        this.ShowEndLight();
        CpSDK.EnterSection(4, "结束界面");
    }

    private ShowRedPacket() {
        AudioManager.play("gameOver");
        cc.tween(this.redPacket)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                this.ShowScore();
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

    public ClickDownLoadBtn() {
        AudioManager.play("click");
        CpSDK.ClickFinishDownloadBar(1, "结束下载按钮");
    }

    public ClickAgainGame() {
        AudioManager.play("click");
        this.node.active = false;
        this.redPacket.scale = 0;
        this.endLight.opacity = 0;
        this.endLight.stopAllActions();
        this.endLight.angle = 0;
        this.btn_Again.active = false;
        this.ChangeDownLoadButtonPosition();
        this.goldScore = 0;
        GlobalData.instance.SetGolsScore(0);
        LayerManger.Instance.GetLayer(Layer_1).AgainGame();
    }

    private ChangeDownLoadButtonPosition() {
        let pos_1: cc.Vec2 = this.btn_DownLoad.getPosition();
        let pos_2: cc.Vec2 = this.btn_Again.getPosition();
        this.btn_DownLoad.setPosition(pos_1.x, (pos_1.y + pos_2.y) / 2);
    }

    public ShowScore() {
        let score: number = GlobalData.instance.GetGoldScore();
        cc.tween<Layer_2>(this)
            .to(0.5, { goldScore: score })
            .start();
    }
}
