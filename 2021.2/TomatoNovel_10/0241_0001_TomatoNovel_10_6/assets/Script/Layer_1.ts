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


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(sp.Skeleton)
    caidai: sp.Skeleton = null;

    @property(sp.Skeleton)
    firework: sp.Skeleton = null;

    onLoad() {
        super.onResize();
        this.showFireWork();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
        this.firework.addAnimation(0, 'texiao', false);

    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    showFireWork() {
        this.firework.clearTracks();
        this.firework.setStartListener(() => {
            this.caidai.clearTracks();
            this.caidai.setAnimation(0, 'texiao', false);
            this.caidai.setCompleteListener(() => {
                this.firework.addAnimation(0, 'texiao', false);
            });
        });
    }

}
