// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";
import Monster_0 from "./Monster_0";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoxMonster extends Monster_0 {

    protected death(){
        super.death();

        LayerManger.Instance.GetLayer(Layer_1).ShowBoxNode();
    }
}
