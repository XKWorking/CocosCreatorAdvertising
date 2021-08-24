// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";
import PoolManager from "./Manager/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CastGold extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    start() {
        this.InitCastGold();
    }

    update(dt) {

    }

    public InitCastGold() {
        let animState = this.anim.play();
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
        this.node.scale = 1;
        cc.tween(this.node)
            .to(0.4, { y: 708 }, { easing: 'quadOut' })
            .call(() => {
                this.node.getComponent(cc.Collider).enabled = true;
            })
            .to(1, { y: -300 }, { easing: 'quadIn' })
            .call(() => {
                PoolManager.instance.putNode(this.node);
            })
            .start();
        cc.tween(this.node)
            .to(0.2, { scale: 1.2 })
            .to(0.2, { scale: 1 })
            .to(1, { scale: 0 })
            .start();
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === "giftBox") {
            self.enabled = false;
            self.node.stopAllActions();
            let targetNode: cc.Node = other.node.children[0];
            self.node.setParent(targetNode);
            self.node.setPosition(cc.v2(0, -1));
            this.DownMove();
            LayerManger.Instance.GetLayer(Layer_1).CreateScore(true);
            LayerManger.Instance.GetLayer(Layer_1).AddGoldScore();
            LayerManger.Instance.GetLayer(Layer_1).ShowGoldNode();
            LayerManger.Instance.GetLayer(Layer_1).CreateGiftBox();
            AudioManager.play("gold");
        }
        if (other.node.group === "miss") {
            self.enabled = false;
            LayerManger.Instance.GetLayer(Layer_1).CreateScore(false);
            LayerManger.Instance.GetLayer(Layer_1).GiftBoxMoveEnd();
            LayerManger.Instance.GetLayer(Layer_1).ShowGoldNode();
            LayerManger.Instance.GetLayer(Layer_1).CreateGiftBox();
        }
    }

    private DownMove() {
        cc.tween(this.node)
            .by(0.5, { y: -180 })
            .call(() => {
                // this.node.destroy();
                PoolManager.instance.putNode(this.node);
            })
            .start();
    }


}
