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
import PoolManager from "./Manager/PoolManager";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    canvas: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    node_LightEffect: cc.Node = null;

    @property(cc.Label)
    label_Time: cc.Label = null;

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Node)
    fukubukuro: cc.Node = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property([cc.Node])
    arr_BeginGeneratePos: cc.Node[] = [];

    @property([cc.Node])
    arr_RedPacketPos: cc.Node[] = [];

    @property([cc.Node])
    arr_GoldBrickPos: cc.Node[] = [];

    @property(cc.Node)
    goldBrickParent: cc.Node = null;

    @property(cc.Node)
    redPacketStartPos_1: cc.Node = null;

    @property(cc.Node)
    redPacketStartPos_2: cc.Node = null;

    @property(cc.Node)
    redPacketParent: cc.Node = null;

    @property(cc.Node)
    goldParent: cc.Node = null;

    @property(cc.Node)
    guide: cc.Node = null;

    @property(cc.Prefab)
    pre_Gold: cc.Prefab = null;

    @property(cc.Prefab)
    pre_GoldBrick: cc.Prefab = null;

    @property(cc.Prefab)
    pre_RedPacket: cc.Prefab = null;

    @property([cc.Node])
    arr_OverAnim: cc.Node[] = [];

    @property(cc.Node)
    gold_1: cc.Node = null;

    @property(cc.Node)
    gold_2: cc.Node = null;

    // ================================================ //

    private _arrStartRedPacket: cc.Node[] = [];
    private _gameTime: number = 13;
    private _isSlidePlayer: boolean = false;
    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _posL: number = 0;
    private _posR: number = 0;
    private _arrGoldNode: cc.Node[] = [];

    onLoad() {
        super.onResize();
        this.onBindTouch();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
        this.shake(this.node_LightEffect);
        this._posL = -this.canvas.width / 2;
        this._posR = this.canvas.width / 2;
        this.fukubukuro.scale = 0;
        this.fukubukuro.opacity = 0;
        this.hideNode(this.player);
        this.hideNode(this.goldParent);
        this.hideNode(this.guide);
        this.hideNode(this.arr_OverAnim[0]);
        this.showFukubukuro();
        this._arrGoldNode.push(this.gold_1);
        this._arrGoldNode.push(this.gold_2);
    }

    update(dt: number) {

    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (this._isSlidePlayer) {
            this.hideNode(this.guide);
            this._isSlidePlayer = false;
            this.schedule(this.countDown, 1);
            this.player.getComponent('player').runUpAction();
            this.player.getComponent(cc.RigidBody).gravityScale = 0;
        }
    }
    onTouchMove(event) {
        if (!this._isGameStart) return;
        let delta = event.getDelta();
        if (this.player.x > this._posR) {
            this.player.x = this._posR;
        } else if (this.player.x < this._posL) {
            this.player.x = this._posL;
        } else {
            this.player.x += delta.x;
        }
    }

    countDown() {
        if (this._gameTime >= 1) {
            this._gameTime -= 1;
            this.label_Time.string = this._gameTime + 's';
        } else if (this._gameTime <= 0) {
            this.unschedule(this.countDown);
            this._isGameStart = false;
            this._isGameOver = true;
            this.overAnim();
        }
    }

    showFukubukuro() {
        let t = cc.tween;
        t(this.fukubukuro)
            .parallel(
                t().to(0.5, { scale: 1 }),
                t().to(0.5, { opacity: 255 }, { easing: 'fade' })
            )
            .delay(0.5)
            .to(0.1, { scale: 0.8 })
            .to(0.1, { scale: 1 })
            .call(() => {
                this.createStartRedPacket(this.redPacketStartPos_1, 0);
                t(this.fukubukuro)
                    .delay(0.2)
                    .to(0.1, { scale: 0.8 })
                    .to(0.1, { scale: 1 })
                    .call(() => {
                        this.createStartRedPacket(this.redPacketStartPos_1, 1);
                        t(this.fukubukuro)
                            .delay(0.2)
                            .to(0.1, { scale: 0.8 })
                            .to(0.1, { scale: 1 })
                            .call(() => {
                                this.createStartRedPacket(this.redPacketStartPos_1, 2);
                                t(this.fukubukuro)
                                    .delay(0.2)
                                    .to(0.1, { scale: 0.8 })
                                    .to(0.1, { scale: 1 })
                                    .call(() => {
                                        this.createStartRedPacket(this.redPacketStartPos_1, 3);
                                        t(this.fukubukuro)
                                            .delay(0.2)
                                            .to(0.1, { scale: 0.8 })
                                            .to(0.1, { scale: 1 })
                                            .call(() => {
                                                this.createStartRedPacket(this.redPacketStartPos_2, 4);
                                                t(this.fukubukuro)
                                                    .delay(0.2)
                                                    .to(0.1, { scale: 0.8 })
                                                    .to(0.1, { scale: 1 })
                                                    .call(() => {
                                                        this.createStartRedPacket(this.redPacketStartPos_2, 5);
                                                        t(this.fukubukuro)
                                                            .delay(0.2)
                                                            .to(0.1, { scale: 0.8 })
                                                            .to(0.1, { scale: 1 })
                                                            .call(() => {
                                                                this.createStartRedPacket(this.redPacketStartPos_2, 6);
                                                                t(this.fukubukuro)
                                                                    .delay(0.2)
                                                                    .to(0.1, { scale: 0.8 })
                                                                    .to(0.1, { scale: 1 })
                                                                    .call(() => {
                                                                        this.createStartRedPacket(this.redPacketStartPos_2, 7);
                                                                        t(this.fukubukuro)
                                                                            .delay(0.2)
                                                                            .to(0.1, { opacity: 0 }, { easing: 'fade' })
                                                                            .call(() => {
                                                                                this.showNode(this.player);
                                                                                this.showNode(this.goldParent);
                                                                                this.showNode(this.guide);
                                                                                this.createGoldBrick();
                                                                                // this.moveStartRedPacket();
                                                                                // this.createRedPacket();
                                                                                this._isGameStart = true;
                                                                                this._isSlidePlayer = true;
                                                                            })
                                                                            .start();
                                                                    })
                                                                    .start();
                                                            })
                                                            .start();
                                                    })
                                                    .start();
                                            })
                                            .start();
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    moveStartRedPacket() {
        let pos_1: cc.Vec2 = this.arr_RedPacketPos[0].getPosition();
        let pos_2: cc.Vec2 = this.arr_RedPacketPos[1].getPosition();
        let lenght: number = pos_2.x - pos_1.x;
        this._arrStartRedPacket.forEach((temp) => {
            cc.tween(temp)
                .by(2, { position: cc.v2(lenght, 0) })
                .start();
        });
    }

    createStartRedPacket(node: cc.Node, index: number) {
        let obj = cc.instantiate(this.pre_RedPacket);
        obj.setParent(node);
        obj.getComponent(cc.BoxCollider).tag = index + 1;
        obj.setPosition(cc.v2(0, 0));
        let pos: cc.Vec2 = this.arr_BeginGeneratePos[index].getPosition();
        AudioManager.play('redPacket');
        cc.tween(obj)
            .to(0.1, { position: pos })
            .call(() => {
                obj.parent = this.redPacketParent;
                this._arrStartRedPacket.push(obj);
            })
            .start();
    }

    createRedPacket(num: number) {
        let obj = PoolManager.instance.getNode(this.pre_RedPacket, this.redPacketParent);
        obj.getComponent(cc.BoxCollider).tag = num;
        let pos = this.getRedPacketPosition(num - 1);
        obj.setPosition(pos);
    }

    getRedPacketPosition(index: number) {
        return this.arr_BeginGeneratePos[index].getPosition();
    }
    createGold() {
        let obj = PoolManager.instance.getNode(this.pre_Gold, this.goldParent);
        this._arrGoldNode.push(obj);
        let pos = this.getGoldPosition()
        obj.setPosition(pos);
    }


    delectGold(node: cc.Node) {
        let index: number = this._arrGoldNode.indexOf(node);
        this._arrGoldNode.splice(index, 1);
    }
    getGoldPosition() {
        let pos = this.randomGoldPos();
        pos = this.getCreateGold(pos);
        return pos;
    }

    getCreateGold(pos: cc.Vec2) {
        while (this.getPlayerDistance(pos) <= 100 || this.getGoldDistance(pos) <= 100) {
            pos = this.randomGoldPos();
        }
        return pos;
    }

    randomGoldPos(): cc.Vec2 {
        let randX = Util.random(-200, 200);
        let randY = Util.random(-100, 100);
        return cc.v2(randX, randY);
    }
    getPlayerDistance(pos: cc.Vec2) {
        let playerPos = this.player.getPosition();
        let dist = pos.sub(playerPos).mag();
        return dist;
    }
    getGoldDistance(pos: cc.Vec2) {
        let goldPos = this._arrGoldNode[0].getPosition();
        let dist = pos.sub(goldPos).mag();
        return dist;
    }

    createGoldBrick() {
        this.createGoldBrick_1();
        this.createGoldBrick_2();
        this.createGoldBrick_3();
        this.createGoldBrick_4();
        cc.tween(this.node)
            .delay(0.15)
            .call(() => {
                this.createGoldBrick();
            })
            .start();
    }

    createGoldBrick_1() {
        let obj = cc.instantiate(this.pre_GoldBrick);
        obj.setParent(this.goldBrickParent);
        obj.getComponent(cc.BoxCollider).tag = 1;
        let pos_1: cc.Vec2 = this.arr_GoldBrickPos[0].getPosition();
        let pos_2: cc.Vec2 = this.arr_GoldBrickPos[1].getPosition();
        obj.setPosition(pos_1);
        cc.tween(obj)
            .to(1, { position: pos_2 })
            .call(() => {
                obj.destroy();
            })
            .start();
    }
    createGoldBrick_2() {
        let obj = cc.instantiate(this.pre_GoldBrick);
        obj.setParent(this.goldBrickParent);
        obj.getComponent(cc.BoxCollider).tag = 1;
        let pos_1: cc.Vec2 = this.arr_GoldBrickPos[2].getPosition();
        let pos_2: cc.Vec2 = this.arr_GoldBrickPos[3].getPosition();
        obj.setPosition(pos_1);
        cc.tween(obj)
            .to(1, { position: pos_2 })
            .call(() => {
                obj.destroy();
            })
            .start();
    }
    createGoldBrick_3() {
        let obj = cc.instantiate(this.pre_GoldBrick);
        obj.setParent(this.goldBrickParent);
        obj.getComponent(cc.BoxCollider).tag = 2;
        let pos_1: cc.Vec2 = this.arr_GoldBrickPos[4].getPosition();
        let pos_2: cc.Vec2 = this.arr_GoldBrickPos[5].getPosition();
        obj.setPosition(pos_1);
        cc.tween(obj)
            .to(1, { position: pos_2 })
            .call(() => {
                obj.destroy();
            })
            .start();
    }
    createGoldBrick_4() {
        let obj = cc.instantiate(this.pre_GoldBrick);
        obj.setParent(this.goldBrickParent);
        obj.getComponent(cc.BoxCollider).tag = 2;
        let pos_1: cc.Vec2 = this.arr_GoldBrickPos[6].getPosition();
        let pos_2: cc.Vec2 = this.arr_GoldBrickPos[7].getPosition();
        obj.setPosition(pos_1);
        cc.tween(obj)
            .to(1, { position: pos_2 })
            .call(() => {
                obj.destroy();
            })
            .start();
    }


    addProgressBar(num: number) {
        if (this.progressBar.progress >= 1) {
            if (this._isGameOver) return;
            this.unschedule(this.countDown);
            this._isGameStart = false;
            this._isGameOver = true;
            this.overAnim();
            return;
        }
        this.progressBar.progress += num;
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
                .by(0.4, { x: Util.random(-15, 15), y: Util.random(-15, 15), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.node2Ctnode1(star, this.node_EndPos) })
                .call(() => {
                    star.destroy();
                    this.addProgressBar(0.005);
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
    }

    hideNode(node: cc.Node) {
        node.active = false;
    }

    overAnim() {
        this.player.stopAllActions();
        this.player.getComponent('player').gameOver();
        this.node.stopAllActions();
        let _collisionManager = cc.director.getCollisionManager();
        _collisionManager.enabled = false;
        this.player.setPosition(cc.v2(0, 0));
        cc.tween(this.player)
            .to(0.5, { scale: 5 }, { easing: 'backOut' })
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .start();
        cc.tween(this.player)
            .delay(0.5)
            .to(0.5, { opacity: 0 }, { easing: 'fade' })
            .call(() => {
                this.createOverRedPacket();
            })
            .start();
    }

    createOverRedPacket() {
        this.showNode(this.arr_OverAnim[0]);
        this.arr_OverAnim[0].setPosition(this.player.getPosition());
        cc.tween(this.arr_OverAnim[1])
            .by(0.5, { position: cc.v2(0, 500), opacity: { value: -255, easing: 'fade' } })
            .start();
        cc.tween(this.arr_OverAnim[2])
            .by(0.5, { position: cc.v2(500, 500), opacity: { value: -255, easing: 'fade' } })
            .start();
        cc.tween(this.arr_OverAnim[3])
            .by(0.5, { position: cc.v2(500, 0), opacity: { value: -255, easing: 'fade' } })
            .start();
        cc.tween(this.arr_OverAnim[4])
            .by(0.5, { position: cc.v2(500, -500), opacity: { value: -255, easing: 'fade' } })
            .start();
        cc.tween(this.arr_OverAnim[5])
            .by(0.5, { position: cc.v2(0, -500), opacity: { value: -255, easing: 'fade' } })
            .start();
        cc.tween(this.arr_OverAnim[6])
            .by(0.5, { position: cc.v2(-500, -500), opacity: { value: -255, easing: 'fade' } })
            .start();
        cc.tween(this.arr_OverAnim[7])
            .by(0.5, { position: cc.v2(-500, 0), opacity: { value: -255, easing: 'fade' } })
            .start();
        cc.tween(this.arr_OverAnim[8])
            .by(0.5, { position: cc.v2(-500, 500), opacity: { value: -255, easing: 'fade' } })
            .call(() => {
                LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            })
            .start();
    }
}
