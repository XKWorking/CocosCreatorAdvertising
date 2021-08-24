// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import BaseLayer from "./Base/BaseLayer";
import CpSDK from "./CpTool/SDK/CpSDK";
import Util from "./Utils/Util";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    redPackNode: cc.Node = null;
    @property(cc.Prefab)
    redPack: cc.Prefab = null;
    @property(cc.Prefab)
    gold: cc.Prefab = null;

    onLoad() {
        super.onResize();
        this.schedule(this.insRedPackObj, 0.5);
        this.schedule(this.insGoldObj, 0.5);
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    update(dt: number) {
    }

    insRedPackObj() {
        let redPackObj = cc.instantiate(this.redPack);
        this.redPackNode.addChild(redPackObj);

        redPackObj.x = Util.random(-700, 300);
        redPackObj.y = 600
        redPackObj.angle = Util.random(30, -30)
        cc.tween(redPackObj)
            .to(Util.random(2, 3), { x: redPackObj.x + 600, y: -600 })
            .call(() => { redPackObj.destroy() })
            .start();
    }

    insGoldObj() {
        let goldObj = cc.instantiate(this.gold);
        this.redPackNode.addChild(goldObj);
        goldObj.x = Util.random(-700, 300);
        goldObj.y = 600
        goldObj.angle = Util.random(30, -30)
        cc.tween(goldObj)
            .to(Util.random(2, 3), { x: goldObj.x + 600, y: -600 })
            .call(() => { goldObj.destroy() })
            .start();
    }

}
