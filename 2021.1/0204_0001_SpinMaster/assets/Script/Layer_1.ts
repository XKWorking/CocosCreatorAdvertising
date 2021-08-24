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
import Shadow_0 from "./Shadow_0";
import Hero_1 from "./Hero_1";
import Shadow_1 from "./Shadow_1";
import Monster_0 from "./Monster_0";
import MonsterBase from "./MonsterBase";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(Hero_0)
    heroNode_0: Hero_0 = null;
    @property(Shadow_0)
    shadow_0: Shadow_0 = null;

    @property(Hero_1)
    heroNode_1: Hero_1 = null;
    @property(Shadow_1)
    shadow_1: Shadow_1 = null;

    @property(cc.Node)
    monsterParent: cc.Node = null;
    @property([cc.Prefab])
    monsterPref_0: cc.Prefab[] = [];
    @property(cc.Prefab)
    monsterPref_1: cc.Prefab = null;
    @property(cc.Node)
    shadowParent: cc.Node = null;

    @property(cc.Node)
    effectNode: cc.Node = null;

    @property(cc.Prefab)
    atkPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    deathPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Node)
    boxNode: cc.Node = null;
    @property(cc.Node)
    boxGlow: cc.Node = null;
    @property(cc.Node)
    boxGlow_end: cc.Node = null;

    @property(cc.Node)
    warningNode: cc.Node = null;
    @property(cc.Node)
    tip_1: cc.Node = null;
    @property(cc.Node)
    tip_2: cc.Node = null;
    @property(cc.Node)
    word_1: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Node)
    goldIcon: cc.Node = null;

    @property(cc.SpriteFrame)
    goldFrame: cc.SpriteFrame = null;

    private _monsterLevelHp: Array<{ min: number, max: number }> = [
        { min: 800, max: 1500 },
        { min: 1500, max: 2000 },
        { min: 4000, max: 6000 }
    ];


    private _maxNum = 20;
    private _createDura = 0.1;
    private _createTimer = 0;

    private _isGameEnd = false;

    private _gold: number = 0;

    onLoad() {
        super.onResize();


        this.node.runAction(cc.sequence(cc.delayTime(8), cc.callFunc(() => {
            let obj = cc.instantiate(this.monsterPref_1);
            this.monsterParent.addChild(obj);
            let hp = this._monsterLevelHp[2].min + Math.random() * (this._monsterLevelHp[2].max - this._monsterLevelHp[2].min);
            obj.getComponent(MonsterBase).SetData(hp);
        })));

        this.ShowTip();

        this.goldLabel.string =  this._gold.toString();
        AudioManager.play("gold");
    }

    public CreateMonster_0(level: number) {
        if (this._isGameEnd) return;
        let obj = cc.instantiate(this.monsterPref_0[Math.floor(Math.random() * this.monsterPref_0.length)]);
        this.monsterParent.addChild(obj);
        let hp = this._monsterLevelHp[level].min + Math.random() * (this._monsterLevelHp[level].max - this._monsterLevelHp[level].min);
        obj.getComponent(MonsterBase).SetData(hp);
    }

    protected start() {

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
        let obj = cc.instantiate(this.atkPrefab);
        this.effectNode.addChild(obj);
        obj.position = target.position;
        obj.angle = Math.random() * 360;
        obj.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            obj.removeFromParent();
        })));
    }
    public ShowDeathEffect(target: cc.Node) {
        let obj = cc.instantiate(this.deathPrefab);
        this.effectNode.addChild(obj);
        obj.position = target.position;

        obj.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            obj.removeFromParent();
        })));
    }

    public ShowBoxNode(pos: cc.Vec3) {
        this.boxNode.active = true;
        this.boxNode.position = pos;
        this.boxNode.opacity = 0;
        this.boxNode.scale = 0;
        this.boxNode.runAction(cc.fadeIn(0.5));
        this.boxNode.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));

        this.boxGlow.runAction(cc.repeatForever(cc.rotateBy(5, 360)));
        this.boxGlow.once('click', () => {
            AudioManager.play("click");
            this.finger.active = false;
            this.GameEnd();
        });

        for (let i = 0; i < this.monsterParent.childrenCount; ++i) {
            this.monsterParent.children[i].getComponent(MonsterBase).BeAtk(99999999999);
            --i
        }

        this.heroNode_1.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(() => {
            this.heroNode_1.node.active = false;
        })));

        this._isGameEnd = true;
        this.heroNode_0.node.width = 0;
        this.heroNode_0.node.height = 0;
        this.heroNode_0.node.runAction(cc.moveBy(2, 0, LayerManger.Instance.GetStageH()));

    }

    private ShowTip() {
        this.warningNode.active = true;
        this.warningNode.scaleY = 0;
        this.warningNode.runAction(cc.sequence(cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()), cc.delayTime(2), cc.scaleTo(0.5, 1, 0).easing(cc.easeBackIn())))

        this.tip_1.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.5, 150), cc.fadeIn(0.5))));
        this.tip_2.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.5, 150), cc.fadeIn(0.5))));
        this.word_1.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.5, 1))));
    }

    public GameEnd() {
        this.boxNode.runAction(cc.moveTo(0.2, 0, -100));
        this.boxNode.runAction(cc.scaleTo(0.2, 2));

        this.boxGlow_end.active = true;
        this.boxGlow_end.opacity = 0;
        this.boxGlow_end.runAction(cc.fadeIn(0.2));
        this.boxGlow_end.runAction(cc.repeatForever(cc.rotateBy(5,360)))

        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }

    public AddGold(num: number) {
        this._gold += num;
        
        this.goldLabel.string =  this._gold.toString();
        AudioManager.play("gold");
    }

    public ShowGoldNum(num: number, pos: cc.Vec3) {
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
