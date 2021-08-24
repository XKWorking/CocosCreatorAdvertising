// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PopupPanel from "./Panel/PopupPanel";
import LayerManger from "./Manager/LayerManger";
import CpSDK from "./CpTool/SDK/CpSDK";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    redPacket: cc.Node = null;

    @property(cc.Prefab)
    fireFlower: cc.Prefab = null;

    @property(cc.Node)
    node_Pos: cc.Node = null;

    onLoad() {
        super.onResize();

    }

    protected start() {

        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        this.redPacket.scale = 0;
        this.createFireWorks();
        this.showRedPacket();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    showRedPacket() {
        cc.tween(this.redPacket)
            .delay(0.3)
            .to(0.5, { scale: 1.1 }, { easing: 'backOut' })
            .to(0.5, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
            })
            .start();
    }

    createFireWorks() {
        let obj = cc.instantiate(this.fireFlower);
        obj.setParent(this.node_Pos);
        cc.tween(this.node_Pos)
            .delay(1)
            .call(() => {
                this.createFireWorks();
            })
            .start()
    }

    shake(node: cc.Node) {
        cc.tween(node)
            .by(0.1, { angle: 3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: 3 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }
}
