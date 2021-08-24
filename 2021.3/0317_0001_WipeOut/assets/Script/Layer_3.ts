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
import CpSDK from "./CpTool/SDK/CpSDK";
import LayerManger from "./Manager/LayerManger";
import Layer_1 from "./Layer_1";
import GlobalData from "./GlobalData";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_3 extends PopupPanel {

    @property(cc.Node)
    btn_TryAgain: cc.Node = null;

    onLoad() {
        super.onResize();
    }

    protected start() {
        AudioManager.play('gate');
        this.btn_TryAgain.on("click", () => {
            CpSDK.ClickFinishDownloadBar(3, "失败页面结束下载按钮");
        }, this);
        CpSDK.EnterSection(3, "失败界面");
        CpSDK.GameEnd();
    }

    private resetData() {
        GlobalData.instance.resetData();
    }


}
