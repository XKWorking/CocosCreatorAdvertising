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
import PoolManager from "./Manager/PoolManager";
import ObjMove from "./ObjMove";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    guid: cc.Node = null;

    @property(cc.Node)
    fukubukuro: cc.Node = null;

    @property(cc.Node)
    fukubukuroLight: cc.Node = null;

    @property(cc.Node)
    generateObjPos: cc.Node = null;

    @property(cc.Node)
    knifeLight: cc.Node = null;

    @property(cc.Prefab)
    pre_KnifeLight: cc.Prefab = null;

    @property(cc.Prefab)
    pre_LeftKnife: cc.Prefab = null;

    @property(cc.Node)
    generateLeftKnifePos: cc.Node = null;

    @property(cc.Prefab)
    pre_RightKnife: cc.Prefab = null;

    @property(cc.Node)
    generateRightKnifePos: cc.Node = null;

    @property(cc.Node)
    objPartEndPos: cc.Node = null;

    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Label)
    label_Time: cc.Label = null;

    @property(cc.Node)
    generateCirclePos: cc.Node = null;

    @property(cc.Prefab)
    pre_Circle: cc.Prefab = null;

    @property(cc.Node)
    firstObj: cc.Node = null;

    // @property(cc.Node)
    // secondObj: cc.Node = null;

    @property([cc.Prefab])
    arr_Obj: cc.Prefab[] = [];

    @property([cc.Node])
    arr_ObjPartEndPos: cc.Node[] = [];
    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _isGuidTime: boolean = false;
    private _goldScore: number = 0;
    private _countDownTime: number = 20;
    private _initOrigin: cc.Vec2 = cc.v2(0, 0);
    private _isLeftKnife: boolean = false;
    private _isClick: boolean = true;
    private _time: number = 0;

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.InitGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
    }

    update(dt: number) {
        if (!this._isClick) {
            this._time += dt;
            if (this._time >= 0.4) {
                this._time = 0;
                this._isClick = true;
            }
        }
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (this._isGuidTime) {
            this.schedule(this.CountDown, 1);
            this._isGameStart = true;
            this._isGuidTime = false;
            this.FukubukuroEffect();
            this.firstObj.getComponent(ObjMove).SetMoveSpeed(600);
            // this.secondObj.getComponent(ObjMove).SetMoveSpeed(600);
            // cc.tween(this.secondObj)
            //     .by(6, { angle: 360 })
            //     .call(() => {
            //         this.secondObj.destroy();
            //     })
            //     .start();
            this.HideNode(this.guid, false);
        }
        if (!this._isGameStart) return;
        if (!this._isClick) return;
        this.CreateKnife();
        this._isClick = false;
    }


    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        let t = cc.tween;
        this.firstObj.getComponent(ObjMove).SetMoveSpeed(0);
        this.firstObj.getComponent(ObjMove).SetIsGameStart(false);
        t(this.fukubukuro)
            .to(0.3, { scaleY: 0.8 })
            .call(() => {
                t(this.fukubukuroLight)
                    .delay(0.1)
                    .to(0.15, { opacity: 255 }, { easing: 'fade' })
                    .to(0.15, { opacity: 0 }, { easing: 'fade' })
                    .call(() => {
                        t(this.firstObj)
                            .to(0, { opacity: 255 })
                            .to(0.8, { position: cc.v3(0, 35) })
                            .call(() => {
                                this.ShowGuid();
                            })
                            .start();

                        t(this.firstObj)
                            .to(0.8, { angle: 48 })
                            .start();
                    })
                    .start();
            })
            .to(0.3, { scaleY: 1 }, { easing: 'backOut' })
            .start();
        // this.secondObj.getComponent(ObjMove).SetMoveSpeed(0);
        // this.secondObj.getComponent(ObjMove).SetIsGameStart(false);
        t(this.generateLeftKnifePos.children[0])
            .parallel(
                t().to(0.5, { scaleX: -1.1 }),
                t().to(0.5, { scaleY: 1.1 })
            )
            .parallel(
                t().to(0.5, { scaleX: -1 }),
                t().to(0.5, { scaleY: 1 })
            )
            .union()
            .repeatForever()
            .start();
        t(this.generateRightKnifePos.children[0])
            .to(0.5, { scale: 1.1 })
            .to(0.5, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }


    /**
    * 倒计时
    */
    private CountDown() {
        this._countDownTime -= 1;
        this.label_Time.string = this._countDownTime + 's';
        if (this._countDownTime <= 0) {
            this.unschedule(this.CountDown);
            this.GameOver();
        }
    }

    /**
     * 游戏结束
     */
    private GameOver() {
        if (this._isGameOver) return;
        this._isGameStart = false;
        this._isGameOver = true;
        this.unschedule(this.CountDown);
        this.fukubukuro.stopAllActions();
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }

    private ShowGuid() {
        this.ShowNode(this.guid, false);
        cc.tween(this.guid.children[0])
            .to(0.5, { scale: 2.5 })
            .call(() => {
                this._isGuidTime = true;
                let pos = this.ChangePos(this.guid, this.firstObj);
                pos.y -= 185;
                this.guid.setPosition(pos);
            })
            .start();
    }

    /**
     * 创建生成的物体
     */
    private CreateObj() {
        let obj = cc.instantiate(Util.randomArray(this.arr_Obj));
        obj.setParent(this.generateObjPos);
        obj.setPosition(this._initOrigin);
    }

    /**
     * 创建小刀
     */
    private CreateKnife() {
        AudioManager.play('knife');
        if (this._isLeftKnife) {
            let left_Obj = PoolManager.instance.getNode(this.pre_LeftKnife, this.generateLeftKnifePos);
            left_Obj.setPosition(this._initOrigin);
            cc.tween(left_Obj)
                .by(0.8, { position: cc.v3(1600, 0) })
                .call(() => {
                    PoolManager.instance.putNode(left_Obj);
                })
                .start();
            this._isLeftKnife = false;
        } else {
            let rithg_Obj = PoolManager.instance.getNode(this.pre_RightKnife, this.generateRightKnifePos);
            rithg_Obj.setPosition(this._initOrigin);
            cc.tween(rithg_Obj)
                .by(0.8, { position: cc.v3(-1600, 0) })
                .call(() => {
                    PoolManager.instance.putNode(rithg_Obj);
                })
                .start();
            this._isLeftKnife = true;
        }

    }

    /**
     * 福袋的吞吐效果
     */
    private FukubukuroEffect() {
        let t = cc.tween;
        t(this.fukubukuro)
            .to(0.3, { scaleY: 0.8 })
            .call(() => {
                t(this.fukubukuroLight)
                    .delay(0.1)
                    .to(0.15, { opacity: 255 }, { easing: 'fade' })
                    .to(0.15, { opacity: 0 }, { easing: 'fade' })
                    .call(() => {
                        this.CreateObj();
                    })
                    .start();
            })
            .to(0.3, { scaleY: 1 }, { easing: 'backOut' })
            .delay(0.2)
            .union()
            .repeatForever()
            .start();
    }

    /**
    * 实现金币飞的效果
    * @param generateNode 生成的地点
    */
    public ScatterGold(generateNode: cc.Node) {
        AudioManager.play('gold', 0.8);
        let v = 1000;
        let s = Util.getDistance(this.goldEndPos.getPosition(), generateNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < 5; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.ChangePos(star, generateNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-30, 30), y: Util.random(-30, 30), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.ChangePos(star, this.goldEndPos) })
                .call(() => {
                    star.destroy();
                    this.AddGoldScore(2);
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
    private ShowNode(node: cc.Node, isAnim: boolean, num?: number) {
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
    private HideNode(node: cc.Node, isAnim: boolean, num?: number) {
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
    public ChangePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }

    /**
     * 摇摆效果
     * @param node 
     */
    private Shake(node: cc.Node) {
        cc.tween(node)
            .to(0.1, { angle: 3 })
            .to(0.1, { angle: 0 })
            .to(0.1, { angle: -3 })
            .to(0.1, { angle: 0 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }



    /**
     * 显示刀光特效
     * @param node 这node节点的位置上显示
     */
    public ShowKnifeEffect() {
        // let pos: cc.Vec3 = this.ChangePos(this.knifeLight, node);
        // pos.y -= 35;
        // this.knifeLight.setPosition(pos);
        // cc.tween(this.knifeLight)
        //     .to(0, { opacity: 255 }, { easing: 'fade' })
        //     .to(0.3, { opacity: 0 }, { easing: 'fade' })
        //     .start();
        let obj = PoolManager.instance.getNode(this.pre_KnifeLight, this.knifeLight);
        cc.tween(obj)
            .to(0, { opacity: 255 }, { easing: 'fade' })
            .to(0.4, { opacity: 0 }, { easing: 'fade' })
            .call(() => {
                PoolManager.instance.putNode(obj);
            })
            .start();
    }

    /**
     * 显示圆圈扩散效果
     */
    public ShowCircleEffect() {
        let obj = PoolManager.instance.getNode(this.pre_Circle, this.generateCirclePos);
        cc.tween(obj)
            .to(0.5, { scale: 1.5 })
            .call(() => {
                obj.scale = 0;
                PoolManager.instance.putNode(obj);
            })
            .start();
    }

    public GetGoldScore(): number {
        return this._goldScore;
    }
    public AddGoldScore(value: number) {
        this._goldScore += value;
        this.label_Gold.string = this._goldScore.toString();
    }
    public SetGoldScore(value: number) {
        this._goldScore = value;
        this.label_Gold.string = this._goldScore.toString();
    }

    public GetArrObjPartEndPos(): cc.Node[] {
        return this.arr_ObjPartEndPos;
    }

}
