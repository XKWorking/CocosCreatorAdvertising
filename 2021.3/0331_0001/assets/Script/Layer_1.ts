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
    ruleContent: cc.Node = null;

    @property(cc.Node)
    btn_StartGame: cc.Node = null;

    @property(cc.Node)
    gameContent: cc.Node = null;

    @property(cc.Node)
    shade_1: cc.Node = null;

    @property(cc.Node)
    shade_2: cc.Node = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Prefab)
    bulletBroken: cc.Prefab = null;

    @property(cc.Node)
    goldBroken: cc.Node = null;

    @property(cc.Node)
    img_Out: cc.Node = null;

    @property([cc.Node])
    arr_ProgressBarRedPacket: cc.Node[] = [];

    @property([cc.Node])
    arr_ScorePos: cc.Node[] = [];

    @property([cc.Node])
    arr_ScoreView: cc.Node[] = [];
    // ================================================ //
    private _goldScore: number = 0;
    private _currentNode: cc.Node = null;
    private _currentFx: cc.Node = null;
    // _softDegree: number = 60;
    // _arr_RopeCutArray: cc.Node[] = [];//存放所有绳子小节的数组
    private _maxLength: number = 0;
    private _isClick: boolean = false;
    private _isStart: boolean = true;
    private _launchNum: number = 0;

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
    }

    update(dt: number) {
    }

    initGame() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        this.hideNode(this.finger, false);
        // this.hideNode(this.gameContent, false);
        this.gameContent.opacity = 0;
        // this.createRope();
    }

    changeNode() {
        let pos = this._currentNode.getPosition();
        this.createBulletBroken(pos);
        this.showGoldBroken(pos);
        let node = this._currentNode;
        AudioManager.play('gold');
        this.scatterGold(node);
        this._currentNode.active = false;
        this._currentNode = null;
        this._currentFx = null;
    }
    changeNode_1() {
        // GlobalData.instance.setIsOut(false);
        // this.hideNode(this._currentNode, false);
        let pos = this._currentNode.getPosition();
        this.createBulletBroken(pos);
        this._currentNode.active = false;
        this._currentNode = null;
        this._currentFx = null;
        this.nextBullet();
        // cc.tween(this._currentNode)
        //     .to(0.5, { position: cc.v2(0, 0) })
        //     .call(() => {
        //         this._isClick = true;
        //     })
        //     .start();
    }
    bulletMoveAnim() {
        if (!this._isStart) {
            cc.director.getPhysicsManager().enabled = false;
        }
        cc.tween(this._currentNode)
            .to(0.8, { position: this.changePos(this._currentNode, this.firePos) })
            .call(() => {
                this._currentNode.setParent(this.firePos);
                this._currentNode.setPosition(cc.v2(0, 0));
                this._isClick = true;
                if (this._isStart) {
                    this.showFinger(this.changePos(this.finger, this.firePos));
                    this.showNode(this.shade_1, false);
                    this.showNode(this.shade_2, false);
                    this.shade_1.setPosition(this.changePos(this.shade_1, this.firePos));
                    this.shade_2.setPosition(this.changePos(this.shade_2, this.firePos));
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
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (this.finger.activeInHierarchy) {
            this.hideNode(this.finger, true);
            this.hideNode(this.shade_1, false);
            this.hideNode(this.shade_2, false);
        }
    }
    onTouchMove(event) {
        if (!this._isClick) return;
        let variate = event.getDelta().y;
        if (variate < 0) {
            if (this._maxLength >= 10) {
                this._maxLength = 10;
            } else {
                this._maxLength += 0.4;
                this._currentNode.y -= 6;
                // if (this._arr_RopeCutArray[0].getComponent(cc.RopeJoint).maxLength >= 4.4) return;
                // this._arr_RopeCutArray.forEach((temp) => {
                //     temp.getComponent(cc.RopeJoint).maxLength += 0.2;
                //     temp.getComponent(cc.RopeJoint).apply();
                // });
            }
        } else if (variate > 0) {
            if (this._maxLength <= 0) {
                this._maxLength = 0;
            } else {
                this._maxLength -= 0.4;
                this._currentNode.y += 6;
                // if (this._arr_RopeCutArray[0].getComponent(cc.RopeJoint).maxLength <= 6) return;
                // this._arr_RopeCutArray.forEach((temp) => {
                //     temp.getComponent(cc.RopeJoint).maxLength -= 0.2;
                //     temp.getComponent(cc.RopeJoint).apply();
                // });
            }

        }
    }
    getScore() {
        return this._goldScore;
    }
    setScore(num: number) {
        this._goldScore += num;
    }
    onTouchEnd(event) {
        if (!this._isClick) return;
        if (this._maxLength == 0) return;
        this.showNode(this._currentFx, false);
        if (this._maxLength > 0 && this._maxLength <= 1) {
            GlobalData.instance.setPowerNum(1);
            this.setScore(8888);
            GlobalData.instance.setScore(8888);
        } else if (this._maxLength > 1 && this._maxLength <= 2) {
            GlobalData.instance.setPowerNum(2);
            this.setScore(2888)
            GlobalData.instance.setScore(2888)
        } else if (this._maxLength > 2 && this._maxLength <= 3) {
            GlobalData.instance.setPowerNum(3);
            this.setScore(1888)
            GlobalData.instance.setScore(1888)
        } else if (this._maxLength > 3 && this._maxLength <= 4) {
            GlobalData.instance.setPowerNum(4);
            this.setScore(1288)
            GlobalData.instance.setScore(1288)
        } else if (this._maxLength > 4 && this._maxLength <= 5) {
            GlobalData.instance.setPowerNum(5);
            this.setScore(888)
            GlobalData.instance.setScore(888)
        } else if (this._maxLength > 5 && this._maxLength <= 6) {
            GlobalData.instance.setPowerNum(6);
            this.setScore(1288)
            GlobalData.instance.setScore(1288)
        } else if (this._maxLength > 6 && this._maxLength <= 7) {
            GlobalData.instance.setPowerNum(7);
            this.setScore(1888)
            GlobalData.instance.setScore(1888)
        } else if (this._maxLength > 7 && this._maxLength <= 8) {
            GlobalData.instance.setPowerNum(8);
            this.setScore(2888)
            GlobalData.instance.setScore(2888)
        } else if (this._maxLength > 8 && this._maxLength <= 9.5) {
            GlobalData.instance.setPowerNum(9);
            this.setScore(8888)
            GlobalData.instance.setScore(8888)
        } else {
            GlobalData.instance.setPowerNum(10);
            this.setScore(0)
            GlobalData.instance.setScore(0)
        }
        this.moveUp(GlobalData.instance.getPowerNum());
        // this._arr_RopeCutArray.forEach((temp) => {
        //     temp.getComponent(cc.RopeJoint).maxLength = 2;
        //     temp.getComponent(cc.RopeJoint).apply();
        // });
        this._isClick = false;
        this._maxLength = 0;
    }
    onTouchCancel(event) {
        if (!this._isClick) return;
        if (this._maxLength == 0) return;
        this.showNode(this._currentFx, false);
        if (this._maxLength > 0 && this._maxLength <= 1) {
            GlobalData.instance.setPowerNum(1);
            this.setScore(8888);
            GlobalData.instance.setScore(8888);
        } else if (this._maxLength > 1 && this._maxLength <= 2) {
            GlobalData.instance.setPowerNum(2);
            this.setScore(2888)
            GlobalData.instance.setScore(2888)
        } else if (this._maxLength > 2 && this._maxLength <= 3) {
            GlobalData.instance.setPowerNum(3);
            this.setScore(1888)
            GlobalData.instance.setScore(1888)
        } else if (this._maxLength > 3 && this._maxLength <= 4) {
            GlobalData.instance.setPowerNum(4);
            this.setScore(1288)
            GlobalData.instance.setScore(1288)
        } else if (this._maxLength > 4 && this._maxLength <= 5) {
            GlobalData.instance.setPowerNum(5);
            this.setScore(888)
            GlobalData.instance.setScore(888)
        } else if (this._maxLength > 5 && this._maxLength <= 6) {
            GlobalData.instance.setPowerNum(6);
            this.setScore(1288)
            GlobalData.instance.setScore(1288)
        } else if (this._maxLength > 6 && this._maxLength <= 7) {
            GlobalData.instance.setPowerNum(7);
            this.setScore(1888)
            GlobalData.instance.setScore(1888)
        } else if (this._maxLength > 7 && this._maxLength <= 8) {
            GlobalData.instance.setPowerNum(8);
            this.setScore(2888)
            GlobalData.instance.setScore(2888)
        } else if (this._maxLength > 8 && this._maxLength <= 9.5) {
            GlobalData.instance.setPowerNum(9);
            this.setScore(8888)
            GlobalData.instance.setScore(8888)
        } else {
            GlobalData.instance.setPowerNum(10);
            this.setScore(0)
            GlobalData.instance.setScore(0)
        }
        this.moveUp(GlobalData.instance.getPowerNum());
        // this._arr_RopeCutArray.forEach((temp) => {
        //     temp.getComponent(cc.RopeJoint).maxLength = 2;
        //     temp.getComponent(cc.RopeJoint).apply();
        // });
        this._isClick = false;
        this._maxLength = 0;
    }

    moveUp(powerNum: number) {
        AudioManager.play('launch');
        this.hideNode(this.img_Out, true);
        this._launchNum++;
        switch (powerNum) {
            case 1:
                cc.tween(this._currentNode)
                    .to(3, { position: this.changePos(this._currentNode, this.arr_ScorePos[4]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(4);
                        this.changeNode();
                    })
                    .start();
                break;
            case 2:
                cc.tween(this._currentNode)
                    .to(3, { position: this.changePos(this._currentNode, this.arr_ScorePos[3]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(3);
                        this.changeNode();
                    })
                    .start();
                break;
            case 3:
                cc.tween(this._currentNode)
                    .to(3, { position: this.changePos(this._currentNode, this.arr_ScorePos[2]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(2);
                        this.changeNode();
                    })
                    .start();
                break;
            case 4:
                cc.tween(this._currentNode)
                    .to(3, { position: this.changePos(this._currentNode, this.arr_ScorePos[1]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(1);
                        this.changeNode();
                    })
                    .start();
                break;
            case 5:
                cc.tween(this._currentNode)
                    .to(3, { position: this.changePos(this._currentNode, this.arr_ScorePos[0]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(0);
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
                    .to(2, { position: this.changePos(this._currentNode, this.arr_ScorePos[1]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(1);
                        this.changeNode();
                    })
                    .start();
                break;
            case 7:
                cc.tween(this._currentNode)
                    .to(3, { position: this.changePos(this._currentNode, this.arr_ScorePos[2]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(2);
                        this.changeNode();
                    })
                    .start();
                break;
            case 8:
                cc.tween(this._currentNode)
                    .to(4, { position: this.changePos(this._currentNode, this.arr_ScorePos[3]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(3);
                        this.changeNode();
                    })
                    .start();
                break;
            case 9:
                cc.tween(this._currentNode)
                    .to(5, { position: this.changePos(this._currentNode, this.arr_ScorePos[4]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showStopScoreView(4);
                        this.changeNode();
                    })
                    .start();
                break;
            case 10:
                cc.tween(this._currentNode)
                    .to(6, { position: this.changePos(this._currentNode, this.arr_ScorePos[5]) }, { easing: 'cubicOut' })
                    .call(() => {
                        this.showOut();
                        this.changeNode_1();
                    })
                    .start();
                break;
        }
    }
    showOut() {
        if (this._launchNum >= 3) return;
        let pos = this._currentNode.getPosition();
        pos.y += 120;
        this.img_Out.setPosition(pos);
        this.showNode(this.img_Out, true);
    }
    createBulletBroken(pos: cc.Vec2) {
        let obj = cc.instantiate(this.bulletBroken);
        this.firePos.addChild(obj);
        obj.setPosition(pos);
    }
    showGoldBroken(pos: cc.Vec2) {
        this.goldBroken.setPosition(pos);
        let t = cc.tween;
        t(this.goldBroken)
            .parallel(
                t().to(0.5, { scale: 1 }),
                t().to(0.5, { opacity: 255 }, { easing: 'fade' })
            )
            .delay(0.3)
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .call(() => {
                this.goldBroken.scale = 0;
            })
            .start();
    }
    // createRope() {

    //     //遍历这个数组
    //     for (var i = 0; i < this._softDegree; i++) {
    //         this._arr_RopeCutArray.push(cc.instantiate(this.pre_RopeCut)); //生成新的绳子小节存放到数组中
    //         this.ropeCutNode.addChild(this._arr_RopeCutArray[i]); //将绳子小节添加为Canvas的子节点，这里的this.node指的是Canvas

    //         //如果是第一个绳子小节，那么它的Connected Body就应该是anchor
    //         if (i == 0) {
    //             this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).connectedBody = this.ropeHead.getComponent(cc.RigidBody);
    //             //修改绳子的最大长度
    //             this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).maxLength = 2;//this._arr_RopeCutArray[i].width;//(this.ropeHead.width + ropeCutArray[i].width) / 2;
    //         }
    //         //如果是第2~n个绳子小节，那么它的Connected Body就应该是上一个绳子小节，直接数组索引-1就可以得到
    //         else {
    //             this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).connectedBody = this._arr_RopeCutArray[i - 1].getComponent(cc.RigidBody);
    //             //修改绳子的最大长度
    //             this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).maxLength = 2;
    //         }

    //         //修改完RopeJoint的属性之后一定要调用apply()方法，不然所有修改都无效！
    //         this._arr_RopeCutArray[i].getComponent(cc.RopeJoint).apply();
    //     }
    //     this.ropeEnd.getComponent(cc.RopeJoint).connectedBody = this._arr_RopeCutArray[this._softDegree - 1].getComponent(cc.RigidBody);
    //     this.ropeEnd.getComponent(cc.RopeJoint).maxLength = 2;
    //     this.ropeEnd.getComponent(cc.RopeJoint).apply();
    // }

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

    showFinger(pos: cc.Vec2) {
        this.showNode(this.finger, true);
        pos.x += 50;
        pos.y -= 50;
        this.finger.setPosition(pos);
        cc.tween(this.finger)
            .delay(0.5)
            .by(0.5, { position: cc.v2(0, -200) })
            .by(0.5, { position: cc.v2(0, 200) })
            .delay(0.2)
            .union()
            .repeatForever()
            .start();
        this._isStart = false;
    }

    showRuleContent() {
        this.showNode(this.ruleContent, true);
    }

    hideRuleContent() {
        this.hideNode(this.ruleContent, true);
    }

    getProgress() {
        return this.progressBar.progress;
    }
    addProgress(num: number) {
        let bar: number = 0;
        bar = this.progressBar.progress * 1000;
        bar += num;
        this.progressBar.progress = bar / 1000;
        if (this.progressBar.progress >= 1) {
            this.progressBar.progress = 1;
        }
    }
    scatterGold(goldNode: cc.Node) {
        let v = 600;
        let s = Util.getDistance(this.node_EndPos.getPosition(), goldNode.getPosition());
        let t = 0;
        t = s / v;
        for (let i = 0; i < 10; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);
            cc.tween(star)
                .set({ position: this.changePos(star, goldNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.changePos(star, this.node_EndPos) })
                .call(() => {
                    star.destroy();
                    let num = GlobalData.instance.getScore();
                    if (num == 0) {
                        this.addProgress(0);
                    } else if (num == 888) {
                        this.addProgress(10);
                    } else if (num == 1288) {
                        this.addProgress(14);
                    } else if (num == 1888) {
                        this.addProgress(21);
                    } else if (num == 2888) {
                        this.addProgress(32);
                    } else {
                        this.addProgress(100);
                    }
                    if (this.getProgress() >= 0.2) {
                        this.fallRedPacket(this.arr_ProgressBarRedPacket[0]);
                    }
                    if (this.getProgress() >= 0.75) {
                        this.fallRedPacket(this.arr_ProgressBarRedPacket[1]);
                    }
                    if (this.getProgress() >= 1) {
                        this.fallRedPacket(this.arr_ProgressBarRedPacket[2]);
                    }
                    if (i == 9) {
                        if (this.getProgress() >= 1) {
                            if (this._goldScore < 6888) {
                                GlobalData.instance.setScore(1888);
                            } else if (this._goldScore >= 6888 && this._goldScore < 8888) {
                                GlobalData.instance.setScore(6888);
                            } else {
                                GlobalData.instance.setScore(8888);
                            }
                            cc.tween(this.node)
                                .delay(1)
                                .call(() => {
                                    LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                                })
                                .start();
                        } else {
                            this.nextBullet();
                        }
                    }
                })
                .start();
        }


    }

    nextBullet() {
        if (!this.bullet_1.activeInHierarchy) {
            if (this.bullet_2.activeInHierarchy) {
                this._currentNode = this.bullet_2
                this._currentFx = this.bulletFX_2;
                this.executeBulletMoveAnim();
            } else {
                if (this.bullet_3.activeInHierarchy) {
                    this._currentNode = this.bullet_3;
                    this._currentFx = this.bulletFX_3;
                    this.executeBulletMoveAnim();
                } else {
                    if (this._goldScore < 6888) {
                        GlobalData.instance.setScore(1888);
                    } else if (this._goldScore >= 6888 && this._goldScore < 8888) {
                        GlobalData.instance.setScore(6888);
                    } else {
                        GlobalData.instance.setScore(8888);
                    }
                    cc.tween(this.node)
                        .delay(1)
                        .call(() => {
                            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                        })
                        .start();
                }
            }
        }
    }

    executeBulletMoveAnim() {
        cc.tween(this._currentNode)
            .delay(0.1)
            .call(() => {
                this.bulletMoveAnim();
            })
            .start();
    }
    changePos(node1, node2) {
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
    showBig() {
        cc.tween(this.arr_ScorePos[4])
            .to(0.1, { scale: 1.5 })
            .start();
    }
    showSmall() {
        cc.tween(this.arr_ScorePos[4])
            .to(0.1, { scale: 1 })
            .start();
    }
    showScoreView(index: number) {
        cc.tween(this.arr_ScoreView[index])
            .to(0.1, { opacity: 166 }, { easing: 'fade' })
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .start();
    }
    showStopScoreView(index: number) {
        cc.tween(this.arr_ScoreView[index])
            .to(0.1, { opacity: 166 }, { easing: 'fade' })
            .delay(1)
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .start();
    }

    fallRedPacket(node: cc.Node) {
        cc.tween(node)
            .by(2, { position: cc.v2(0, -2000) })
            .call(() => {
                this.hideNode(node, false);
            })
            .start();
    }

    StartGame() {
        this.hideNode(this.btn_StartGame, true);
        this.showNode(this.gameContent, true);
        this.shake(this.arr_ScorePos[4]);
        this.arr_ProgressBarRedPacket.forEach((temp) => {
            this.shake(temp);
        });
        this._currentNode = this.bullet_1;
        this._currentFx = this.bulletFX_1;
        cc.tween(this._currentNode)
            .delay(1)
            .call(() => {
                this.bulletMoveAnim();
            })
            .start();
    }
}
