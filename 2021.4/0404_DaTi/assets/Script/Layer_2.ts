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
import { globalData } from "./Config/SystemConfig";
import Util from "./Utils/Util";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    endLight: cc.Node = null;

    @property(cc.Node)
    img_EndContent: cc.Node = null;

    @property(cc.Label)
    label_GoldScore: cc.Label = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    btn_Again: cc.Node = null;

    @property(cc.Node)
    beginPos: cc.Node = null;

    @property(cc.Node)
    endPos: cc.Node = null;

    //-------------------------------------
    private _goldScore: number = 0;
    public get goldScore(): number {
        return this._goldScore;
    }
    public set goldScore(value: number) {
        this._goldScore = Math.floor(value);
        this.label_GoldScore.string = "$" + this._goldScore;
    }
    private _arr_GoldScore: number[] = [];


    onLoad() {
        super.onResize();
        this._arr_GoldScore.push(1512);
        this._arr_GoldScore.push(2448);
        this._arr_GoldScore.push(4608);
        this._arr_GoldScore.push(13212);
    }

    protected start() {
        this.btn_DownLoad.on("click", () => {
            AudioManager.play("button");
            CpSDK.ClickFinishDownloadBar(1, "结束下载按钮");
        }, this);
        this.ShowResult();
        this.ShowAddScore();
        this.ShowEndLight();
        CpSDK.EnterSection(5, "结束下载或者再测一次界面");
        CpSDK.GameEnd();
    }

    public InitGame() {
        this.node.active = true;
        this.ShowResult();
        CpSDK.EnterSection(10, "结束下载界面");
        CpSDK.GameEnd();
        if (!LayerManger.Instance.GetLayer(Layer_1).GetIsFirst()) {
            let position = cc.v2(this.btn_DownLoad.x, 0);
            position.y = Math.floor((this.btn_Again.position.y - this.btn_DownLoad.position.y) / 2);
            position.y += this.btn_DownLoad.position.y;
            this.btn_DownLoad.setPosition(position);
            this.btn_Again.active = false;
        }
    }

    private ShowResult() {
        cc.tween(this.img_EndContent)
            .to(0.5, { position: this.endPos.position })
            .call(() => {
                this.img_EndContent.parent = this.endPos;
                this.img_EndContent.setPosition(cc.v2(0, 0));
                this.ShowAddScore();
                this.ShowEndLight();
            })
            .start();
    }

    private ShowEndLight() {
        this.endLight.active = true;
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

    /**
     * 再测一次
     */
    public ClickAgainGame() {
        AudioManager.play("button");
        this.endLight.opacity = 0;
        this.endLight.active = false;
        this.endLight.stopAllActions();
        this.goldScore = 0;
        this.node.active = false;
        this.img_EndContent.parent = this.node;
        this.img_EndContent.setPosition(this.endPos.getPosition());
        LayerManger.Instance.GetLayer(Layer_1).AgainGame();

    }



    /**
     * 实现滚动分数效果
     */
    private ShowAddScore() {
        let endGoldScore = Util.randomArray(this._arr_GoldScore);
        cc.tween<Layer_2>(this)
            .to(1, { goldScore: endGoldScore })
            .start();
    }
}
