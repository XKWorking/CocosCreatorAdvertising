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
import GlobalData from "./GlobalData";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    bg_arr: cc.Node = null;

    @property(cc.Node)
    train: cc.Node = null;

    @property(cc.Animation)
    trainAirBillow: cc.Animation = null;

    @property(cc.Node)
    shopBtn: cc.Node = null;

    @property(cc.Node)
    shopShade: cc.Node = null;

    @property(cc.Node)
    shopInterface: cc.Node = null;

    @property(cc.Node)
    businessInterface: cc.Node = null;

    @property(cc.ProgressBar)
    spotProgressBar: cc.ProgressBar = null;

    @property(cc.Node)
    redSpot: cc.Node = null;

    @property(cc.Sprite)
    img_GuiLin: cc.Sprite = null;

    @property(cc.Sprite)
    img_NanNing: cc.Sprite = null;

    @property(cc.SpriteFrame)
    img_Arrive: cc.SpriteFrame = null;

    @property(cc.Animation)
    halfTrainMan: cc.Animation = null;

    @property(cc.Node)
    halfTrainManPos: cc.Node = null;

    @property(cc.Node)
    img_Remind: cc.Node = null;

    @property(cc.Node)
    carriage_Null: cc.Node = null;

    @property(cc.Node)
    carriage_Obj: cc.Node = null;

    @property(cc.Node)
    shadeMask: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    img_Coke: cc.Node = null;

    @property(cc.Node)
    img_Maize: cc.Node = null;

    @property(cc.Node)
    sellBtn: cc.Node = null;

    @property(cc.Node)
    notSellBtn: cc.Node = null;

    @property(cc.Node)
    sell_Cargo_Coke: cc.Node = null;

    @property(cc.Node)
    sell_Cargo_Maize: cc.Node = null;

    @property(cc.Node)
    resultWinFx: cc.Node = null;

    @property(cc.Node)
    img_WinResult: cc.Node = null;

    @property(cc.Node)
    img_FailResult: cc.Node = null;

    @property(cc.Node)
    resultShade: cc.Node = null;

    @property(cc.Node)
    bird: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Prefab)
    pre_FlyDiamond: cc.Prefab = null;

    @property(cc.Node)
    diamondEndPos: cc.Node = null;

    @property(cc.Label)
    label_Diamond: cc.Label = null;

    @property(cc.Prefab)
    pre_CargoCoke: cc.Prefab = null;

    @property(cc.Prefab)
    pre_CargoMaize: cc.Prefab = null;

    @property([cc.Node])
    arr_CargoPos: cc.Node[] = [];

    @property([cc.Animation])
    arr_TrainWheelSmoke: cc.Animation[] = [];
    // ================================================ //
    private bgStation: cc.Node = null;
    private _isGameStart: boolean = false;
    private _goldScore: number = 0;
    private _diamondScore: number = 0;
    private _isCoke: boolean = true;
    private _isSell: boolean = true;
    private _trainInitPos: cc.Vec2 = cc.v2(0, 0);

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏开始界面");
    }

    update(dt: number) {
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }

    private initGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        this._trainInitPos = this.train.getPosition();
        AudioManager.play('broadcast', 0.8);
        this.bgStation = this.bg_arr.children[0];
        this.bgStation.active = true;
        this.tarinComeIn_1();
        this.hideNode(this.shopInterface, false);
        this.hideNode(this.businessInterface, false);
        let animState = this.trainAirBillow.play();
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
        this.arr_TrainWheelSmoke.forEach((temp) => {
            let animState = temp.play();
            animState.wrapMode = cc.WrapMode.Loop;
            animState.repeatCount = Infinity;
        });
        this.showBreathe(this.shopBtn);
        this.setGoldScore(12.5);
        this.setDiamondScore(12);
    }

    /**
      * 火车到达第一个站广州
      */
    private tarinComeIn_1() {
        AudioManager.play('depart', 0.8);
        AudioManager.play('run', 0.8, true);
        AudioManager.pauseBgm();
        AudioManager.play('roadBg', 0.8, true);
        AudioManager.play('rail', 0.8, true);
        let t = cc.tween;
        t(this.train)
            .by(5, { position: cc.v3(0, 1480) }, { easing: 'quadInOut' })
            .call(() => {
                this.showHalfTrainMan();
                this.trainAirBillow.stop();
                this.trainAirBillow.node.active = false;
                this.arr_TrainWheelSmoke.forEach((temp) => {
                    temp.stop();
                    temp.node.active = false;
                });
                AudioManager.resumeBgm();
                AudioManager.pause('roadBg');
                AudioManager.pause('rail');
                AudioManager.stop('broadcast');
            })
            .start();
        t(this.bgStation)
            .delay(0.5)
            .by(4.5, { position: cc.v3(0, -1480) }, { easing: 'quadInOut' })
            .start();
        t(this.train)
            .delay(3)
            .call(() => {
                AudioManager.pause('run');
                AudioManager.play('stop_2', 0.8);
                AudioManager.play('surroundings', 0.8, true);
            })
            .start();
    }

    /**
     * 显示商店页面
     */
    public showShopInterface() {
        CpSDK.FirstTouch();
        AudioManager.play('click');
        let t = cc.tween;
        this.shopBtn.stopAllActions();
        t(this.shopBtn)
            .to(0.2, { scale: 0.8 })
            .to(0.2, { scale: 1 })
            .call(() => {
                this.showBreathe(this.shopBtn);
                this.hideNode(this.shadeMask, false);
                this.hideNode(this.finger, false);
                this.hideNode(this.halfTrainMan.node, false);
            })
            .start();
        this.shopShade.active = true;
        this.shopInterface.active = true;
        t(this.shopInterface)
            .parallel(
                t().to(0.5, { scale: 1 }, { easing: 'backOut' }),
                t().to(0.1, { opacity: 255 }, { easing: 'fade' })
            )
            .start();
        this.shopBtn.getComponent(cc.Button).enabled = false;
        t(this.img_Coke)
            .by(0.5, { angle: -3 })
            .by(0.5, { angle: 3 })
            .by(0.5, { angle: 3 })
            .by(0.5, { angle: -3 })
            .union()
            .repeatForever()
            .start();
        t(this.img_Maize)
            .by(0.5, { angle: -3 })
            .by(0.5, { angle: 3 })
            .by(0.5, { angle: 3 })
            .by(0.5, { angle: -3 })
            .union()
            .repeatForever()
            .start();
        CpSDK.EnterSection(2, "广州进货界面");
    }

    /**
     * 显示半身的乘务员
     */
    private showHalfTrainMan() {
        let t = cc.tween;
        t(this.halfTrainMan.node)
            .to(1, { position: this.halfTrainManPos.position })
            .call(() => {
                let animState = this.halfTrainMan.play();
                animState.wrapMode = cc.WrapMode.Normal;
                t(this.img_Remind)
                    .parallel(
                        t().to(0.5, { scale: 1 }),
                        t().to(0.5, { opacity: 255 }, { easing: 'fade' })
                    )
                    .call(() => {
                        this.guidClickShop();
                    })
                    .start();
            })
            .start();
    }

    /**
     * 指引点击商店
     */
    private guidClickShop() {
        cc.tween(this.shadeMask)
            .to(0.3, { scale: 1 })
            .call(() => {
                this.showNode(this.finger, true);
                this.showFingerPock();
                this.shopBtn.getComponent(cc.Button).enabled = true;
            })
            .start();
    }

    /**
     * 选中可乐
     */
    public clickBtnCoke() {
        AudioManager.play('click');
        this.img_Coke.children[0].active = true;
        this.img_Coke.children[1].getComponent(cc.Button).enabled = false;
        this.img_Maize.children[1].getComponent(cc.Button).enabled = false;
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                AudioManager.play('carriage');
                AudioManager.play('gold', 0.8);
                AudioManager.play('diamond', 0.8);
                this.showNode(this.carriage_Obj, true);
                this.hideNode(this.carriage_Null, true);
                this.hideNode(this.shopInterface, true);
                this.hideNode(this.shopShade, true);
                this._isCoke = true;
                this.arr_CargoPos.forEach((temp) => {
                    this.createCargoCoke(temp);
                });
                this.leavePlace_1();
            })
            .start();
    }
    /**
     * 选中玉米
     */
    public clickBtnMaize() {
        AudioManager.play('click');
        this.img_Maize.children[0].active = true;
        this.img_Coke.children[1].getComponent(cc.Button).enabled = false;
        this.img_Maize.children[1].getComponent(cc.Button).enabled = false;
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                AudioManager.play('carriage');
                AudioManager.play('gold', 0.8);
                AudioManager.play('diamond', 0.8);
                this.showNode(this.carriage_Obj, true);
                this.hideNode(this.carriage_Null, true);
                this.hideNode(this.shopInterface, true);
                this.hideNode(this.shopShade, true);
                this._isCoke = false;
                this.arr_CargoPos.forEach((temp) => {
                    this.createCargoMaize(temp);
                });
                this.leavePlace_1();
            })
            .start();
    }

    /**
     * 创建可乐
     */
    private createCargoCoke(parent: cc.Node) {
        let obj = cc.instantiate(this.pre_CargoCoke);
        obj.setParent(parent);
        obj.setPosition(cc.v2(0, 0));
        this.reduceGoldScore(1);
        this.reduceDiamondScore(1);
    }

    /**
     * 创建玉米 
     */
    private createCargoMaize(parent: cc.Node) {
        let obj = cc.instantiate(this.pre_CargoMaize);
        obj.setParent(parent);
        obj.setPosition(cc.v2(0, 0));
        this.reduceGoldScore(1);
        this.reduceDiamondScore(1);
    }



    /**
      * 火车离开第一个站广州
      */
    private leavePlace_1() {
        AudioManager.play('depart', 0.8);
        AudioManager.pause('surroundings');
        AudioManager.pauseBgm();
        AudioManager.resume('roadBg');
        AudioManager.resume('rail');
        let t = cc.tween;
        t(this.bgStation)
            .by(3.5, { y: -1160 }, { easing: 'quadIn' })
            .call(() => {

            })
            .start();
        t(this.train)
            .by(4, { y: 1480 }, { easing: 'quadIn' })
            .call(() => {
                this.hideNode(this.bgStation, true);
                t(this.train)
                    .delay(0.5)
                    .call(() => {
                        this.tarinComeIn_2();
                        this.train.setPosition(this._trainInitPos);
                    })
                    .start();
            })
            .start();
    }

    /**
     * 火车到达第二个站桂林
     */
    private tarinComeIn_2() {
        this.bgStation = this.bg_arr.children[1];
        this.showNode(this.bgStation, true);
        let t = cc.tween;
        t(this.train)
            .delay(0.5)
            .call(() => {
                AudioManager.play('depart', 0.8);
                AudioManager.pauseBgm();
                AudioManager.play('broadcast', 0.8);
                this.trainAirBillow.node.active = true;
                let animState = this.trainAirBillow.play();
                animState.wrapMode = cc.WrapMode.Loop;
                animState.repeatCount = Infinity;
                this.arr_TrainWheelSmoke.forEach((temp) => {
                    temp.node.active = true;
                    let animState = temp.play();
                    animState.wrapMode = cc.WrapMode.Loop;
                    animState.repeatCount = Infinity;
                });
            })
            .by(5, { position: cc.v3(0, 1480) }, { easing: 'quadInOut' })
            .call(() => {
                AudioManager.stop('broadcast');
                AudioManager.pause('roadBg');
                AudioManager.pause('rail');
                AudioManager.resumeBgm();
                this.showBusinessInterface();
                this.trainAirBillow.stop();
                this.trainAirBillow.node.active = false;
                this.arr_TrainWheelSmoke.forEach((temp) => {
                    temp.stop();
                    temp.node.active = false;
                });
                CpSDK.EnterSection(3, "桂林是否卖货界面");
            })
            .start();
        t(this.bgStation)
            .delay(1)
            .by(4.5, { position: cc.v3(0, -1480) }, { easing: 'quadInOut' })
            .start();
        t(this.train)
            .delay(3.5)
            .call(() => {
                AudioManager.pause('run');
                AudioManager.play('stop_2', 0.8);
                AudioManager.resume('surroundings');
            })
            .start();
        t(this.redSpot)
            .delay(0.5)
            .by(5, { position: cc.v3(145, 0) })
            .call(() => {
                this.img_GuiLin.spriteFrame = this.img_Arrive;
            })
            .start();
        t(this.spotProgressBar)
            .delay(0.5)
            .to(5, { progress: 0.5 })
            .start();
    }

    /**
     * 显示买卖界面
     */
    private showBusinessInterface() {
        let t = cc.tween;
        this.businessInterface.active = true;
        t(this.businessInterface)
            .parallel(
                t().to(0.5, { scale: 1 }, { easing: 'backOut' }),
                t().to(0.1, { opacity: 255 }, { easing: 'fade' })
            )
            .start();
        if (this._isCoke) {
            this.showNode(this.sell_Cargo_Coke, false);
        } else {
            this.showNode(this.sell_Cargo_Maize, false);
        }
        t(this.sellBtn)
            .to(0.5, { scale: 0.9 })
            .to(0.5, { scale: 1 })
            .union()
            .repeatForever()
            .start();
        t(this.notSellBtn)
            .to(0.5, { scale: 1 })
            .to(0.5, { scale: 0.9 })
            .union()
            .repeatForever()
            .start();
    }


    /**
     * 选择卖
     */
    public clickBtnSell() {
        AudioManager.play('click');
        this._isSell = true;
        this.sellBtn.stopAllActions();
        this.notSellBtn.stopAllActions();
        this.sellBtn.getComponent(cc.Button).enabled = false;
        this.notSellBtn.getComponent(cc.Button).enabled = false;
        let t = cc.tween;
        t(this.sellBtn)
            .to(0.3, { scale: 1.1 })
            .to(0.3, { scale: 1 })
            .call(() => {
                this.hideNode(this.carriage_Obj, true);
                this.showNode(this.carriage_Null, true);
                t(this.node)
                    .call(() => {
                        this.hideNode(this.businessInterface, true);
                    })
                    .delay(0.3)
                    .call(() => {
                        this.showSellResult();
                    })
                    .start();
            })
            .start();
        GlobalData.instance.setIsWin(true);
    }

    /**
     * 选择不卖
     */
    public clickBtnNotSell() {
        AudioManager.play('click');
        this._isSell = false;
        this.sellBtn.stopAllActions();
        this.notSellBtn.stopAllActions();
        this.sellBtn.getComponent(cc.Button).enabled = false;
        this.notSellBtn.getComponent(cc.Button).enabled = false;
        let t = cc.tween;
        t(this.notSellBtn)
            .to(0.3, { scale: 1.1 })
            .to(0.3, { scale: 1 })
            .call(() => {
                t(this.node)
                    .call(() => {
                        this.hideNode(this.businessInterface, true);
                    })
                    .delay(0.3)
                    .call(() => {
                        this.leavePlace_2();
                    })
                    .start();
            })
            .start();
        GlobalData.instance.setIsWin(false);
    }

    /**
     * 显示卖的结果
     */
    private showSellResult() {
        this.resultShade.active = true;
        this.resultWinFx.active = true;
        let t = cc.tween;
        t(this.node)
            .delay(1.5)
            .call(() => {
                this.img_WinResult.active = true;
                let light = this.img_WinResult.children[0];
                t(light)
                    .by(2, { angle: -360 })
                    .union()
                    .repeatForever()
                    .start();
                AudioManager.play('acquireAward', 0.8);
                t(this.img_WinResult)
                    .parallel(
                        t().to(0.5, { scale: 1 }, { easing: 'backOut' }),
                        t().to(0.1, { opacity: 255 }, { easing: 'fade' })
                    )
                    .call(() => {
                        this.scatterDiamond(this.img_WinResult);
                        this.scatterGold(this.img_WinResult);
                    })
                    .delay(1.2)
                    .call(() => {
                        this.leavePlace_2();
                        this.hideNode(this.img_WinResult, false);
                    })
                    .start();
            })
            .start();
    }

    /**
     * 火车离开第二个站桂林
     */
    private leavePlace_2() {
        this.hideNode(this.resultShade, true);
        AudioManager.play('depart', 0.8);
        AudioManager.pause('surroundings');
        AudioManager.pauseBgm();
        AudioManager.resume('roadBg');
        AudioManager.resume('rail');
        let t = cc.tween;
        t(this.bgStation)
            .by(3.5, { y: -1160 }, { easing: 'quadIn' })
            .call(() => {

            })
            .start();
        t(this.train)
            .by(4, { y: 1480 }, { easing: 'quadIn' })
            .call(() => {
                this.hideNode(this.bgStation, true);
                t(this.train)
                    .delay(0.5)
                    .call(() => {
                        this.tarinComeIn_3();
                        this.train.setPosition(this._trainInitPos);
                    })
                    .start();
            })
            .start();
    }

    /**
     * 火车到达终点站南宁
     */
    private tarinComeIn_3() {
        this.bgStation = this.bg_arr.children[2];
        this.showNode(this.bgStation, true);
        let t = cc.tween;
        t(this.train)
            .delay(0.5)
            .call(() => {
                AudioManager.play('broadcast', 0.8);
                AudioManager.play('depart', 0.8);
                AudioManager.pause('surroundings');
                AudioManager.pauseBgm();
                AudioManager.resume('roadBg');
                AudioManager.resume('rail');
                this.trainAirBillow.node.active = true;
                let animState = this.trainAirBillow.play();
                animState.wrapMode = cc.WrapMode.Loop;
                animState.repeatCount = Infinity;
                this.arr_TrainWheelSmoke.forEach((temp) => {
                    temp.node.active = true;
                    let animState = temp.play();
                    animState.wrapMode = cc.WrapMode.Loop;
                    animState.repeatCount = Infinity;
                });
                this.showBird();
            })
            .by(5, { position: cc.v3(0, 1480) }, { easing: 'quadInOut' })
            .call(() => {
                AudioManager.stop('broadcast');
                AudioManager.stop('roadBg');
                AudioManager.stop('rail');
                AudioManager.resumeBgm();
                this.trainAirBillow.stop();
                this.trainAirBillow.node.active = false;
                this.arr_TrainWheelSmoke.forEach((temp) => {
                    temp.stop();
                    temp.node.active = false;
                });
                CpSDK.EnterSection(4, "南宁终点界面");
            })
            .start();
        t(this.bgStation)
            .delay(1)
            .by(3, { position: cc.v3(0, -360) })
            .start();
        t(this.train)
            .delay(3.5)
            .call(() => {
                AudioManager.pause('run');
                AudioManager.play('stop_2', 0.8);
                AudioManager.resume('surroundings');
            })
            .start();
        t(this.redSpot)
            .delay(0.5)
            .by(5, { position: cc.v3(150, 0) })
            .call(() => {
                this.img_NanNing.spriteFrame = this.img_Arrive;
            })
            .start();
        t(this.spotProgressBar)
            .delay(0.5)
            .to(5, { progress: 1 })
            .start();
    }

    /**
     * 显示小鸟动画
     */
    private showBird() {
        cc.tween(this.bird)
            .to(2, { position: cc.v3(0, 200) })
            .call(() => {
                this.bird.children[0].stopAllActions;
            })
            .delay(2)
            .by(2, { position: cc.v3(1000, 600) })
            .call(() => {
                this.hideNode(this.bird, true);
                if (!this._isSell) {
                    this.showNotSellResult();
                } else {
                    LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                }
            })
            .start();
        cc.tween(this.bird.children[0])
            .by(0.2, { position: cc.v3(0, 20) })
            .by(0.2, { position: cc.v3(0, -20) })
            .by(0.2, { position: cc.v3(0, -20) })
            .by(0.2, { position: cc.v3(0, 20) })
            .union()
            .repeatForever()
            .start();
    }




    /**
     * 显示不卖的结果
     */
    private showNotSellResult() {
        this.showNode(this.resultShade, false, 165);
        AudioManager.play('fail_1');
        let t = cc.tween;
        this.img_FailResult.active = true;
        t(this.img_FailResult)
            .parallel(
                t().to(0.5, { scale: 1 }, { easing: 'backOut' }),
                t().to(0.1, { opacity: 255 }, { easing: 'fade' })
            )
            .call(() => {
                this.setDiamondScore(0);
                this.setGoldScore(0);
            })
            .delay(0.5)
            .call(() => {
                this.hideNode(this.img_FailResult, true);
                LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            })
            .start();
    }



    /**
    * 手指呈现戳一戳效果
    */
    private showFingerPock() {
        cc.tween(this.finger)
            .by(0.3, { position: cc.v3(30, 30) })
            .by(0.3, { position: cc.v3(-30, -30) })
            .by(0.3, { position: cc.v3(30, 30) })
            .by(0.3, { position: cc.v3(-30, -30) })
            .delay(0.3)
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 实现金币飞的效果
     * @param generateNode 生成的地点
     */
    private scatterGold(generateNode: cc.Node) {
        let v = 50;
        let s = Util.getDistance(this.goldEndPos.getPosition(), generateNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < 10; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.changePos(star, generateNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.changePos(star, this.goldEndPos) })
                .call(() => {
                    star.destroy();
                    this.addGoldScore(10);
                    AudioManager.play('gold', 0.8);
                })
                .start();
        }
    }

    /**
     * 实现钻石飞的效果
     * @param generateNode 生成的地点
     */
    private scatterDiamond(generateNode: cc.Node) {
        let v = 50;
        let s = Util.getDistance(this.diamondEndPos.getPosition(), generateNode.getPosition());
        let t = 0;

        t = s / v;

        for (let i = 0; i < 10; i++) {
            let star = cc.instantiate(this.pre_FlyDiamond);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.changePos(star, generateNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.changePos(star, this.diamondEndPos) })
                .call(() => {
                    star.destroy();
                    this.addDiamondScore(10);
                    AudioManager.play('diamond', 0.8);
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
     * 呼吸效果
     * @param node  执行效果的节点
     */
    private showBreathe(node: cc.Node) {
        cc.tween(node)
            .to(0.5, { scale: 1.1 })
            .to(0.5, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }

    private getGoldScore(): number {
        return this._goldScore;
    }
    private addGoldScore(value: number) {
        this._goldScore += value;
        this.label_Gold.string = this._goldScore + 'K';
    }

    private reduceGoldScore(value: number) {
        let num = this._goldScore * 10 - value * 10;
        this._goldScore = num / 10;
        this.label_Gold.string = this._goldScore + 'K';
    }

    private setGoldScore(value: number) {
        this._goldScore = value;
        this.label_Gold.string = this._goldScore + 'K';
    }


    private getDiamondScore(): number {
        return this._diamondScore;
    }
    private addDiamondScore(value: number) {
        this._diamondScore += value;
        this.label_Diamond.string = this._diamondScore.toString();
    }

    private reduceDiamondScore(value: number) {
        this._diamondScore -= value;
        this.label_Diamond.string = this._diamondScore.toString();
    }

    private setDiamondScore(value: number) {
        this._diamondScore = value;
        this.label_Diamond.string = this._diamondScore.toString();
    }

}
