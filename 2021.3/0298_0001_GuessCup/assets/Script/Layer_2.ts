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
import AudioManager from "./Manager/AudioManager";
import GlobalData from "./GlobalData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Sprite)
    sprite_Gold: cc.Sprite = null;

    @property([cc.SpriteFrame])
    arr_SpriteFrame: cc.SpriteFrame[] = [];

    private _gold: number = 0;

    onLoad() {
        super.onResize();
        this.node.scale = 0;
    }

    protected start() {
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        this._gold = GlobalData.instance.getGold();
        switch (this._gold) {
            case 8:
                this.sprite_Gold.spriteFrame = this.arr_SpriteFrame[0];
                break;
            case 18:
                this.sprite_Gold.spriteFrame = this.arr_SpriteFrame[1];
                break;
            case 88:
                this.sprite_Gold.spriteFrame = this.arr_SpriteFrame[2];
                break;
        }
        AudioManager.play('tanchu');
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: 'backOut' })
            .start();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();

    }
}
