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
import MoveBg from "./MoveBg";
import RedPacketMove from "./RedPacketMove";
import BarrierMove from "./BarrierMove";
import FukubukuroMove from "./FukubukuroMove";
import GoldMove from "./GoldMove";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Label)
    label_Time: cc.Label = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    playerRipple: cc.Node = null;

    @property(cc.Node)
    left_PlayerPos: cc.Node = null;

    @property(cc.Node)
    right_PlayerPos: cc.Node = null;

    @property(cc.Node)
    left_PlayerRipplePos: cc.Node = null;

    @property(cc.Node)
    right_PlayerRipplePos: cc.Node = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    @property(cc.Node)
    redLine: cc.Node = null;

    @property(cc.Node)
    objParent: cc.Node = null;

    @property(cc.Node)
    objFxParent: cc.Node = null;

    @property(cc.Node)
    begingBarrierMove: cc.Node = null;

    @property([cc.Node])
    beginRedPacketMove: cc.Node[] = [];

    @property([MoveBg])
    arr_MoveBg: MoveBg[] = [];

    @property([cc.Node])
    arr_GeneratePos: cc.Node[] = [];

    @property([cc.Prefab])
    arr_PreObjs: cc.Prefab[] = [];
    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _isClickButton: boolean = true;
    private _isLeft: boolean = true;
    private _isGuidTime: boolean = true;
    private _goldScore: number = 0;
    private _countDownTime: number = 200;
    private _generateBeginTime: number = 0;
    private _generateEndTime: number = 0;

    private _barrierGenerateBeginTime: number = 0;
    private _barrierGenerateEndTime: number = 2.5;
    private _arr_AllRedPackets: cc.Node[] = [];
    private _arr_AllGolds: cc.Node[] = [];
    private _arr_AllBarriers: cc.Node[] = [];
    private _arr_AllFukubukuro: cc.Node[] = [];

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
    }

    update(dt: number) {
        if (this._isGameStart) {
            this._generateBeginTime += dt;
            if (this._generateBeginTime >= this._generateEndTime) {
                this._generateBeginTime = 0;
                this.createPreObj();
                this._generateEndTime = Util.random(1.4, 1.6);
            }
            this._barrierGenerateBeginTime += dt;
            if (this._barrierGenerateBeginTime >= this._barrierGenerateEndTime) {
                this._barrierGenerateBeginTime = 0;
                this._generateBeginTime = 0;
                this.createBarrier();
                this._barrierGenerateEndTime = Util.random(5, 6);
            }

        }
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (!this._isClickButton) return;
        this._isClickButton = false;
        if (this._isLeft) {
            this._isLeft = !this._isLeft;
            this.playerTurnRightMove();
            if (this._isGuidTime) {
                this.hideNode(this.guidFinger, false);
                this.guidFinger.parent = this.left_PlayerPos;
                this.guidFinger.setPosition(cc.v2(0, 0));
                this.setBgMoveSpeed(500);
                this.setBeginObjMoveSpeed(500);
                this._isClickButton = false;
            }
        } else {
            this._isLeft = !this._isLeft;
            this.playerTurnLeftMove();
            if (this._isGuidTime) {
                this.hideNode(this.guidFinger, false);
                this.setBgMoveSpeed(500);
                this.setBeginObjMoveSpeed(500);
                this._isClickButton = false;
            }
        }
    }

    private initGame() {
        this.setBeginObjMoveSpeed(0);
    }


    /**
     * 倒计时
     */
    private countDown() {
        this._countDownTime -= 1;
        this.label_Time.string = this._countDownTime + 's';

        if (this._countDownTime <= 0) {
            this.gameOver();
            this.unschedule(this.countDown);
        }
    }


    private createPreObj() {
        let index = Util.randomInteger(0, 2);
        let preObj = this.arr_PreObjs[index];// Util.randomArray(this.arr_PreObjs);//
        let obj = cc.instantiate(preObj);
        let parent = Util.randomArray(this.arr_GeneratePos);
        obj.setParent(parent);
        obj.name = index.toString();
        switch (index) {
            case 0:
                this.addFukuburo(obj);
                break;
            case 1:
                this.addGold(obj);
                break;
            case 2:
                this.addRedPacket(obj);
                break;
        }
        cc.tween(obj.children[0])
            .by(0.4, { position: cc.v3(0, -15) })
            .by(0.4, { position: cc.v3(0, 15) })
            .delay(0.3)
            .union()
            .repeatForever()
            .start();
    }

    private createBarrier() {
        let preObj = this.arr_PreObjs[3];
        let obj = cc.instantiate(preObj);
        let parent = Util.randomArray(this.arr_GeneratePos);
        obj.setParent(parent);
        obj.name = '3';
        this.addBarrier(obj);

    }


    public setBgMoveSpeed(value: number) {
        this.arr_MoveBg.forEach((temp) => {
            temp.setMoveSpeed(value);
        });
    }

    public setBeginObjMoveSpeed(value: number) {
        this.beginRedPacketMove.forEach((temp) => {
            temp.getComponent(RedPacketMove).setMoveSpeed(value);
            temp.children[0].stopAllActions();
            cc.tween(temp.children[0])
                .by(0.4, { position: cc.v3(0, -15) })
                .by(0.4, { position: cc.v3(0, 15) })
                .delay(0.3)
                .union()
                .repeatForever()
                .start();
        });
        this.begingBarrierMove.getComponent(BarrierMove).setMoveSpeed(value);
    }

    public getGoldScore(): number {
        return this._goldScore;
    }
    public addGoldScore(value: number) {
        this._goldScore += value;
        this.label_Gold.string = this._goldScore.toString();
    }
    public setGoldScore(value: number) {
        this._goldScore = value;
        this.label_Gold.string = this._goldScore.toString();
    }

    /**
     * 摇晃效果
     * @param node 
     */
    private shake(node: cc.Node) {
        cc.tween(node)
            .by(0.1, { angle: 3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: 3 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 收集金币特效
     * @param GoldNode 
     */
    public scatterGold(GoldNode: cc.Node) {

        let v = 100;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;

        t = v / s;

        for (let i = 0; i < 5; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.changePos(star, GoldNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.changePos(star, this.node_EndPos) })
                .call(() => {
                    star.destroy();
                    this.addGoldScore(5);
                    AudioManager.play('gold');
                })
                .start();
        }
    }

    /**
   * 激活节点
   * @param node 要激活的节点 
   * @param isAnim 是否有0.5s的缓动效果
   * @param num 透明度，不输入则为255
   */
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
    /**
     * 关闭节点
     * @param node 要关闭的节点 
     * @param isAnim 是否有0.5s的缓动效果
     * @param num 透明度，不输入则为0
     */
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



    /**
     * 
     * @param node1 要被转换的node
     * @param node2 目标node
     * @returns 
     */
    private changePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }


    public showGuidFinger() {
        this.showNode(this.guidFinger, false);
    }


    private playerTurnRightMove() {
        let t = cc.tween;
        t(this.player)
            .to(0.3, { position: this.right_PlayerPos.position })
            .call(() => {
                if (!this._isGuidTime) {
                    this._isClickButton = true;
                } else {
                    this._isClickButton = false;
                }
            })
            .start();

        t(this.playerRipple)
            .to(0.3, { position: this.right_PlayerRipplePos.position })
            .start();

    }
    private playerTurnLeftMove() {
        let t = cc.tween;
        t(this.player)
            .to(0.3, { position: this.left_PlayerPos.position })
            .call(() => {
                if (!this._isGuidTime) {
                    this._isClickButton = true;
                } else {
                    this._isClickButton = false;
                }
            })
            .start();
        t(this.playerRipple)
            .to(0.3, { position: this.left_PlayerRipplePos.position })
            .start();
    }

    public getGuidTime(): boolean {
        return this._isGuidTime
    }

    public setGuidTime(value: boolean) {
        this._isGuidTime = value;
    }
    public getGameStart(): boolean {
        return this._isGameStart
    }

    public setGameStart(value: boolean) {
        this._isGameStart = value;
    }

    public gameStart() {
        this._isClickButton = true;
        this.setBeginObjMoveSpeed(500);
        this.setBgMoveSpeed(500);
        this.setGameStart(true);
        this.setGuidTime(false);
        this.schedule(this.countDown, 1);
    }

    public gameOver() {
        if (this._isGameOver) return;
        this.unschedule(this.countDown);
        this._isGameOver = true;
        this.setGameStart(false);
        this.stopAllObjMove();
        this.player.stopAllActions();
        this.playerRipple.stopAllActions();
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }

    /**
     * 实现碰撞障碍物后退效果
     */
    public backUp() {
        this.setBgMoveSpeed(0);
        let t = cc.tween;
        t(this.player)
            .by(0.15, { position: cc.v3(0, -50) })
            .by(0.15, { position: cc.v3(0, 50) })
            .call(() => {
                this.runAllObjMove();
            })
            .start();

        t(this.playerRipple)
            .by(0.15, { position: cc.v3(0, -50) })
            .by(0.15, { position: cc.v3(0, 50) })
            .start();
    }

    /**
     * 停止所有物体的运动
     */
    public stopAllObjMove() {
        if (this._arr_AllRedPackets != null) {
            this._arr_AllRedPackets.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(RedPacketMove).setMoveSpeed(0);
                }
            });
        }
        if (this._arr_AllGolds != null) {
            this._arr_AllGolds.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(GoldMove).setMoveSpeed(0);
                }
            });
        }
        if (this._arr_AllBarriers != null) {
            this._arr_AllBarriers.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(BarrierMove).setMoveSpeed(0);
                }
            });
        }
        if (this._arr_AllFukubukuro != null) {
            this._arr_AllFukubukuro.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(FukubukuroMove).setMoveSpeed(0);
                }
            });
        }
        this.setBgMoveSpeed(0);
    }
    /**
     * 开始所有的运动
     */
    public runAllObjMove() {
        this.setBgMoveSpeed(500);
        if (this._arr_AllRedPackets != null) {
            this._arr_AllRedPackets.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(RedPacketMove).setMoveSpeed(500);
                }
            });
        }
        if (this._arr_AllGolds != null) {
            this._arr_AllGolds.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(GoldMove).setMoveSpeed(500);
                }
            });
        }
        if (this._arr_AllBarriers != null) {
            this._arr_AllBarriers.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(BarrierMove).setMoveSpeed(500);
                }
            });
        }
        if (this._arr_AllFukubukuro != null) {
            this._arr_AllFukubukuro.forEach((temp) => {
                if (temp.active == true) {
                    temp.getComponent(FukubukuroMove).setMoveSpeed(500);
                }
            });
        }
    }

    private addRedPacket(node: cc.Node) {
        this._arr_AllRedPackets.push(node);
    }
    private addGold(node: cc.Node) {
        this._arr_AllGolds.push(node);
    }
    private addBarrier(node: cc.Node) {
        this._arr_AllBarriers.push(node);
    }
    public delectBarrier() {
        this._arr_AllBarriers.shift();
    }
    private addFukuburo(node: cc.Node) {
        this._arr_AllFukubukuro.push(node);
    }

    /**
     * 返回
     */
    public goBack() {
        this.player.stopAllActions();
        this.playerRipple.stopAllActions();
        this._isClickButton = false;
        if (this._isLeft) {
            this._isLeft = !this._isLeft;
            this.playerTurnRightMove();

        } else {
            this._isLeft = !this._isLeft;
            this.playerTurnLeftMove();
        }
    }


    private getPlayerObjNum(): number {
        return this.objParent.childrenCount;
    }

    public JudgePlayerObjNum() {
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                if (this.getPlayerObjNum() >= 4) {
                    this.showNode(this.redLine, false);
                    cc.tween(this.redLine)
                        .to(0.5, { opacity: 0 })
                        .to(0.5, { opacity: 255 })
                        .delay(0.1)
                        .union()
                        .repeatForever()
                        .start();
                } else {
                    {
                        this.hideNode(this.redLine, false);
                    }
                }
            })
            .start();
    }

    public getObjParent(): cc.Node {
        return this.objParent;;
    }

    public getObjFxParent(): cc.Node {
        return this.objFxParent;
    }

    public getIsGameOver(): boolean {
        return this._isGameOver;
    }

    public setIsClickButton(value: boolean) {
        this._isClickButton = value;
    }

    public checkSame() {
        console.log('objParent的孩子数量', this.objParent.childrenCount);
        console.log('储存的孩子数量', this.getPlayerObjNum());
        if (this.objParent.childrenCount < 2) return;
        for (let i: number = 0; i < this.objParent.childrenCount - 1; i++) {
            let obj_1 = this.objParent.children[i];
            let obj_2 = this.objParent.children[i + 1];
            console.log('obj_1的名字', obj_1.name);
            console.log('obj_2的名字', obj_2.name);
            if (obj_1.name == obj_2.name) {
                this.scatterGold(obj_1);
                if (obj_1.name == '0') {
                    obj_1.getComponent(FukubukuroMove).createRippleExplode(this.objFxParent, obj_1.getPosition());
                    obj_2.getComponent(FukubukuroMove).createRippleExplode(this.objFxParent, obj_2.getPosition());
                } else if (obj_1.name == '1') {
                    obj_1.getComponent(GoldMove).createRippleExplode(this.objFxParent, obj_1.getPosition());
                    obj_2.getComponent(GoldMove).createRippleExplode(this.objFxParent, obj_2.getPosition());
                } else if (obj_1.name == '2') {
                    obj_1.getComponent(RedPacketMove).createRippleExplode(this.objFxParent, obj_1.getPosition());
                    obj_2.getComponent(RedPacketMove).createRippleExplode(this.objFxParent, obj_2.getPosition());
                }
                this.JudgePlayerObjNum();
                return;
            }
        }
    }

}
