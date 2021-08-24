// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CpSDK from "./CpTool/SDK/CpSDK";
import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    plane_0: cc.Node = null;

    @property(cc.Node)
    touchNode_0: cc.Node = null;

    @property(cc.Node)
    bg_0: cc.Node = null;
    @property(cc.Node)
    bg_1: cc.Node = null;

    @property(cc.Node)
    plane_1: cc.Node = null;
    @property(cc.Node)
    btn: cc.Node = null;




    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.touchNode_0.on("click", () => {
            this.plane_0.active = false;
            this.plane_1.active = true;
            this.plane_1.opacity = 0;
            this.plane_1.runAction(cc.fadeIn(0.3));

            CpSDK.FirstTouch();

            AudioManager.play("click");

        });
        this.btn.on("click", () => {
            CpSDK.FirstTouch();
            this.node.active = false;
            LayerManger.Instance.GetLayer(Layer_1).node.active = true;
            this.bg_0.active = false;
            this.bg_1.active = true;
            AudioManager.play("click");
        })
    }

    start() {

    }

    // update (dt) {}
}
