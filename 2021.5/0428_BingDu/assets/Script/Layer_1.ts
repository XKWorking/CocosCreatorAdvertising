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
import Hero_0 from "./Hero_0";
import MonsterBase from "./MonsterBase";
import AudioManager from "./Manager/AudioManager";
import Util from "./Utils/Util";
import CpSDK from "./CpTool/SDK/CpSDK";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    guid: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(Hero_0)
    heroNode_0: Hero_0 = null;

    @property(cc.Node)
    monsterParent: cc.Node = null;

    @property([cc.Prefab])
    monsterPref_0: cc.Prefab[] = [];

    @property(cc.Prefab)
    monsterPref_1: cc.Prefab = null;

    @property(cc.Node)
    effectNode: cc.Node = null;

    @property(cc.Prefab)
    atkPrefab_1: cc.Prefab = null;

    @property(cc.Prefab)
    atkPrefab_2: cc.Prefab = null;

    @property(cc.Node)
    goldIcon: cc.Node = null;

    @property(cc.SpriteFrame)
    goldFrame: cc.SpriteFrame = null;

    @property(cc.ProgressBar)
    gameProgress: cc.ProgressBar = null;

    @property(cc.Label)
    label_Gold: cc.Label = null;

    @property(cc.Label)
    label_Time: cc.Label = null;
    //=======================================================================
    private _monsterLevelHp: Array<{ min: number, max: number }> = [
        { min: 800, max: 1500 },
        { min: 1500, max: 2000 },
        { min: 4000, max: 6000 }
    ];


    private _countDownTime: number = 20;
    private _maxNum = 20;
    private _createDura = 0.1;
    private _createTimer = 0;
    private _isGameEnd = true;
    private _gold: number = 0;
    private _isGameStart: boolean = false;
    // private _progressAction: cc.Tween= null;


    onLoad() {
        super.onResize();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.label_Gold.string = this._gold.toString();
        this.ShowLeftRightMove(this.finger);
    }
    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        this.StartGame();
    }
    private ShowLeftRightMove(node: cc.Node) {
        cc.tween(node)
            .by(0.5, { position: cc.v3(-200, 0) })
            .by(0.5, { position: cc.v3(200, 0) })
            .by(0.5, { position: cc.v3(200, 0) })
            .by(0.5, { position: cc.v3(-200, 0) })
            .delay(0.5)
            .union()
            .repeatForever()
            .start();
    }

    private StartGame() {
        if (this._isGameStart) return;
        this.schedule(this.CountDown, 1);
        this._progressAction = cc.tween(this.gameProgress)
            .to(20, { progress: 0 })
            .start();
        this.guid.active = false;
        this.finger.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
            let obj = cc.instantiate(this.monsterPref_1);
            obj.setParent(this.monsterParent);
            let hp = this._monsterLevelHp[2].min + Math.random() * (this._monsterLevelHp[2].max - this._monsterLevelHp[2].min);
            obj.getComponent(MonsterBase).SetData(hp);
            obj.name = "boos";
        })));
        this._isGameEnd = false;
        this._isGameStart = true;
    }

    public CreateMonster_0(level: number) {
        if (this._isGameEnd) return;
        let obj = cc.instantiate(Util.randomArray(this.monsterPref_0));
        obj.setParent(this.monsterParent);
        let hp = this._monsterLevelHp[level].min + Math.random() * (this._monsterLevelHp[level].max - this._monsterLevelHp[level].min);
        obj.getComponent(MonsterBase).SetData(hp);
    }

    private _progressAction;
    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
    }

    update(dt) {
        if (this._isGameEnd) return;
        this._createTimer += dt;
        if (this._createTimer > this._createDura) {
            this._createTimer = 0;
            if (this.monsterParent.childrenCount < this._maxNum) {
                let level = Math.floor(Math.random() * 2);
                this.CreateMonster_0(level);
            }
        }
    }

    public ShowAtkEffect(target: cc.Node) {
        if (target.name === "boos") {
            var obj = cc.instantiate(this.atkPrefab_1);
        } else {
            var obj = cc.instantiate(this.atkPrefab_2);
        }
        this.effectNode.addChild(obj);
        obj.position = target.position;
        obj.angle = Math.random() * 360;
        cc.tween(obj)
            .delay(0.25)
            .call(() => {
                obj.removeFromParent();
            })
            .start();
    }

    public ShowBoxNode() {
        this._isGameEnd = true;
        for (let i = 0; i < this.monsterParent.childrenCount; ++i) {
            this.monsterParent.children[i].getComponent(MonsterBase).BeAtk(99999999999);
            --i;
        }
        AudioManager.play("gold");
        this.GameEnd();
    }
    /**
        * 倒计时
        */
    private CountDown() {
        this._countDownTime -= 1;
        this.label_Time.string = this._countDownTime + 's';
        if (this._countDownTime <= 0) {
            this.ShowBoxNode();
        }
    }
    public GameEnd() {
        this.unschedule(this.CountDown);
        this._progressAction.stop();

        cc.tween(this.node)
            .delay(1.6)
            .call(() => {
                this.heroNode_0.node.width = 0;
                this.heroNode_0.node.height = 0;
                this.heroNode_0.node.runAction(cc.moveBy(1, 0, LayerManger.Instance.GetStageH()));
                cc.tween(this.heroNode_0)
                    .delay(1)
                    .call(() => {
                        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
                    })
                    .start();
            })
            .start();
    }


    public GetGoldScore(): number {
        return this._gold;
    }
    public AddGold(num: number) {
        this._gold += num;

        this.label_Gold.string = this._gold.toString();
    }

    public ShowGoldNum(num: number, pos: cc.Vec3) {
        AudioManager.play("gold");
        this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(() => {
            this.node.runAction(cc.repeat(cc.sequence(cc.delayTime(0.02), cc.callFunc(() => {
                let obj = new cc.Node();
                obj.addComponent(cc.Sprite).spriteFrame = this.goldFrame;
                this.effectNode.addChild(obj)
                obj.position = pos;
                obj.opacity = 255;

                let angle = Math.PI * (Math.random() * (2) + 0);
                let dir = cc.v2(Math.sin(angle), Math.cos(angle));
                obj.runAction(cc.fadeIn(0.2));
                obj.runAction(cc.sequence(
                    cc.moveBy(Math.random() * 0.2 + 0.2, dir.mul(Math.random() * 50 + 50)),
                    cc.delayTime(Math.random() * 0.2 + 0.2),
                    cc.moveTo(Math.random() * 0.2 + 0.2, cc.v2(obj.parent.convertToNodeSpaceAR(this.goldIcon.parent.convertToWorldSpaceAR(this.goldIcon.position)))),
                    cc.spawn(cc.scaleTo(0.2, 2), cc.fadeOut(0.2)),
                    cc.callFunc(() => {
                        obj.removeFromParent();
                        this.AddGold(1);
                    })
                ));
            })), num));
        })));
    }



}
