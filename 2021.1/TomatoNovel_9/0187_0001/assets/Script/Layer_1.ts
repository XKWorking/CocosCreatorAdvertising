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
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(sp.Skeleton)
    fx_1: sp.Skeleton = null;

    @property(sp.Skeleton)
    fx_2: sp.Skeleton = null;

    @property(sp.Skeleton)
    fx_3: sp.Skeleton = null;

    @property(sp.Skeleton)
    fx_4: sp.Skeleton = null;


    onLoad() {
        super.onResize();
        // this.schedule(this.playAudio, 1.2);
        this.initFx_1();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
    }

    initFx_1() {
        this.scheduleOnce(this.playAudio, 1);
        this.fx_1.clearTracks();
        this.fx_1.setAnimation(0, "texiao01", false);
        this.fx_1.setCompleteListener(() => {
            this.initFx_2();
        })
    }

    initFx_2() {
        this.scheduleOnce(this.playAudio, 1);
        this.fx_2.clearTracks();
        this.fx_2.setAnimation(0, "texiao02", false);
        this.fx_2.setCompleteListener(() => {
            this.initFx_3();
        })
    }

    initFx_3() {
        this.scheduleOnce(this.playAudio, 1);
        this.fx_3.clearTracks();
        this.fx_3.setAnimation(0, "texiao03", false);
        this.fx_3.setCompleteListener(() => {
            this.initFx_4();
        })
    }

    initFx_4() {
        this.scheduleOnce(this.playAudio, 1);
        this.fx_4.clearTracks();
        this.fx_4.setAnimation(0, "texiao04", false);
        this.fx_4.setCompleteListener(() => {
            this.initFx_1();
        })
    }

    playAudio() {
        AudioManager.play('scatterGold');
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }
}
