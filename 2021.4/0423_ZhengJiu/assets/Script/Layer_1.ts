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
import FictionScrollView from "./FictionScrollView";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.ProgressBar)
    gameProgressBar: cc.ProgressBar = null;

    @property(cc.Node)
    gift_RedPacket: cc.Node = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    @property(cc.Node)
    img_Remind: cc.Node = null;

    @property(cc.Node)
    treatEndPos: cc.Node = null;

    @property(cc.Node)
    bookInterface: cc.Node = null;

    @property(cc.Node)
    img_Book: cc.Node = null;

    @property(cc.Node)
    img_BookLight: cc.Node = null;

    @property(cc.Node)
    fictionInterface: cc.Node = null;

    @property(cc.Node)
    fictionScrollView: cc.Node = null;


    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(sp.Skeleton)
    sp_PgheTreat: sp.Skeleton = null;

    @property(sp.Skeleton)
    sp_OtherTreat: sp.Skeleton = null;

    @property([cc.Node])
    arr_Treat: cc.Node[] = [];

    @property([cc.Node])
    arr_BruiseSpot: cc.Node[] = [];
    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _targetIndex: number = 0;
    private _isClick: boolean = true;
    private _clickNum: number = 0;
    private _isTime: boolean = false;
    private _time: number = 0;
    private _endTime: number = 2;
    private _isThird: boolean = false;

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
        if (this._isTime) {
            this._time += dt;
            if (this._time >= this._endTime) {
                this._time = 0;
                this._isTime = false;
                if (!this._isThird) {
                    this.ShowGuidFinger(this._targetIndex);
                    this._isThird = true;
                } else {
                    let treatNode: cc.Node = null;
                    for (const treat of this.arr_Treat) {
                        if (treat.activeInHierarchy) {
                            treatNode = treat;
                        }
                    }
                    this.ShowGuidFinger_3(treatNode);
                }
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
        this.Shake(this.gift_RedPacket, 5);
        this.ShowGuidFinger_1(this.arr_Treat[0], this.arr_Treat[1], this.arr_Treat[2]);
        for (const treat of this.arr_Treat) {
            this.ShowUpDownMove(treat);
        }
        this.fictionInterface.active = false;

    }

    private ShowGuidFinger(index: number) {
        switch (index) {
            case 0:
                this.ShowGuidFinger_2(this.arr_Treat[1], this.arr_Treat[2]);
                break;
            case 1:
                this.ShowGuidFinger_2(this.arr_Treat[0], this.arr_Treat[2]);
                break;
            case 2:
                this.ShowGuidFinger_2(this.arr_Treat[0], this.arr_Treat[1]);
                break;
        }
    }

    private ShowGuidFinger_1(parent_1: cc.Node, parent_2: cc.Node, parent_3: cc.Node) {
        this.guidFinger.active = true;
        cc.tween(this.guidFinger)
            .call(() => {
                this.guidFinger.parent = parent_1;
                this.guidFinger.setPosition(cc.v2(60, -60));
                this.ShowFingerPock();
            })
            .delay(1.5)
            .call(() => {
                this.guidFinger.parent = parent_2;
                this.guidFinger.setPosition(cc.v2(60, -60));
                this.ShowFingerPock();
            })
            .delay(1.5)
            .call(() => {
                this.guidFinger.parent = parent_3;
                this.guidFinger.setPosition(cc.v2(60, -60));
                this.ShowFingerPock();
            })
            .delay(1.5)
            .union()
            .repeatForever()
            .start();
    }

    private ShowGuidFinger_2(parent_1: cc.Node, parent_2: cc.Node) {
        this.guidFinger.active = true;
        cc.tween(this.guidFinger)
            .call(() => {
                this.guidFinger.parent = parent_1;
                this.guidFinger.setPosition(cc.v2(60, -60));
                this.ShowFingerPock();
            })
            .delay(1.5)
            .call(() => {
                this.guidFinger.parent = parent_2;
                this.guidFinger.setPosition(cc.v2(60, -60));
                this.ShowFingerPock();
            })
            .delay(1.5)
            .union()
            .repeatForever()
            .start();
    }

    private ShowGuidFinger_3(parent_1: cc.Node) {
        this.guidFinger.active = true;
        this.guidFinger.parent = parent_1;
        this.guidFinger.setPosition(cc.v2(60, -60));
        cc.tween(this.guidFinger)
            .by(0.3, { position: cc.v3(30, -30) })
            .by(0.3, { position: cc.v3(-30, 30) })
            .by(0.3, { position: cc.v3(30, -30) })
            .by(0.3, { position: cc.v3(-30, 30) })
            .delay(0.3)
            .union()
            .repeatForever()
            .start();
    }



    //显示手指戳一戳效果
    private ShowFingerPock() {
        cc.tween(this.guidFinger)
            .by(0.3, { position: cc.v3(30, -30) })
            .by(0.3, { position: cc.v3(-30, 30) })
            .by(0.3, { position: cc.v3(30, -30) })
            .by(0.3, { position: cc.v3(-30, 30) })
            .start();
    }

    /**
     * 点击草药
     */
    public ClickHerbTreat() {
        if (!this._isClick) return;
        CpSDK.FirstTouch();
        AudioManager.play("button",0.8);
        this._isClick = false
        this._clickNum++;
        this._targetIndex = 0;
        let index = this._targetIndex;
        this.TreatMove(index, 0.2);
        this._isTime = false;
        this._time = 0;
    }

    /**
     * 点击绷带
     */
    public ClickBandageTreat() {
        if (!this._isClick) return;
        CpSDK.FirstTouch();
        AudioManager.play("button",0.8);
        this._isClick = false
        this._clickNum++;
        this._targetIndex = 1;
        let index = this._targetIndex;
        this.TreatMove(index, 0.3);
        this._isTime = false;
        this._time = 0;
    }

    /**
     * 点击大还丹
     */
    public ClickPgheTreat() {
        if (!this._isClick) return;
        CpSDK.FirstTouch();
        AudioManager.play("button",0.8);
        this._isClick = false
        this._clickNum++;
        this._targetIndex = 2;
        let index = this._targetIndex;
        this.TreatMove(index, 0.5);
        this._isTime = false;
        this._time = 0;
    }


    /**
     * 治疗物移动到固定点
     * @param targetIndex 治疗物的下标 
     * @param progressNum 进度条到达的位置
     */
    private TreatMove(targetIndex: number, progressNum: number) {
        this.guidFinger.active = false;
        this.guidFinger.stopAllActions();
        let treat: cc.Node = this.arr_Treat[this._targetIndex];
        let pos = this.ChangePos(treat, this.treatEndPos);
        let t = cc.tween;
        t(treat)
            .parallel(
                t().to(0.5, { position: pos }, { easing: 'quadOut' }),
                t().to(0.5, { scale: 0 })
            )
            .call(() => {
                AudioManager.play("gold");
                treat.active = false;
                this.ScatterGold(this.treatEndPos, progressNum);
                this._isClick = true;
                this._isTime = true;
                switch (targetIndex) {
                    case 0:
                        this.sp_OtherTreat.clearTracks()
                        this.sp_OtherTreat.setAnimation(0, 'texiao', false);
                        this.ShowTreatEffect(targetIndex);
                        break;
                    case 1:
                        this.sp_OtherTreat.clearTracks()
                        this.sp_OtherTreat.setAnimation(0, 'texiao', false);
                        this.ShowTreatEffect(targetIndex);
                        break;
                    case 2:
                        this.sp_PgheTreat.clearTracks()
                        this.sp_PgheTreat.setAnimation(0, 'texiao', false);
                        this.ShowTreatEffect(targetIndex);
                        break;
                }

            })
            .start();
    }

    private ShowTreatEffect(targetIndex: number) {
        let bruise: cc.Node = this.arr_BruiseSpot[targetIndex];
        cc.tween(bruise)
            .delay(0.1)
            .to(0.5, { opacity: 0 }, { easing: 'fade' })
            .call(() => {
                bruise.active = false;
            })
            .start();
        if (this._clickNum >= 3) {
            cc.tween(this.bookInterface)
                .delay(1.5)
                .call(() => {
                    this.ShowBook();
                })
                .start();
        }
    }

    /**
     * 显示上下移动效果
     */
    private ShowUpDownMove(node: cc.Node) {
        cc.tween(node)
            .by(1, { position: cc.v3(0, -15) })
            .by(1, { position: cc.v3(0, 15) })
            .union()
            .repeatForever()
            .start();
    }



    private ShowBook() {
        this.ShowNode(this.bookInterface, true);
        AudioManager.play("getBook");
        cc.tween(this.bookInterface)
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .start();
        this.ShowBookLight();
        cc.tween(this.img_Book)
            .to(0.15, { width: 0 })
            .to(0.15, { width: 416 })
            .start();
    }
    private ShowBookLight() {
        cc.tween(this.img_BookLight)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.img_BookLight)
                    .by(4, { angle: 360 })
                    .union()
                    .repeatForever()
                    .start();
                this.guidFinger.stopAllActions();
                this.guidFinger.parent = this.bookInterface;
                this.guidFinger.setPosition(cc.v2(68, -400));
                this.ShowFingerPock();
            })
            .start();
    }

    public ClickReadBtn() {
        AudioManager.play("button",0.8);
        this.HideNode(this.bookInterface, true);
        this.ShowNode(this.fictionInterface, true);
        this.fictionScrollView.getComponent(FictionScrollView).StartMove();
    }


    /**
     * 游戏结束
     */
    public GameOver() {
        if (this._isGameOver) return;
        this._isGameStart = false;
        this._isGameOver = true;
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
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
       * 实现金币飞的效果
       * @param generateNode 生成的地点
       */
    private ScatterGold(generateNode: cc.Node, progressNum: number) {
        let v = 800;
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
                .by(0.4, { x: Util.random(-30, 30), y: Util.random(-30, 30), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.ChangePos(star, this.goldEndPos) })
                .call(() => {
                    star.destroy();
                    if (i == 0) {
                        this.SetProgress(progressNum);
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

    /**
     * 摇摆效果
     * @param dirAngle 摇摆角度大小
     */
    private Shake(node: cc.Node, dirAngle: number) {
        cc.tween(node)
            .to(0.1, { angle: dirAngle })
            .to(0.1, { angle: 0 })
            .to(0.1, { angle: -dirAngle })
            .to(0.1, { angle: 0 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }

    private SetProgress(value: number) {
        cc.tween(this.gameProgressBar)
            .by(0.5, { progress: value })
            .start();
    }


}
