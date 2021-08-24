// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LayerManger from "./Manager/LayerManger";
import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {


    // onLoad () {}

    // start() {}

    // update (dt) {}

    onCollisionEnter(other, self) {
        if (other.tag == 1) {
            // LayerManger.Instance.GetLayer(Layer_1).scatterGold(node);
        }

        if (other.tag == 2) {
        }
    }
}
