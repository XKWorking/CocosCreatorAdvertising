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
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";
import GlobalData from "./GlobalData";
import Layer_3 from "./Layer_3";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    node_Up: cc.Node = null;
    @property(cc.Node)
    node_Down: cc.Node = null;
    @property(cc.Node)
    game_Home: cc.Node = null;
    @property(cc.Node)
    game_Bg: cc.Node = null;
    @property(cc.Node)
    game_Level_1: cc.Node = null;
    @property(cc.Node)
    game_Level_2: cc.Node = null;
    @property(cc.Node)
    game_Level_3: cc.Node = null;
    @property(cc.Node)
    game_Level_4: cc.Node = null;
    @property([cc.Node])
    arr_CountDown: cc.Node[] = [];

    @property(cc.Label)
    label_Time: cc.Label = null;

    @property(cc.Label)
    label_Level: cc.Label = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Prefab)
    pre_Balloon_1: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Balloon_2: cc.Prefab = null;

    @property(cc.Prefab)
    pre_Balloon_3: cc.Prefab = null;

    @property([cc.Node])
    arr_Level_Node_1: cc.Node[] = [];

    @property([cc.Node])
    arr_Level_Node_2: cc.Node[] = [];

    @property([cc.Node])
    arr_Level_Node_3: cc.Node[] = [];

    @property([cc.Node])
    arr_Level_Node_4: cc.Node[] = [];

    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _goldScore: number = 0;
    private _levelNum: number = 0;
    private _timeNum: number = 3;
    private _enemyNum_1: number = 0;
    private _enemyNum_2: number = 0;
    private _enemyNum_3: number = 0;
    private _arr_BalloonObj: cc.Node[] = [];

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");

        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(1, "游戏界面下载按钮");
        }, this);
    }

    update(dt: number) {

    }

    initGame() {
        this._isGameStart = true;
        this.showNode(this.game_Home);
        this.showCountDown();
        this.hideNode(this.node_Up);
        this.hideNode(this.node_Down);
        this.hideNode(this.game_Bg);
        this.hideNode(this.game_Level_1);
        this.hideNode(this.game_Level_2);
        this.hideNode(this.game_Level_3);
        this.hideNode(this.game_Level_4);
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }

    showCountDown() {
        let t = cc.tween;
        t(this.arr_CountDown[0])
            .parallel(
                t().to(0.5, { scale: 1 }),
                t().to(0.5, { opacity: 255 }, { easing: 'fade' })
            )
            .parallel(
                t().to(0.5, { scale: 0 }),
                t().to(0.5, { opacity: 0 }, { easing: 'fade' })
            )
            .call(() => {
                t(this.arr_CountDown[1])
                    .parallel(
                        t().to(0.5, { scale: 1 }),
                        t().to(0.5, { opacity: 255 }, { easing: 'fade' })
                    )
                    .parallel(
                        t().to(0.5, { scale: 0 }),
                        t().to(0.5, { opacity: 0 }, { easing: 'fade' })
                    )
                    .call(() => {
                        t(this.arr_CountDown[2])
                            .parallel(
                                t().to(0.5, { scale: 1 }),
                                t().to(0.5, { opacity: 255 }, { easing: 'fade' })
                            )
                            .parallel(
                                t().to(0.5, { scale: 0 }),
                                t().to(0.5, { opacity: 0 }, { easing: 'fade' })
                            )
                            .call(() => {
                                this.hideNode(this.game_Home);
                                this.setLevelNum(1);
                                this.setTimeNum(3);
                                this.setEnemyNum();
                                this.showNode(this.game_Bg);
                                this.showNode(this.game_Level_1);
                                this.showNode(this.node_Up);
                                this.showNode(this.node_Down);
                                this.arr_Level_Node_1.forEach((temp) => {
                                    this.createBalloon_1(temp);
                                });
                                this.showFinger();
                                GlobalData.instance.setLastScore(this.getGoldScore());
                                console.log(this.getGoldScore());
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    showFinger() {
        cc.tween(this.finger)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .delay(0.3)
            .call(() => {
                this.showFinger();
            })
            .start();
    }
    hideFinger() {
        cc.tween(this.finger)
            .to(0.5, { opacity: 0 }, { easing: 'fade' })
            .start();
    }
    getGoldScore(): number {
        return this._goldScore;
    }
    addGoldScore(num: number) {
        this._goldScore += num;
        this.label_Gold.string = this._goldScore.toString();
    }
    setGoldScore(num: number) {
        this._goldScore = num;
        this.label_Gold.string = this._goldScore.toString();
    }
    getLevelNum(): number {
        return this._levelNum;
    }

    setLevelNum(num: number) {
        this._levelNum = num;
        this.label_Level.string = this._levelNum.toString() + '/4';
    }
    getTimeNum(): number {
        return this._timeNum;
    }
    setTimeNum(num: number) {
        this._timeNum = num;
        this.label_Time.string = this._timeNum.toString();
    }
    reduceTimeNum() {
        this._timeNum--;
        this.label_Time.string = this._timeNum.toString();
    }

    getIsExistEnemy() {
        if (this._enemyNum_1 > 0 || this._enemyNum_2 > 0 || this._enemyNum_3 > 0) {
            if (this._timeNum <= 0) {
                if (GlobalData.instance.getGoldeNum() <= 0) {
                    if (GlobalData.instance.getIsOpenLayer_2()) {
                        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                    } else {
                        LayerManger.Instance.GetLayer(Layer_3).OpenForTween();
                    }
                }
            }
        } else {
            switch (this._levelNum) {
                case 1:
                    this.setLevelNum(2);
                    this.setTimeNum(3);
                    this.setEnemyNum();
                    this.hideNode(this.game_Level_1);
                    this.showNode(this.game_Level_2);
                    this.arr_Level_Node_2.forEach((temp) => {
                        this.createBalloon_1(temp);
                    });
                    GlobalData.instance.setLastScore(this.getGoldScore());
                    console.log(this.getGoldScore());
                    break;
                case 2:
                    this.setLevelNum(3);
                    this.setTimeNum(3);
                    this.setEnemyNum();
                    this.hideNode(this.game_Level_2);
                    this.showNode(this.game_Level_3);
                    this.arr_Level_Node_3.forEach((temp) => {
                        if (temp.name === 'balloon_2_1') {
                            this.createBalloon_2(temp);
                        } else if (temp.name === 'balloon_3_1') {
                            this.createBalloon_3(temp);
                        } else {
                            this.createBalloon_1(temp);
                        }
                    });
                    GlobalData.instance.setLastScore(this.getGoldScore());
                    console.log(this.getGoldScore());
                    break;
                case 3:
                    this.setLevelNum(4);
                    this.setTimeNum(3);
                    this.setEnemyNum();
                    this.hideNode(this.game_Level_3);
                    this.showNode(this.game_Level_4);
                    this.arr_Level_Node_4.forEach((temp) => {
                        if (temp.name === 'balloon_2_1' || temp.name === 'balloon_2_2') {
                            this.createBalloon_2(temp);
                        } else {
                            this.createBalloon_1(temp);
                        }
                    });
                    GlobalData.instance.setLastScore(this.getGoldScore());
                    console.log(this.getGoldScore());
                    break;
                case 4:
                    if (GlobalData.instance.getIsOpenLayer_2()) {
                        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                    } else {
                        LayerManger.Instance.GetLayer(Layer_3).OpenForTween();
                    }
                    break;
            }
        }
    }
    setEnemyNum() {
        switch (this._levelNum) {
            case 1:
                this._enemyNum_1 = 2;
                this._enemyNum_2 = 0;
                this._enemyNum_3 = 0;
                break;
            case 2:
                this._enemyNum_1 = 8;
                this._enemyNum_2 = 0;
                this._enemyNum_3 = 0;
                break;
            case 3:
                this._enemyNum_1 = 6;
                this._enemyNum_2 = 1;
                this._enemyNum_3 = 1;
                break;
            case 4:
                this._enemyNum_1 = 3;
                this._enemyNum_2 = 2;
                this._enemyNum_3 = 0;
                break;
        }
    }
    reduceEnemyNum(num: number) {
        switch (num) {
            case 1:
                this._enemyNum_1--;
                break;
            case 2:
                this._enemyNum_2--;
                break;
            case 3:
                this._enemyNum_3--;
                break;
        }
    }

    againGame() {
        let index = this.getLevelNum();
        this.setLevelNum(index);
        this.setTimeNum(3);
        this.setEnemyNum();
        let lastScore: number = GlobalData.instance.getLastScore();
        console.log(lastScore);
        this.setGoldScore(lastScore);
        this._arr_BalloonObj.forEach((temp) => {
            if (temp.activeInHierarchy) {
                temp.active = false;
            }
        });
        switch (index) {
            case 1:
                this.arr_Level_Node_1.forEach((temp) => {
                    this.createBalloon_1(temp);
                });
                break;
            case 2:
                this.arr_Level_Node_2.forEach((temp) => {
                    this.createBalloon_1(temp);
                });
                break;
            case 3:
                this.arr_Level_Node_3.forEach((temp) => {
                    if (temp.name === 'balloon_2_1') {
                        this.createBalloon_2(temp);
                    } else if (temp.name === 'balloon_3_1') {
                        this.createBalloon_3(temp);
                    } else {
                        this.createBalloon_1(temp);
                    }
                });
                break;
            case 4:
                this.arr_Level_Node_4.forEach((temp) => {
                    if (temp.name === 'balloon_2_1' || temp.name === 'balloon_2_2') {
                        this.createBalloon_2(temp);
                    } else {
                        this.createBalloon_1(temp);
                    }
                });
                break;
        }
    }

    createBalloon_1(nodeParent: cc.Node) {
        let obj = cc.instantiate(this.pre_Balloon_1);
        obj.setParent(nodeParent);
        obj.setPosition(cc.v2(0, 0));
        obj.name = nodeParent.name;
        this._arr_BalloonObj.push(obj);
    }
    createBalloon_2(nodeParent: cc.Node) {
        let obj = cc.instantiate(this.pre_Balloon_2);
        obj.setParent(nodeParent);
        obj.setPosition(cc.v2(0, 0));
        obj.name = nodeParent.name;
        this._arr_BalloonObj.push(obj);
    }
    createBalloon_3(nodeParent: cc.Node) {
        let obj = cc.instantiate(this.pre_Balloon_3);
        obj.setParent(nodeParent);
        obj.setPosition(cc.v2(0, 0));
        obj.name = nodeParent.name;
        this._arr_BalloonObj.push(obj);
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
