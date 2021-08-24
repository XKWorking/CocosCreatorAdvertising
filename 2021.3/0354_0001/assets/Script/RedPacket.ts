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
export default class NewClass extends cc.Component {

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === 'labelGold') {
            if (other.tag === 1) {
                // LayerManger.Instance.GetLayer(Layer_1).showRedPacket();
            } else if (other.tag === 2) {
                // LayerManger.Instance.GetLayer(Layer_1).showRedPacket();
                // LayerManger.Instance.GetLayer(Layer_1).setMoveDown();
            }
        }
    }
}
