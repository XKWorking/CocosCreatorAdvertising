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
import PoolManager from "./Manager/PoolManager";
import AudioManager from "./Manager/AudioManager";
import Background from "./Background";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    playerShade: cc.Node = null;

    @property(cc.Node)
    goldBeginPos: cc.Node = null;

    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Node)
    hitEffectParent: cc.Node = null;

    @property(cc.Prefab)
    pre_HitEffect: cc.Prefab = null;

    @property(cc.Node)
    giftParent: cc.Node = null;

    @property(cc.Prefab)
    pre_GiftBox: cc.Prefab = null;

    @property(cc.Prefab)
    pre_GiftGold: cc.Prefab = null;

    @property(cc.Node)
    clickEffectParent: cc.Node = null;

    @property(cc.Prefab)
    pre_ClickEffect: cc.Prefab = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    fistGift: cc.Node = null;

    @property(cc.Button)
    btn_PlayerJump: cc.Button = null;

    @property([cc.Node])
    arr_PlayerExpression: cc.Node[] = [];
    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _goldScore: number = 0;
    private _countDownTime: number = 20;
    private _isClickJumpButton: boolean = true;
    private _isClickAgain: boolean = false;
    private _createGiftTime: number = 0;
    private _createGiftEndTime: number = 0;
    private _isFistClick: boolean = true;


    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.InitGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
        this.btn_PlayerJump.enabled = false;
        cc.tween(this.fistGift)
            .to(1, { position:  this.goldBeginPos.position })
            .call(() => {
                this.btn_PlayerJump.enabled = true;
                this.finger.active = true;
                LayerManger.Instance.GetLayer(Background).SetBgMoveSpeed(0);
            })
            .start();
    }

    update(dt: number) {
        if (!this._isGameStart) return;
        this._createGiftTime += dt;
        if (this._createGiftTime >= this._createGiftEndTime) {
            this._createGiftTime = 0;
            if (Util.randomInteger(0, 6) === 3) {
                this.CreateGiftBox();
            } else {
                this.CreateGiftGold();
            }
            if (this._countDownTime >= 15) {
                this._createGiftEndTime = Util.random(1, 1.2);
            } else if (this._countDownTime >= 8) {
                this._createGiftEndTime = Util.random(0.8, 1);
            } else {
                this._createGiftEndTime = Util.random(0.5, 0.8);
            }
        }
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }


    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        this._isClickJumpButton = true;
        this.SetGoldScore(0);
        this._countDownTime = 20;
        this._isGameOver = false;
        if (!this._isFistClick) {
            this.schedule(this.CountDown, 1);
            this.PlayerJumpStart();
            this._isGameStart = true;
            this.player.getComponent(cc.PolygonCollider).enabled = true;
        }
    }

    public ClickJumpButton() {
        AudioManager.play("click");
        if (this._isFistClick) {
            LayerManger.Instance.GetLayer(Background).SetBgMoveSpeed(300);
            this.finger.active = false;
            this.schedule(this.CountDown, 1);
            this.PlayerJumpStart();
            this._isGameStart = true;
            this.player.getComponent(cc.PolygonCollider).enabled = true;
            this._isFistClick = false;
        }
        this.CreateClickEffect();
        if (!this._isClickJumpButton) return;
        CpSDK.FirstTouch();
        this._isClickJumpButton = false;
        this.PlayerJumpOver();
        cc.tween(this.player)
            .to(0.4, { y: 250 }, { easing: 'sineOut' })
            .to(0.4, { y: -24 }, { easing: 'sineIn' })
            .call(() => {
                this._isClickJumpButton = true;
                this.PlayerJumpStart();
            })
            .start();
        cc.tween(this.playerShade)
            .to(0.4, { scale: 0.6 }, { easing: 'sineOut' })
            .to(0.4, { scale: 1 }, { easing: 'sineIn' })
            .start();
    }

    private CreateClickEffect() {
        let obj = PoolManager.instance.getNode(this.pre_ClickEffect, this.clickEffectParent);
        obj.scale = 1;
        obj.opacity = 255;
        let t = cc.tween;
        t(obj)
            .parallel(
                t().to(0.2, { opacity: 0 }, { easing: 'fade' }),
                t().to(0.2, { scale: 1.1 })
            )
            .call(() => {
                PoolManager.instance.putNode(obj);
            })
            .start();


    }

    private CreateGiftBox() {
        let obj = cc.instantiate(this.pre_GiftBox);
        obj.setParent(this.giftParent);
        obj.setPosition(cc.v2(0, Util.randomInteger(80, 350)));
    }

    private CreateGiftGold() {
        let obj = cc.instantiate(this.pre_GiftGold);
        obj.setParent(this.giftParent);
        obj.setPosition(cc.v2(0, Util.randomInteger(80, 350)));

    }

    public ChangeExpression(index: number) {
        this.arr_PlayerExpression[1].stopAllActions();
        switch (index) {
            case 0:
                this.arr_PlayerExpression[0].active = true;
                this.arr_PlayerExpression[1].active = false;
                this.arr_PlayerExpression[2].active = false;
                break
            case 2:
                this.arr_PlayerExpression[0].active = false;
                this.arr_PlayerExpression[1].active = false;
                this.arr_PlayerExpression[2].active = true;
                break
        }
        cc.tween(this.arr_PlayerExpression[1])
            .delay(1)
            .call(() => {
                this.arr_PlayerExpression[0].active = false;
                this.arr_PlayerExpression[1].active = true;
                this.arr_PlayerExpression[2].active = false;
            })
            .start();
    }

    public CreateHitEffect(pos: cc.Vec2) {
        let obj = PoolManager.instance.getNode(this.pre_HitEffect, this.hitEffectParent);
        obj.setPosition(pos);
        obj.scale = 0;
        obj.opacity = 255;
        cc.tween(obj)
            .to(0.2, { scale: 1 }, { easing: 'backOut' })
            .to(0.2, { opacity: 0 }, { easing: 'fade' })
            .call(() => {
                PoolManager.instance.putNode(obj);
            })
            .start();
    }

    private PlayerJumpStart() {
        cc.tween(this.player)
            .to(0.4, { y: 50 }, { easing: 'sineOut' })
            .to(0.4, { y: -24 }, { easing: 'sineIn' })
            .union()
            .repeatForever()
            .start();
        cc.tween(this.playerShade)
            .to(0.4, { scale: 0.9 }, { easing: 'sineOut' })
            .to(0.4, { scale: 1 }, { easing: 'sineIn' })
            .union()
            .repeatForever()
            .start();

    }

    private PlayerJumpOver() {
        this.player.stopAllActions();
        this.playerShade.stopAllActions();
    }


    public AgainGame() {
        CpSDK.EnterSection(3, "再玩一次界面");
        this._isClickAgain = true;
        LayerManger.Instance.GetLayer(Background).SetBgMoveSpeed(300);
        this.InitGame();
    }

    /**
    * 倒计时
    */
    private CountDown() {
        this._countDownTime -= 1;
        if (this._countDownTime <= 0) {
            this.GameOver();
        }
    }

    /**
     * 游戏结束
     */
    private GameOver() {
        if (this._isGameOver) return;
        this._isGameStart = false;
        this._isGameOver = true;
        this.unschedule(this.CountDown);
        this.player.stopAllActions();
        this.playerShade.stopAllActions();
        this.player.getComponent(cc.PolygonCollider).enabled = false;
        LayerManger.Instance.GetLayer(Background).SetBgMoveSpeed(0);
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
        if (this._isClickAgain) {
            LayerManger.Instance.GetLayer(Layer_2).InitGame();
        }
    }


    /**
    * 实现金币飞的效果
    * @param generateNode 生成的地点
    */
    public ScatterGold(generateNode: cc.Node, goldNum: number) {
        AudioManager.play("gold");
        let v = 1000;
        let s = Util.getDistance(this.goldEndPos.getPosition(), generateNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < goldNum; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.ChangePos(star, generateNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.ChangePos(star, this.goldEndPos) })
                .call(() => {
                    star.destroy();
                    this.AddGoldScore(2);
                })
                .start();
        }
    }

    /**
     * 
     * @param node1 要被转换的node
     * @param node2 目标node
     * @returns 
     */
    private ChangePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }



    public GetGoldScore(): number {
        return this._goldScore;
    }
    private AddGoldScore(value: number) {
        this._goldScore += value;
        this.label_Gold.string = this._goldScore.toString();
    }
    private SetGoldScore(value: number) {
        this._goldScore = value;
        this.label_Gold.string = this._goldScore.toString();
    }



}
