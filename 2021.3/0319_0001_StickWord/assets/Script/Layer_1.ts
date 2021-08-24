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
    label_Gold: cc.Label = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Node)
    left_CoupletPos: cc.Node = null;

    @property(cc.Node)
    right_CoupletPos: cc.Node = null;

    @property(cc.Prefab)
    pre_Perfect: cc.Prefab = null;

    @property(cc.Node)
    perfectPos: cc.Node = null;

    @property(cc.Node)
    goldPos: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    shadeBg: cc.Node = null;

    @property(cc.Node)
    shadeBg_2: cc.Node = null;

    @property(cc.Node)
    changeShade: cc.Node = null;

    @property(cc.Node)
    left_CoupletNode: cc.Node = null;

    @property(cc.Node)
    right_CoupletNode: cc.Node = null;

    @property(cc.Node)
    left_CoupletNodeShade: cc.Node = null;

    @property(cc.Node)
    targetNode: cc.Node = null;

    @property(sp.Skeleton)
    left_Broken: sp.Skeleton = null;

    @property(sp.Skeleton)
    left_EffectFx: sp.Skeleton = null;

    @property(sp.Skeleton)
    right_Broken: sp.Skeleton = null;

    @property(sp.Skeleton)
    right_EffectFx: sp.Skeleton = null;


    @property([cc.Node])
    arr_CoupletNode: cc.Node[] = [];

    @property([cc.Node])
    arr_MoveFontNode: cc.Node[] = [];

    @property([cc.Node])
    arr_MoveFontBg: cc.Node[] = [];

    @property([cc.Prefab])
    arr_Gold: cc.Prefab[] = [];
    // ================================================ //
    private _isClick: boolean = false;
    private _goldScore: number = 0;
    private _currentNode: cc.Node = null;
    private _currentNum: number = 0;
    private _distance: number = 0;
    private _arr_InitFontPos: cc.Vec2[] = [];

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
        this.showStartAnim();
        this._distance = 500;
    }

    update(dt: number) {
    }

    initGame() {
        this.arr_CoupletNode.forEach((temp) => {
            this.hideNode(temp);
        });
        this.arr_MoveFontNode.forEach((temp) => {
            this.hideNode(temp);
        });
        this.arr_MoveFontNode.forEach((temp) => {
            this._arr_InitFontPos.push(temp.getPosition())
        });
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (!this._isClick) return;
        this.getResult();
        this._isClick = false;
        if (!this.finger.activeInHierarchy) return;
        this.hideNode(this.finger);
        this.hideNode(this.changeShade);
        // this.hideNode(this.shadeBg_2);
        this.hideNode(this.targetNode);
        this.shadeBg.active = true;
        this.shadeBg.opacity = 180;
        // this.showNode(this.shadeBg);
    }

    showStartAnim() {
        this.showNode(this.arr_CoupletNode[0]);
        this.showNode(this.arr_CoupletNode[1]);
        cc.tween(this.arr_CoupletNode[1])
            .to(0.5, { height: 871 })
            .call(() => {
                this.arr_CoupletNode[2].active = true;
                this.arr_CoupletNode[2].opacity = 255;
                this.showGuide();
            })
            .start();
    }
    showSecondAnim() {
        this.showNode(this.arr_CoupletNode[3]);
        this.showNode(this.arr_CoupletNode[4]);
        cc.tween(this.arr_CoupletNode[4])
            .to(0.5, { height: 871 })
            .call(() => {
                this.arr_CoupletNode[5].active = true;
                this.arr_CoupletNode[5].opacity = 255;
                this.showMoveObj(this._currentNum);
            })
            .start();
    }

    showGuide() {
        this.showNode(this.arr_MoveFontNode[0]);
        this._currentNode = this.arr_MoveFontNode[0];
        cc.tween(this.arr_MoveFontNode[0])
            .by(1, { position: cc.v2(this._distance / 2, 0) })
            .call(() => {
                this.targetNode.active = true;
                this.hideNode(this.shadeBg);
                this.changeShade.active = true;
                this.shadeBg_2.active = true;
                cc.tween(this.changeShade)
                    .to(0.8, { scale: 1 }, { easing: 'backIn' })
                    .call(() => {
                        this.showFinger();
                    })
                    .start();
            })
            .start();
    }

    showMoveObj(num: number) {
        this.showNode(this.arr_MoveFontNode[num]);
        this._currentNode = this.arr_MoveFontNode[num];
        this._isClick = true;
        if (num == 1 || num == 3 || num == 6 || num == 8) {
            cc.tween(this.arr_MoveFontNode[num])
                .by(1, { position: cc.v2(-this._distance, 0) })
                .by(1, { position: cc.v2(this._distance, 0) })
                .union()
                .repeatForever()
                .start();
        } else {
            cc.tween(this.arr_MoveFontNode[num])
                .by(1, { position: cc.v2(this._distance, 0) })
                .by(1, { position: cc.v2(-this._distance, 0) })
                .union()
                .repeatForever()
                .start();
        }
    }
    getResult() {
        if (this._currentNode == null) return;
        this._currentNode.stopAllActions();
        let posx: number = Math.abs(this._currentNode.x);
        if (posx <= 1) {
            this.createPerfect();
            this.createGold(3);
            AudioManager.play('getGold');
            this.scatterGold(this._currentNode, 10);
            this.showBroken(this._currentNode.getPosition());
            this.hideNode(this.arr_MoveFontBg[this._currentNum]);
            this.nextFlow();
        } else if (posx >= 1 && posx <= 25) {
            this.createGold(2);
            AudioManager.play('getGold');
            this.scatterGold(this._currentNode, 8);
            this.showBroken(this._currentNode.getPosition());
            this.moveTargetPos();
            this.hideNode(this.arr_MoveFontBg[this._currentNum]);
            this.nextFlow();
        } else if (posx >= 25 && posx <= 78) {
            this.createGold(1);
            AudioManager.play('getGold');
            this.scatterGold(this._currentNode, 5);
            this.showBroken(this._currentNode.getPosition());
            this.moveTargetPos();
            this.hideNode(this.arr_MoveFontBg[this._currentNum]);
            this.nextFlow();
        } else if (posx >= 78 && posx <= 131) {
            this.createGold(0);
            AudioManager.play('getGold');
            this.scatterGold(this._currentNode, 3);
            this.showBroken(this._currentNode.getPosition());
            this.moveTargetPos();
            this.hideNode(this.arr_MoveFontBg[this._currentNum]);
            this.nextFlow();
        } else {
            this.hideNode(this._currentNode);
            let pos = this._arr_InitFontPos[this._currentNum];
            this.showEffectFx(this._currentNode, pos);
        }
    }
    nextFlow() {
        cc.tween(this.node)
            .delay(1)
            .call(() => {
                if (this._currentNum === 4) {
                    let pos: cc.Vec2 = this.left_CoupletPos.getPosition();
                    cc.tween(this.shadeBg)
                        .to(0.1, { opacity: 0 }, { easing: 'fade' })
                        .start();
                    let t = cc.tween;
                    t(this.left_CoupletNode)
                        .parallel(
                            t().to(0.5, { position: cc.v2(pos) }),
                            t().to(0.5, { scale: 0.8 })
                        )
                        .call(() => {
                            this.hideNode(this.arr_CoupletNode[0]);
                            this.hideNode(this.arr_CoupletNode[2]);
                            this.left_CoupletNodeShade.active = true;
                            cc.tween(this.shadeBg)
                                .to(0.1, { opacity: 180 }, { easing: 'fade' })
                                .delay(0.2)
                                .call(() => {
                                    this._currentNum++;
                                    this._currentNode = null;
                                    this.showSecondAnim();
                                })
                                .start();
                        })
                        .start();
                } else if (this._currentNum === 9) {
                    this.hideNode(this.left_CoupletNodeShade);
                    let pos: cc.Vec2 = this.right_CoupletPos.getPosition();
                    cc.tween(this.shadeBg)
                        .to(0.1, { opacity: 0 }, { easing: 'fade' })
                        .start();
                    let t = cc.tween;
                    t(this.right_CoupletNode)
                        .parallel(
                            t().to(0.5, { position: cc.v2(pos) }),
                            t().to(0.5, { scale: 0.8 })
                        )
                        .call(() => {
                            this.hideNode(this.arr_CoupletNode[0]);
                            this.hideNode(this.arr_CoupletNode[2]);
                            this._currentNode = null;
                            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                        })
                        .start();
                } else {
                    this._currentNum++;
                    this._currentNode = null;
                    this.showMoveObj(this._currentNum);
                }
            })
            .start();
    }
    createPerfect() {
        let obj = cc.instantiate(this.pre_Perfect);
        obj.setParent(this.perfectPos);
        cc.tween(obj)
            .by(0.6, { position: cc.v2(-800, 0) }, { easing: 'backOut' })
            .delay(0.5)
            .call(() => {
                cc.tween(obj)
                    .to(0.5, { opacity: 0 }, { easing: 'fade' })
                    .call(() => {
                        obj.destroy();
                    })
                    .start();
            })
            .start();
    }
    createGold(num: number) {
        let obj = cc.instantiate(this.arr_Gold[num]);
        obj.setParent(this.goldPos);
        let t = cc.tween;
        t(obj)
            .to(0.5, { opacity: 255 }, { easing: 'backOut' })
            .call(() => {
                t(obj)
                    .parallel(
                        t().by(0.5, { position: cc.v2(0, 300) }, { easing: 'backOut' }),
                        t().to(0.5, { opacity: 0 }, { easing: 'fade' })
                    )
                    .delay(0.5)
                    .call(() => {
                        obj.destroy();
                    })
                    .start();
            })
            .start();
    }
    showBroken(pos: cc.Vec2) {
        if (this._currentNum <= 4) {
            let anim: sp.Skeleton = this.left_Broken;
            anim.node.setPosition(pos);
            this.showNode(anim.node);
            anim.clearTracks();
            anim.setAnimation(0, 'texiao', false);
            anim.setCompleteListener(() => {
                this.hideNode(anim.node);
            });
        } else {
            let anim: sp.Skeleton = this.right_Broken;
            anim.node.setPosition(pos);
            this.showNode(anim.node);
            anim.clearTracks();
            anim.setAnimation(0, 'texiao', false);
            anim.setCompleteListener(() => {
                this.hideNode(anim.node);
            });
        }
    }
    showEffectFx(currentNode: cc.Node, initPos: cc.Vec2) {
        if (this._currentNum <= 4) {
            let anim: sp.Skeleton = this.left_EffectFx;
            let pos: cc.Vec2 = currentNode.getPosition();
            anim.node.setPosition(pos);
            this.showNode(anim.node);
            anim.clearTracks();
            anim.setAnimation(0, 'texiao', false);
            anim.setCompleteListener(() => {
                this.hideNode(anim.node);
                currentNode.setPosition(initPos);
                // this.showNode(currentNode);
                this.showMoveObj(this._currentNum);
            });
        } else {
            let anim: sp.Skeleton = this.right_EffectFx;
            let pos: cc.Vec2 = currentNode.getPosition();
            anim.node.setPosition(pos);
            this.showNode(anim.node);
            anim.clearTracks();
            anim.setAnimation(0, 'texiao', false);
            anim.setCompleteListener(() => {
                this.hideNode(anim.node);
                currentNode.setPosition(initPos);
                // this.showNode(currentNode);
                this.showMoveObj(this._currentNum);
            });
        }

    }

    moveTargetPos() {
        this.hideNode(this._currentNode);
        let pos: cc.Vec2 = this._currentNode.getPosition();
        pos.x = 0;
        cc.tween(this._currentNode)
            .delay(0.3)
            .call(() => {
                this._currentNode.setPosition(pos);
                this.showNode(this._currentNode);
            })
            .start();
    }
    getGoldScore() {
        return this._goldScore;
    }

    addGoldScore(num: number) {
        this._goldScore += num;
        this.label_Gold.string = this._goldScore.toString();
    }

    shake(node: cc.Node) {
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

    showFinger() {
        this.showNode(this.finger);
        // cc.tween(this.finger)
        //     .delay(0.3)
        //     .by(0.3, { position: cc.v2(30, -30) })
        //     .by(0.3, { position: cc.v2(-30, 30) })
        //     .by(0.3, { position: cc.v2(30, -30) })
        //     .by(0.3, { position: cc.v2(-30, 30) })
        //     .union()
        //     .repeatForever()
        //     .start();
        this._isClick = true;
        cc.tween(this.finger)
            .delay(0.3)
            .to(0.2, { scale: 0.6 })
            .to(0.2, { scale: 0.8 })
            .union()
            .repeatForever()
            .start();

    }
    scatterGold(GoldNode: cc.Node, num: number) {

        let v = 1000;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < num; i++) {
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
                    this.addGoldScore(10);
                })
                .start();
        }
    }

    node2Ctnode1(node1, node2) {
        let wordPoint = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }

    showNode(node: cc.Node) {
        node.active = true;
        cc.tween(node)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .start();
    }

    hideNode(node: cc.Node) {
        node.active = false;
        node.opacity = 0;
    }
}
