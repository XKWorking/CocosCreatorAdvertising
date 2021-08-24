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
import { GetViewH, GetViewW } from "./Config/SystemConfig";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    startGame: cc.Node = null;

    @property(cc.Node)
    bg_1: cc.Node = null;

    @property(cc.Node)
    bg_2: cc.Node = null;

    @property(cc.Node)
    bg_3: cc.Node = null;

    @property(cc.Node)
    moneyDown: cc.Node = null;

    @property(cc.Node)
    gameProgressBar: cc.Node = null;

    @property(cc.Node)
    titleBg: cc.Node = null;

    @property(cc.Node)
    downLoadBg: cc.Node = null;

    @property(cc.ProgressBar)
    gameProgress: cc.ProgressBar = null;

    @property(cc.Node)
    generateMoneyPos: cc.Node = null;

    @property(cc.Node)
    generateScorePos: cc.Node = null;

    @property(cc.Prefab)
    scatterMoney: cc.Prefab = null;

    @property(cc.Node)
    scatterMoneyParent: cc.Node = null;

    @property(cc.Prefab)
    pre_Money: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Money_2: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Money_3: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Score: cc.Prefab = null;

    @property(cc.Prefab)
    pre_FlyP: cc.Prefab = null;

    @property(cc.Prefab)
    pre_BothSidesFlower: cc.Prefab = null;

    @property(cc.Node)
    generateBothSidesFlower: cc.Node = null;

    @property(sp.Skeleton)
    scatterGold: sp.Skeleton = null;

    @property(cc.Node)
    first_Money: cc.Node = null;

    @property(cc.Node)
    guid: cc.Node = null;

    @property(cc.Sprite)
    MoneyBg: cc.Sprite = null;

    @property(cc.Node)
    img_KeepPressing: cc.Node = null;

    @property([cc.SpriteFrame])
    arr_MoneySprite: cc.SpriteFrame[] = [];

    @property([cc.Label])
    arr_Label_Gold: cc.Label[] = [];

    @property([cc.Node])
    arr_BarPos: cc.Node[] = [];
    // ================================================ //
    private _isGameStart: boolean = false;
    private _isFistSlide: boolean = false;
    private _goldScore: number = 0;
    private _isCreate: boolean = false;
    private _isLongCreate: boolean = false;
    private _createAllMoneyNum: number = 0;
    private _gameProgressNum: number = 0;
    private _isGiftTime: boolean = false;
    private _width: number = Math.floor(GetViewW() / 2);
    private _isOpen_10: boolean = false;
    private _time: number = 0;
    private _reFreshTime: number = 25;
    private _isCreateScatterGold: boolean = true;
    private _isBeginGuid: boolean = true;
    private _guidTime: number = 0;
    private _guidEndTime: number = 2;


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
        if (this._isLongCreate) {
            this._time += dt * 100;
            if (this._time >= this._reFreshTime) {
                this._time = 0;
                this.CreateMoney();
                if (this._reFreshTime <= 10) return;
                this._reFreshTime -= 1;
            }
        }
        if (this._isBeginGuid) {
            this._guidTime += dt;
            if (this._guidTime >= this._guidEndTime) {
                this._guidTime = 0;
                this._isBeginGuid = false;
                this.ShowGuidFlash();
            }
        }


    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (!this._isGameStart) return;
        if (this._isGiftTime) return;
        this._isCreate = true;
        if (this.guid.activeInHierarchy) {
            this.img_KeepPressing.stopAllActions();
            this.HideNode(this.guid, false);
        }
    }
    private onTouchEnd(e: cc.Event.EventTouch) {
        if (!this._isGameStart) return;
        if (this._isGiftTime) return;
        if (this._isFistSlide) {
            if (this._isCreate) {
                if (this._isLongCreate) {
                    this._isLongCreate = false;
                    this._time = 0;
                } else {
                    this.CreateMoney();
                }
            }
            this.generateMoneyPos.stopAllActions();
        } else {
            let t = cc.tween;
            AudioManager.play('slide');
            t(this.first_Money)
                .by(2, { position: cc.v3(0, 2500) }, { easing: 'expoOut' })
                .start();
            this.CreateScatterGold();
            let obj = cc.instantiate(this.pre_Score);
            obj.setParent(this.generateScorePos);
            obj.setPosition(cc.v2(0, 0));
            t(obj)
                .parallel(
                    t().by(0.5, { position: cc.v3(0, 300) }),
                    t().to(0.5, { opacity: 0 }, { easing: 'fade' })
                )
                .call(() => {
                    obj.destroy();
                })
                .start();
        }
        this._isFistSlide = true;
        this._isCreate = false;
        this._isLongCreate = false;
        this._time = 0;
        this._isBeginGuid = true;
    }

    private onTouchCancel(e: cc.Event.EventTouch) {
        if (!this._isGameStart) return;
        if (this._isGiftTime) return;
        if (this._isFistSlide) {
            if (this._isCreate) {
                if (this._isLongCreate) {
                    this._isLongCreate = false;
                    this._time = 0;
                } else {
                    this.CreateMoney();
                }
            }
            this.generateMoneyPos.stopAllActions();
        } else {
            let t = cc.tween;
            AudioManager.play('slide');
            t(this.first_Money)
                .by(2, { position: cc.v3(0, 2500) }, { easing: 'expoOut' })
                .start();
            this.CreateScatterGold();
            let obj = cc.instantiate(this.pre_Score);
            obj.setParent(this.generateScorePos);
            obj.setPosition(cc.v2(0, 0));
            t(obj)
                .parallel(
                    t().by(0.5, { position: cc.v3(0, 300) }),
                    t().to(0.5, { opacity: 0 }, { easing: 'fade' })
                )
                .call(() => {
                    obj.destroy();
                })
                .start();
        }
        this._isFistSlide = true;
        this._isCreate = false;
        this._isLongCreate = false;
        this._time = 0;
        this._isBeginGuid = true;
    }

    /**
     * 初始化游戏
     */
    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        let t = cc.tween;
        this.firstSlide();
        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.ResizeContent();
        });
        this.ResizeContent();
        this.Shake(this.arr_BarPos[2]);
        this.ShowGuidFlash();
    }

    /**
     * 第一次引导滑动
     */
    private firstSlide() {
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this._isGameStart = true;
            })
            .start();
    }

    /**
     * 监听屏幕横竖屏变化
     */
    private ResizeContent() {
        let changeWidth = Math.floor(GetViewW() / 2);
        if (GetViewW() > GetViewH()) {
            this.gameProgressBar.scale = this.titleBg.scale = this.downLoadBg.scale = this.moneyDown.scale = 1.25;
            this.moneyDown.x = -186;
            this.gameProgressBar.setPosition(cc.v2(14, -700));
            this.titleBg.setPosition(cc.v2(14, -400));
            this.downLoadBg.x = 14;
            console.log('横屏');
        } else {
            this.gameProgressBar.scale = this.titleBg.scale = this.downLoadBg.scale = this.moneyDown.scale = 1;
            this.moneyDown.x = 223;
            this.gameProgressBar.setPosition(cc.v2(-300, -387.5));
            this.titleBg.setPosition(cc.v2(-304.5, -167));
            this.downLoadBg.x = -301;
            console.log('竖屏');
        }
        this._width = changeWidth;
    }

    /**
     * 实现长按提示闪一闪效果
     */
    private ShowGuidFlash() {
        this.ShowNode(this.guid, true);
        this.Shake(this.img_KeepPressing);
    }

    /**
     * 创建钱
     */
    private CreateMoney() {
        this._isBeginGuid = false;
        this._guidTime = 0;
        if (this.GetCreateAllMoneyNum() <= 10) {
            var obj = cc.instantiate(this.pre_Money);
            this.MoneyBg.spriteFrame = this.arr_MoneySprite[0];
        } else if (this.GetCreateAllMoneyNum() <= 20) {
            var obj = cc.instantiate(this.pre_Money_2);
            this.MoneyBg.spriteFrame = this.arr_MoneySprite[1];
        } else {
            var obj = cc.instantiate(this.pre_Money_3);
            this.MoneyBg.spriteFrame = this.arr_MoneySprite[2];
        }
        obj.setParent(this.generateMoneyPos);
        this.CreateScatterGold()
        AudioManager.play('slide');
        let t = cc.tween;
        t(obj)
            .parallel(
                t().by(2, { position: cc.v3(0, 2500) }, { easing: 'expoOut' }),
                t().to(0.5, { opacity: 0 }, { easing: 'fade' })
            )
            .start();
        this.CreateScore();
        this.AddCreateAllMoneyNum(1);
        if (this.GetGameProgress() < 0.3) {
            this.AddGameProgress(0.03);
        } else if (this.GetGameProgress() < 0.66) {
            this.AddGameProgress(0.036);
        } else if (this.GetGameProgress() < 1) {
            this.AddGameProgress(0.017);
        }

    }

    /**
     * 打开奖励界面10
     */
    private OpenGiftInterface_10() {
        if (this._isOpen_10) return;
        this._isOpen_10 = true;
        let t = cc.tween;
        this.generateMoneyPos.stopAllActions();
        this._isLongCreate = false;
        this._isGiftTime = true;
        this.CreateBothSidesFlower();
        t(this.node)
            .delay(0.2)
            .call(() => {
                this.CreateFlyP();
                t(this.node)
                    .delay(1.2)
                    .call(() => {
                        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                    })
                    .start();
            })
            .start();
        console.log("打开页面10的时候的张数", this.GetCreateAllMoneyNum());
    }

    /**
     * 长按触发创建钱
     */
    public LongPressCreateMoney() {
        if (this._isGiftTime) return;
        this._isLongCreate = true;
        if (this._isFistSlide) {
            this.CreateMoney();
            this.AddCreateAllMoneyNum(1);
        } else {
            AudioManager.play('slide');
            let t = cc.tween;
            t(this.first_Money)
                .parallel(
                    t().by(2, { position: cc.v3(0, 2500) }, { easing: 'expoOut' }),
                    t().to(0.5, { opacity: 0 }, { easing: 'fade' })
                )
                .start();
            this.CreateScatterGold();
            this.CreateScore();
            this.AddCreateAllMoneyNum(1);
            if (this.GetGameProgress() < 0.3) {
                this.AddGameProgress(0.03);
            } else if (this.GetGameProgress() < 0.66) {
                this.AddGameProgress(0.036);
            } else if (this.GetGameProgress() < 1) {
                this.AddGameProgress(0.017);
            }
            this._isFistSlide = true;
        }
        if (this.guid.activeInHierarchy) {
            this.img_KeepPressing.stopAllActions();
            this.HideNode(this.guid, false);
        }
    }

    /**
     * 创建分数
     */
    private CreateScore() {
        var num = this.GetCreateAllMoneyNum();
        num = (num + 1) * 5;
        let obj = cc.instantiate(this.pre_Score);
        obj.getComponent(cc.Label).string = '+' + num;
        this.AddGoldScore(num);
        obj.setParent(this.generateScorePos);
        obj.setPosition(cc.v2(0, 0));
        let t = cc.tween;
        t(obj)
            .parallel(
                t().by(0.5, { position: cc.v3(0, 500) }),
                t().to(0.5, { opacity: 0 }, { easing: 'fade' })
            )
            .call(() => {
                obj.destroy();
            })
            .start();
    }
    /**
     * 创建两边撒花特效
     */
    private CreateBothSidesFlower() {
        let obj = cc.instantiate(this.pre_BothSidesFlower);
        obj.setParent(this.generateBothSidesFlower);
        obj.setPosition(cc.v2(0, 0));
    }



    /**
     * 创建flyp特效
     */
    private CreateFlyP() {
        AudioManager.play('money');
        let obj = cc.instantiate(this.pre_FlyP);
        obj.setParent(this.scatterGold.node);
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                obj.children[1].active = true;
            })
            .start();
    }

    /**
     * 创建撒钱特效
     */
    private CreateScatterGold() {
        if (!this._isCreateScatterGold) return;
        this._isCreateScatterGold = false;
        let obj = cc.instantiate(this.scatterMoney);
        obj.setParent(this.scatterMoneyParent);
        let anim = obj.getComponent(sp.Skeleton);
        anim.clearTracks();
        anim.setAnimation(0, 'texiao', false);
        anim.setCompleteListener(() => {
            obj.destroy();
        });
        cc.tween(this.scatterMoneyParent)
            .delay(1)
            .call(() => {
                this._isCreateScatterGold = true;
            })
            .start();
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
     * 摇摆效果
     * @param node 
     */
    private Shake(node: cc.Node) {
        cc.tween(node)
            .to(0.1, { angle: 3 })
            .to(0.1, { angle: 0 })
            .to(0.1, { angle: -3 })
            .to(0.1, { angle: 0 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 下载
     */
    public ClickDownLoadBtn() {
        CpSDK.ClickFinishDownloadBar(1, "游戏界面底部按钮");
    }



    private GetGoldScore(): number {
        return this._goldScore;
    }
    private AddGoldScore(value: number) {
        this._goldScore += value;
        let goldString: string = this._goldScore.toString();
        switch (goldString.length) {
            case 1:
                this.arr_Label_Gold[0].string = this._goldScore.toString();
                break;
            case 2:
                this.arr_Label_Gold[0].string = goldString[1];
                this.arr_Label_Gold[1].string = goldString[0];
                break;
            case 3:
                this.arr_Label_Gold[0].string = goldString[2];
                this.arr_Label_Gold[1].string = goldString[1];
                this.arr_Label_Gold[2].string = goldString[0];
                break;
            case 4:
                this.arr_Label_Gold[0].string = goldString[3];
                this.arr_Label_Gold[1].string = goldString[2];
                this.arr_Label_Gold[2].string = goldString[1];
                this.arr_Label_Gold[3].string = goldString[0];
                break;
            case 5:
                this.arr_Label_Gold[0].string = goldString[4];
                this.arr_Label_Gold[1].string = goldString[3];
                this.arr_Label_Gold[2].string = goldString[2];
                this.arr_Label_Gold[3].string = goldString[1];
                this.arr_Label_Gold[4].string = goldString[0];
                break;
            case 6:
                this.arr_Label_Gold[0].string = goldString[5];
                this.arr_Label_Gold[1].string = goldString[4];
                this.arr_Label_Gold[2].string = goldString[3];
                this.arr_Label_Gold[3].string = goldString[2];
                this.arr_Label_Gold[4].string = goldString[1];
                this.arr_Label_Gold[5].string = goldString[0];
                break;
        }
    }

    private GetCreateAllMoneyNum(): number {
        return this._createAllMoneyNum;
    }

    private AddCreateAllMoneyNum(value: number) {
        this._createAllMoneyNum += value;
        if (this._createAllMoneyNum == 10) {
            this.HideNode(this.bg_1, true);
            this.ShowNode(this.bg_2, true);
            this.arr_BarPos[0].children[0].active = true;
            AudioManager.play('good');
        } else if (this._createAllMoneyNum == 20) {
            this.HideNode(this.bg_2, true);
            this.ShowNode(this.bg_3, true);
            this.arr_BarPos[1].children[0].active = true;
            AudioManager.play('great');
        } else if (this._createAllMoneyNum == 40) {
            this.generateMoneyPos.stopAllActions();
            this.OpenGiftInterface_10();
        }
    }



    private GetGameProgress(): number {
        return this.gameProgress.progress;
    }

    private AddGameProgress(value: number) {
        this._gameProgressNum += value * 1000;
        let num = this._gameProgressNum / 1000;
        cc.tween(this.gameProgress)
            .to(0.1, { progress: num })
            .start();
    }


}
