// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Hero_0 from "./Hero_0";
import Hero_1 from "./Hero_1";
import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shadow_1 extends cc.Component {


    @property(cc.Node)
    daoParent_0: cc.Node = null;
    @property(cc.Node)
    daoParent_1: cc.Node = null;

    private _daoNum = 8;
    private _target: Hero_1 = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._target = LayerManger.Instance.GetLayer(Layer_1).heroNode_1;
        this._daoNum = this._target.GetDaoNum();

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

    public SetTarget(target:Hero_1){
        this._target = target;
        this._daoNum = target.GetDaoNum();
    }

    update(dt) {
        this.node.position = this._target.node.position.add(cc.v3(20, -20))
        if (this.daoParent_0) {
            this.daoParent_0.angle = this._target.daoParent_0.angle;
        }
        if (this.daoParent_1) {
            this.daoParent_1.angle = this._target.daoParent_1.angle;
        }

        this.node.opacity = this._target.node.opacity;

    }
}
