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
import Bullet from "./Bullet";
import PoolManager from "./Manager/PoolManager";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    gameProgressView: cc.Node = null;

    @property(cc.ProgressBar)
    giftProgressBar: cc.ProgressBar = null;

    @property(cc.Node)
    bulletParent: cc.Node = null;

    @property(cc.Node)
    guidLinde: cc.Node = null;

    @property(cc.Node)
    cannon: cc.Node = null;

    @property(cc.Node)
    cannonParent: cc.Node = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    @property(cc.Prefab)
    pre_Bullet: cc.Prefab = null;

    @property(cc.Node)
    starLaunch: cc.Node = null;

    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property([cc.Prefab])
    arr_ScorePreabs: cc.Prefab[] = [];

    @property([cc.Node])
    arr_ScoreParents: cc.Node[] = [];

    @property([cc.Node])
    arr_ScoreImgs: cc.Node[] = [];

    @property([cc.Node])
    arr_ScoreGifts: cc.Node[] = [];
    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _goldScore: number = 0;
    private _countDownTime: number = 20;
    private _isFirstClickLaunch: boolean = true;
    private _isClickLaunch: boolean = true;
    private _ClickLaunchNum: number = 0;

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
    }

    /**
     * 游戏结束
     */
    private GameOver() {
        if (this._isGameOver) return;
        this._isGameStart = false;
        this._isGameOver = true;
        this.starLaunch.destroy();
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }


    private CreateBullet(angle: number) {
        let obj = cc.instantiate(this.pre_Bullet);
        obj.setParent(this.bulletParent);
        obj.setPosition(cc.v2(0, 0));
        obj.getComponent(Bullet).LookAtObject(angle);
    }

    public JudgeScore(angle: number) {
        if (4 <= angle && angle < 48) {
            this.CreateScore(this.arr_ScoreParents[0], 0);
            this.ShakeGift(this.arr_ScoreGifts[0]);
            this.FlashGold(this.arr_ScoreImgs[0]);
        } else if (48 <= angle && angle < 93) {
            this.CreateScore(this.arr_ScoreParents[1], 1);
            this.ShakeGift(this.arr_ScoreGifts[1]);
            this.FlashGold(this.arr_ScoreImgs[1]);
        } else if (93 <= angle && angle < 137) {
            this.CreateScore(this.arr_ScoreParents[2], 2);
            this.ShakeGift(this.arr_ScoreGifts[2]);
            this.FlashGold(this.arr_ScoreImgs[2]);
        } else if (137 <= angle && angle < 182) {
            this.CreateScore(this.arr_ScoreParents[3], 3);
            this.ShakeGift(this.arr_ScoreGifts[3]);
            this.FlashGold(this.arr_ScoreImgs[3]);
        } else if (182 <= angle && angle < 227) {
            this.CreateScore(this.arr_ScoreParents[4], 4);
            this.ShakeGift(this.arr_ScoreGifts[4]);
            this.FlashGold(this.arr_ScoreImgs[4]);
        } else if (227 <= angle && angle < 273) {
            this.CreateScore(this.arr_ScoreParents[5], 5);
            this.ShakeGift(this.arr_ScoreGifts[5]);
            this.FlashGold(this.arr_ScoreImgs[5]);
        } else if (273 <= angle && angle < 319) {
            this.CreateScore(this.arr_ScoreParents[6], 6);
            this.ShakeGift(this.arr_ScoreGifts[6]);
            this.FlashGold(this.arr_ScoreImgs[6]);
        } else {
            this.CreateScore(this.arr_ScoreParents[7], 7);
            this.ShakeGift(this.arr_ScoreGifts[7]);
            this.FlashGold(this.arr_ScoreImgs[7]);
        }
    }

    private CreateScore(scoreParent: cc.Node, index: number) {
        let obj = PoolManager.instance.getNode(Util.randomArray(this.arr_ScorePreabs), scoreParent);
        obj.setPosition(cc.v2(0, 0));
        obj.scale = 0;
        obj.opacity = 255;
        let t = cc.tween;
        t(obj)
            .to(0.2, { scale: 1 }, { easing: "backOut" })
            .parallel(
                t().by(0.3, { y: 200 }),
                t().to(0.3, { opacity: 0 }, { easing: "fade" })
            )
            .call(() => {
                PoolManager.instance.putNode(obj);
            })
            .start();
        this.ScatterGold(this.arr_ScoreGifts[index]);
        this._ClickLaunchNum++;
    }

    private ShakeGift(node: cc.Node) {
        cc.tween(node)
            .by(0.02, { position: cc.v3(-5, 0) })
            .by(0.02, { position: cc.v3(5, 0) })
            .by(0.02, { position: cc.v3(5, 0) })
            .by(0.02, { position: cc.v3(-5, 0) })
            .by(0.02, { position: cc.v3(0, 5) })
            .by(0.02, { position: cc.v3(0, -5) })
            .by(0.02, { position: cc.v3(0, -5) })
            .by(0.02, { position: cc.v3(0, 5) })
            .union()
            .repeat(4)
            .union()
            .start();
    }

    private FlashGold(node: cc.Node) {
        cc.tween(node)
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .union()
            .start();
    }



    public ClickLaunchBtn() {
        if (!this._isClickLaunch) return;
        CpSDK.FirstTouch();
        AudioManager.play("launch");
        if (this._isFirstClickLaunch) {
            this.guidLinde.active = false;
            this._isFirstClickLaunch = false;
            this.guidFinger.active = false;
        }
        this._isClickLaunch = false;
        let angle = this.cannonParent.angle;
        this.CreateBullet(angle);
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                // if (this._ClickLaunchNum >= 3) return;
                this._isClickLaunch = true;
            })
            .start();
        this.ShowCannonLaunchEffect();
    }

    private ShowCannonLaunchEffect() {
        cc.tween(this.cannon)
            .by(0.1, { position: cc.v3(5, -5) })
            .by(0.1, { position: cc.v3(-5, 5) })
            .start();
    }

    private AddProgress(progressNum: number) {
        let widthNum: number = progressNum * 423;
        cc.tween(this.gameProgressView)
            .to(0.3, { width: widthNum })
            .start();
        cc.tween(this.giftProgressBar)
            .to(0.3, { progress: progressNum })
            .start();
        if (progressNum === 1) {
            cc.tween(this.node)
                .delay(0.5)
                .call(() => {
                    this.GameOver();
                })
                .start();
        }
    }



    /**
    * 实现金币飞的效果
    * @param generateNode 生成的地点
    */
    private ScatterGold(generateNode: cc.Node) {
        AudioManager.play("gold");
        let v = 1000;
        let s = Util.getDistance(this.goldEndPos.getPosition(), generateNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < 5; i++) {
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
                    if (i === 4) {
                        switch (this._ClickLaunchNum) {
                            case 1:
                                this.AddProgress(0.3);
                                break;
                            case 2:
                                this.AddProgress(0.6);
                                break;
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                                this.AddProgress(1);
                                break;
                        }
                    }
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

}
