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
    gameContent: cc.Node = null;
    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    redPacketPos: cc.Node = null;

    @property(cc.Prefab)
    pre_Score_1: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Score_2: cc.Prefab = null;

    @property([cc.Node])
    arr_Angle: cc.Node[] = [];

    @property([cc.Node])
    arr_Pos: cc.Node[] = [];

    @property([cc.Node])
    arr_Circle: cc.Node[] = [];

    @property([cc.Node])
    arr_GuidLine: cc.Node[] = [];

    @property([cc.Node])
    arr_Book: cc.Node[] = [];

    @property([cc.Node])
    arr_EndBook: cc.Node[] = [];

    @property([sp.Skeleton])
    arr_Fx: sp.Skeleton[] = [];

    @property([cc.Node])
    arr_Gigt: cc.Node[] = [];
    // ================================================ //
    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _isClick: boolean = true;
    private _startTime: number = 0;
    private _score: number = 0;
    private _posIndex: number = 0;
    private _isMoveDown: boolean = true;


    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
    }

    update(dt: number) {
        // if (this._isGameStart) {
        //     this._startTime += dt;
        //     if (this._startTime >= 15) {
        //         if (this._posIndex >= 7) {
        //             this._startTime = 0;
        //             this._isGameStart = false;
        //             this._isClick = false;
        //         } else {
        //             this._isClick = false;
        //             this._isGameStart = false;
        //             this.setMoveDown();
        //             let t = cc.tween;
        //             if (this._posIndex != 6) {
        //                 let pos_1: cc.Vec2 = this.redPacketPos.getPosition();
        //                 pos_1.y -= 300;
        //                 this.arr_Pos[7].setPosition(pos_1);
        //             }
        //             let pos = this.changePos(this.player, this.arr_Pos[8]);
        //             t(this.player)
        //                 .delay(0.3)
        //                 .to(0.5, { position: this.arr_Pos[7].getPosition() })
        //                 .call(() => {
        //                     t(this.player)
        //                         .delay(0.3)
        //                         .parallel(
        // t().to(0.3, { opacity: 0 }, { easing: 'fade' }),
        // t().to(0.6, { position: pos }, { easing: 'backOut' })
        //                         )
        //                         .call(() => {
        //                             this.arr_Pos.forEach((temp) => {
        //                                 temp.stopAllActions();
        //                             });
        //                             // this.arr_Angle.forEach((temp) => {
        //                             //     temp.stopAllActions();
        //                             // });
        //                             this.arr_GuidLine.forEach((temp) => {
        //                                 temp.stopAllActions();
        //                             });
        //                             LayerManger.Instance.GetLayer(Layer_2).OpenForTween();

        //                         })
        //                         .start();
        //                 })
        //                 .start();
        //             for (let i: number = this._posIndex + 1; i <= 6; i++) {
        //                 this.hideNode(this.arr_Pos[i], false);
        //             }
        //             switch (this._posIndex) {
        //                 case 1:
        //                     this.hideCircle(1);
        //                     this.hideGuidLine(1);
        //                     this.hideGift(1);
        //                     break;
        //                 case 2:
        //                     this.hideCircle(2);
        //                     this.hideGuidLine(3);
        //                     this.hideGift(2);
        //                     break;
        //                 case 3:
        //                     this.hideCircle(3);
        //                     this.hideGuidLine(5);
        //                     this.hideGift(3);
        //                     break;
        //                 case 4:
        //                     this.hideCircle(4);
        //                     this.hideGuidLine(7);
        //                     this.hideGift(4);
        //                     break;
        //                 case 5:
        //                     this.hideCircle(5);
        //                     this.hideGuidLine(9);
        //                     this.hideGift(5);
        //                     break;
        //                 case 6:
        //                     this.hideGuidLine(11);
        //                     break;
        //             }
        //         }
        //     }
        // }
    }

    private hideCircle(index: number) {
        for (let i: number = index; i <= 5; i++) {
            this.hideNode(this.arr_Circle[i], false);
        }
    }
    private hideGuidLine(index: number) {
        for (let i: number = index; i <= 11; i++) {
            this.hideNode(this.arr_GuidLine[i], false);
        }
    }
    private hideGift(index: number) {
        for (let i: number = index; i <= 5; i++) {
            this.hideNode(this.arr_Gigt[i], false);
        }
    }
    private initGame() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
        // this.showBreathe();
        this.arr_GuidLine.forEach((temp) => {
            cc.tween(temp)
                .to(0.3, { opacity: 0 }, { easing: 'fade' })
                .to(0.3, { opacity: 255 }, { easing: 'fade' })
                .union()
                .repeatForever()
                .start();
        });
        cc.tween(this.arr_Pos[0])
            .by(3, { angle: -360 })
            .repeatForever()
            .start();
    }
    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (!this._isClick) return;
        this._isClick = false;
        this._posIndex++;
        this.playerMove(this.arr_Pos[this._posIndex]);
        if (!this.finger.activeInHierarchy) return;
        this.hideNode(this.finger, true);

        this.arr_Pos.forEach((temp) => {
            cc.tween(temp)
                .by(3, { angle: -360 })
                .repeatForever()
                .start();
        });
        this._isGameStart = true;
    }

    private playerMove(node: cc.Node) {
        let t = cc.tween;
        t(this.player)
            .to(0.5, { position: node.getPosition() })
            .call(() => {
                this.bgDown();
                if (this._posIndex === 7) {
                    this.arr_Fx[6].clearTracks();
                    this.arr_Fx[6].setAnimation(0, 'texiao', false);
                    this._isGameStart = false;
                    this._isClick = false;
                    this.setMoveDown();
                    this._posIndex++;
                    let pos = this.changePos(this.player, this.arr_Pos[this._posIndex]);
                    t(this.player)
                        .delay(0.3)
                        .parallel(
                            t().to(0.9, { opacity: 0 }, { easing: 'fade' }),
                            t().to(1.2, { position: pos }, { easing: 'backOut' })
                        )
                        .call(() => {
                            if (this._posIndex >= 8) {
                                AudioManager.play('success');
                                this.arr_Pos.forEach((temp) => {
                                    temp.stopAllActions();
                                });
                                this.arr_GuidLine.forEach((temp) => {
                                    temp.stopAllActions();
                                });
                                LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                            }
                        })
                        .start();

                } else {
                    this._isClick = true;
                    switch (this._posIndex) {
                        case 1:
                            AudioManager.play('enter');
                            this.createScore_1();
                            this.arr_Fx[0].clearTracks();
                            this.arr_Fx[0].setAnimation(0, 'texiao', false);
                            this.scatterGold(this.player, 688)
                            this.hideNode(this.arr_Gigt[0], false);
                            this.hideAngleBook(1, 0);
                            break;
                        case 2:
                            AudioManager.play('enter');
                            this.createScore_2();
                            this.arr_Fx[1].clearTracks();
                            this.arr_Fx[1].setAnimation(0, 'texiao', false);
                            this.scatterGold(this.player, 888)
                            this.hideNode(this.arr_Gigt[1], false);
                            this.hideAngleBook(2, 1);
                            this.hideAngleBook(2, 2);
                            break;
                        case 3:
                            AudioManager.play('enter');
                            this.createScore_1();
                            this.arr_Fx[2].clearTracks();
                            this.arr_Fx[2].setAnimation(0, 'texiao', false);
                            this.scatterGold(this.player, 688)
                            this.hideNode(this.arr_Gigt[2], false);
                            this.hideAngleBook(3, 3);
                            break;
                        case 4:
                            AudioManager.play('enter');
                            this.createScore_1();
                            this.arr_Fx[3].clearTracks();
                            this.arr_Fx[3].setAnimation(0, 'texiao', false);
                            this.scatterGold(this.player, 688)
                            this.hideNode(this.arr_Gigt[3], false);
                            this.hideAngleBook(4, 4);
                            break;
                        case 5:
                            AudioManager.play('enter');
                            this.createScore_2();
                            this.arr_Fx[4].clearTracks();
                            this.arr_Fx[4].setAnimation(0, 'texiao', false);
                            this.scatterGold(this.player, 888)
                            this.hideNode(this.arr_Gigt[4], false);
                            this.hideAngleBook(5, 5);
                            this.hideAngleBook(5, 6);
                            break;
                        case 6:
                            AudioManager.play('enter');
                            this.createScore_1();
                            this.arr_Fx[5].clearTracks();
                            this.arr_Fx[5].setAnimation(0, 'texiao', false);
                            this.scatterGold(this.player, 688)
                            this.hideNode(this.arr_Gigt[5], false);
                            this.hideAngleBook(6, 7);
                            this.showRedPacket();
                            break;
                    }

                }
            })
            .start();

    }
    private createScore_1() {
        let obj = cc.instantiate(this.pre_Score_1);
        obj.setParent(this.player);
        obj.setPosition(cc.v2(0, 150));
        let t = cc.tween;
        t(obj)
            .parallel(
                t().by(0.5, { position: cc.v2(0, 300) }),
                t().to(0.5, { opacity: 0 }, { easing: 'fade' })
            )
            .call(() => {
                obj.destroy();
            })
            .start();
    }
    private createScore_2() {
        let obj = cc.instantiate(this.pre_Score_2);
        obj.setParent(this.player);
        obj.setPosition(cc.v2(0, 150));
        let t = cc.tween;
        t(obj)
            .parallel(
                t().by(0.5, { position: cc.v2(0, 300) }),
                t().to(0.5, { opacity: 0 }, { easing: 'fade' })
            )
            .call(() => {
                obj.destroy();
            })
            .start();
    }
    private hideAngleBook(num: number, index: number) {
        let angleNode = this.arr_Pos[num];
        angleNode.stopAllActions();
        let obj = this.arr_Book[index];
        let pos = this.arr_EndBook[index].getPosition();
        obj.getComponent(cc.CircleCollider).tag = 1;
        let t = cc.tween;
        t(obj)
            .parallel(
                t().to(0.5, { position: pos }),
                t().to(0.5, { opacity: 0 }, { easing: 'fade' }),
            )
            .call(() => {
                this.hideNode(obj, false);
            })
            .start();

    }
    private bgDown() {
        if (!this._isMoveDown) return;
        cc.tween(this.gameContent)
            .by(0.5, { position: cc.v2(0, -304) }, { easing: 'backOut' })
            .start();
    }
    public showRedPacket() {
        this.showNode(this.redPacketPos, true);
    }

    public setMoveDown() {
        this._isMoveDown = false;
    }

    private addScore(num: number) {
        this._score += num;
        let score = this._score / 100;
        score = Math.floor(score);
        this.label_Gold.string = score.toString();
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
    private showBreathe() {
        cc.tween(this.finger)
            .to(0.5, { scale: 0.8 })
            .to(0.5, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }

    public goBack() {
        this._posIndex--;
        let pos = this.arr_Pos[this._posIndex].getPosition();
        cc.tween(this.player)
            .to(0.3, { position: pos })
            .call(() => {
                this._isClick = true;
            })
            .start();
    }

    public scatterGold(GoldNode: cc.Node, num: number) {
        let v = 1000;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;
        t = v / s;
        for (let i = 0; i < 5; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);
            let pos = this.changePos(star, GoldNode);
            pos.y -= 300;
            cc.tween(star)
                .set({ position: pos, opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-15, 15), y: Util.random(-15, 15), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.changePos(star, this.node_EndPos) })
                .call(() => {
                    AudioManager.play('gold');
                    star.destroy();
                    if (i == 4) {
                        this.addScore(num);
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
