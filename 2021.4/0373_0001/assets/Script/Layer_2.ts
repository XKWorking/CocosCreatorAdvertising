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
import Layer_1 from "./Layer_1";
import { GetViewH, GetViewW } from "./Config/SystemConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    endLight: cc.Node = null;

    @property(cc.Node)
    overInterface: cc.Node = null;

    @property(cc.Node)
    btn_DownLoad: cc.Node = null;

    @property(cc.Node)
    scatterColouredRibbon: cc.Node = null;

    @property(cc.Node)
    card: cc.Node = null;

    @property(cc.Node)
    fireworksPos: cc.Node = null;

    @property(cc.Prefab)
    fireworks: cc.Prefab = null;

    private _layerScale_2: number = 1;

    onLoad() {
        super.onResize();
        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.ResizeContent();
        });
        this.ResizeContent();
    }

    protected start() {
        this.btn_DownLoad.on("click", () => {
            CpSDK.ClickFinishDownloadBar(2, "结束下载按钮");
        }, this);
        this.ShowSlef();
        CpSDK.EnterSection(2, "结束界面");
        CpSDK.GameEnd();
    }

    private ShowSlef() {
        cc.tween(this.node)
            .to(0.5, { scale: this._layerScale_2 }, { easing: 'backOut' })
            .call(() => {
                AudioManager.play('amazing');
                this.RotateLight();
                this.createFireWorks();
                this.scatterColouredRibbon.active = true;
                this.card.active = true;
            })
            .start();
    }

    private RotateLight() {
        cc.tween(this.endLight)
            .by(3, { angle: 360 })
            .repeatForever()
            .start();
    }

    private createFireWorks() {
        let obj = cc.instantiate(this.fireworks);
        obj.setParent(this.fireworksPos);
        cc.tween(this.node)
            .delay(1)
            .call(() => {
                this.createFireWorks();
            })
            .start();
    }

    /**
     * 监听屏幕横竖屏变化
     */
    private ResizeContent() {
        if (GetViewW() > GetViewH()) {
            this.node.scale = this._layerScale_2 = 1.5;
            console.log('横屏');
        } else {
            this.node.scale = this._layerScale_2 = 1;
            console.log('竖屏');
        }
    }
}
