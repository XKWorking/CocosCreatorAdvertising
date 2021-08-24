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
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Label)
    label_Time: cc.Label = null;

    @property(cc.Node)
    btnDownLoad: cc.Node = null;

    @property(cc.Node)
    imgIcon_1: cc.Node = null;

    @property(cc.Node)
    imgContent_1: cc.Node = null;

    @property(cc.Node)
    imgIcon_2: cc.Node = null;

    @property(cc.Node)
    imgContent_2: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    redPacketShade: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Node)
    btnRedPacket: cc.Node = null;
    // ================================================ //

    private _isGameOver: boolean = false;
    private _isExecuteNext: boolean = false;
    private _time: number = 0;
    private _isFirstExecute: boolean = true;
    private _isBeginSystemTime: boolean = false;
    private _systemDate: Date = new Date();
    private _systemBeginTime: number = 0;
    private _systemHourTime: number = 0;
    private _systemMinuteTime: number = 0;
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
        if (this._isGameOver) return;
        if (this._isExecuteNext) {
            this._time += dt;
            if (this._time >= 6) {
                this._time = 0;
                this._isExecuteNext = false;
                this.ExecuteNext();
            }
        }
        if (this._isBeginSystemTime) {
            this._systemBeginTime += dt;
            if (this._systemBeginTime >= 60) {
                this._systemBeginTime = 0;
                let systemDate: Date = new Date();
                this.label_Time.string = systemDate.getHours() + ':' + systemDate.getMinutes();
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
        this.GetSystemDate();
        let t = cc.tween;
        this.Shake(this.btnDownLoad);
        this.ShowNode(this.imgIcon_1, true, 0.3, () => {
            AudioManager.play('message');
            t(this.imgContent_1)
                .parallel(
                    t().to(0.2, { opacity: 255, }, { easing: 'fade' }),
                    t().to(0.4, { position: cc.v3(260, 0) }, { easing: 'fade' })
                )
                .delay(0.2)
                .call(() => {
                    this.ShowNode(this.imgIcon_2, true, 0.3, () => {
                        AudioManager.play('message');
                        t(this.imgContent_2)
                            .parallel(
                                t().to(0.2, { opacity: 255, }, { easing: 'fade' }),
                                t().to(0.4, { position: cc.v3(282, -38) }, { easing: 'fade' })
                            )
                            .delay(1.5)
                            .call(() => {
                                this.ShowNode(this.finger, true, 0.3, () => {
                                    this.showPock(this.finger);
                                })
                                this._isExecuteNext = true;
                            })
                            .start();
                    })
                })
                .start();
        })
    }

    private GetSystemDate() {
        // console.log(this._systemDate.getHours());
        // console.log(this._systemDate.getMinutes());
        // console.log(this._systemDate.getSeconds());

        //         myDate.getHours();       //获取当前小时数(0-23)
        // myDate.getMinutes();     //获取当前分钟数(0-59)
        // myDate.getSeconds();     //获取当前秒数(0-59)
        this._systemBeginTime = this._systemDate.getSeconds();
        this._isBeginSystemTime = true;
        this._systemHourTime = this._systemDate.getHours();
        this._systemMinuteTime = this._systemDate.getMinutes();
        if (this._systemHourTime < 10) {
            this.label_Time.string = '0' + this._systemHourTime + ':' + this._systemMinuteTime;
            return;
        }
        if (this._systemMinuteTime < 10) {
            this.label_Time.string = this._systemHourTime + ':' + '0' + this._systemMinuteTime;
            return;
        }
        this.label_Time.string = this._systemHourTime + ':' + this._systemMinuteTime;
    }

    /**
     * 游戏结束
     */
    private GameOver() {
        if (this._isGameOver) return;
        this._isGameOver = true;
        this.redPacketShade.active = false;
        this.finger.opacity = 255;
        this.finger.parent = this.node;
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }


    private ExecuteNext() {
        if (this._isFirstExecute) {
            this.ClickRedPacket();
        } else {
            this.ClickOpenRedPacket();
        }
    }

    public ClickRedPacket() {
        CpSDK.FirstTouch();
        AudioManager.play('button');
        this.imgContent_2.stopAllActions();
        this.finger.stopAllActions();
        this.HideNode(this.finger, true, 0.3, null);
        this.ShowRedPack();
        this._time = 0;
        this._isFirstExecute = false;
        this._isExecuteNext = false;
    }

    private ShowRedPack() {
        this.redPacketShade.active = true;
        this.redPacket.active = true;
        let t = cc.tween;
        t(this.redPacket)
            .to(0.3, { scale: 1 }, { easing: 'backOut' })
            .to(0.2, { scale: 0.9 }, { easing: 'backOut' })
            .to(0.2, { scale: 1 }, { easing: 'backOut' })
            .to(0.2, { scale: 0.95 }, { easing: 'backOut' })
            .to(0.2, { scale: 1 }, { easing: 'backOut' })
            .union()
            .call(() => {
                this.btnRedPacket.getComponent(cc.Button).enabled = true;
                this.showBreathe(this.btnRedPacket);
                this.finger.stopAllActions();
                this.finger.parent = this.btnRedPacket.parent;
                this.finger.setPosition(cc.v2(90, -90));
                t(this.finger)
                    .delay(2)
                    .call(() => {
                        this.ShowNode(this.finger, true, 0.3, () => {
                            this.showPock(this.finger);
                        })
                        this._isExecuteNext = true;
                    })
                    .start();
            })
            .start();
    }

    private showBreathe(node: cc.Node) {
        cc.tween(node)
            .to(0.5, { scale: 0.8 })
            .to(0.5, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }

    public ClickOpenRedPacket() {
        AudioManager.play('button');
        this.btnRedPacket.getComponent(cc.Button).enabled = false;
        this.ShowOpenRedPacketEffect();
        this._time = 0;
        this._isFirstExecute = false;
        this.finger.stopAllActions();
        this.finger.active = false;
    }

    private ShowOpenRedPacketEffect() {
        cc.tween(this.btnRedPacket.parent)
            .to(0.2, { scale: 1.5 })
            .delay(0.1)
            .to(0.2, { scale: 1 })
            .call(() => {
                this.GameOver();
            })
            .start();
        cc.tween(this.btnRedPacket)
            .to(0.05, { scaleX: 0, scaleY: 1 })
            .to(0.05, { scaleX: -1, scaleY: 1 })
            .to(0.05, { scaleX: 0, scaleY: 1 })
            .to(0.05, { scaleX: 1, scaleY: 1 })
            .delay(0.1)
            .to(0.05, { scaleX: 0, scaleY: 1 })
            .to(0.05, { scaleX: -1, scaleY: 1 })
            .to(0.05, { scaleX: 0, scaleY: 1 })
            .to(0.05, { scaleX: 1, scaleY: 1 })
            .union()
            .start();

    }



    /**
   * 激活节点
   * @param node 要激活的节点 
   * @param isAnim 是否有0.5s的缓动效果
   * @param callback 回调函数
   * @param time 缓动时间
   * @param num 透明度，不输入则为255
   */
    private ShowNode(node: cc.Node, isAnim: boolean, time: number, callback: CallableFunction, num?: number) {
        node.active = true;
        if (num == null) {
            num = 255;
        }
        if (isAnim) {
            cc.tween(node)
                .to(time, { opacity: num }, { easing: 'fade' })
                .call(() => {
                    if (callback == null) return;
                    callback();
                })
                .start();
        } else {
            node.opacity = num;
        }
    }
    /**
     * 关闭节点
     * @param node 要关闭的节点 
     * @param isAnim 是否有0.5s的缓动效果
   * @param callback 回调函数
   * @param time 缓动时间
     * @param num 透明度，不输入则为0
     */
    private HideNode(node: cc.Node, isAnim: boolean, time: number, callback: CallableFunction, num?: number) {
        if (num == null) {
            num = 0;
        }
        if (isAnim) {
            cc.tween(node)
                .to(0.5, { opacity: num }, { easing: 'fade' })
                .call(() => {
                    if (num != 0) return;
                    node.active = false;
                    if (callback == null) return;
                    callback();
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

    public ClickGameInterfaceDownLoad() {
        AudioManager.play('button');
        CpSDK.ClickFinishDownloadBar(1, "游戏界面下载按钮");
    }

    /**
     * 显示戳一戳效果
     */
    private showPock(node: cc.Node) {
        cc.tween(node)
            .by(0.3, { position: cc.v3(30, -30) })
            .by(0.3, { position: cc.v3(-30, 30) })
            .by(0.3, { position: cc.v3(30, -30) })
            .by(0.3, { position: cc.v3(-30, 30) })
            .delay(0.3)
            .union()
            .repeatForever()
            .start();
    }


}
