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
import GlobalData from "./GlobalData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    node_Up: cc.Node = null;

    @property(cc.Node)
    node_Min: cc.Node = null;

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
    tooth_1: cc.Node = null;

    @property(cc.Node)
    tooth_2: cc.Node = null;

    @property(cc.Node)
    tooth_3: cc.Node = null;

    @property(cc.Node)
    mouth_1: cc.Node = null;

    @property(cc.Node)
    mouth_2: cc.Node = null;

    @property(cc.Node)
    mouth_3: cc.Node = null;

    @property(cc.Node)
    node_PickMe_1: cc.Node = null;

    @property(cc.Node)
    node_PickMe_2: cc.Node = null;

    @property(cc.Node)
    node_PickMe_3: cc.Node = null;

    @property(cc.Node)
    startFinger: cc.Node = null;

    @property(cc.Node)
    node_StartButton: cc.Node = null;

    @property(cc.Button)
    btn_ActiveRule: cc.Button = null;

    @property(cc.Sprite)
    sprite_Title: cc.Sprite = null;

    @property(cc.SpriteFrame)
    spriteFrame_Title: cc.SpriteFrame = null;

    private arr_CupShadow: cc.Node[] = [];

    private _leftPos: cc.Vec2 = cc.v2(-90, -90);
    private _rightPos: cc.Vec2 = cc.v2(90, 90);

    private _num: number = 0;

    private _pos1: cc.Vec2 = cc.v2(0, 0);
    private _pos2: cc.Vec2 = cc.v2(0, 0);
    private _pos3: cc.Vec2 = cc.v2(0, 0);

    private _isOverGame: boolean = false;
    private _isStartGame: boolean = false;

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
        this.showStartFinger();
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
        cc.tween(this.cup_1)
            .by(0.2, { position: cc.v2(6, 150), angle: -6 })
            .call(() => {
                this.hideNode(this.tooth_1);
                this.viewNode(this.mouth_1);
                cc.tween(this.cup_1)
                    .delay(0.5)
                    .by(0.2, { position: cc.v2(-6, -150), angle: 6 })
                    .call(() => {
                        this.viewNode(this.tooth_1);
                        this.hideNode(this.mouth_1);
                        cc.tween(this.cup_1)
                            .delay(0.3)
                            .call(() => {
                            })
                            .start();
                    })
                    .start();
            })
            .start();

        cc.tween(this.cup_2)
            .by(0.2, { position: cc.v2(6, 150), angle: -6 })
            .call(() => {
                this.hideNode(this.tooth_2);
                this.viewNode(this.mouth_2);
                cc.tween(this.cup_2)
                    .delay(0.5)
                    .by(0.2, { position: cc.v2(-6, -150), angle: 6 })
                    .call(() => {
                        this.viewNode(this.tooth_2);
                        this.hideNode(this.mouth_2);
                        cc.tween(this.cup_2)
                            .delay(0.3)
                            .call(() => {
                            })
                            .start();
                    })
                    .start();
            })
            .start();

        cc.tween(this.cup_3)
            .by(0.2, { position: cc.v2(6, 150), angle: -6 })
            .call(() => {
                this.hideNode(this.tooth_3);
                this.viewNode(this.mouth_3);
                cc.tween(this.cup_3)
                    .delay(0.5)
                    .by(0.2, { position: cc.v2(-6, -150), angle: 6 })
                    .call(() => {
                        this.viewNode(this.tooth_3);
                        this.hideNode(this.mouth_3);
                        cc.tween(this.cup_3)
                            .delay(0.3)
                            .call(() => {
                                this.rotateCup();
                                this._num++;
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    rotateCup() {
        this.turnRight2(this.arr_CupShadow[1], this.arr_CupShadow[2]);
    }

    randomPos() {
        this._num++;
        if (this._num >= 13) {
            switch (this.arr_CupShadow[1].name) {
                case 'cupShadow_1':
                    cc.tween(this.node_PickMe_1)
                        .by(0, { position: cc.v2(0, -20) })
                        .call(() => {
                            this.arr_CupShadow[0].setPosition(this._pos1);
                            this.arr_CupShadow[1].setPosition(this._pos2);
                            this.arr_CupShadow[2].setPosition(this._pos3);
                            let spriteNode = this.sprite_Title.node;
                            spriteNode.scale = 0;
                            cc.tween(spriteNode)
                                .to(0.5, { scale: 1 })
                                .start();
                            this.sprite_Title.spriteFrame = this.spriteFrame_Title;
                            this.btn_ActiveRule.enabled = true;
                            this.viewNode(this.node_PickMe_1);
                            this.viewNode(this.node_PickMe_2);
                            this.viewNode(this.node_PickMe_3);
                            this.shake(this.node_PickMe_1, this.node_PickMe_2, this.node_PickMe_3);

                        })
                        .start();
                    break;
                case 'cupShadow_2':
                    cc.tween(this.node_PickMe_2)
                        .by(0, { position: cc.v2(0, -20) })
                        .call(() => {
                            this.arr_CupShadow[0].setPosition(this._pos1);
                            this.arr_CupShadow[1].setPosition(this._pos2);
                            this.arr_CupShadow[2].setPosition(this._pos3);
                            let spriteNode = this.sprite_Title.node;
                            spriteNode.scale = 0;
                            cc.tween(spriteNode)
                                .to(0.5, { scale: 1 })
                                .start();
                            this.sprite_Title.spriteFrame = this.spriteFrame_Title;
                            this.btn_ActiveRule.enabled = true;
                            this.viewNode(this.node_PickMe_1);
                            this.viewNode(this.node_PickMe_2);
                            this.viewNode(this.node_PickMe_3);
                            this.shake(this.node_PickMe_1, this.node_PickMe_2, this.node_PickMe_3);

                        })
                        .start();
                    break;
                case 'cupShadow_3':
                    cc.tween(this.node_PickMe_3)
                        .by(0, { position: cc.v2(0, -20) })
                        .call(() => {
                            this.arr_CupShadow[0].setPosition(this._pos1);
                            this.arr_CupShadow[1].setPosition(this._pos2);
                            this.arr_CupShadow[2].setPosition(this._pos3);
                            let spriteNode = this.sprite_Title.node;
                            spriteNode.scale = 0;
                            cc.tween(spriteNode)
                                .to(0.5, { scale: 1 })
                                .start();
                            this.sprite_Title.spriteFrame = this.spriteFrame_Title;
                            this.btn_ActiveRule.enabled = true;
                            this.viewNode(this.node_PickMe_1);
                            this.viewNode(this.node_PickMe_2);
                            this.viewNode(this.node_PickMe_3);
                            this.shake(this.node_PickMe_1, this.node_PickMe_2, this.node_PickMe_3);

                        })
                        .start();
                    break;
            }
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
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(180, 20))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-180, -20))
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
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-180, -20))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(180, 20))
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
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(180, -20))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-180, 20))
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
            .bezierBy(0.28, this._leftPos, this._leftPos, cc.v2(-180, 20))
            .start();
        cc.tween(node2)
            .bezierBy(0.28, this._rightPos, this._rightPos, cc.v2(180, -20))
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
        this.overAnim(this.cup_1, this.tooth_1, this.mouth_1);
        GlobalData.instance.setGold(8);
    }
    chooseCup2() {
        this.overAnim(this.cup_2, this.tooth_2, this.mouth_2);
        GlobalData.instance.setGold(18);
    }
    chooseCup3() {
        this.overAnim(this.cup_3, this.tooth_3, this.mouth_3);
        GlobalData.instance.setGold(88);
    }

    overAnim(cup: cc.Node, tooth: cc.Node, mouth: cc.Node) {
        if (this._isOverGame) return;
        cc.tween(this.node)
            .call(() => {
                AudioManager.play('gold');
            })
            .start();
        cc.tween(cup)
            .by(0.2, { position: cc.v2(6, 150), angle: -6 })
            .call(() => {
                this.hideNode(tooth);
                this.viewNode(mouth);
                cc.tween(cup)
                    .delay(0.5)
                    .call(() => {
                        this.node.active = false;
                        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                    })
                    .start();
            })
            .start();
        this._isOverGame = true;
    }

    showStartFinger() {
        cc.tween(this.startFinger)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .delay(0.3)
            .call(() => {
                this.showStartFinger();
            })
            .start();
    }

    viewActiveRule() {
        this.viewNode(this.node_ActiveRule);
        this.hideNode(this.node_Up);
        this.hideNode(this.node_StartButton);
    }

    hideActiveRule() {
        this.hideNode(this.node_ActiveRule);
        this.viewNode(this.node_Up);
        if (this._isStartGame) return;
        this.viewNode(this.node_StartButton);
    }

    viewNode(node: cc.Node) {
        node.active = true;
    }

    hideNode(node: cc.Node) {
        node.active = false;
    }

    startGame() {
        AudioManager.play('start');
        this._isStartGame = true;
        this.showGold();
        this.hideNode(this.node_StartButton);
        this.btn_ActiveRule.enabled = false;
    }

    shake(node1: cc.Node, node2: cc.Node, node3: cc.Node) {
        cc.tween(node1)
            .by(0.1, { angle: 6 })
            .by(0.1, { angle: -6 })
            .by(0.1, { angle: -6 })
            .by(0.1, { angle: 6 })
            .union()
            .repeat(2)
            .delay(0.4)
            .call(() => {
                cc.tween(node2)
                    .by(0.1, { angle: 6 })
                    .by(0.1, { angle: -6 })
                    .by(0.1, { angle: -6 })
                    .by(0.1, { angle: 6 })
                    .union()
                    .repeat(2)
                    .delay(0.4)
                    .call(() => {
                        cc.tween(node3)
                            .by(0.1, { angle: 6 })
                            .by(0.1, { angle: -6 })
                            .by(0.1, { angle: -6 })
                            .by(0.1, { angle: 6 })
                            .union()
                            .repeat(2)
                            .delay(0.4)
                            .call(() => {
                                this.shake(node1, node2, node3);
                            })
                            .start();

                    })
                    .start();

            })
            .start();
    }
}
