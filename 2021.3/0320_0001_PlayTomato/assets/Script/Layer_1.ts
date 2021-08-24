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

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Node)
    bulletFX_1: cc.Node = null;

    @property(cc.Node)
    bulletFX_2: cc.Node = null;

    @property(cc.Node)
    bulletFX_3: cc.Node = null;

    @property(cc.Node)
    bullet_1: cc.Node = null;

    @property(cc.Node)
    bullet_2: cc.Node = null;

    @property(cc.Node)
    bullet_3: cc.Node = null;

    @property(cc.Node)
    ropeHead: cc.Node = null;

    @property(cc.Node)
    ropeEnd: cc.Node = null;

    @property(cc.Node)
    ropeCutNode: cc.Node = null;

    @property(cc.Prefab)
    pre_RopeCut: cc.Prefab = null;

    @property(cc.Node)
    firePos: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    circle: cc.Node = null;

    @property(cc.Node)
    left_Lantern: cc.Node = null;

    @property(cc.Node)
    right_Lantern: cc.Node = null;

    @property(cc.Prefab)
    logeBroken: cc.Prefab = null;

    @property([cc.Node])
    arr_ScorePos: cc.Node[] = [];

    @property([cc.Node])
    arr_ScoreView: cc.Node[] = [];
    // ================================================ //
    private _goldScore: number = 0;
    private _currentNode: cc.Node = null;
    private _currentFx: cc.Node = null;
    private _softDegree: number = 22;
    private _arr_RopeCutArray: cc.Node[] = [];//存放所有绳子小节的数组
    private _maxLength: number = 0;
    private _isClick: boolean = false;
    private _isStart: boolean = true;

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
        this.createRope();
        this._currentNode = this.bullet_1;
        this._currentFx = this.bulletFX_1;
        cc.tween(this._currentNode)
            .delay(1)
            .call(() => {
                this.bulletMoveAnim();
            })
            .start();
    }

    update(dt: number) {
    }

    initGame() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        this.hideNode(this.finger, false);
        this.hideNode(this.circle, false);
        this.shakeLantern();
        this.shake(this.arr_ScorePos[4]);
    }

    changeNode() {
        let pos = this._currentNode.getPosition();
        this.createLogoBroken(pos);
        let node = this._currentNode;
        AudioManager.play('redPacket');
        this.scatterGold(node);
        this._currentNode.active = false;
        this._currentNode = null;
        this._currentFx = null;
    }
    changeNode_1() {
        let pos = this._currentNode.getPosition();
        this.createLogoBroken(pos);
        this._currentNode.active = false;
        this._currentNode = null;
        this._currentFx = null;
        if (!this.bullet_1.activeInHierarchy) {
            if (this.bullet_2.activeInHierarchy) {
                this._currentNode = this.bullet_2
                this._currentFx = this.bulletFX_2;
            } else {
                if (this.bullet_3.activeInHierarchy) {
                    this._currentNode = this.bullet_3;
                    this._currentFx = this.bulletFX_3;
                } else {
                    LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                }
            }
        }
        cc.tween(this._currentNode)
            .delay(0.1)
            .call(() => {
                this.bulletMoveAnim();
            })
            .start();
    }
    bulletMoveAnim() {
        if (!this._isStart) {
            cc.director.getPhysicsManager().enabled = false;
        }
        cc.tween(this._currentNode)
            .to(0.8, { position: this.node2Ctnode1(this._currentNode, this.firePos) })
            .call(() => {
                this._currentNode.setParent(this.firePos);
                this._currentNode.setPosition(cc.v2(0, 0));
                this._isClick = true;
                if (this._isStart) {
                    this.showFinger();
                    this.moveFinger();
                } else {
                    cc.director.getPhysicsManager().enabled = true;
                }
            })
            .start();
    }
    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }
    onTouchMove(event) {
        if (!this._isClick) return;
        let variate = event.getDelta().y;
        if (variate < 0) {
            if (this._maxLength >= 10) {
                this._maxLength = 10;
            } else {
                this._maxLength += 0.4;
                this._currentNode.y -= 8;
                this._arr_RopeCutArray.forEach((temp) => {
                    temp.getComponent(cc.RopeJoint).maxLength += 0.4;
                    temp.getComponent(cc.RopeJoint).apply();
                });
            }
        } else if (variate > 0) {
            if (this._maxLength <= 0) {
                this._maxLength = 0;
            } else {
                this._maxLength -= 0.4;
                this._currentNode.y += 8;
                this._arr_RopeCutArray.forEach((temp) => {
                    temp.getComponent(cc.RopeJoint).maxLength -= 0.4;
                    temp.getComponent(cc.RopeJoint).apply();
                });
            }

        }
    }
    onTouchEnd(event) {
        if (!this._isClick) return;
        if (this._maxLength == 0) return;
        this.showNode(this._currentFx, false);
        if (this._maxLength > 0 && this._maxLength <= 1) {
            GlobalData.instance.setPowerNum(1);
        } else if (this._maxLength > 1 && this._maxLength <= 2) {
            GlobalData.instance.setPowerNum(2);
        } else if (this._maxLength > 2 && this._maxLength <= 3) {
            GlobalData.instance.setPowerNum(3);
        } else if (this._maxLength > 3 && this._maxLength <= 4) {
            GlobalData.instance.setPowerNum(4);
        } else if (this._maxLength > 4 && this._maxLength <= 5) {
            GlobalData.instance.setPowerNum(5);
        } else if (this._maxLength > 5 && this._maxLength <= 6) {
            GlobalData.instance.setPowerNum(6);
        } else if (this._maxLength > 6 && this._maxLength <= 7) {
            GlobalData.instance.setPowerNum(7);
        } else if (this._maxLength > 7 && this._maxLength <= 8) {
            GlobalData.instance.setPowerNum(8);
        } else if (this._maxLength > 8 && this._maxLength <= 9.5) {
            GlobalData.instance.setPowerNum(9);
        } else {
            GlobalData.instance.setPowerNum(10);
        }
        this.moveUp(GlobalData.instance.getPowerNum());
        this._arr_RopeCutArray.forEach((temp) => {
            temp.getComponent(cc.RopeJoint).maxLength = 10;
            temp.getComponent(cc.RopeJoint).apply();
        });
        this._isClick = false;
        this._maxLength = 0;
    }
    moveUp(powerNum: number) {
        AudioManager.play('launch');
        switch (powerNum) {
            case 1:
                cc.tween(this._currentNode)
                    .to(3, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[4]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.changeNode();
                    })
                    .start();
                break;
            case 2:
                cc.tween(this._currentNode)
                    .to(3, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[3]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.changeNode();
                    })
                    .start();
                break;
            case 3:
                cc.tween(this._currentNode)
                    .to(3, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[2]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.changeNode();
                    })
                    .start();
                break;
            case 4:
                cc.tween(this._currentNode)
                    .to(3, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[1]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.changeNode();
                    })
                    .start();
                break;
            case 5:
                cc.tween(this._currentNode)
                    .to(3, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[0]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.changeNode();
                    })
                    .start();
                break;
            case 6:
                cc.tween(this._currentNode)
                    .by(3, { position: cc.v2(0, 2400) }, { easing: 'cubicOut' })
                    .start();
                break;
            case 7:
                cc.tween(this._currentNode)
                    .by(3, { position: cc.v2(0, 2600) }, { easing: 'cubicOut' })
                    .start();
                break;
            case 8:
                cc.tween(this._currentNode)
                    .by(3, { position: cc.v2(0, 2800) }, { easing: 'cubicOut' })
                    .start();
                break;
            case 9:
                cc.tween(this._currentNode)
                    .by(3, { position: cc.v2(0, 3000) }, { easing: 'cubicOut' })
                    .start();
                break;
            case 10:
                cc.tween(this._currentNode)
                    .by(3, { position: cc.v2(0, 3200) }, { easing: 'cubicOut' })
                    .start();
                break;
        }
    }
    moveDown(powerNum: number) {
        switch (powerNum) {
            case 6:
                cc.tween(this._currentNode)
                    .to(2, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[1]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(1);
                        this.changeNode();
                    })
                    .start();
                break;
            case 7:
                cc.tween(this._currentNode)
                    .to(3, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[2]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(2);
                        this.changeNode();
                    })
                    .start();
                break;
            case 8:
                cc.tween(this._currentNode)
                    .to(4, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[3]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(3);
                        this.changeNode();
                    })
                    .start();
                break;
            case 9:
                cc.tween(this._currentNode)
                    .to(5, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[4]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(4);
                        this.changeNode();
                    })
                    .start();
                break;
            case 10:
                cc.tween(this._currentNode)
                    .to(6, { position: this.node2Ctnode1(this._currentNode, this.arr_ScorePos[5]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.changeNode_1();
                    })
                    .start();
                break;
        }
    }
    createLogoBroken(pos: cc.Vec2) {
        let obj = cc.instantiate(this.logeBroken);
        this.firePos.addChild(obj);
        obj.setPosition(pos);
        let anim = obj.getComponent(sp.Skeleton);
        anim.clearTracks();
        anim.setAnimation(0, 'texiao', false);
        anim.setCompleteListener(() => {
            obj.destroy();
        });
        this.hideNode(this.finger, true);
        this.hideNode(this.circle, true)
    }
    createRope() {

        //遍历这个数组
        for (var i = 0; i < this._softDegree; i++) {
            this._arr_RopeCutArray.push(cc.instantiate(this.pre_RopeCut)); //生成新的绳子小节存放到数组中
            this.ropeCutNode.addChild(this._arr_RopeCutArray[i]); //将绳子小节添加为Canvas的子节点，这里的this.node指的是Canvas

            //如果是第一个绳子小节，那么它的Connected Body就应该是anchor
            if (i == 0) {
                this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).connectedBody = this.ropeHead.getComponent(cc.RigidBody);
                //修改绳子的最大长度
                this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).maxLength = this._arr_RopeCutArray[i].width;//(this.ropeHead.width + ropeCutArray[i].width) / 2;
            }
            //如果是第2~n个绳子小节，那么它的Connected Body就应该是上一个绳子小节，直接数组索引-1就可以得到
            else {
                this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).connectedBody = this._arr_RopeCutArray[i - 1].getComponent(cc.RigidBody);
                //修改绳子的最大长度
                this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).maxLength = this._arr_RopeCutArray[i].width;
            }

            //修改完RopeJoint的属性之后一定要调用apply()方法，不然所有修改都无效！
            this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).apply();
        }
        this.ropeEnd.getComponent(cc.RopeJoint).connectedBody = this._arr_RopeCutArray[this._softDegree - 1].getComponent(cc.RigidBody);
        this.ropeEnd.getComponent(cc.RopeJoint).apply();
    }

    getGoldScore() {
        return this._goldScore;
    }

    addGoldScore(num: number) {
        this._goldScore += num;
        let score: number = this._goldScore / 500;
        this.label_Gold.string = score.toString();
    }

    shake(node: cc.Node) {
        cc.tween(node)
            .by(0.1, { angle: 6 })
            .by(0.1, { angle: -6 })
            .by(0.1, { angle: -6 })
            .by(0.1, { angle: 6 })
            .union()
            .repeat(2)
            .delay(0.6)
            .union()
            .repeatForever()
            .start();
    }

    showFinger() {
        this.showNode(this.finger, true);
        this.showNode(this.circle, true, 210);
        cc.tween(this.finger)
            .delay(0.3)
            .to(0.2, { angle: 10 })
            .delay(1)
            .to(0.2, { angle: 0 })
            .union()
            .repeatForever()
            .start();
        cc.tween(this.circle)
            .delay(0.5)
            .to(0.5, { scale: 1 })
            .delay(0.5)
            .to(0.2, { scale: 0.5 })
            .union()
            .repeatForever()
            .start();
        this._isStart = false;
    }
    moveFinger() {
        cc.tween(this.finger)
            .delay(0.5)
            .by(0.5, { position: cc.v2(0, -200) })
            .by(0.5, { position: cc.v2(0, 200) })
            .delay(0.2)
            .union()
            .repeatForever()
            .start();
        cc.tween(this.circle)
            .delay(0.5)
            .by(0.5, { position: cc.v2(0, -200) })
            .by(0.5, { position: cc.v2(0, 200) })
            .delay(0.2)
            .union()
            .repeatForever()
            .start();
    }
    scatterGold(GoldNode: cc.Node) {
        let v = 800;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;
        t = s / v;
        for (let i = 0; i < 5; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);
            cc.tween(star)
                .set({ position: this.node2Ctnode1(star, GoldNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-30, 30), y: Util.random(-30, 30), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.node2Ctnode1(star, this.node_EndPos) })
                .call(() => {
                    star.destroy();
                    let score = GlobalData.instance.getScore();
                    this.addGoldScore(score);
                    if (i == 4) {
                        if (!this.bullet_1.activeInHierarchy) {
                            if (this.bullet_2.activeInHierarchy) {
                                this._currentNode = this.bullet_2
                                this._currentFx = this.bulletFX_2;
                            } else {
                                if (this.bullet_3.activeInHierarchy) {
                                    this._currentNode = this.bullet_3;
                                    this._currentFx = this.bulletFX_3;
                                } else {
                                    LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                                }
                            }
                        }
                        cc.tween(this._currentNode)
                            .delay(0.1)
                            .call(() => {
                                this.bulletMoveAnim();
                            })
                            .start();
                    }
                })
                .start();
        }
    }

    node2Ctnode1(node1, node2) {
        let wordPoint = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }

    showNode(node: cc.Node, isAnim: boolean, num?: number) {
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

    hideNode(node: cc.Node, isAnim: boolean, num?: number) {
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

    showScoreView(index: number) {
        cc.tween(this.arr_ScoreView[index])
            .to(0.1, { opacity: 210 }, { easing: 'fade' })
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .start();
    }
    showStopScoreView(index: number) {
        cc.tween(this.arr_ScoreView[index])
            .to(0.1, { opacity: 210 }, { easing: 'fade' })
            .delay(1)
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .start();
    }
    shakeLantern() {
        cc.tween(this.left_Lantern)
            .to(1, { angle: -5 })
            .to(1, { angle: 5 })
            .union()
            .repeatForever()
            .start();
        cc.tween(this.right_Lantern)
            .to(1, { angle: 5 })
            .to(1, { angle: -5 })
            .union()
            .repeatForever()
            .start();
    }
}
