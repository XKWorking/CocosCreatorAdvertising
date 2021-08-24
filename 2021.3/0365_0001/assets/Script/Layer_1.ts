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

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Label)
    label_Time: cc.Label = null;

    @property(cc.Node)
    targetParent: cc.Node = null;

    @property(cc.Node)
    arrowParent: cc.Node = null;

    @property(cc.Node)
    beginArrow: cc.Node = null;
    @property(cc.Node)
    beginTarget: cc.Node = null;
    @property(cc.Node)
    bow: cc.Node = null;
    @property(cc.Node)
    rope_1: cc.Node = null;
    @property(cc.Node)
    rope_2: cc.Node = null;
    @property(cc.Node)
    guid: cc.Node = null;
    @property(cc.Sprite)
    up_Arrows: cc.Sprite = null;

    @property(cc.Node)
    shade: cc.Node = null;

    @property(cc.Node)
    shadeCircle: cc.Node = null;

    @property(cc.Node)
    upShadeNode: cc.Node = null;

    @property(cc.Prefab)
    pre_Target: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Arrow: cc.Prefab = null;

    @property(cc.Prefab)
    pre_ScatterGold: cc.Prefab = null;

    @property(cc.Label)
    label_Score: cc.Label = null;

    @property([cc.Node])
    arr_ArrowMoveNode: cc.Node[] = [];
    // ================================================ //
    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _goldScore: number = 0;
    private _time: number = 20;
    private _isTargetMove: boolean = false;
    private _isStartTime: boolean = false;
    private _isClick: boolean = false;
    private _beginBowPos: cc.Vec2 = cc.v2(0, 0);
    private _arr_ArrowMovePos: cc.Vec2[] = [];
    private _arr_ArrowNode: cc.Node[] = [];
    private _arr_TargetNode: cc.Node[] = [];

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
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (this._isGameOver) return;
        if (this._isClick) {
            if (this._isStartTime) {
                this.schedule(this.countDown, 1);
                this._isStartTime = false;
                this.hideNode(this.guid, true);
            }
            this.bow.stopAllActions();
            this.launchArrow();
            this._isClick = false;
        }
    }

    private initGame() {
        this.arr_ArrowMoveNode.forEach((temp) => {
            this._arr_ArrowMovePos.push(temp.getPosition());
        });
        this._arr_ArrowNode.push(this.beginArrow);
        this._arr_TargetNode.push(this.beginTarget);
        let t = cc.tween;
        t(this.up_Arrows)
            .to(0.5, { fillRange: 1 })
            .to(0, { fillRange: 0 })
            .delay(0.2)
            .union()
            .repeatForever()
            .start();
        this._beginBowPos = this.bow.getPosition();
        t(this.shade)
            .to(0.3, { scale: 1 })
            .delay(0.3)
            .call(() => {
                this.shade.parent = this.upShadeNode;
                this.shade.setPosition(cc.v2(0, -25));
                t(this.shade)
                    .delay(0.2)
                    .parallel(
                        t().to(0.3, { scaleX: 0.27 }),
                        t().to(0.3, { scaleY: 0.07 })
                    )
                    .call(() => {
                        // this.shadeCircle.parent = this.upShadeNode;
                        // this.shadeCircle.setPosition(cc.v2(0, -25));
                        // t(this.shadeCircle.children[1])
                        //     .to(0.4, { scale: 1, opacity: 255 })
                        //     .to(0.7, { scale: 2.5, opacity: 0 })
                        //     .to(0, { scale: 0.1 })
                        //     .delay(1.5)
                        //     .union()
                        //     .repeatForever()
                        //     .start();
                        // t(this.shadeCircle.children[2])
                        //     .to(0.3, { scale: 1.5, opacity: 255 })
                        //     .to(0.5, { scale: 2.5, opacity: 0 })
                        //     .to(0, { scale: 0.3 })
                        //     .delay(1.5)
                        //     .union()
                        //     .repeatForever()
                        //     .start();
                        t(this.shade)
                            .parallel(
                                t().to(0.3, { scaleX: 0.54 }),
                                t().to(0.3, { scaleY: 0.14 })
                            )
                            .parallel(
                                t().to(0.3, { scaleX: 0.27 }),
                                t().to(0.3, { scaleY: 0.07 })
                            )
                            .union()
                            .repeatForever()
                            .start();
                        this._isClick = true;
                        this._isStartTime = true;
                    })
                    .start();
            })
            .start();
    }


    private countDown() {
        this._time -= 1;
        if (this._time < 10) {
            this.label_Time.string = '0' + this._time + 's';
        } else {
            this.label_Time.string = this._time + 's';
        }
        if (this._time == 8) {
            this.setTargetMove(true);
        }
        if (this._time <= 0) {
            this.unschedule(this.countDown);
            this._isGameOver = true;
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
        }
    }

    private createArrow() {
        if (this._isGameOver) return;
        this.bow.setPosition(this._beginBowPos);
        let obj = cc.instantiate(this.pre_Arrow);
        obj.setParent(this.arrowParent);
        obj.setPosition(cc.v2(0, -20));
        cc.tween(this.bow)
            .to(0.5, { position: this._arr_ArrowMovePos[0] })
            .to(0.5, { position: this._arr_ArrowMovePos[1] })
            .to(0.5, { position: this._arr_ArrowMovePos[2] })
            .to(0.5, { position: this._arr_ArrowMovePos[1] })
            .union()
            .repeatForever()
            .start();
        this._arr_ArrowNode.push(obj);
        this._isClick = true;
    }

    private createTarget() {
        if (this._isGameOver) return;
        let obj = cc.instantiate(this.pre_Target);
        obj.setParent(this.targetParent);
        obj.setPosition(cc.v2(0, 0));
        this._arr_TargetNode.push(obj);
    }



    public getTargetMove(): boolean {
        return this._isTargetMove;
    }

    public setTargetMove(value: boolean) {
        this._isTargetMove = value;
    }

    public getGoldScore(): number {
        return this._goldScore;
    }
    public addGoldScore(value: number) {
        this._goldScore += value;
        if (this._goldScore < 10) {
            this.label_Gold.string = '0' + this._goldScore;
        } else {
            this.label_Gold.string = this._goldScore.toString();
        }
    }
    public setGoldScore(value: number) {
        this._goldScore = value;
        if (this._goldScore < 10) {
            this.label_Gold.string = '0' + this._goldScore;
        } else {
            this.label_Gold.string = this._goldScore.toString();
        }
    }

    /**
     * 下一轮箭和靶
     * @param num 判断中间间隔时间
     */
    public nextLevel(num: number) {
        if (this._isGameOver) return;
        switch (num) {
            case 0:
                this.createArrow();
                this.initTargetNode();
                break;
            case 1:
                cc.tween(this.node)
                    .delay(1)
                    .call(() => {
                        this.createArrow();
                        this.createTarget();
                    })
                    .start();
                break;
        }
    }

    /**
     * 发射箭
     */
    private launchArrow() {
        let t = cc.tween;
        t(this.rope_1)
            .to(0.1, { angle: -21 })
            .start();
        t(this.rope_2)
            .to(0.1, { angle: 21 })
            .start();
        cc.tween(this._arr_ArrowNode[0])
            .by(0.2, { position: cc.v2(0, -42) })
            .call(() => {
                t(this.rope_1)
                    .to(0.1, { angle: 0 })
                    .start();
                t(this.rope_2)
                    .to(0.1, { angle: 0 })
                    .start();
            })
            .by(1, { position: cc.v2(0, 1500) })
            .call(() => {
                AudioManager.play('fail');
                this.delectArrowArrFirstElement();
                this.nextLevel(0);
            })
            .start();
    }

    /**
     * 删除箭
     */
    public delectArrowArrFirstElement() {
        let obj = this._arr_ArrowNode.shift();
        obj.destroy();
    }

    /**
     * 删除靶
     */
    public delectTargetArrFirstElement() {
        let obj = this._arr_TargetNode.shift();
        obj.destroy();
    }


    /**
     * 初始化靶
     */
    public initTargetNode() {
        let obj = this._arr_TargetNode[0];
        obj.getComponent(cc.BoxCollider).enabled = true;
        obj.getComponent('Target').init();
    }
    /**
     * 创建撒金币的特效
     */
    public createScatterGoldFx(pos: cc.Vec2) {
        if (this._isGameOver) return;
        AudioManager.play('scatterGold');
        let obj = cc.instantiate(this.pre_ScatterGold);
        obj.setParent(this.targetParent);
        obj.setPosition(pos);
    }

    /**
     * 显示分数特效
     * @param num 多少分
     * @param pos 位置
     */
    public showLabelScore(num: number, pos: cc.Vec2) {
        if (this._isGameOver) return;
        this.label_Score.string = '+' + num;
        pos.y += 120;
        this.label_Score.node.setPosition(pos);
        let t = cc.tween;
        t(this.label_Score.node)
            .to(0.3, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                t(this.label_Score.node)
                    .parallel(
                        t().to(0.3, { opacity: 0 }, { easing: 'fade' }),
                        t().by(0.3, { position: cc.v2(0, 300) }, { easing: 'backOut' })
                    )
                    .start();
            })
            .start();
        this.addGoldScore(num);
    }

    /**
     * 生成金币飞到金币收集点
     * @param GoldNode 金币生成的地点
     * @param num 生成金币的个数
     */
    public scatterGold(GoldNode: cc.Node, num: number) {
        if (this._isGameOver) return;
        let v = 20;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;

        t = v / s;

        for (let i = 0; i < num; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.changePos(star, GoldNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.3, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.changePos(star, this.node_EndPos) })
                .call(() => {
                    AudioManager.play('getGold');
                    star.destroy();
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


    /**
     * 实现抖动效果
     */
    public shake() {
        if (this._isGameOver) return;
        cc.tween(this.bg)
            .by(0.03, { position: cc.v2(10, 0) })
            .by(0.03, { position: cc.v2(-10, 0) })
            .by(0.03, { position: cc.v2(-10, 0) })
            .by(0.03, { position: cc.v2(10, 0) })
            .union()
            .start();
    }


    public getIsGameOver(): boolean {
        return this._isGameOver;
    }

}
