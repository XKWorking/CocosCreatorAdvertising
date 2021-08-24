// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "./GlobalData";
import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Balloon_3 extends cc.Component {

    @property(cc.Prefab)
    gold: cc.Prefab = null;
    @property(cc.Prefab)
    explode: cc.Prefab = null;
    @property(cc.PolygonCollider)
    selfCollider: cc.PolygonCollider = null;
    private _hp: number = 3;
    private _pos_1: cc.Vec2 = cc.v2(0, 1500);
    private _pos_2: cc.Vec2 = cc.v2(1500, 0);
    private _pos_3: cc.Vec2 = cc.v2(0, -1500);
    private _pos_4: cc.Vec2 = cc.v2(-1500, 0);
    private _nameId: number = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        LayerManger.Instance.GetLayer(Layer_1).reduceTimeNum();
        this.reduceHp();
        LayerManger.Instance.GetLayer(Layer_1).getIsExistEnemy();
    }

    gameOver() {
        LayerManger.Instance.GetLayer(Layer_1).addGoldScore(99);
        LayerManger.Instance.GetLayer(Layer_1).reduceEnemyNum(3);
        this.selfCollider.enabled = false;
        this.createGold(this._pos_1);
        this.createGold(this._pos_2);
        this.createGold(this._pos_3);
        this.createGold(this._pos_4);
        this.createExplode();
        cc.tween(this.node)
            .to(0.3, { opacity: 0 }, { easing: 'fade' })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'Gold') {
            if (other.node.name === self.node.name) return
            this.reduceHp();
            GlobalData.instance.reduceGoldNum();
            other.node.destroy();
        }
    }

    reduceHp() {
        if (this._hp <= 0) return;
        this._hp--;
        if (this._hp <= 0) {
            this.gameOver();
        }
    }
    createGold(pos: cc.Vec2) {
        this._nameId++;
        let obj = cc.instantiate(this.gold);
        GlobalData.instance.addGoldNum();
        obj.name = this.node.name + this._nameId.toString();
        obj.setParent(this.node.getParent());
        obj.setPosition(this.node.getPosition());
        cc.tween(obj)
            .by(2, { position: pos })
            .call(() => {
                GlobalData.instance.reduceGoldNum();
                if (GlobalData.instance.getGoldeNum() <= 0) {
                    LayerManger.Instance.GetLayer(Layer_1).getIsExistEnemy();
                }
                obj.destroy();
            })
            .start();
    }

    createExplode() {
        let obj = cc.instantiate(this.explode);
        obj.setParent(this.node.getParent());
        obj.setPosition(this.node.getPosition());
        let anim = obj.getComponent(sp.Skeleton);
        anim.clearTracks();
        anim.setAnimation(0, 'texiao', false);
        anim.setCompleteListener(() => {
            obj.destroy();
        });
    }

}