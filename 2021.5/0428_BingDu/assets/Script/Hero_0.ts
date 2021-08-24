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
export default class Hero_0 extends cc.Component {

    @property(cc.Node)
    daoParent_1: cc.Node = null;

    private _daoNum = 8;
    private _rotateSpeed = 300;

    private _demage = 200;
    private _atkRange = 200;
    private _atkTimer = 0;
    private _atkDDura = 0.1;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.daoParent_1) {
            for (let i = 0; i < this._daoNum; ++i) {
                let obj = cc.instantiate(this.daoParent_1.children[0]);
                this.daoParent_1.addChild(obj);
                obj.angle = 360 / this._daoNum * i;
            }
        }

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => {
            this.node.position = this.node.position.add(cc.v3(e.getDelta()));
        });

    }

    start() {

    }

    update(dt) {
        if (this.daoParent_1) {
            this.daoParent_1.angle -= this._rotateSpeed * dt;
        }

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

    public GetSpeed(): number {
        return this._rotateSpeed;
    }
    public GetDaoNum(): number {
        return this._daoNum;
    }
}
