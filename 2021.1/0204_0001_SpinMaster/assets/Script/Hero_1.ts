// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";
import MonsterBase from "./MonsterBase";
import Util from "./Utils/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hero_1 extends cc.Component {

    @property(cc.Node)
    daoParent_0: cc.Node = null;
    @property(cc.Node)
    daoParent_1: cc.Node = null;

    private _daoNum = 12;
    private _rotateSpeed = 300;

    private _dir = cc.v3(1, 1);
    private _speed = 100;

    private _demage = 200;
    private _atkRange = 170;
    private _atkTimer = 0;
    private _atkDura = 0.1;

    private _bulletDura = 3;
    private _bulletTimer = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        if (this.daoParent_0) {
            for (let i = 0; i < this._daoNum; ++i) {
                let obj = cc.instantiate(this.daoParent_0.children[0]);
                this.daoParent_0.addChild(obj);
                obj.angle = 360 / this._daoNum * i;
            }
        }
        if (this.daoParent_1) {
            for (let i = 0; i < this._daoNum; ++i) {
                let obj = cc.instantiate(this.daoParent_1.children[0]);
                this.daoParent_1.addChild(obj);
                obj.angle = 360 / this._daoNum * i;
            }
        }

    }

    start() {

    }

    update(dt) {
        if (this.daoParent_0) {
            this.daoParent_0.angle += this._rotateSpeed * dt;
        }
        if (this.daoParent_1) {
            this.daoParent_1.angle -= this._rotateSpeed * dt;
        }

        let pos = this.node.position.add(this._dir.mul(this._speed * dt));



        let rect = cc.rect(-LayerManger.Instance.GetStageW() * 0.5, -LayerManger.Instance.GetStageH() * 0.5, LayerManger.Instance.GetStageW(), LayerManger.Instance.GetStageH());
        if (rect.contains(cc.v2(this.node.position))) {
            if (!rect.contains(cc.v2(pos))) {
                if (pos.x < rect.x || pos.x > rect.x + rect.width) {
                    this._dir.x = -this._dir.x;
                }
                if (pos.y < rect.y || pos.y > rect.y + rect.height) {
                    this._dir.y = -this._dir.y;
                }
                pos = this.node.position.add(this._dir.mul(this._speed * dt * 2));
            }
            this.node.position = pos;
        } else {
            if (rect.contains(cc.v2(pos))) {
                this.node.runAction(cc.fadeIn(0.5));
            }
        }
        this.node.position = pos;
        this.node.angle = Util.getRadianTwoPoint(cc.Vec2.ZERO, cc.v2(this._dir)) * 180 / Math.PI + 90;


        this._atkTimer += dt;
        if (this._atkTimer > this._atkDura) {
            this._atkTimer = 0;
            LayerManger.Instance.GetLayer(Layer_1).monsterParent.children.forEach(element => {
                let dis = element.position.sub(this.node.position).mag();
                if (dis < this._atkRange) {
                    element.getComponent(MonsterBase).BeAtk(this._demage);
                }
            });
        }

        this._bulletTimer += dt;
        
        if (this._bulletTimer > this._bulletDura) {
            this._bulletTimer = 0;
            for (let i = 0; i < 4; ++i) {
                let obj = cc.instantiate(LayerManger.Instance.GetLayer(Layer_1).bulletPrefab);
                obj.angle = this.node.angle + 180 + i * 90;
                LayerManger.Instance.GetLayer(Layer_1).effectNode.addChild(obj);
                obj.position = this.node.position;
            }

        }

    }

    public GetSpeed(): number {
        return this._rotateSpeed;
    }
    public GetDaoNum(): number {
        return this._daoNum;
    }
}
