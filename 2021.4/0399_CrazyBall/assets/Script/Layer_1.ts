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
    img_Remind: cc.Node = null;

    @property(cc.Node)
    gameProgressBar: cc.Node = null;

    @property(cc.Node)
    titleBg: cc.Node = null;

    @property(cc.Node)
    gameContent: cc.Node = null;

    @property(cc.Node)
    downLoadBg_1: cc.Node = null;

    @property(cc.Node)
    downLoadBg_2: cc.Node = null;

    @property(cc.ProgressBar)
    gameProgress: cc.ProgressBar = null;

    @property(cc.Node)
    generateScorePos: cc.Node = null;

    @property(cc.Prefab)
    pre_Score: cc.Prefab = null;

    @property(cc.Prefab)
    pre_FlyP: cc.Prefab = null;

    @property(cc.Prefab)
    pre_BothSidesFlower: cc.Prefab = null;

    @property(cc.Node)
    generateBothSidesFlower: cc.Node = null;

    @property(cc.Node)
    flyPPositon: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Label)
    label_GoldScore: cc.Label = null;

    @property([cc.Node])
    arr_BarPos: cc.Node[] = [];
    // ================================================ //
    private _isGameStart: boolean = false;
    private _isFistSlide: boolean = false;
    private _goldScore: number = 0;
    private _createAllMoneyNum: number = 0;
    private _gameProgressNum: number = 0;
    private _isGiftTime: boolean = false;
    private _width: number = Math.floor(GetViewW() / 2);
    private _isOpen_10: boolean = false;


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

    private onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (!this._isGameStart) return;
        if (this._isGiftTime) return;
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

        this.downLoadBg_2.x = 120;
    }

    /**
     * 第一次引导点击
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
            // this.titleBg.scale = this.gameProgressBar.scale = this.img_Remind.scale = this.gameContent.scale = 1.3;
            this.startGame.scale = 1.3;
            this.titleBg.setPosition(cc.v2(0, -150));
            this.gameProgressBar.setPosition(cc.v2(15, -325));
            this.img_Remind.setPosition(cc.v2(220, -500));
            this.gameContent.setPosition(cc.v2(-60, -30));
            // this.titleBg.setPosition(cc.v2(0, -150));
            // this.gameProgressBar.setPosition(cc.v2(15, -340));
            // this.img_Remind.setPosition(cc.v2(220, -590));
            // this.gameContent.setPosition(cc.v2(-60, -30));
            this.downLoadBg_1.active = false;
            this.downLoadBg_2.active = true;
            console.log('横屏下startGame的scale的大小为：', this.startGame.scale);
            console.log('横屏');
        } else {
            // this.titleBg.scale = this.gameProgressBar.scale = this.img_Remind.scale = this.gameContent.scale = 1;
            this.startGame.scale = 1;
            this.titleBg.setPosition(cc.v2(-323, -85));
            this.gameProgressBar.setPosition(cc.v2(-315, -260));
            this.img_Remind.setPosition(cc.v2(-127.5, -400));
            this.gameContent.setPosition(cc.v2(299, -90));
            this.downLoadBg_1.active = true;
            this.downLoadBg_2.active = false;
            console.log('竖屏下startGame的scale的大小为：', this.startGame.scale);
            console.log('竖屏');
        }
        this._width = changeWidth;
    }



    /**
     * 打开奖励界面10
     */
    private OpenGiftInterface_10() {
        if (this._isOpen_10) return;
        this._isOpen_10 = true;
        let t = cc.tween;
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
        let obj = cc.instantiate(this.pre_FlyP);
        obj.setParent(this.flyPPositon);
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                obj.children[1].active = true;
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
     * 上下移动 
     */
    private showUpDownMove(node: cc.Node) {
        cc.tween(node)
            .by(0.5, { position: cc.v3(0, -150) })
            .by(0.5, { position: cc.v3(0, 150) })
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 下载
     */
    public ClickDownLoadBtn() {
        CpSDK.ClickFinishDownloadBar(1, "游戏界面下载按钮");
    }



    public GetGoldScore(): number {
        return this._goldScore;
    }

    private AddGoldScore(value: number) {
        this._goldScore += value;
        this.label_GoldScore.string = this._goldScore.toString();
    }

    private GetCreateAllMoneyNum(): number {
        return this._createAllMoneyNum;
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
