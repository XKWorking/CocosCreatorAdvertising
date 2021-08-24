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

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(sp.Skeleton)
    middleScatterFlower: sp.Skeleton = null;
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
        AudioManager.play("success");
        this.ShowScatterFlower();
        this.ShowRedPacket();
        this.ShowEndLight();
        this.ShowScore();
        CpSDK.EnterSection(2, "第一次玩的结束界面");
        CpSDK.GameEnd();
    }

    public InitLayer_2() {
        AudioManager.play("success");
        this.ShowScatterFlower();
        this.ShowRedPacket();
        this.ShowEndLight();
        this.ShowScore();
        CpSDK.EnterSection(4, "再玩一次的结束界面");
    }

    private ShowScatterFlower() {
        this.middleScatterFlower.node.active = true;
        this.middleScatterFlower.clearTracks();
        this.middleScatterFlower.setAnimation(0, "texiao", false);
        this.middleScatterFlower.setCompleteListener(() => {
            this.middleScatterFlower.node.active = false;
        });
    }

    private ShowRedPacket() {
        cc.tween(this.redPacket)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
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

    private ShowScore() {
        let score: number = GlobalData.instance.GetGameScore();// 29;//
        cc.tween<Layer_2>(this)
            .to(0.8, { goldScore: score })
            .start();
    }

    public ClickDownLoadBtn() {
        CpSDK.ClickFinishDownloadBar(1, "结束下载按钮");
        this.btn_DownLoad.getComponent(cc.Button).enabled = false;
        cc.tween(this.btn_DownLoad)
            .to(0.3, { scale: 0.8 })
            .to(0.3, { scale: 1 })
            .call(() => {
                this.btn_DownLoad.getComponent(cc.Button).enabled = true;
            })
            .start();
    }

    public ClickAgainGameBtn(event) {
        this.node.active = false;
        let btn_AgainGame: cc.Node = event.target;
        let offsetY: number = btn_AgainGame.y - this.btn_DownLoad.y;
        this.btn_DownLoad.y += offsetY;
        btn_AgainGame.active = false;
        this.redPacket.scale = 0;
        this.endLight.opacity = 0;
        LayerManger.Instance.GetLayer(Layer_1).AgainGame();
    }
}
