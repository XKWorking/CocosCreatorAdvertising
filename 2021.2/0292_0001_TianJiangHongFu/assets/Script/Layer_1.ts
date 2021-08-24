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
import PoolManager from "./Manager/PoolManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    node_ObjsNode: cc.Node = null;

    @property(cc.Node)
    node_Mid: cc.Node = null;

    @property(cc.Node)
    node_Down: cc.Node = null;

    @property(cc.Label)
    txt_Time: cc.Label = null;

    @property(cc.Label)
    txt_Score: cc.Label = null;

    @property(cc.Node)
    couplet: cc.Node = null;

    @property(cc.Node)
    title: cc.Node = null;

    @property(cc.Node)
    finger_1: cc.Node = null;

    @property(cc.Node)
    finger_2: cc.Node = null;

    @property(cc.Node)
    finger_3: cc.Node = null;

    @property(cc.Node)
    btn_RedPacket: cc.Node = null;

    @property(cc.Node)
    btn_Blessing: cc.Node = null;

    @property(cc.Node)
    btn_Book: cc.Node = null;

    @property(cc.Node)
    redPacketPos: cc.Node = null;

    @property(cc.Node)
    blessingPos: cc.Node = null;

    @property(cc.Node)
    bookPos: cc.Node = null;

    @property([cc.Node])
    arr_Pos: cc.Node[] = [];

    @property([cc.Prefab])
    arr_Prefab: cc.Prefab[] = [];

    @property(cc.Prefab)
    scatterGold: cc.Prefab = null;

    @property(sp.Skeleton)
    redPacketFxPos: sp.Skeleton = null;

    @property(sp.Skeleton)
    blessingFxPos: sp.Skeleton = null;

    @property(sp.Skeleton)
    bookFxPos: sp.Skeleton = null;

    @property(cc.Node)
    comboNode: cc.Node = null;

    @property(cc.Label)
    txt_Combo: cc.Label = null;

    @property(cc.Node)
    eyelid: cc.Node = null;

    private _gameTime: number = 15;
    private _isGameStart: boolean = false;
    private _time: number = 0;
    private _isClick: boolean = true;
    private arr_Obj: cc.Node[] = [];
    private _gameScore: number = 0;
    private _fingerNum: number = 1;

    private _comboNum: number = 0;
    private _comboContentNum: number = 0;

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.init();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected init() {
        this.node_ObjsNode.active = false;
        this.node_Mid.active = false;
        this.node_Down.active = false;
        this.finger_1.active = false;
        this.finger_2.active = false;
        this.finger_3.active = false;
        this.comboNode.active = false;
        this.txt_Combo.node.opacity = 0;
        this.eyelid.opacity = 0;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
        cc.tween(this.couplet)
            .by(0.5, { position: cc.v2(0, -900) })
            .call(() => {
                this.viewTitleContent();
            })
            .start();
    }

    update(dt: number) {
        if (!this._isClick) {
            this._time += dt;
            if (this._time >= 0.2) {
                this._isClick = true;
                this._time = 0;
            }
        }
    }

    countDown() {
        if (this._gameTime >= 1) {
            this._gameTime = this._gameTime - 1;
            this.txt_Time.string = this._gameTime + 's';
        } else if (this._gameTime <= 0) {
            this.unschedule(this.countDown);
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            this._isGameStart = false;
        }
    }

    doWink() {
        cc.tween(this.eyelid)
            .to(0.1, { opacity: 255 }, { easing: 'fade' })
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .delay(2)
            .union()
            .repeatForever()
            .start();
    }
    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }

    viewTitleContent() {
        cc.tween(this.title)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .delay(1)
            .call(() => {
                this.closeTitleContent();
                this.viewGameContent();
            })
            .start();
    }
    closeTitleContent() {
        this.couplet.active = false;
        this.title.active = false;
    }

    viewGameContent() {
        for (let i: number = 0; i < 3; i++) {
            let obj = cc.instantiate(this.arr_Prefab[i]);
            obj.setParent(this.arr_Pos[i]);//PoolManager.instance.getNode(this.arr_Prefab[i], this.arr_Pos[i]);
            obj.setPosition(0, 0);
            this.arr_Obj.push(obj);
        }
        for (let i: number = 3; i < this.arr_Pos.length; i++) {
            let obj = cc.instantiate(Util.randomArray(this.arr_Prefab));
            obj.setParent(this.arr_Pos[i]);//PoolManager.instance.getNode(Util.randomArray(this.arr_Prefab), this.arr_Pos[i]);
            obj.setPosition(0, 0);
            this.arr_Obj.push(obj);
        }
        this.node_ObjsNode.active = true;
        this.node_Mid.active = true;
        this.node_Down.active = true;
        this.showFinger_1();
    }

    changeObjPos() {
        for (let i: number = 0; i < this.arr_Obj.length; i++) {
            this.arr_Obj[i].parent = this.arr_Pos[i];
        }
    }

    creatorNewObj() {
        this.changeObjPos();
        let newObj = cc.instantiate(Util.randomArray(this.arr_Prefab));
        newObj.setParent(this.arr_Pos[7]);
        newObj.setPosition(0, 0);
        this.arr_Obj.push(newObj);
    }
    hiddenComboFx() {
        this._comboNum = 0;
        this._comboContentNum = 0;
        this.comboNode.active = false;
    }
    clickRedPacketBtn() {
        if (!this._isClick) return;
        let t = cc.tween;
        t(this.btn_RedPacket)
            // 同时执行两个 cc.tween
            .parallel(
                t().to(0.1, { scale: 1.5 }),
                t().to(0.1, { opacity: 0 }, { easing: 'fade' })//
            )
            .call(() => {
                this.btn_RedPacket.scale = 1;
                this.btn_RedPacket.opacity = 255;
            })
            .start();
        this._isClick = false;
        if (this.arr_Obj[0].name === 'redPacket') {
            AudioManager.play('right');
            if (this._isGameStart) {
                this._comboNum++;
                if (this._comboNum > 1) {
                    this._comboContentNum++;
                    this.comboNode.active = true;
                    this.txt_Combo.string = this._comboContentNum.toString();
                    cc.tween(this.txt_Combo.node)
                        .to(0.1, { opacity: 0 }, { easing: 'fade' })
                        .to(0.1, { opacity: 255 }, { easing: 'fade' })
                        .start();
                }
            }
            this.creatorNewObj();
            let obj = this.arr_Obj.shift();
            let t = cc.tween;
            t(obj)
                .parallel(
                    t().to(0.35, { position: this.redPacketPos.getPosition() }),
                    t().to(0.4, { opacity: 0 }, { easing: 'fade' })
                )
                .call(() => {
                    obj.destroy();
                    if (this._fingerNum === 1) {
                        this._fingerNum++;
                        this.finger_1.active = false;
                        this.showFinger_2();
                    } else {
                        this._gameScore += Util.randomInteger(20, 50);
                        this.txt_Score.string = this._gameScore.toString();
                    }
                    this.redPacketFxPos.node.active = true;
                    this.redPacketFxPos.clearTracks();
                    this.redPacketFxPos.setAnimation(0, "texiao", false);
                    this.redPacketFxPos.setCompleteListener(() => {
                        this.redPacketFxPos.node.active = false;
                    });
                })
                .start();
        } else {
            AudioManager.play('wrong');
            this.hiddenComboFx();
        }
    }
    clickBlessingBtn() {
        if (!this._isClick) return;
        let t = cc.tween;
        t(this.btn_Blessing)
            // 同时执行两个 cc.tween
            .parallel(
                t().to(0.1, { scale: 1.5 }),
                t().to(0.1, { opacity: 0 }, { easing: 'fade' })
            )
            .call(() => {
                this.btn_Blessing.scale = 1;
                this.btn_Blessing.opacity = 255;
            })
            .start();
        this._isClick = false;
        if (this.arr_Obj[0].name === 'blessing') {
            AudioManager.play('right');
            if (this._isGameStart) {
                this._comboNum++;
                if (this._comboNum > 1) {
                    this._comboContentNum++;
                    this.comboNode.active = true;
                    this.txt_Combo.string = this._comboContentNum.toString();
                    cc.tween(this.txt_Combo.node)
                        .to(0.1, { opacity: 0 }, { easing: 'fade' })
                        .to(0.1, { opacity: 255 }, { easing: 'fade' })
                        .start();
                }
            }
            this.creatorNewObj();
            let obj = this.arr_Obj.shift();
            let t = cc.tween;
            t(obj)
                .parallel(
                    t().to(0.35, { position: this.blessingPos.getPosition() }),
                    t().to(0.4, { opacity: 0 }, { easing: 'fade' })
                )
                .call(() => {
                    obj.destroy();
                    if (this._fingerNum === 2) {
                        this._fingerNum++;
                        this.finger_2.active = false;
                        this.showFinger_3();
                    } else {
                        this._gameScore += Util.randomInteger(20, 50);
                        this.txt_Score.string = this._gameScore.toString();
                    }
                    this.blessingFxPos.node.active = true;
                    this.blessingFxPos.clearTracks();
                    this.blessingFxPos.setAnimation(0, "texiao", false);
                    this.blessingFxPos.setCompleteListener(() => {
                        this.blessingFxPos.node.active = false;
                    });
                })
                .start();
        } else {
            AudioManager.play('wrong');
            this.hiddenComboFx();
        }
    }
    clickBookBtn() {
        if (!this._isClick) return;
        let t = cc.tween;
        t(this.btn_Book)
            // 同时执行两个 cc.tween
            .parallel(
                t().to(0.1, { scale: 1.5 }),
                t().to(0.1, { opacity: 0 }, { easing: 'fade' })
            )
            .call(() => {
                this.btn_Book.scale = 1;
                this.btn_Book.opacity = 255;
            })
            .start();
        this._isClick = false;
        if (this.arr_Obj[0].name === 'book') {
            AudioManager.play('right');
            if (this._isGameStart) {
                this._comboNum++;
                if (this._comboNum > 1) {
                    this._comboContentNum++;
                    this.comboNode.active = true;
                    this.txt_Combo.string = this._comboContentNum.toString();
                    cc.tween(this.txt_Combo.node)
                        .to(0.1, { opacity: 0 }, { easing: 'fade' })
                        .to(0.1, { opacity: 255 }, { easing: 'fade' })
                        .start();
                }
            }
            this.creatorNewObj();
            let obj = this.arr_Obj.shift();
            let t = cc.tween;
            t(obj)
                .parallel(
                    t().to(0.35, { position: this.bookPos.getPosition() }),
                    t().to(0.4, { opacity: 0 }, { easing: 'fade' })
                )
                .call(() => {
                    obj.destroy();
                    if (this._fingerNum === 3) {
                        this._fingerNum++;
                        this.finger_3.active = false;
                        this.schedule(this.countDown, 1);
                        this._isGameStart = true;
                        this.doWink();
                    } else {
                        this._gameScore += Util.randomInteger(20, 50);
                        this.txt_Score.string = this._gameScore.toString();
                    }
                    this.bookFxPos.node.active = true;
                    this.bookFxPos.clearTracks();
                    this.bookFxPos.setAnimation(0, "texiao", false);
                    this.bookFxPos.setCompleteListener(() => {
                        this.bookFxPos.node.active = false;
                    });
                })
                .start();
        } else {
            AudioManager.play('wrong');
            this.hiddenComboFx();
        }
    }
    createScatterGold(parentNode: cc.Node) {
        let obj = cc.instantiate(this.scatterGold);
        obj.setParent(parentNode); obj.getPosition()
    }
    showFinger_1() {
        this.finger_1.active = true;
        cc.tween(this.finger_1)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .union()
            .repeatForever()
            .start();
    }
    showFinger_2() {
        this.finger_2.active = true;
        cc.tween(this.finger_2)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .union()
            .repeatForever()
            .start();
    }
    showFinger_3() {
        this.finger_3.active = true;
        cc.tween(this.finger_3)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .union()
            .repeatForever()
            .start();
    }
}
