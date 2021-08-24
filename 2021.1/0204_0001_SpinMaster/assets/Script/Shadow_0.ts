// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Hero_0 from "./Hero_0";
import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shadow_0 extends cc.Component {


    @property(cc.Node)
    daoParent_0: cc.Node = null;
    @property(cc.Node)
    daoParent_1: cc.Node = null;

    @property(cc.Node)
    Target: cc.Node = null;

    @property(Hero_0)
    followTarget: Hero_0 = null;

    private _daoNum = 8;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if(this.Target){
            this.followTarget = this.Target.getComponent(Hero_0);
        }
        if(LayerManger.Instance.GetLayer(Layer_1).node.active){
            this.followTarget = LayerManger.Instance.GetLayer(Layer_1).heroNode_0;
        }
       
        this._daoNum = this.followTarget.GetDaoNum();

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

    public SetTarget(target: Hero_0) {
        this.followTarget = target;
        this._daoNum = target.GetDaoNum();
    }

    update(dt) {
        this.node.position = this.followTarget.node.position.add(cc.v3(20, -20))
        if (this.daoParent_0) {
            this.daoParent_0.angle = this.followTarget.daoParent_0.angle;
        }
        if (this.daoParent_1) {
            this.daoParent_1.angle = this.followTarget.daoParent_1.angle;
        }

    }
}
