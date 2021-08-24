// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseLayer from "./Base/BaseLayer";
import GlobalData from "./GlobalData";
import AudioManager from "./Manager/AudioManager";
import Util from "./Utils/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    node_Rotate: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    onLoad() {
        super.onResize();
    }

    scatterGold(GoldNode) {
        AudioManager.play('redPackedClip');
        let v = 800;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;
        t = s / v;
        for (let i = 0; i < 5; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.node2Ctnode1(star, GoldNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-100, 100), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.node2Ctnode1(star, this.node_EndPos) })
                .call(() => {
                    star.destroy();
                    GlobalData.instance.addGoldNum(20);
                })
                .start();
        }
    }

    node2Ctnode1(node1, node2) {
        let wordPoint = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }


}
