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
    @property(cc.Node)
    startInterface: cc.Node = null;

    @property(cc.Node)
    gameBg_2: cc.Node = null;

    @property(cc.Node)
    startTestBtn: cc.Node = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    @property(cc.Node)
    img_ResultBg: cc.Node = null;

    @property(cc.Node)
    img_Book: cc.Node = null;

    @property(cc.Node)
    startReadBtn: cc.Node = null;

    @property(cc.Node)
    fictionInterface: cc.Node = null;

    @property(cc.Node)
    fictionScrollView: cc.Node = null;

    @property(cc.ProgressBar)
    gameProgressBar: cc.ProgressBar = null;

    @property([cc.Node])
    arr_Citys: cc.Node[] = [];

    @property([cc.Node])
    arr_Professions: cc.Node[] = [];

    @property([cc.Node])
    arr_PositionY: cc.Node[] = [];

    @property([cc.Node])
    arr_ProgressRedPackets: cc.Node[] = [];

    // ================================================ //
    private _isGameOver: boolean = false;

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
        this.ShowBreathe(this.startTestBtn);
    }

    private ShowBreathe(node: cc.Node) {
        cc.tween(node)
            .to(0.5, { scale: 0.9 })
            .to(0.5, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }

    public ClickStartTestBtn() {
        CpSDK.FirstTouch();
        AudioManager.play("click");
        this.startTestBtn.getComponent(cc.Button).enabled = false;
        this.startTestBtn.stopAllActions();
        cc.tween(this.startTestBtn)
            .to(0.3, { scale: 0.8 })
            .to(0.3, { scale: 1 })
            .delay(2.3)
            .call(() => {
                this.img_ResultBg.parent.active = true;
                cc.tween(this.img_ResultBg)
                    .to(0.5, { scale: 1 }, { easing: 'backOut' })
                    .call(() => {
                        this.ShowBreathe(this.startReadBtn);
                    })
                    .start();
                    this.ShowBook();
            })
            .start();
        this.MoveEffect_1(this.arr_Citys[0]);
        this.MoveEffect_2(this.arr_Citys[1]);
        this.MoveEffect_3(this.arr_Citys[2]);
        this.MoveEffect_1(this.arr_Professions[0]);
        this.MoveEffect_2(this.arr_Professions[1]);
        this.MoveEffect_3(this.arr_Professions[2]);
        this.guidFinger.active = false;
    }

    private ShowBook() {
        AudioManager.play("book");
        cc.tween(this.img_Book)
            .to(0.15, { scaleX: 0 })
            .to(0.15, { scaleX: 1 })
            .start();
    }

    private MoveEffect_1(target: cc.Node) {
        let t = cc.tween;
        t(target)
            .to(0.3, { y: this.arr_PositionY[1].y })
            .to(0.2, { y: this.arr_PositionY[2].y })
            .to(0, { y: this.arr_PositionY[3].y })
            .to(0.1, { y: this.arr_PositionY[0].y })
            .call(() => {
                t(target)
                    .to(0.1, { y: this.arr_PositionY[1].y })
                    .to(0.1, { y: this.arr_PositionY[2].y })
                    .to(0, { y: this.arr_PositionY[3].y })
                    .to(0.1, { y: this.arr_PositionY[0].y })
                    .union()
                    .repeat(4)
                    .to(0.2, { y: this.arr_PositionY[1].y })
                    .to(0.3, { y: this.arr_PositionY[2].y })
                    .start();
            })
            .start();

    }

    private MoveEffect_2(target: cc.Node) {
        let t = cc.tween;
        t(target)
            .to(0.3, { y: this.arr_PositionY[2].y })
            .to(0, { y: this.arr_PositionY[3].y })
            .to(0.2, { y: this.arr_PositionY[0].y })
            .to(0.1, { y: this.arr_PositionY[1].y })
            .call(() => {
                t(target)
                    .to(0.1, { y: this.arr_PositionY[2].y })
                    .to(0, { y: this.arr_PositionY[3].y })
                    .to(0.1, { y: this.arr_PositionY[0].y })
                    .to(0.1, { y: this.arr_PositionY[1].y })
                    .union()
                    .repeat(4)
                    .to(0.2, { y: this.arr_PositionY[2].y })
                    .to(0, { y: this.arr_PositionY[3].y })
                    .to(0.3, { y: this.arr_PositionY[0].y })
                    .start();
            })
            .start();

    }

    private MoveEffect_3(target: cc.Node) {
        let t = cc.tween;
        t(target)
            .to(0, { y: this.arr_PositionY[3].y })
            .to(0.3, { y: this.arr_PositionY[0].y })
            .to(0.2, { y: this.arr_PositionY[1].y })
            .to(0.1, { y: this.arr_PositionY[2].y })
            .call(() => {
                t(target)
                    .to(0, { y: this.arr_PositionY[3].y })
                    .to(0.1, { y: this.arr_PositionY[0].y })
                    .to(0.1, { y: this.arr_PositionY[1].y })
                    .to(0.1, { y: this.arr_PositionY[2].y })
                    .union()
                    .repeat(4)
                    .to(0, { y: this.arr_PositionY[3].y })
                    .to(0.2, { y: this.arr_PositionY[0].y })
                    .to(0.3, { y: this.arr_PositionY[1].y })
                    .start();
            })
            .start();

    }



    public ClickStartReadBtn() {
        AudioManager.play("click");
        this.startReadBtn.getComponent(cc.Button).enabled = false;
        this.startReadBtn.stopAllActions();
        cc.tween(this.startReadBtn)
            .to(0.3, { scale: 0.8 })
            .to(0.3, { scale: 1 })
            .call(() => {
                this.gameBg_2.active = true;
                this.HideNode(this.startInterface, true);
                this.ShowNode(this.fictionInterface, true);
                this.fictionScrollView.getComponent(FictionScrollView).StartMove();
            })
            .start();

    }

    public AddProgress() {
        let t = cc.tween;
        t(this.gameProgressBar)
            .delay(3.3)
            .call(() => {
                this.ShakeProgressRedPacket(this.arr_ProgressRedPackets[0]);
            })
            .start();
        t(this.gameProgressBar)
            .delay(6.6)
            .call(() => {
                this.ShakeProgressRedPacket(this.arr_ProgressRedPackets[1]);
            })
            .start();
        t(this.gameProgressBar)
            .to(10, { progress: 1 })
            .call(() => {
                this.ShakeProgressRedPacket(this.arr_ProgressRedPackets[2]);
                this.GameOver();
            })
            .start();
    }

    private ShakeProgressRedPacket(node: cc.Node) {
        let t = cc.tween;
        t(node)
            .to(0.1, { angle: 6 })
            .to(0.1, { angle: 0 })
            .to(0.1, { angle: -6 })
            .to(0.1, { angle: 0 })
            .call(() => {
                t(node)
                    .by(2, { y: -2000 }, { easing: 'quartOut' })
                    .start();
            })
            .start();
    }



    /**
     * 游戏结束
     */
    public GameOver() {
        if (this._isGameOver) return;
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


}
