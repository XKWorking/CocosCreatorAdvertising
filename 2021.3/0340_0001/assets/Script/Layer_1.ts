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


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Animation)
    player: cc.Animation = null;

    @property(cc.Node)
    taskTarget: cc.Node = null;

    @property(cc.Node)
    shadeBg: cc.Node = null;

    @property(cc.Node)
    btn_UnlockAction: cc.Node = null;

    @property(cc.Node)
    fundInsufficient: cc.Node = null;

    @property(cc.Label)
    label_GameGold: cc.Label = null;

    @property(cc.Label)
    label_GameGrowth: cc.Label = null;

    @property(cc.Label)
    label_WeightNum: cc.Label = null;

    @property(cc.ProgressBar)
    gameProgressBar: cc.ProgressBar = null;

    @property(cc.Label)
    label_DumbbellGrowthGold: cc.Label = null;

    @property(cc.Label)
    label_DumbbellClickNum: cc.Label = null;

    @property(cc.Label)
    label_DumbbellUseGold: cc.Label = null;

    @property(cc.ProgressBar)
    dumbbellProgressBar: cc.ProgressBar = null;

    @property(cc.Label)
    label_SkipRopeGrowthGold: cc.Label = null;

    @property(cc.Label)
    label_SkipRopeClickNum: cc.Label = null;

    @property(cc.Label)
    label_SkipRopeUseGold: cc.Label = null;

    @property(cc.ProgressBar)
    skipRopeProgressBar: cc.ProgressBar = null;

    @property(cc.Label)
    label_SitUpGrowthGold: cc.Label = null;

    @property(cc.Label)
    label_SitUpClickNum: cc.Label = null;

    @property(cc.Label)
    label_SitUpUseGold: cc.Label = null;

    @property(cc.ProgressBar)
    sitUpProgressBar: cc.ProgressBar = null;

    @property(cc.Node)
    gift: cc.Node = null;

    @property(cc.Node)
    idea: cc.Node = null;

    @property(cc.Sprite)
    ideaContent: cc.Sprite = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    downLoadNode: cc.Node = null;

    @property(cc.Node)
    continueNode: cc.Node = null;

    @property(cc.Button)
    btn_Dumbbell: cc.Button = null;

    @property(cc.Button)
    btn_SkipRope: cc.Button = null;

    @property(cc.Button)
    btn_SitUp: cc.Button = null;

    @property([cc.SpriteFrame])
    arr_Idea: cc.SpriteFrame[] = [];
    // ================================================ //
    private _isAddGold: boolean = false;
    private _isGameOver: boolean = false;
    private _gameGold: number = 210000;
    private _gameGrowth: number = 0;
    private _weightNum: number = 90;
    private _gameProgressNum: number = 0;
    private _dumbbellGrowthGold: number = 60;
    private _dumbbellClickNum: number = 0;
    private _dumbbellUseGold: number = 195;
    private _dumbbellProgressNum: number = 0;
    private _skipRopeGrowthGold: number = 20;
    private _skipRopeClickNum: number = 0;
    private _skipRopeUseGold: number = 203;
    private _skipRopeProgressNum: number = 0;
    private _sitUpGrowthGold: number = 30;
    private _sitUpClickNum: number = 0;
    private _sitUpUseGold: number = 298;
    private _sitUpProgressNum: number = 0;
    private _isFirstClickSkipRope: boolean = true;
    private _startTime: number = 0;
    private _randNum: number = 0;


    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
    }

    update(dt: number) {
        if (this._isAddGold) {
            this._startTime += dt;
            if (this._startTime >= 1) {
                this.addGameGold();
                this._startTime = 0;
            }
        }
    }

    initGame() {
        this.showStartLight();
        this.showNode(this.shadeBg, true, 165);
        this.showNode(this.taskTarget, true);
        this.showFinger();
        this.btn_SkipRope.enabled = false;
        this.btn_SitUp.enabled = false;
        this.btn_UnlockAction.getComponent(cc.Button).enabled = false;
        this.hideNode(this.fundInsufficient, false);
    }
    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }

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

    public acceptTask() {
        AudioManager.play('click');
        this.hideNode(this.taskTarget, true);
        this.hideNode(this.shadeBg, true);
        this.shake(this.gift);
        this._isAddGold = true;
        let animState = this.player.play();
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
        this.showNode(this.idea, true);
        this._randNum = 0;
        this.ideaContent.spriteFrame = this.arr_Idea[this._randNum];
        this.showNode(this.idea, true);
        this.finger.stopAllActions();
        this.finger.parent = this.btn_Dumbbell.node;
        this.finger.setPosition(cc.v2(0, -100));
        this.finger.angle = -45;
        // this.showFinger();
        cc.tween(this.finger)
            .by(0.2, { position: cc.v2(0, -15) })
            .by(0.2, { position: cc.v2(0, 15) })
            .by(0.2, { position: cc.v2(0, -15) })
            .by(0.2, { position: cc.v2(0, 15) })
            .delay(0.2)
            .union()
            .repeatForever()
            .start();
    }

    private showFinger() {
        cc.tween(this.finger)
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .by(0.3, { position: cc.v2(30, -30) })
            .by(0.3, { position: cc.v2(-30, 30) })
            .delay(0.3)
            .union()
            .repeatForever()
            .start();
    }
    private changeIdea() {
        if (this._isGameOver) return;
        this._randNum = Util.randomInteger(0, 2);
        console.log('randNum:', this._randNum);
        this.ideaContent.spriteFrame = this.arr_Idea[this._randNum];
        this.showNode(this.idea, true);
    }
    private showStartLight() {
        let ligth = this.taskTarget.getChildByName('light');
        cc.tween(ligth)
            .by(2, { angle: 360 })
            .repeatForever()
            .start();
    }
    private showBreathe() {
        cc.tween(this.btn_UnlockAction)
            .to(0.5, { scale: 1.2 })
            .to(0.5, { scale: 1.3 })
            .union()
            .repeatForever()
            .start();
    }

    public unlockAction() {
        AudioManager.play('click');
        this.showNode(this.fundInsufficient, true);
        this.showNode(this.shadeBg, true, 165);
        this.player.pause();
        this.btn_UnlockAction.stopAllActions();
        this._isAddGold = false;

    }

    public continueGame() {
        AudioManager.play('click');
        this.hideNode(this.fundInsufficient, true);
        this.hideNode(this.shadeBg, true);
        this.player.resume();
        this.showBreathe();
        this._isAddGold = true;
        if (this.downLoadNode.parent === this.continueNode) return;
        cc.tween(this.continueNode)
            .delay(0.6)
            .call(() => {
                this.downLoadNode.parent = this.continueNode;
                this.downLoadNode.setPosition(cc.v2(0, 0));
            })
            .start();
    }

    public downLoadGame() {
        AudioManager.play('click');
        CpSDK.ClickFinishDownloadBar(1, "游戏界面下载按钮");
    }

    private judgeGameOver() {
        if (this._weightNum <= 70) {
            this.btn_UnlockAction.stopAllActions();
            this.player.stop();
            this._isGameOver = true;
            this._isAddGold = false;
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
        }
    }
    public clickDumbbell() {//点击一次，消耗金币+3，生长值+1，总生长值+1，体重-1,总进度+=体重*5
        AudioManager.play('click');
        let animState = this.player.play('dumbbell');
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
        this.reduceGameGold(this._dumbbellUseGold);
        this.addDumbbellClickNum();
        this.addDumbbellProgress();
        this.addDumbbellUseGold(3);
        this.addDumbbellGrowthGold(1);
        this.addGameGrowth();
        this.reduceWeightNum(1);
        this.addGameProgress(5);
        this.judgeGameOver();
        if (this._randNum === 0) {
            cc.tween(this.idea)
                .to(0.5, { opacity: 0 }, { easing: 'fade' })
                .delay(0.5)
                .call(() => {
                    this.changeIdea();
                })
                .start();
        }
        if (this.finger.activeInHierarchy) {
            this.finger.stopAllActions();
            this.hideNode(this.finger, false);
            this.btn_SkipRope.enabled = true;
            this.btn_SitUp.enabled = true;
            this.btn_UnlockAction.getComponent(cc.Button).enabled = true;
            this.showBreathe();
        }
    }
    public clickSkipRope() {//点击一次，消耗金币+8和+7轮流，生长值+1，总生长值+1，体重-2,总进度+=体重*5
        AudioManager.play('click');
        let animState = this.player.play('skipRope');
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
        this.reduceGameGold(this._skipRopeUseGold);
        this.addSkipRopeClickNum();
        this.addSkipRopeProgress();
        this.addSkipRopeGrowthGold(1);
        this.addGameGrowth();
        this.reduceWeightNum(2);
        this.addGameProgress(10);
        if (this._isFirstClickSkipRope) {
            this.addSkipRopeUseGold(8);
        } else {
            this.addSkipRopeUseGold(7);
        }
        this._isFirstClickSkipRope = !this._isFirstClickSkipRope;
        this.judgeGameOver();
        if (this._randNum === 1) {
            cc.tween(this.idea)
                .to(0.5, { opacity: 0 }, { easing: 'fade' })
                .delay(0.5)
                .call(() => {
                    this.changeIdea();
                })
                .start();
        }
    }
    public clickSitUp() {//点击一次，消耗金币+15，生长值+3，总生长值+3，体重-3,总进度+=体重*5
        AudioManager.play('click');
        let animState = this.player.play('sitUp');
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
        this.reduceGameGold(this._sitUpUseGold);
        this.addSitUpClickNum();
        this.addSitUpProgress();
        this.addSitUpUseGold(15);
        this.addSitUpGrowthGold(3);
        this.addGameGrowth();
        this.reduceWeightNum(3);
        this.addGameProgress(15);
        this.judgeGameOver();
        if (this._randNum === 2) {
            cc.tween(this.idea)
                .to(0.5, { opacity: 0 }, { easing: 'fade' })
                .delay(0.5)
                .call(() => {
                    this.changeIdea();
                })
                .start();
        }
    }

    private addGameGold() {// _gameGold
        this._gameGold += this._gameGrowth;
        let intNum = Math.floor(this._gameGold / 1000);
        console.log('_gameGold:', this._gameGold);
        console.log('gameGold:', intNum);
        this.label_GameGold.string = intNum + 'K';
    }
    private reduceGameGold(num: number) {// _gameGold
        this._gameGold -= num;
        let intNum = Math.floor(this._gameGold / 1000);
        console.log('_gameGold:', this._gameGold);
        console.log('gameGold:', intNum);
        this.label_GameGold.string = intNum + 'K';
    }
    private addGameGrowth() {// _gameGrowth
        this._gameGrowth = this._dumbbellGrowthGold + this._skipRopeGrowthGold + this._sitUpGrowthGold;
        this.label_GameGrowth.string = this._gameGrowth + '/s';
    }
    private reduceWeightNum(num: number) {// _weightNum 
        this._weightNum -= num;
        this.label_WeightNum.string = this._weightNum + 'KG';
    }
    private addGameProgress(num: number) {//_gameProgressNum
        this._gameProgressNum += num;
        this.gameProgressBar.progress = this._gameProgressNum / 100;
    }
    private addDumbbellGrowthGold(num: number) {//_dumbbellGrowthGold
        this._dumbbellGrowthGold += num;
        this.label_DumbbellGrowthGold.string = this._dumbbellGrowthGold + '/sec';
    }
    private addDumbbellClickNum() {//_dumbbellClickNum
        this._dumbbellClickNum++;
        this.label_DumbbellClickNum.string = this._dumbbellClickNum + '/100';
    }
    private addDumbbellUseGold(num: number) {//_dumbbellUseGold
        this._dumbbellUseGold += num;
        this.label_DumbbellUseGold.string = this._dumbbellUseGold.toString();
    }
    private addDumbbellProgress() {//_dumbbellProgressNum
        this._dumbbellProgressNum++;
        this.dumbbellProgressBar.progress = this._dumbbellProgressNum / 100;
    }
    private addSkipRopeGrowthGold(num: number) {//_skipRopeGrowthGold
        this._skipRopeGrowthGold += num;
        this.label_SkipRopeGrowthGold.string = this._skipRopeGrowthGold + '/sec';
    }
    private addSkipRopeClickNum() {//_skipRopeClickNum
        this._skipRopeClickNum++;
        this.label_SkipRopeClickNum.string = this._skipRopeClickNum + '/100';
    }
    private addSkipRopeUseGold(num: number) {//_skipRopeUseGold
        this._skipRopeUseGold += num;
        this.label_SkipRopeUseGold.string = this._skipRopeUseGold.toString();

    }
    private addSkipRopeProgress() {//_skipRopeProgressNum
        this._skipRopeProgressNum++;
        this.skipRopeProgressBar.progress = this._skipRopeProgressNum / 100;
    }
    private addSitUpGrowthGold(num: number) {//_sitUpGrowthGold
        this._sitUpGrowthGold += num;
        this.label_SitUpGrowthGold.string = this._sitUpGrowthGold + '/sec';
    }
    private addSitUpClickNum() {//_sitUpClickNum
        this._sitUpClickNum++;
        this.label_SitUpClickNum.string = this._sitUpClickNum + '/100';
    }
    private addSitUpUseGold(num: number) {//_sitUpUseGold
        this._sitUpUseGold += num;
        this.label_SitUpUseGold.string = this._sitUpUseGold.toString();
    }
    private addSitUpProgress() {//_sitUpProgressNum
        this._sitUpProgressNum++;
        this.sitUpProgressBar.progress = this._sitUpProgressNum / 100;
    }
}
