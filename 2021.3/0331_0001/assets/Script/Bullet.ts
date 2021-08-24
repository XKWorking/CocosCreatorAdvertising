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
export default class Bullet extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property(cc.Node)
    bulletFX: cc.Node = null;


    start() {

    }

    // update (dt) {}
    onBeginContact(contact, self, other) {
        if (other.node.group === 'wall') {
            this.node.stopAllActions();
            let num = GlobalData.instance.getPowerNum();
            LayerManger.Instance.GetLayer(Layer_1).moveDown(num);
            this.bulletFX.angle = 180;
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === 'wall') {
            this.node.stopAllActions();
            let num = GlobalData.instance.getPowerNum();
            LayerManger.Instance.GetLayer(Layer_1).moveDown(num);
            this.bulletFX.angle = 180;
        }
        else if (other.node.group == 'score') {
            if (other.tag == 1) {
                LayerManger.Instance.GetLayer(Layer_1).showScoreView(0);
            } else if (other.tag == 2) {
                LayerManger.Instance.GetLayer(Layer_1).showScoreView(1);
            } else if (other.tag == 3) {
                LayerManger.Instance.GetLayer(Layer_1).showScoreView(2);
            } else if (other.tag == 4) {
                LayerManger.Instance.GetLayer(Layer_1).showScoreView(3);
            } else if (other.tag == 5) {
                LayerManger.Instance.GetLayer(Layer_1).showScoreView(4);
                LayerManger.Instance.GetLayer(Layer_1).showBig();
            }
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'score') {
            if (other.tag == 5) {
                LayerManger.Instance.GetLayer(Layer_1).showSmall();
            }
        }
    }

}
