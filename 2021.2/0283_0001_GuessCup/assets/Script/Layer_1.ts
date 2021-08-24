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
    @property(cc.Button)
    btn_ActiveRule: cc.Button = null;
    @property(cc.Node)
    node_ActiveRule: cc.Node = null;

    @property(cc.Node)
    cupShadow_1: cc.Node = null;

    @property(cc.Node)
    cupShadow_2: cc.Node = null;

    @property(cc.Node)
    cupShadow_3: cc.Node = null;

    @property(cc.Node)
    cup_1: cc.Node = null;

    @property(cc.Node)
    cup_2: cc.Node = null;

    @property(cc.Node)
    cup_3: cc.Node = null;

    @property(cc.Node)
    gold_1: cc.Node = null;

    @property(cc.Node)
    gold_2: cc.Node = null;

    @property(cc.Node)
    gold_3: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property([cc.Button])
    arr_button: cc.Button[] = [];

    private arr_CupShadow: cc.Node[] = [];

    private _leftPos: cc.Vec2 = cc.v2(-115, -115);
    private _rightPos: cc.Vec2 = cc.v2(115, 115);

    private _num: number = 0;

    private _pos1: cc.Vec2 = cc.v2(0, 0);
    private _pos2: cc.Vec2 = cc.v2(0, 0);
    private _pos3: cc.Vec2 = cc.v2(0, 0);

    private _isOver: boolean = false;

    private _index = 0;

    onLoad() {
        super.onResize();
        this.onBindTouch();
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
        this.arr_CupShadow.push(this.cupShadow_1);
        this.arr_CupShadow.push(this.cupShadow_2);
        this.arr_CupShadow.push(this.cupShadow_3);
        this._pos1 = this.arr_CupShadow[0].getPosition();
        this._pos2 = this.arr_CupShadow[1].getPosition();
        this._pos3 = this.arr_CupShadow[2].getPosition();
        this.showGold();
        this.cupEnable(false);
        this.finger.active = false;
    }

    update(dt: number) {

    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }

    showGold() {
        cc.tween(this.node)
            .delay(0.9)
            .call(() => {
                AudioManager.play('click');
            })
            .start();
        cc.tween(this.cup_2)
            .delay(0.9)
            .by(0.2, { position: cc.v2(0, 150) })
            .delay(1.5)
            .by(0.2, { position: cc.v2(0, -150) })
            .delay(0.8)
            .call(() => {
                this.rotateCup();
                this._num++;
            })
            .start();
    }

    rotateCup() {
        this.turnRight2(this.arr_CupShadow[1], this.arr_CupShadow[2]);
    }

    randomPos() {
        this.arr_CupShadow[0].setPosition(this._pos1);
        this.arr_CupShadow[1].setPosition(this._pos2);
        this.arr_CupShadow[2].setPosition(this._pos3);

        this._num++;
        if (this._num >= 11) {

            this.showFinger();
            this.cupEnable(true);
        }
        else {
            let num = Util.randomInteger(0, 2);
            if (num == 0) {
                this.turnRight1(this.arr_CupShadow[0], this.arr_CupShadow[1]);
            } else if (num == 1) {
                let num1 = Util.randomInteger(0, 1);
                if (num1 == 0) {
                    this.turnLeft2(this.arr_CupShadow[1], this.arr_CupShadow[0]);
                } else {
                    this.turnRight2(this.arr_CupShadow[1], this.arr_CupShadow[2]);
                }
            } else {
                this.turnLeft3(this.arr_CupShadow[2], this.arr_CupShadow[1]);
            }
        }
    }


    turnRight1(node1: cc.Node, node2: cc.Node) {
        node2.setSiblingIndex(3);
        cc.tween(node1)
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(230, 0))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-230, 0))
            .call(() => {
                let cup1 = this.arr_CupShadow.indexOf(node1);
                let cup2 = this.arr_CupShadow.indexOf(node2);
                this.arr_CupShadow[cup1] = null;
                this.arr_CupShadow[cup2] = null;
                this.arr_CupShadow[cup1] = node2;
                this.arr_CupShadow[cup2] = node1;
                this.randomPos();
            })
            .start();
    }

    turnLeft2(node1: cc.Node, node2: cc.Node) {
        node1.setSiblingIndex(3);
        cc.tween(node1)
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-230, 0))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(230, 0))
            .call(() => {
                let cup1 = this.arr_CupShadow.indexOf(node1);
                let cup2 = this.arr_CupShadow.indexOf(node2);
                this.arr_CupShadow[cup1] = null;
                this.arr_CupShadow[cup2] = null;
                this.arr_CupShadow[cup1] = node2;
                this.arr_CupShadow[cup2] = node1;
                this.randomPos();
            })
            .start();
    }


    turnRight2(node1: cc.Node, node2: cc.Node) {
        node2.setSiblingIndex(3);
        cc.tween(node1)
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(230, 0))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-230, 0))
            .call(() => {
                let cup1 = this.arr_CupShadow.indexOf(node1);
                let cup2 = this.arr_CupShadow.indexOf(node2);
                this.arr_CupShadow[cup1] = null;
                this.arr_CupShadow[cup2] = null;
                this.arr_CupShadow[cup1] = node2;
                this.arr_CupShadow[cup2] = node1;
                this.randomPos();
            })
            .start();

    }
    turnLeft3(node1: cc.Node, node2: cc.Node) {
        node1.setSiblingIndex(3);
        cc.tween(node1)
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-230, 0))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(230, 0))
            .call(() => {
                let cup1 = this.arr_CupShadow.indexOf(node1);
                let cup2 = this.arr_CupShadow.indexOf(node2);
                this.arr_CupShadow[cup1] = null;
                this.arr_CupShadow[cup2] = null;
                this.arr_CupShadow[cup1] = node2;
                this.arr_CupShadow[cup2] = node1;
                this.randomPos();

            })
            .start();
    }

    chooseCup1() {
        this.overAnim(this.cup_1, this.gold_1);
        CpSDK.FirstTouch();
    }
    chooseCup2() {
        this.overAnim(this.cup_2, this.gold_2);
        CpSDK.FirstTouch();
    }
    chooseCup3() {
        this.overAnim(this.cup_3, this.gold_3);
        CpSDK.FirstTouch();
    }

    overAnim(cup: cc.Node, gold: cc.Node) {
        this.finger.opacity = 0;
        this._isOver = true;
        this.cupEnable(false);
        cc.tween(this.node)
            .call(() => {
                AudioManager.play('click');
            })
            .start();
        cc.tween(cup)
            .by(0.2, { position: cc.v2(0, 150) })
            .delay(0.5)
            .call(() => {
                LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            })
            .start();
    }

    showFinger() {
        if (this._isOver) return;
        this.finger.setSiblingIndex(4);
        this.finger.active = true;
        this._index++;
        if (this._index >= this.arr_button.length) {
            this._index = 0;
        }
        let pos = this.arr_button[this._index].node.parent.position;
        pos.x += 35;
        pos.y += 90;
        this.finger.setPosition(pos);
        cc.tween(this.finger)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .delay(0.5)
            .call(() => {
                this.showFinger();
            })
            .start();
    }

    cupEnable(istrue: boolean) {
        if (istrue) {
            this.arr_button.forEach((temp) => {
                temp.enabled = true;
            });
        } else {
            this.arr_button.forEach((temp) => {
                temp.enabled = false;
            });
        }
    }
    viewActiveRule() {
        this.viewNode(this.node_ActiveRule);
    }

    hideActiveRule() {
        this.hideNode(this.node_ActiveRule);
    }

    viewNode(node: cc.Node) {
        node.active = true;
    }

    hideNode(node: cc.Node) {
        node.active = false;
    }
}
