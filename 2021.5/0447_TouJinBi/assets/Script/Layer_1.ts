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
import GiftBox from "./GiftBox";
import PoolManager from "./Manager/PoolManager";
import CastGold from "./CastGold";
import GlobalData from "./GlobalData";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    top_GiftBoxParent: cc.Node = null;

    @property(cc.Node)
    giftBoxMiddleParent: cc.Node = null;

    @property(cc.Node)
    giftBoxEndParent: cc.Node = null;

    @property(cc.Node)
    castGoldTargetNode: cc.Node = null;

    @property(cc.Node)
    deskParent: cc.Node = null;

    @property(cc.Node)
    castGoldParent: cc.Node = null;

    @property(cc.Node)
    scoreParent: cc.Node = null;

    @property(cc.Node)
    img_Spring: cc.Node = null;

    @property(cc.Node)
    showGold: cc.Node = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    @property(cc.Prefab)
    pre_Gold: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Score: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Great: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Miss: cc.Prefab = null;

    @property([cc.Prefab])
    arr_GiftBoxs: cc.Prefab[] = [];
    // ================================================ //

    private _isGameOver: boolean = false;
    private _goldScore: number = 0;
    private _isCastGold: boolean = true;
    private _isFirstClickCastGold: boolean = true;
    private _isFirstPlayGame: boolean = true;
    private _springUpTime: number = 0;
    private _boxMoveTime: number = 0;
    private _createGoldNum: number = 0;
    private _currentGiftBox: cc.Node = null;
    private _giftBoxIndex: number = 0;


    public get goldScore(): number {
        return this._goldScore;
    }
    public set goldScore(value: number) {
        this._goldScore = Math.floor(value);
        this.label_Gold.string = "R" + this._goldScore.toString();
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
        this._springUpTime = Math.round(100 / this.castGoldTargetNode.y * 100) / 100;
        this._boxMoveTime = Math.round(this.giftBoxMiddleParent.x / 3) / 100;
        // this.CreateGiftBox();
    }


    public ClickCastGoldBtn(event) {
        if (!this._isCastGold) return;
        CpSDK.FirstTouch();
        this.HideGoldNode();
        let btn_CastGold: cc.Node = event.target;
        cc.tween(btn_CastGold)
            .to(0.3, { scale: 0.8 })
            .to(0.3, { scale: 1 })
            .call(() => {
            })
            .start();
        let pos: cc.Vec2 = this.deskParent.getPosition();
        this.castGoldParent.setPosition(pos);
        this.CreateGold();
        if (this._isFirstClickCastGold) {
            this._isFirstClickCastGold = false;
            this.guidFinger.active = false;
            this.LeftAndRightMoveDesk();
        }
    }

    /**
     * 显示金币可以投币
     */
    public ShowGoldNode() {
        this._isCastGold = true;
        this.showGold.active = true;
        if (this._createGoldNum >= 5) {
            this.GameOver();
            return;
        }
    }


    /**
     * 隐藏金币不可以投币
     */
    public HideGoldNode() {
        this._isCastGold = false;
        this.showGold.active = false;
    }

    private LeftAndRightMoveDesk() {
        cc.tween(this.deskParent)
            .to(0.5, { x: -200 })
            .to(0.5, { x: 0 })
            .to(0.5, { x: 200 })
            .to(0.5, { x: 0 })
            .union()
            .repeatForever()
            .start();
    }

    private StopDeskMove() {
        this.deskParent.stopAllActions();
    }

    private CreateGold() {
        AudioManager.play("popup");
        this._createGoldNum++;
        let goldNode: cc.Node = PoolManager.instance.getNode(this.pre_Gold, this.castGoldParent);
        goldNode.setPosition(cc.v2(-5, -30));
        goldNode.getComponent(CastGold).InitCastGold();
        cc.tween(this.img_Spring)
            .to(this._springUpTime, { y: 17 })
            .to(0.3, { y: -83 })
            .start();
    }

    public CreateGiftBox() {
        if (this._createGoldNum >= 5) return;
        let giftBox: cc.Node = PoolManager.instance.getNode(this.arr_GiftBoxs[this._giftBoxIndex], this.top_GiftBoxParent);
        giftBox.setPosition(cc.v2(0, 0));
        this._giftBoxIndex++;
        this._giftBoxIndex = this._giftBoxIndex % 3;
        this._currentGiftBox = giftBox;
        cc.tween(giftBox)
            .to(this._boxMoveTime, { position: this.giftBoxMiddleParent.position }, { easing: 'quartOut' })
            .start();
    }

    public GiftBoxMoveEnd() {
        this._currentGiftBox.getComponent(GiftBox).MoveEndPos();
    }

    public CreateScore(isScore: boolean) {
        let scoreNode: cc.Node = null;
        let t = cc.tween;
        if (isScore) {
            scoreNode = PoolManager.instance.getNode(this.pre_Great, this.scoreParent);
            // let scoreNode_1: cc.Node = PoolManager.instance.getNode(this.pre_Score, this.scoreParent);
            // scoreNode_1.setPosition(cc.v2(200, 0));
            // scoreNode_1.opacity = 255;
            // t(scoreNode_1)
            //     .parallel(
            //         t().by(0.5, { y: 200 }),
            //         t().to(0.5, { opacity: 0 })
            //     )
            //     .call(() => {
            //         PoolManager.instance.putNode(scoreNode_1);
            //     })
            //     .union()
            //     .start();
        } else {
            scoreNode = PoolManager.instance.getNode(this.pre_Miss, this.scoreParent);
        }
        scoreNode.setPosition(cc.v2(0, 0));
        scoreNode.opacity = 255;
        t(scoreNode)
            .parallel(
                t().by(0.5, { y: 200 }),
                t().to(0.5, { opacity: 0 })
            )
            .call(() => {
                PoolManager.instance.putNode(scoreNode);
            })
            .union()
            .start();
    }

    /**
     * 游戏结束
     */
    private GameOver() {
        if (this._isGameOver) return;
        this._isGameOver = true;
        this.StopDeskMove();
        if (this._isFirstPlayGame) {
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
        } else {
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            LayerManger.Instance.GetLayer(Layer_2).InitLayer_2();
        }
    }



    public GetGoldScore(): number {
        return this._goldScore;
    }

    public AddGoldScore() {
        // let value: number = Util.randomInteger(10, 66);
        // this._goldScore += value;
        // this.label_Gold.string = "R" + this._goldScore.toString();
        let score: number = this._goldScore + Util.randomInteger(10, 66);//value;
        GlobalData.instance.SetGameScore(score);
        cc.tween<Layer_1>(this)
            .to(0.5, { goldScore: score })
            .start();
    }

    private SetGoldScore(value: number) {
        this._goldScore = value;
        this.label_Gold.string = "R" + this._goldScore.toString();
    }

    public AgainGame() {
        CpSDK.EnterSection(3, "再玩一次的开始界面");
        this._isFirstPlayGame = false;
        this._isGameOver = false;
        this.SetGoldScore(0);
        GlobalData.instance.SetGameScore(0);
        this.deskParent.x = 0;
        this._createGoldNum = 0;
        this._giftBoxIndex = 0;
        this.LeftAndRightMoveDesk();
        this.ShowGoldNode();
        this.CreateGiftBox();
    }


    public GetGiftBoxEndParent(): cc.Node {
        return this.giftBoxEndParent
    }

    public GetBoxMoveTime(): number {
        return this._boxMoveTime
    }
}
