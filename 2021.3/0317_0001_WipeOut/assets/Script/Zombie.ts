// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "./GlobalData";
import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Zombie extends cc.Component {

    @property(cc.Boolean)
    isLeft: boolean = false;

    @property(cc.Integer)
    hp: number = 0;

    @property(cc.Animation)
    selfAnim: cc.Animation = null;

    @property(cc.Animation)
    blood: cc.Animation = null;

    onLoad() {
    }
    start() {
        let animState = this.selfAnim.play();
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    }

    update(dt) {
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'otherObj') {
            // if (this.isLeft) {
            self.node.stopAllActions();
            LayerManger.Instance.GetLayer(Layer_1).reduceHp_1(self.node);
            // } else {
            //     self.node.stopAllActions();
            //     LayerManger.Instance.GetLayer(Layer_1).reduceHp_2(self.node);
            // }
            LayerManger.Instance.GetLayer(Layer_1).showRedScreen();
        }
        else if (other.node.group == 'bullet') {
            this.showNode(this.blood.node);
            this.blood.play();
            cc.tween(this.node)
                .delay(0.3)
                .call(() => {
                    this.hideNode(this.blood.node);
                })
                .start();
            this.reduceHp();
            other.node.destroy();
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'otherObj') {
            LayerManger.Instance.GetLayer(Layer_1).hideRedScreen();
        }
    }



    showNode(node: cc.Node) {
        node.active = true;
    }
    hideNode(node: cc.Node) {
        node.active = false;
    }

    reduceHp() {
        this.hp -= 50;
        if (this.hp <= 0) {
            if (this.isLeft) {
                GlobalData.instance.delectLeftZombie();
                this.node.destroy();
            } else {
                GlobalData.instance.delectRightZombie();
                this.node.destroy();
            }
        }
    }

    changePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }
}
