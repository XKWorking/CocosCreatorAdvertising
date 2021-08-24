import BaseLayer from "./Base/BaseLayer";
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import CanvasVideoPlayer from "./Components/CanvasVideoPlayer";
import AudioManager from "./Manager/AudioManager";
import { globalData } from "./Config/SystemConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    finger: cc.Node = null;
    @property(cc.Node)
    img_CircleLight_1: cc.Node = null;
    @property(cc.Node)
    img_CircleLight_2: cc.Node = null;

    @property(cc.Button)
    btn_RecruitHero: cc.Button = null;

    @property(cc.Node)
    node_Mid: cc.Node = null;
    @property(cc.Node)
    downLoad: cc.Node = null;
    @property(cc.Button)
    btn_KillEnemy: cc.Button = null;

    @property(cc.Node)
    videoInterface: cc.Node = null;

    @property(cc.Node)
    node_Video: cc.Node = null;

    @property([cc.Node])
    arr_Logo: cc.Node[] = [];

    @property([cc.Node])
    arr_Icon: cc.Node[] = [];

    @property([cc.Animation])
    arr_Anim_A: cc.Animation[] = [];

    @property([cc.Animation])
    arr_Anim_B: cc.Animation[] = [];

    @property([cc.Animation])
    arr_Anim_C: cc.Animation[] = [];
    // ================================================ //
    private _isGameStart: boolean = false;
    private _beginProgressBarNum: number = 0;
    private _isBeginAddProgressBarNum: boolean = false;

    onLoad() {
        super.onResize();

        this.onBindTouch();
        //初始化游戏
        this.initGame();
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


    /**
    * 初始化游戏方法
    */
    private initGame() {
        this.showFingerPock();
        this.hideNode(this.node_Mid, false);
        this.hideNode(this.videoInterface, false);
        this.videoInterface.scale = this.videoInterface.scale / globalData.scale;
        this.node_Video.on('ended', () => {
            console.log("视频播放完成");
            this.downLoad.active = false;
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
        });
    }

    /**
     * 第一幕视频播放
     */
    private startVideo() {
        //开始播放视频
        this.node_Video.getComponent(CanvasVideoPlayer).play('fightFrames');
        AudioManager.play('explode');
        //视频播放完执行操作
    }

    /** 
     *   点击招募英雄
    */
    public clickRecruitHero() {
        CpSDK.FirstTouch();
        AudioManager.play('click');
        this.btn_RecruitHero.enabled = false;
        cc.tween(this.btn_RecruitHero.node)
            .to(0.2, { scale: 0.8 })
            .to(0.2, { scale: 1 })
            .call(() => {
                this.hideNode(this.finger, true);
                this.hideNode(this.img_CircleLight_1, true);
                this.hideNode(this.img_CircleLight_2, true);
                this.showNode(this.node_Mid, true);
                this.recruitHero_1();
                CpSDK.EnterSection(2, "抽卡过程");
            })
            .start();
    }
    /** 
     *  招募英雄1
    */
    private recruitHero_1() {
        AudioManager.play('flip');
        this.arr_Logo[0].active = true;
        cc.tween(this.arr_Logo[0])
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Icon[0])
                    // .delay(0.1)
                    .call(() => {
                        this.arr_Icon[0].active = true;
                        cc.tween(this.arr_Icon[0])
                            .delay(0.1)
                            .call(() => {
                                this.arr_Anim_B[0].node.active = true;
                                let animState = this.arr_Anim_B[0].play();
                                //设置循环模式为Loop
                                animState.wrapMode = cc.WrapMode.Loop;
                                //设置动画循环次数为无限次
                                animState.repeatCount = Infinity;
                                this.recruitHero_2();
                            })
                            .start();
                    })
                    .start();
            })
            .to(0.2, { scaleX: -1 })
            .start();
    }
    /** 
     *  招募英雄2
    */
    private recruitHero_2() {
        AudioManager.play('flip');
        this.arr_Logo[1].active = true;
        cc.tween(this.arr_Logo[1])
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Icon[1])
                    // .delay(0.1)
                    .call(() => {
                        this.arr_Icon[1].active = true;
                        cc.tween(this.arr_Icon[1])
                            .delay(0.1)
                            .call(() => {
                                this.arr_Anim_B[1].node.active = true;
                                let animState = this.arr_Anim_B[1].play();
                                //设置循环模式为Loop
                                animState.wrapMode = cc.WrapMode.Loop;
                                //设置动画循环次数为无限次
                                animState.repeatCount = Infinity;
                                this.recruitHero_3();
                            })
                            .start();
                    })
                    .start();
            })
            .to(0.2, { scaleX: -1 })
            .start();

    }
    /** 
     *  招募英雄3
    */
    private recruitHero_3() {
        AudioManager.play('flip');
        this.arr_Logo[2].active = true;
        cc.tween(this.arr_Logo[2])
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Icon[2])
                    // .delay(0.1)
                    .call(() => {
                        this.arr_Icon[2].active = true;
                        cc.tween(this.arr_Icon[2])
                            .delay(0.1)
                            .call(() => {
                                this.arr_Anim_B[2].node.active = true;
                                let animState = this.arr_Anim_B[2].play();
                                //设置循环模式为Loop
                                animState.wrapMode = cc.WrapMode.Loop;
                                //设置动画循环次数为无限次
                                animState.repeatCount = Infinity;
                                this.recruitHero_4();
                            })
                            .start();
                    })
                    .start();
            })
            .to(0.2, { scaleX: -1 })
            .start();

    }
    /** 
     *  招募英雄4
    */
    private recruitHero_4() {
        AudioManager.play('flip');
        this.arr_Logo[3].active = true;
        cc.tween(this.arr_Logo[3])
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Icon[3])
                    // .delay(0.1)
                    .call(() => {
                        this.arr_Icon[3].active = true;
                        cc.tween(this.arr_Icon[3])
                            .delay(0.1)
                            .call(() => {
                                this.arr_Anim_B[3].node.active = true;
                                let animState = this.arr_Anim_B[3].play();
                                //设置循环模式为Loop
                                animState.wrapMode = cc.WrapMode.Loop;
                                //设置动画循环次数为无限次
                                animState.repeatCount = Infinity;
                                this.recruitHero_5();
                            })
                            .start();
                    })
                    .start();
            })
            .to(0.2, { scaleX: -1 })
            .start();

    }
    /** 
     *  招募英雄5
    */
    private recruitHero_5() {
        AudioManager.play('flip');
        this.arr_Logo[4].active = true;
        cc.tween(this.arr_Logo[4])
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Icon[4])
                    // .delay(0.1)
                    .call(() => {
                        this.arr_Icon[4].active = true;
                        cc.tween(this.arr_Icon[4])
                            .delay(0.1)
                            .call(() => {
                                this.arr_Anim_B[4].node.active = true;
                                let animState = this.arr_Anim_B[4].play();
                                //设置循环模式为Loop
                                animState.wrapMode = cc.WrapMode.Loop;
                                //设置动画循环次数为无限次
                                animState.repeatCount = Infinity;
                                this.moveIcon_1();
                            })
                            .start();
                    })
                    .start();
            })
            .to(0.2, { scaleX: -1 })
            .start();

    }

    /** 
     *  移动吕布卡牌
    */
    private moveIcon_1() {
        CpSDK.EnterSection(3, "抽卡完成");
        let t = cc.tween;
        t(this.arr_Icon[1])
            .delay(0.5)
            .call(() => {
                this.arr_Logo.forEach((temp) => {
                    temp.active = false;
                });
                for (let i: number = 0; i < 5; i++) {
                    if (i == 1) continue;
                    this.arr_Icon[i].active = false;
                }
                this.arr_Anim_A.forEach((temp) => {
                    temp.node.active = false;
                });
                for (let i: number = 0; i < 5; i++) {
                    if (i == 1) continue;
                    this.arr_Anim_B[i].node.active = false;
                }
                this.arr_Anim_C.forEach((temp) => {
                    temp.node.active = false;
                });
                AudioManager.play('move');
            })
            .parallel(
                t().to(0.5, { scale: 1.8 }),
                t().to(0.5, { position: cc.v2(0, 0) })
            )
            .call(() => {
                AudioManager.play('appear');
                this.showKillEnemy();
            })
            .start();
    }

    /**
     * 点击上阵杀敌
     */
    public clickKillEnemy() {
        CpSDK.EnterSection(4, "开始战斗");
        this.hideNode(this.node_Mid, false);
        this.showNode(this.videoInterface, false);
        this.startVideo();
        this.btn_KillEnemy.enabled = false;
    }

    /**
     * 显示上阵杀敌按钮
     */
    private showKillEnemy() {
        this.hideNode(this.btn_RecruitHero.node, true);
        this.btn_KillEnemy.node.active = true;
        cc.tween(this.btn_KillEnemy.node)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                this.showBreathe(this.btn_KillEnemy.node);
            })
            .start();
    }

    /**
     * 呼吸效果
    */
    private showBreathe(node: cc.Node) {
        cc.tween(node)
            .to(0.4, { scale: 1.0 })
            .to(0.4, { scale: 1.2 })
            .union()
            .repeatForever()
            .start();
    }

    /** 
     *   游戏界面下载按钮
    */
    public downLoadGame() {
        CpSDK.ClickFinishDownloadBar(1, "游戏界面下载按钮");
    }

    /** 
     *   显示戳一戳效果
    */
    private showFingerPock() {
        cc.tween(this.finger)
            .by(0.3, { position: cc.v2(-30, 30) })
            .call(() => {
                cc.tween(this.img_CircleLight_1)
                    .to(0.4, { scale: 1.5, opacity: 255 })
                    .to(0.7, { scale: 3, opacity: 0 })
                    .to(0, { scale: 0.1 })
                    .start();
                cc.tween(this.img_CircleLight_2)
                    .delay(0.6)
                    .to(0.3, { scale: 1.5, opacity: 255 })
                    .to(0.5, { scale: 3, opacity: 0 })
                    .to(0, { scale: 0.3 })
                    .start();
            })
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .by(0.3, { position: cc.v2(30, -30) })
            .delay(0.5)
            .union()
            .repeatForever()
            .start();
    }
    /** 
    *   显示效果
    */
    private showNode(node: cc.Node, isAnim: boolean, num?: number) {
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
    *   隐藏效果
    */
    private hideNode(node: cc.Node, isAnim: boolean, num?: number) {
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
