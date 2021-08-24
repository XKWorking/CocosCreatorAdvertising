// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // @property(cc.Prefab)
    // pre_Score_1: cc.Prefab = null;

    // @property(cc.Prefab)
    // pre_Score_2: cc.Prefab = null;

    // @property(sp.Skeleton)
    // endPosFx: sp.Skeleton = null;

    // @property([sp.Skeleton])
    // arr_GoldFx: sp.Skeleton[] = [];

    // @property([sp.Skeleton])
    // arr_RedPacketFx: sp.Skeleton[] = [];
    // onLoad () {}

    start() {

    }

    // update (dt) {}
    // createScore_1() {
    //     let obj = cc.instantiate(this.pre_Score_1);
    //     obj.setParent(this.node);
    //     obj.setPosition(cc.v2(0, 200));
    //     let t = cc.tween;
    //     t(obj)
    //         .parallel(
    //             t().by(0.5, { position: cc.v2(0, 300) }),
    //             t().to(0.5, { opacity: 0 }, { easing: 'fade' })
    //         )
    //         .call(() => {
    //             obj.destroy();
    //         })
    //         .start();
    // }
    // createScore_2() {
    //     let obj = cc.instantiate(this.pre_Score_2);
    //     obj.setParent(this.node);
    //     obj.setPosition(cc.v2(0, 200));
    //     let t = cc.tween;
    //     t(obj)
    //         .parallel(
    //             t().by(0.5, { position: cc.v2(0, 300) }),
    //             t().to(0.5, { opacity: 0 }, { easing: 'fade' })
    //         )
    //         .call(() => {
    //             obj.destroy();
    //         })
    //         .start();
    // }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === 'book') {
            if (other.tag === 0) {
                self.node.stopAllActions();
                AudioManager.play('flyOut');
                LayerManger.Instance.GetLayer(Layer_1).goBack();
            }
        }
    }
}
