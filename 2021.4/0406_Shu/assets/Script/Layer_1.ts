// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import BaseLayer from "./Base/BaseLayer";
import Util from "./Utils/Util";
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    collectRedPacketBtn: cc.Node = null;

    @property(cc.Node)
    downLoadBtn: cc.Node = null;

    @property(cc.Node)
    redPacketEndPos: cc.Node = null;

    @property(cc.Node)
    redPacketParent: cc.Node = null;

    @property(sp.Skeleton)
    assimilateEffect: sp.Skeleton = null;

    @property(sp.Skeleton)
    flashEffect: sp.Skeleton = null;

    @property([cc.Node])
    arr_RedPacket: cc.Node[] = [];

    @property([cc.Node])
    arr_OpenRedPacket: cc.Node[] = [];
    // ================================================ //

    private _isGameOver: boolean = false;
    private _goldScore: number = 0;
    private _isClickCollect: boolean = false;
    private _arr_ShakeRedPacket: cc.Node[] = [];



    public get goldScore(): number {
        return this._goldScore;
    }
    public set goldScore(value: number) {
        this._goldScore = Math.floor(value) / 10;
        this.label_Gold.string = this._goldScore.toString();
    }

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.InitGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");

    }

    update(dt: number) {
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }


    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        for (const redPacket of this.arr_RedPacket) {
            redPacket.on("click", () => {
                this.CollectRedPacket();
            }, this);
            let time = Util.random(0.1, 0.5);
            this.showUpDownMove(redPacket, time);
        }
        this.RandomShakeRedPacket();
    }

    /**
     * 随机摇摆红包
     */
    private RandomShakeRedPacket() {
        for (let index = 0; index < 3; index++) {
            let shakeRedPacket = Util.randomArray(this.arr_RedPacket);
            if (this._arr_ShakeRedPacket.includes(shakeRedPacket)) {
                index--;
            } else {
                this._arr_ShakeRedPacket.push(shakeRedPacket);
                this.ShakeRedPacket(shakeRedPacket);
            }
        }
        cc.tween(this.redPacketParent)
            .delay(1.8)
            .call(() => {
                this._arr_ShakeRedPacket = [];
                this.RandomShakeRedPacket();
            })
            .start();
    }
    private ShakeRedPacket(node: cc.Node) {
        cc.tween(node)
            .by(0.1, { angle: 5 })
            .by(0.1, { angle: -5 })
            .by(0.1, { angle: -5 })
            .by(0.1, { angle: 5 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .start();
    }


    /**
     * 收集摇钱树红包
     */
    public CollectRedPacket() {
        if (this._isClickCollect) return;
        CpSDK.FirstTouch();
        AudioManager.play('click');
        this._isClickCollect = true;
        this.redPacketParent.stopAllActions();
        this.redPacketParent.setPosition(cc.v2(0, 0));
        this.ShakeRedPacketParent();
    }


    /**
     * 游戏结束
     */
    public GameOver() {
        if (this._isGameOver) return;
        this._isGameOver = true;
        for (const redPacket of this.arr_OpenRedPacket) {
            redPacket.active = true;
            let time = Util.random(0.1, 0.5);
            this.showUpDownMove(redPacket, time);
        }
        this.downLoadBtn.active = true;
        CpSDK.EnterSection(3, "结束界面");
        CpSDK.GameEnd();
    }


    /**
     * 左右抖动效果
     */
    private ShakeRedPacketParent() {
        cc.tween(this.redPacketParent)
            .by(0.02, { position: cc.v3(-30, 0) })
            .by(0.02, { position: cc.v3(30, 0) })
            .by(0.02, { position: cc.v3(30, 0) })
            .by(0.02, { position: cc.v3(-30, 0) })
            .by(0.02, { position: cc.v3(0, 30) })
            .by(0.02, { position: cc.v3(0, -30) })
            .by(0.02, { position: cc.v3(0, -30) })
            .by(0.02, { position: cc.v3(0, 30) })
            .union()
            .repeat(4)
            .call(() => {
                for (const redPacket of this.arr_RedPacket) {
                    cc.tween(redPacket)
                        .to(0.2, { position: this.redPacketEndPos.position })
                        .call(() => {
                            redPacket.active = false;
                        })
                        .start();
                }
                AudioManager.play('assimilate');
                this.assimilateEffect.clearTracks();
                this.assimilateEffect.setAnimation(0, "texiao", false);
                this.assimilateEffect.setCompleteListener(() => {
                    LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                    AudioManager.play('scatter');
                    this.flashEffect.clearTracks();
                    this.flashEffect.setAnimation(0, "texiao", false);
                    this.flashEffect.setCompleteListener(() => {
                        this.ShowScore();
                        this.collectRedPacketBtn.active = false;
                    });
                });
            })
            .start();
    }

    public ClickGameInterfaceDownLoad() {
        AudioManager.play('click');
        CpSDK.ClickFinishDownloadBar(2, "结束界面下载按钮");
    }

    /**
     * 显示上下移动效果
     */
    private showUpDownMove(node: cc.Node, time: number) {
        cc.tween(node)
            .delay(time)
            .call(() => {
                cc.tween(node)
                    .by(0.5, { position: cc.v3(0, -15) })
                    .delay(0.3)
                    .by(0.5, { position: cc.v3(0, 15) })
                    .delay(0.5)
                    .union()
                    .repeatForever()
                    .start();
            })
            .start();
    }

    /**
     * 实现数字增长效果
     */
    private ShowScore() {
        let score = 1034;
        cc.tween<Layer_1>(this)
            .to(0.5, { goldScore: score })
            .start();
    }
}
