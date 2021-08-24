// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";
import PoolManager from "./Manager/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GiftBox extends cc.Component {

    // private _moveSpeed: number = 300;

    private _endNode: cc.Node = null;
    private _time: number = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this._time = Math.round(this._endNode.x / 15) / 10;
    }

    start() {
        this._endNode = LayerManger.Instance.GetLayer(Layer_1).GetGiftBoxEndParent();
        this._time = LayerManger.Instance.GetLayer(Layer_1).GetBoxMoveTime();
    }

    update(dt) {
        // this.node.x += this._moveSpeed * dt;
        // if (this.node.x >= 2000) {
        //     PoolManager.instance.putNode(this.node);
        // }
    }


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === "gold") {
            this.Shake(self.node);
            this.MoveEndPos();
        }
    }


    public MoveEndPos() {
        cc.tween(this.node)
            .to(this._time, { position: this._endNode.position }, { easing: 'quartOut' })
            .call(() => {
                PoolManager.instance.putNode(this.node);
            })
            .start();
    }

    /**
    * 摇摆效果
    * @param node 
    */
    private Shake(node: cc.Node) {
        cc.tween(node)
            .to(0.1, { angle: 3 })
            .to(0.1, { angle: 0 })
            .to(0.1, { angle: -3 })
            .to(0.1, { angle: 0 })
            .union()
            .repeat(2)
            .start();
    }
}
