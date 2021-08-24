// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BarrierMove extends cc.Component {


    private _moveSpeed: number = 500;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
    }

    update(dt) {
        this.node.y -= this._moveSpeed * dt;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (LayerManger.Instance.GetLayer(Layer_1).getIsGameOver()) {
            LayerManger.Instance.GetLayer(Layer_1).gameOver();
            return;
        }
        if (other.node.group === 'player') {
            if (self.tag == 1) {
                this.setMoveSpeed(0);
                LayerManger.Instance.GetLayer(Layer_1).gameOver();
            } else if (self.tag == 2) {
                LayerManger.Instance.GetLayer(Layer_1).goBack();
            }
        } else if (other.node.group === 'death') {
            LayerManger.Instance.GetLayer(Layer_1).delectBarrier();
            this.node.destroy();
        }
    }

    public setMoveSpeed(value: number) {
        this._moveSpeed = value;
    }
}
