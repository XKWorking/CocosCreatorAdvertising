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
import { globalData } from "./Config/SystemConfig";
import Counter from "./Components/Counter";
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";
import GlobalData from "./GlobalData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    actContent: cc.Node = null;
    @property(cc.Node)
    startNode: cc.Node = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;
    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Node)
    knifeParent: cc.Node = null;

    @property(cc.Node)
    knifeShadow: cc.Node = null;

    // @property(cc.MotionStreak)
    // knifeShadowMotionStreak:cc.MotionStreak=null;

    @property(cc.Label)
    label_GameTime: cc.Label = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    objParent: cc.Node = null;

    @property(cc.Prefab)
    pre_AddScore: cc.Prefab = null;

    @property([cc.Node])
    arr_ProgressBarRedPacket: cc.Node[] = [];

    @property([cc.Prefab])
    arr_Objs: cc.Prefab[] = [];

    @property([cc.Node])
    arr_EndPosNode: cc.Node[] = [];
    // ================================================ //
    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _gameTime: number = 15;
    private _isMoveFinger: boolean = false;
    private _isCreateObj: boolean = false;
    private _createStartTime: number = 0;
    private _createEndTime: number = 0;
    private _arr_AllObj: cc.Node[] = [];
    private _isStartCreate: boolean = true;
    private _arr_StartAllObj: cc.Node[] = [];


    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
    }

    update(dt: number) {
        if (this._isCreateObj) {
            this._createStartTime += dt;
            if (this._createStartTime >= this._createEndTime) {
                this._createStartTime = 0;
                this._createEndTime = Util.random(0.5, 2);
                let pre = Util.randomArray(this.arr_Objs);
                let obj = cc.instantiate(pre);
                this._arr_AllObj.push(obj);
                obj.setParent(this.objParent);
                obj.setPosition(cc.v2(0, 0));
                let index: number = Util.randomInteger(0, 10);
                this.moveUp(obj, index);

            }
        }
        if (this._isStartCreate) {
            this._createStartTime += dt;
            if (this._createStartTime >= this._createEndTime) {
                this._createStartTime = 0;
                this._createEndTime = Util.random(0.5, 2);
                let pre = Util.randomArray(this.arr_Objs);
                let obj = cc.instantiate(pre);
                this._arr_StartAllObj.push(obj);
                obj.setParent(this.objParent);
                obj.setPosition(cc.v2(0, 0));
                let index: number = Util.randomInteger(0, 10);
                this.moveUp(obj, index);
            }
        }

    }

    initGame() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
        this.showNode(this.startNode, false);
        this.showNode(this.finger, false);
        this.showFingerPock();
        this.hideNode(this.knifeShadow, false);
    }
    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (!this._isGameStart) return;
        this.knifeShadow.setPosition(e.getLocation());
        this.knifeShadow.stopAllActions();
        this.showNode(this.knifeShadow, false);
        if (this._isMoveFinger) {
            this.finger.stopAllActions();
            this.hideNode(this.finger, true);
            this.schedule(this.countDown, 1);
            this._isMoveFinger = false;
        }
    }
    onTouchMove(e: cc.Event.EventTouch) {
        if (!this._isGameStart) return;
        this.knifeShadow.setPosition(e.getLocation());
    }
    onTouchEnd(e: cc.Event.EventTouch) {
        if (!this._isGameStart) return;
        this.hideNode(this.knifeShadow, true);
    }
    onTouchCancel(e: cc.Event.EventTouch) {
        if (!this._isGameStart) return;
        this.hideNode(this.knifeShadow, true);
    }

    private firstCastObj() {
        let pre = Util.randomArray(this.arr_Objs);
        let obj = cc.instantiate(pre);
        let pos = Util.randomArray(this.arr_EndPosNode).getPosition();
        obj.setParent(this.objParent);
        obj.setPosition(cc.v2(0, 0));
        obj.getComponent(cc.Collider).tag = 1;
        cc.tween(obj)
            .by(2, { angle: -360 })
            .repeatForever()
            .start();
        cc.tween(obj)
            .to(2, { position: pos }, { easing: 'quadOut' })
            .call(() => {
                obj.stopAllActions();
                this.finger.parent = this.objParent;
                let pos = obj.getPosition();
                pos.y -= 50;
                this.finger.setPosition(pos);
                this.showFingerMove();
                this._isGameStart = true;
            })
            .start();
    }
    public startCreateObj() {
        this._isCreateObj = true;
    }
    private countDown() {
        this._gameTime--;
        this.label_GameTime.string = this._gameTime + 's';
        if (this._gameTime === 0) {
            this.unschedule(this.countDown);
            this._arr_AllObj.forEach((temp) => {
                if (temp.activeInHierarchy) {
                    temp.stopAllActions();
                }
            });
            this._isCreateObj = false;
            if (this._isGameOver) return;
            this._isGameOver = true;
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
        }
    }

    public showActRule() {
        AudioManager.play('click');
        this.showNode(this.actContent, true);
    }

    public hideActRule() {
        AudioManager.play('click');
        this.hideNode(this.actContent, true);
    }

    public clickBtnStart() {
        this._isStartCreate = false;
        this._arr_StartAllObj.forEach((temp) => {
            if (temp.activeInHierarchy) {
                temp.destroy();
            }
        });
        this._createStartTime = 0;
        this._createEndTime = 0.1;
        this.hideNode(this.startNode, true);
        this.finger.stopAllActions();
        this.hideNode(this.finger, true);
        this.arr_ProgressBarRedPacket.forEach((temp) => {
            this.shake(temp);
        });
        this.knifeParent.scale = this.knifeParent.scale / globalData.scale;
        this.firstCastObj();
        AudioManager.play('click');
    }
    private moveUp(node: cc.Node, index: number) {
        cc.tween(node)
            .by(2, { angle: -360 })
            .repeatForever()
            .start();
        let pos: cc.Vec2 = this.arr_EndPosNode[index].getPosition();
        let num: number = index;
        cc.tween(node)
            .to(3, { position: pos }, { easing: 'quadOut' })
            .call(() => {
                if (num <= 4) {
                    this.moveDownLeft(node);
                } else {

                    this.moveDownRight(node);
                }
            })
            .start();
    }
    private moveDownLeft(node: cc.Node) {
        cc.tween(node)
            .by(3, { position: cc.v2(-500, -2000) }, { easing: 'quadIn' })
            .call(() => {
                node.destroy();
            })
            .start();

    }
    private moveDownRight(node: cc.Node) {
        cc.tween(node)
            .by(3, { position: cc.v2(500, -2000) }, { easing: 'quadIn' })
            .call(() => {
                node.destroy();
            })
            .start();

    }


    private getProgress() {
        return this.progressBar.progress;
    }
    public addProgress(num: number) {
        let bar: number = 0;
        bar = this.getProgress() * 100;
        bar += num;
        this.progressBar.progress = bar / 100;
        if (this.getProgress() >= 1) {
            this.progressBar.progress = 1;
        }

        if (this.getProgress() >= 0.2) {
            this.fallRedPacket(this.arr_ProgressBarRedPacket[0]);
        }
        if (this.getProgress() >= 0.32) {
            this.fallRedPacket(this.arr_ProgressBarRedPacket[1]);
        }
        if (this.getProgress() >= 1) {
            this.fallRedPacket(this.arr_ProgressBarRedPacket[2]);
        }
    }
    private fallRedPacket(node: cc.Node) {
        cc.tween(node)
            .by(2, { position: cc.v2(0, -2000) })
            .call(() => {
                this.hideNode(node, false);
            })
            .start();
    }

    private shake(node: cc.Node) {
        cc.tween(node)
            .by(0.1, { angle: 6 })
            .by(0.1, { angle: -6 })
            .by(0.1, { angle: -6 })
            .by(0.1, { angle: 6 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }

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

    private showFingerPock() {
        cc.tween(this.finger)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .delay(0.3)
            .union()
            .repeatForever()
            .start();
    }

    private showFingerMove() {
        this._isMoveFinger = true;
        this.showNode(this.finger, false);
        cc.tween(this.finger)
            .by(0.6, { position: cc.v2(120, 0) })
            .by(0.3, { position: cc.v2(-120, 0) })
            .union()
            .repeatForever()
            .start();
    }

    public scatterGold(GoldNode: cc.Node) {
        let v = 1000;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < 5; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.changePos(star, GoldNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-15, 15), y: Util.random(-15, 15), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.changePos(star, this.node_EndPos) })
                .call(() => {
                    star.destroy();
                    this.addProgress(2);
                    AudioManager.play('gold');
                    if (i == 4) {
                        GoldNode.destroy();
                        if (this._isGameOver) return;
                        if (this.getProgress() >= 1) {
                            this._isCreateObj = false;
                            this.unschedule(this.countDown);
                            this._arr_AllObj.forEach((temp) => {
                                if (temp.activeInHierarchy) {
                                    temp.stopAllActions();
                                }
                            });
                            this._isGameOver = true;
                            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                        }
                    }
                })
                .start();
        }
    }
    private changePos(node1: cc.Node, node2: cc.Node) {
        let wordPoint = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }

}
