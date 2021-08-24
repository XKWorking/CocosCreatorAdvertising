// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";
import MonsterBase from "./MonsterBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    shadowFrame: cc.SpriteFrame = null;

    private _shadow: cc.Node = null;

    private _speed: number = 400;

    
    private _demage = 150;
    private _atkRange = 80;
    private _atkTimer = 0;
    private _atkDDura = 0.3;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let shadow = new cc.Node();
        shadow.addComponent(cc.Sprite).spriteFrame = this.shadowFrame;
        LayerManger.Instance.GetLayer(Layer_1).effectNode.addChild(shadow)
        this._shadow = shadow;
        shadow.y = 5000;

        this.node.runAction(cc.sequence(cc.delayTime(5),cc.callFunc(()=>{
            this.Remove();
        })))
    }

    start() {

    }

    update(dt) {
        this._shadow.position = this.node.position.add(cc.v3(20, -20));
        this._shadow.angle = this.node.angle;

        let dir = cc.v3(-Math.cos(this.node.angle / 180 * Math.PI - Math.PI*0.5), -Math.sin(this.node.angle / 180 * Math.PI - Math.PI * 0.5));
        this.node.position = this.node.position.add(dir.mul(this._speed * dt));

        this._atkTimer += dt;
        if (this._atkTimer > this._atkDDura) {
            this._atkTimer = 0;
            LayerManger.Instance.GetLayer(Layer_1).monsterParent.children.forEach(element => {
                let dis = element.position.sub(this.node.position).mag();
                if (dis < this._atkRange) {
                    element.getComponent(MonsterBase).BeAtk(this._demage);
                }
            });
        }
    }

    private Remove() {
        this._shadow.removeFromParent();
        this.node.removeFromParent();
    }
}
