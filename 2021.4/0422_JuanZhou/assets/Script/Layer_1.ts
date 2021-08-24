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
import { GetViewH, globalData } from "./Config/SystemConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    spotContent_1: cc.Node = null;

    @property(cc.Node)
    spotContent_2: cc.Node = null;

    @property(cc.Sprite)
    scrollBg: cc.Sprite = null;

    @property(cc.Node)
    scrollBgView: cc.Node = null;

    @property(cc.Node)
    gameContent: cc.Node = null;

    @property(cc.Node)
    bookInterface: cc.Node = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    @property(cc.Node)
    img_Book: cc.Node = null;

    @property(cc.Node)
    scrollMidBg: cc.Node = null;

    @property(cc.Node)
    scrollMid: cc.Node = null;

    @property(cc.Node)
    scrollDown: cc.Node = null;

    @property(cc.Node)
    scrollUp: cc.Node = null;

    @property(cc.Node)
    fictionScrollView: cc.Node = null;

    // ================================================ //

    private _isGameStart: boolean = false;
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
        // this.gameContent.parent.parent.scale = this.gameContent.parent.parent.scale / globalData.scale;
        this.spotContent_1.active = true;
        this.spotContent_2.active = false;
        // this.ClickAcceptTask();
        cc.tween(this.scrollBgView)
            .to(0.5, { height: 1023 })
            .start();
        cc.tween(this.scrollBg)
            .to(0.5, { fillRange: -1 })
            .call(() => {
                this.guidFinger.active = true;
            })
            .start();
        AudioManager.play("appearScroll");
    }


    public ClickAcceptTask() {
        CpSDK.FirstTouch();
        AudioManager.play("button", 0.5);
        this.guidFinger.active = false;
        cc.tween(this.scrollBgView)
            .to(0.5, { height: 0 })
            .start();
        cc.tween(this.scrollBg)
            .to(0.5, { fillRange: 0 })
            .delay(0.3)
            .call(() => {
                this.ShowBookInterface();
            })
            .start();
    }

    private ShowBookInterface() {
        // this.spotContent_1.active = false;
        this.HideNode(this.spotContent_1, true);
        this.ShowNode(this.bookInterface, true);
        this.bookInterface.scaleY = Math.ceil(this.bookInterface.scaleY / globalData.scale * 100) / 100;
        // cc.tween(this.scrollMidBg)
        //     .delay(0.5)
        //     .by(0.5, { height: 1182 })
        //     .start();
        cc.tween(this.scrollMid)
            .delay(0.5)
            .call(() => {
                AudioManager.play("appearScroll");
            })
            .to(0.5, { height: 1182 })
            .call(() => {
                cc.tween(this.img_Book)
                    .delay(0.3)
                    .to(0.2, { scale: 1 })
                    .to(0.2, { width: 0 })
                    .to(0.2, { width: 236 })
                    .delay(0.3)
                    .call(() => {
                        cc.tween(this.img_Book)
                            .parallel(
                                cc.tween().to(0.5, { scale: 3 }, { easing: 'backOut' }),
                                cc.tween().to(0.5, { opacity: 0 }, { easing: 'fade' })
                            )
                            .call(() => {
                                this.ShowNode(this.spotContent_2, true);
                                this.fictionScrollView.getComponent(FictionScrollView).StartMove();
                            })
                            .start()
                    })
                    .start();

            })
            .start();
        cc.tween(this.scrollDown)
            .delay(0.5)
            .by(0.5, { y: -591 })
            .start();
        cc.tween(this.scrollUp)
            .delay(0.5)
            .by(0.5, { y: 591 })
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
    public ShowNode(node: cc.Node, isAnim: boolean, num?: number) {
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
    public HideNode(node: cc.Node, isAnim: boolean, num?: number) {
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
    public ChangePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
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


}
