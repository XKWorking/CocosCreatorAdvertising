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
import Book from "./Book";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    gameBg: cc.Node = null;

    @property(cc.Node)
    img_Table: cc.Node = null;

    @property(cc.Node)
    guid_Finger: cc.Node = null;

    @property(cc.Node)
    bookParent: cc.Node = null;

    @property(cc.Prefab)
    pre_Book: cc.Prefab = null;

    @property(cc.Prefab)
    pre_ScatterGold: cc.Prefab = null;

    @property(cc.Prefab)
    pre_GoldScore_10: cc.Prefab = null;

    @property(cc.Prefab)
    pre_GoldScore_20: cc.Prefab = null;

    @property(cc.Node)
    bookFxParent: cc.Node = null;

    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Label)
    label_Time: cc.Label = null;
    // ================================================ //
    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _isGuidTime: boolean = false;
    private _isClick: boolean = false;
    private _goldScore: number = 0;
    private _countDownTime: number = 20;
    private _currentBook: cc.Node = null;
    private _allBookNum: number = 0;
    private _originX: number = -231;
    private _isTurnLeft: boolean = false;
    private _leftPosX: number = -740;
    private _rightPosX: number = 300;
    private _currentBookWidth = 463;
    private _arr_AllBookNode: cc.Node[] = [];

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
            this._currentBook.stopAllActions();
            this.schedule(this.CountDown, 1);
            this.HideNode(this.guid_Finger, false);
            this.VerifyBookPosition();
            this._isGameStart = true;
            this._isGuidTime = false;
            return;
        }
        if (!this._isGameStart) return;
        if (!this._isClick) return;
        this._isClick = false;
        this._currentBook.stopAllActions();
        this.VerifyBookPosition();
    }

    private InitGame() {
        this.img_Table.scale = this.img_Table.scale / globalData.scale;
        this.CreateBook();
        cc.tween(this.node)
            .delay(0.05)
            .call(() => {
                this.CreateBook();
            })
            .delay(0.05)
            .call(() => {
                this.ShowGuidFinger();
            })
            .start();
    }


    /**
    * 倒计时
    */
    private CountDown() {
        this._countDownTime -= 1;
        if (this._countDownTime < 10) {
            this.label_Time.string = '0' + this._countDownTime + 's';
        } else {
            this.label_Time.string = this._countDownTime + 's';
        }
        if (this._countDownTime <= 0) {
            this.unschedule(this.CountDown);
            this.GameOver();
        }
    }

    /**
     * 显示引导
     */
    private ShowGuidFinger() {
        this._allBookNum++;
        let obj = cc.instantiate(this.pre_Book);
        this._arr_AllBookNode.push(obj);
        obj.setParent(this.bookParent);
        let y = obj.y;
        obj.setPosition(cc.v2(-231, y));
        this._currentBook = obj;
        this.ShowNode(this.guid_Finger, false);
        cc.tween(obj)
            .to(0.8, { position: cc.v3(this._rightPosX, y) }, { easing: 'sineOut' })
            .to(0.8, { position: cc.v3(-250, y) })
            .call(() => {
                this._isGuidTime = true;
            })
            .start();
    }

    /**
     * 创建初始的书1
     */
    private CreateBook() {
        this._allBookNum++;
        let obj: cc.Node = cc.instantiate(this.pre_Book);
        this._arr_AllBookNode.push(obj);
        obj.setParent(this.bookParent);
        let y = obj.y;
        obj.setPosition(cc.v2(-231, y));
    }

    /**
     * 复制书
     */
    private CopyBook() {
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this._isClick = true;
            })
            .start();
        this._allBookNum++;
        let obj: cc.Node = cc.instantiate(this._currentBook);
        this._arr_AllBookNode.push(obj);
        this._currentBook = obj;
        let y = obj.y;
        obj.setPosition(cc.v2(this._originX, y));
        obj.setParent(this.bookParent);
        this.ChangeMovePos(obj.width);
        if (this._isTurnLeft) {
            cc.tween(obj)
                .to(0.8, { position: cc.v3(this._leftPosX, y) }, { easing: 'sineOut' })
                .call(() => {
                    this._isTurnLeft = false;
                    cc.tween(obj)
                        .to(1.5, { position: cc.v3(this._rightPosX, y) }, { easing: 'sineInOut' })
                        .call(() => {
                            this._isTurnLeft = true;
                        })
                        .to(1.5, { position: cc.v3(this._leftPosX, y) }, { easing: 'sineInOut' })
                        .call(() => {
                            this._isTurnLeft = false;
                        })
                        .union()
                        .repeatForever()
                        .start();
                })
                .start();
        } else {
            cc.tween(obj)
                .to(0.8, { position: cc.v3(this._rightPosX, y) }, { easing: 'sineOut' })
                .call(() => {
                    this._isTurnLeft = true;
                    cc.tween(obj)
                        .to(1.5, { position: cc.v3(this._leftPosX, y) }, { easing: 'sineInOut' })
                        .call(() => {
                            this._isTurnLeft = false;
                        })
                        .to(1.5, { position: cc.v3(this._rightPosX, y) }, { easing: 'sineInOut' })
                        .call(() => {
                            this._isTurnLeft = true;
                        })
                        .union()
                        .repeatForever()
                        .start();
                })
                .start();
        }

    }

    /**
     * 改变移动位置
     */
    private ChangeMovePos(length: number) {
        let offset = this._currentBookWidth - length;
        this._leftPosX += offset;
        this._currentBookWidth = length;
    }

    /**
     * 改变书的长度
     * @param lenght 改变值 
     */
    private ChangeObj(lenght: number) {
        AudioManager.play('success');
        this._currentBook.width -= lenght;
        let firstChild = this._currentBook.children[0];
        firstChild.setPosition(firstChild.x - lenght, 0);
        let moveObj: cc.Node = this._currentBook.children[0].children[0].children[0];
        let x = moveObj.x + lenght;
        moveObj.setPosition(x, 0);
        this.CopyBook();
        this.bookFxParent.width = this._currentBook.width;
        let pos: cc.Vec2 = this._currentBook.getPosition();
        this.bookFxParent.setPosition(pos);
    }

    /**
     * 创建分数10
     */
    private CreateGoldScore_10(parent: cc.Node) {
        let obj = cc.instantiate(this.pre_GoldScore_10);
        obj.setParent(parent);
        let x = Math.floor(parent.width / 2);
        obj.setPosition(x, 0);
        this.Shake(obj);
        cc.tween(obj)
            .by(0.2, { position: cc.v3(0, 200) })
            .delay(0.5)
            .to(0.5, { scale: 0 }, { easing: 'backIn' })
            .start();
    }

    /**
     * 创建分数20
     */
    private CreateGoldScore_20(parent: cc.Node) {
        let obj = cc.instantiate(this.pre_GoldScore_20);
        obj.setParent(parent);
        let x = Math.floor(parent.width / 2);
        obj.setPosition(x, 0);
        this.Shake(obj);
        cc.tween(obj)
            .by(0.2, { position: cc.v3(0, 200) })
            .delay(0.5)
            .to(0.5, { scale: 0 }, { easing: 'backIn' })
            .start();
    }

    /**
     * 创建撒钱特效
     */
    private CreateScatterGold(parent: cc.Node) {
        let obj = cc.instantiate(this.pre_ScatterGold);
        obj.setParent(parent);
        let x = Math.floor(parent.width / 2);
        obj.setPosition(x, -49);
    }

    /**
     * 校验书的位置
     */
    private VerifyBookPosition() {
        AudioManager.play('book');
        let pos: cc.Vec2 = this._currentBook.getPosition();
        let offset: number = Math.ceil(this._originX - pos.x);
        let width: number = this._currentBook.width - 25;
        if (-2 <= offset && offset <= 2) {
            this.BgMoveDown();
            this._arr_AllBookNode.forEach((temp) => {
                temp.getComponent(Book).ShowFlash();
            });
            this._currentBook.x = this._originX;
            this.ChangeObj(0);
            this.ScatterGold(this.bookFxParent, 10);
            this.CreateScatterGold(this.bookFxParent);
            this.CreateGoldScore_20(this.bookFxParent);
        } else if (-width <= offset && offset < -2) {
            this.BgMoveDown();
            this._currentBook.getComponent(Book).ShowFlash();
            this._originX = this._currentBook.x;
            this.ChangeObj(-offset);
            this.ScatterGold(this.bookFxParent, 5);
            this.CreateGoldScore_10(this.bookFxParent);
            this.CreateScatterGold(this.bookFxParent);
        } else if (2 < offset && offset <= width) {
            this.BgMoveDown();
            this._currentBook.getComponent(Book).ShowFlash();
            this._currentBook.x = this._originX;
            this.ChangeObj(offset);
            this.ScatterGold(this.bookFxParent, 5);
            this.CreateGoldScore_10(this.bookFxParent);
            this.CreateScatterGold(this.bookFxParent);
        } else {
            this.GameOver();
        }

    }

    /**
     * 实现垒书效果背景一直往下
     */
    private BgMoveDown() {
        let pos: cc.Vec3 = cc.v3(0, -98);
        let t = cc.tween;
        t(this.img_Table)
            .by(0.5, { position: pos })
            .start();
        t(this.gameBg)
            .by(0.5, { position: pos })
            .start();

    }


    /**
    * 实现金币飞的效果
    * @param generateNode 生成的地点
    */
    private ScatterGold(generateNode: cc.Node, num: number) {
        let v = 800;
        let s = 300;//Util.getDistance(this.goldEndPos.getPosition(), generateNode.getPosition());
        let t = 0;

        t = s / v;
        for (let i = 0; i < num; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            // this.node.addChild(star);
            star.setParent(generateNode);
            let x = Math.floor(generateNode.width / 2);
            let pos: cc.Vec3 = cc.v3(x, -49);
            let endPos: cc.Vec3 = this.ChangePos(star, this.goldEndPos);
            endPos.y += 98;
            cc.tween(star)
                .set({ position: pos, opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: endPos })
                .call(() => {
                    AudioManager.play('gold');
                    star.destroy();
                    this.AddGoldScore(2);
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
     * 摇摆效果
     * @param node 
     */
    private Shake(node: cc.Node) {
        cc.tween(node)
            .by(0.1, { angle: 3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: 3 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 任务失败或者时间到了
     */
    private GameOver() {
        if (this._isGameOver) return;
        this._isGameStart = false;
        this._isGameOver = true;
        this.HideNode(this._currentBook, false);
        this.unschedule(this.CountDown);
        let t = cc.tween;
        t(this.img_Table)
            .parallel(
                t().to(0.5, { scale: 0.8 }),
                t().to(0.5, { position: cc.v3(0, 0) })
            )
            .delay(1)
            .call(() => {
                LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            })
            .start();
    }


    public GetGoldScore(): number {
        return this._goldScore;
    }
    public AddGoldScore(value: number) {
        this._goldScore += value;
        if (this._goldScore < 10) {
            this.label_Gold.string = '0' + this._goldScore.toString();
        } else {
            this.label_Gold.string = this._goldScore.toString();
        }
    }
    public SetGoldScore(value: number) {
        this._goldScore = value;
        this.label_Gold.string = this._goldScore.toString();
    }

    public GetAllBookNum(): number {
        return this._allBookNum;
    }

}
