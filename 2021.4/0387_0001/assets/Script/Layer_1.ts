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
import { globalData } from "./Config/SystemConfig";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    guid: cc.Node = null;

    @property(cc.Node)
    blastFurnace: cc.Node = null;

    @property(sp.Skeleton)
    lightAbsorbing: sp.Skeleton = null;

    @property(sp.Skeleton)
    explodeLight: sp.Skeleton = null;

    @property(cc.Node)
    img_MoveCircle: cc.Node = null;

    @property(cc.Node)
    moveElixirParent: cc.Node = null;

    @property(cc.Node)
    elixirParent: cc.Node = null;

    @property(cc.Node)
    elixirBeginPosition: cc.Node = null;

    @property(cc.Node)
    elixirEndPosition: cc.Node = null;

    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Label)
    label_Time: cc.Label = null;

    @property([cc.Animation])
    arr_Smokes: cc.Animation[] = [];

    @property([cc.Sprite])
    arr_ElixirPositions: cc.Sprite[] = [];

    @property([cc.SpriteFrame])
    arr_ElixirShade: cc.SpriteFrame[] = [];
    // ================================================ //
    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _isGuidTime: boolean = false;
    private _isClick: boolean = false;
    private _goldScore: number = 0;
    private _countDownTime: number = 20;
    private _currentElixir: cc.Node = null;
    private _currentIndex: number = 0;
    private _endPosNum: number = 0;

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
        if (this._isGuidTime) {
            this._isGuidTime = false;
            this.StopMoveElixir();
            this.VerifyPosition();
            this.HideNode(this.guid, true);
            this.schedule(this.CountDown, 1);
            return;
        }
        if (!this._isClick) return;
        this._isClick = false;
        this.StopMoveElixir()
        this.VerifyPosition();
    }


    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        this._currentElixir = this.elixirParent.children[0];
        this._currentIndex = 1;
        cc.tween(this.img_MoveCircle)
            .to(2, { angle: 180 })
            .call(() => {
                this._currentElixir.stopAllActions();
                this._isGuidTime = true;
            })
            .start();
        cc.tween(this.moveElixirParent)
            .to(2, { angle: 180 })
            .start();
        cc.tween(this.elixirParent)
            .to(2, { angle: -180 })
            .start();
        cc.tween(this._currentElixir)
            .to(0.5, { scale: 1.2 })
            .to(0.5, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }


    /**
    * 倒计时
    */
    private CountDown() {
        this._countDownTime -= 1;
        this.label_Time.string = this._countDownTime + 's';
        if (this._countDownTime <= 0) {
            this.unschedule(this.CountDown);
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
        if (this._currentElixir != null || this._currentElixir != undefined) {
            this.HideNode(this._currentElixir, true);
        }
        this.BlastFurnaceShake();
    }

    /**
     * 移动丹药
     */
    private MoveElixir() {
        let t = cc.tween;
        this._currentElixir = this.elixirParent.children[0];
        this._currentElixir.active = true;
        this._currentIndex++;
        this.img_MoveCircle.angle = Math.floor(this.img_MoveCircle.angle);
        this.moveElixirParent.angle = this.img_MoveCircle.angle;
        this.elixirParent.angle = -this.img_MoveCircle.angle;
        let pos = this.ChangePos(this._currentElixir, this.elixirBeginPosition);
        this._currentElixir.setPosition(pos);
        t(this._currentElixir)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .to(0.5, { position: cc.v3(0, 0) })
            .call(() => {
                this._isClick = true;
                t(this.img_MoveCircle)
                    .by(4, { angle: 360 })
                    .union()
                    .repeatForever()
                    .start();
                t(this.moveElixirParent)
                    .by(4, { angle: 360 })
                    .union()
                    .repeatForever()
                    .start();
                t(this.elixirParent)
                    .by(4, { angle: -360 })
                    .union()
                    .repeatForever()
                    .start();
                t(this._currentElixir)
                    .to(0.5, { scale: 1.2 })
                    .to(0.5, { scale: 1 })
                    .union()
                    .repeatForever()
                    .start();
            })
            .start();
    }

    /**
     * 停止移动丹药
     */
    private StopMoveElixir() {
        this.img_MoveCircle.stopAllActions();
        this.moveElixirParent.stopAllActions();
        this.elixirParent.stopAllActions();
        this._currentElixir.stopAllActions();
    }

    /**
     * 没对上位置向下掉
     */
    private MoveDown(over: boolean) {
        let t = cc.tween;
        let pos = this.ChangePos(this._currentElixir, this.elixirEndPosition);
        pos.x = 0;

        let v = 100;
        let s = Util.getDistance(this._currentElixir.getPosition(), this.elixirEndPosition.getPosition());
        let time = 0;

        time = s / v;

        AudioManager.play('fail');
        t(this._currentElixir)
            .to(time, { position: pos }, { easing: 'quartOut' })
            .call(() => {
                this._currentElixir.active = false;
                this._currentElixir.parent = this.node;
                if (over) {
                    this.GameOver();
                } else {
                    this.MoveElixir();
                }
            })
            .start();
    }

    /**
     * 校验位置
     */
    private VerifyPosition() {
        //误差5度可以
        let currentAngle: number = Math.floor(this.moveElixirParent.angle % 360);
        switch (this._currentIndex) {
            case 1:
                if (175 <= currentAngle && currentAngle <= 185) {
                    this._currentElixir.parent = this.arr_ElixirPositions[1].node;
                    this._currentElixir.angle = 0;
                    this._currentElixir.setPosition(cc.v2(0, 0));
                    cc.tween(this._currentElixir)
                        .to(0.3, { scale: 2 }, { easing: 'backOut' })
                        .call(() => {
                            AudioManager.play('putIn');
                        })
                        .to(0.3, { scale: 1 }, { easing: 'backOut' })
                        .call(() => {
                            this.Shake(this.blastFurnace);
                            this.ScatterGold(this._currentElixir);
                            this.ShowSmokeAnimation(this.arr_Smokes[1]);
                            this.MoveElixir();
                            this.arr_ElixirPositions[0].spriteFrame = this.arr_ElixirShade[0];
                            this.arr_ElixirPositions[2].spriteFrame = this.arr_ElixirShade[0];
                        })
                        .start();
                } else {
                    this.MoveDown(false);
                    this.arr_ElixirPositions[0].spriteFrame = this.arr_ElixirShade[0];
                    this.arr_ElixirPositions[1].spriteFrame = this.arr_ElixirShade[0];
                    this.arr_ElixirPositions[2].spriteFrame = this.arr_ElixirShade[0];
                }
                break;
            case 2:
                if (85 <= currentAngle && currentAngle <= 95) {
                    this._endPosNum = 2;
                    this._currentElixir.parent = this.arr_ElixirPositions[0].node;
                    this._currentElixir.angle = 0;
                    this._currentElixir.setPosition(cc.v2(0, 0));
                    cc.tween(this._currentElixir)
                        .to(0.3, { scale: 2 }, { easing: 'backOut' })
                        .call(() => {
                            AudioManager.play('putIn');
                        })
                        .to(0.3, { scale: 1 }, { easing: 'backOut' })
                        .call(() => {
                            this.Shake(this.blastFurnace);
                            this.ScatterGold(this._currentElixir);
                            this.ShowSmokeAnimation(this.arr_Smokes[0]);
                            this.MoveElixir();
                            this.arr_ElixirPositions[2].spriteFrame = this.arr_ElixirShade[1];
                        })
                        .start();
                } else if (265 <= currentAngle && currentAngle <= 275) {
                    this._endPosNum = 3;
                    this._currentElixir.parent = this.arr_ElixirPositions[2].node;
                    this._currentElixir.angle = 0;
                    this._currentElixir.setPosition(cc.v2(0, 0));
                    cc.tween(this._currentElixir)
                        .to(0.3, { scale: 2 }, { easing: 'backOut' })
                        .call(() => {
                            AudioManager.play('putIn');
                        })
                        .to(0.3, { scale: 1 }, { easing: 'backOut' })
                        .call(() => {
                            this.Shake(this.blastFurnace);
                            this.ScatterGold(this._currentElixir);
                            this.ShowSmokeAnimation(this.arr_Smokes[2]);
                            this.MoveElixir();
                            this.arr_ElixirPositions[0].spriteFrame = this.arr_ElixirShade[1];
                        })
                        .start();
                } else {
                    this._endPosNum = 23;
                    this.MoveDown(false);
                    this.arr_ElixirPositions[0].spriteFrame = this.arr_ElixirShade[1];
                    this.arr_ElixirPositions[2].spriteFrame = this.arr_ElixirShade[1];
                }
                break;
            case 3:
                if (this._endPosNum === 2) {
                    if (265 <= currentAngle && currentAngle <= 275) {
                        this._currentElixir.parent = this.arr_ElixirPositions[2].node;
                        this._currentElixir.angle = 0;
                        this._currentElixir.setPosition(cc.v2(0, 0));
                        cc.tween(this._currentElixir)
                            .to(0.3, { scale: 2 }, { easing: 'backOut' })
                            .call(() => {
                                AudioManager.play('putIn');
                            })
                            .to(0.3, { scale: 1 }, { easing: 'backOut' })
                            .call(() => {
                                this.ScatterGold(this._currentElixir);
                                this.ShowSmokeAnimation(this.arr_Smokes[2]);
                                this._currentElixir = null;
                                this.GameOver();
                            })
                            .start();
                    } else {
                        this.MoveDown(true);
                    }
                } else if (this._endPosNum === 3) {
                    if (85 <= currentAngle && currentAngle <= 95) {
                        this._currentElixir.parent = this.arr_ElixirPositions[0].node;
                        this._currentElixir.angle = 0;
                        this._currentElixir.setPosition(cc.v2(0, 0));
                        cc.tween(this._currentElixir)
                            .to(0.3, { scale: 2 }, { easing: 'backOut' })
                            .call(() => {
                                AudioManager.play('putIn');
                            })
                            .to(0.3, { scale: 1 }, { easing: 'backOut' })
                            .call(() => {
                                this.ScatterGold(this._currentElixir);
                                this.ShowSmokeAnimation(this.arr_Smokes[0]);
                                this._currentElixir = null;
                                this.GameOver();
                            })
                            .start();
                    } else {
                        this.MoveDown(true);
                    }
                } else if (this._endPosNum === 23) {
                    if (265 <= currentAngle && currentAngle <= 275) {
                        this._currentElixir.parent = this.arr_ElixirPositions[2].node;
                        this._currentElixir.angle = 0;
                        this._currentElixir.setPosition(cc.v2(0, 0));
                        cc.tween(this._currentElixir)
                            .to(0.3, { scale: 2 }, { easing: 'backOut' })
                            .call(() => {
                                AudioManager.play('putIn');
                            })
                            .to(0.3, { scale: 1 }, { easing: 'backOut' })
                            .call(() => {
                                this.ScatterGold(this._currentElixir);
                                this.ShowSmokeAnimation(this.arr_Smokes[2]);
                                this._currentElixir = null;
                                this.GameOver();
                            })
                            .start();
                    } else if (85 <= currentAngle && currentAngle <= 95) {
                        this._currentElixir.parent = this.arr_ElixirPositions[0].node;
                        this._currentElixir.angle = 0;
                        this._currentElixir.setPosition(cc.v2(0, 0));
                        cc.tween(this._currentElixir)
                            .to(0.3, { scale: 2 }, { easing: 'backOut' })
                            .call(() => {
                                AudioManager.play('putIn');
                            })
                            .to(0.3, { scale: 1 }, { easing: 'backOut' })
                            .call(() => {
                                this.ScatterGold(this._currentElixir);
                                this.ShowSmokeAnimation(this.arr_Smokes[0]);
                                this._currentElixir = null;
                                this.GameOver();
                            })
                            .start();
                    } else {
                        this.MoveDown(true);
                    }

                }
                break;
        }

    }

    /**
     * 显示烟的动画
     */
    private ShowSmokeAnimation(anim: cc.Animation) {
        this.ShowNode(anim.node, true);
        let animState = anim.play();
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    }

    /**
     * 实现炼丹炉抖动效果
     */
    private BlastFurnaceShake() {
        cc.tween(this.blastFurnace)
            .delay(0.5)
            .call(() => {
                cc.tween(this.blastFurnace)
                    .by(0.03, { angle: 6 })
                    .by(0.03, { angle: -6 })
                    .by(0.03, { angle: -6 })
                    .by(0.03, { angle: 6 })
                    .union()
                    .repeat(2)
                    .call(() => {
                        AudioManager.play('over',1.5);
                        this.lightAbsorbing.clearTracks();
                        this.lightAbsorbing.setAnimation(0, 'texiao', false);
                        this.lightAbsorbing.setCompleteListener(() => {
                            this.explodeLight.clearTracks();
                            this.explodeLight.setAnimation(0, 'texiao', false);
                            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                        });
                    })
                    .start();
            })
            .start();
    }


    /**
    * 实现金币飞的效果
    * @param generateNode 生成的地点
    */
    private ScatterGold(generateNode: cc.Node) {
        let v = 800;
        let s = Util.getDistance(this.goldEndPos.getPosition(), generateNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < 10; i++) {
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
                    this.AddGoldScore(10);
                    AudioManager.play('gold', 0.5);
                })
                .start();
        }
    }

    /**
   * 激活节点
   * @param node 要激活的节点 
   * @param isAnim 是否有0.5s的缓动效果
   * @param num 透明度，不输入则为255
   */
    private ShowNode(node: cc.Node, isAnim: boolean, num?: number) {
        node.active = true;
        if (num == null) {
            num = 255;
        }
        if (isAnim) {
            cc.tween(node)
                .to(0.5, { opacity: num }, { easing: 'fade' })
                .start();
        } else {
            node.opacity = num;
        }
    }
    /**
     * 关闭节点
     * @param node 要关闭的节点 
     * @param isAnim 是否有0.5s的缓动效果
     * @param num 透明度，不输入则为0
     */
    private HideNode(node: cc.Node, isAnim: boolean, num?: number) {
        if (num == null) {
            num = 0;
        }
        if (isAnim) {
            cc.tween(node)
                .to(0.5, { opacity: num }, { easing: 'fade' })
                .call(() => {
                    if (num != 0) return;
                    node.active = false;
                })
                .start();
        } else {
            node.opacity = num;
            if (num != 0) return;
            node.active = false;
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

    /**
     * 抖动效果
     * @param node 
     */
    private Shake(node: cc.Node) {
        cc.tween(node)
            .by(0.03, { position: cc.v3(10, 0) })
            .by(0.03, { position: cc.v3(-10, 0) })
            .by(0.03, { position: cc.v3(0, 10) })
            .by(0.03, { position: cc.v3(0, -10) })
            .by(0.03, { position: cc.v3(0, -10) })
            .by(0.03, { position: cc.v3(0, 10) })
            .by(0.03, { position: cc.v3(-10, 0) })
            .by(0.03, { position: cc.v3(10, 0) })
            .union()
            .start();
    }



    public GetGoldScore(): number {
        return this._goldScore;
    }
    public AddGoldScore(value: number) {
        this._goldScore += value;
        this.label_Gold.string = this._goldScore.toString();
    }
    public SetGoldScore(value: number) {
        this._goldScore = value;
        this.label_Gold.string = this._goldScore.toString();
    }



}
