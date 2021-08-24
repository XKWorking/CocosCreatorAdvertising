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
export default class Player extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
    }

    update(dt) {
    }
}
