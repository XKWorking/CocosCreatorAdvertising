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
export default class Gift extends cc.Component {

    @property
    index: number = 0;

    @property
    moveSpeed: number = 0;

    @property
    createGoldNum: number = 0;

    @property
    isFirst: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        if (this.isFirst) return;
        cc.tween(this.node)
            .delay(10)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    update(dt) {
        if (this.isFirst) return;
        this.node.x += this.moveSpeed * dt;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        LayerManger.Instance.GetLayer(Layer_1).ChangeExpression(this.index);
        LayerManger.Instance.GetLayer(Layer_1).CreateHitEffect(self.node.getPosition());
        LayerManger.Instance.GetLayer(Layer_1).ScatterGold(self.node, this.createGoldNum);
        GlobalData.instance.AddGolsScore(this.createGoldNum * 2);
        self.enabled = false;
        self.node.destroy();
    }
}
