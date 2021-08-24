import PopupPanel from "./Panel/PopupPanel";
import LayerManger from "./Manager/LayerManger";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_2 extends PopupPanel {

    @property(cc.Node)
    btnDownload_1: cc.Node = null;

    @property(cc.Node)
    btnDownload: cc.Node = null;

    @property(cc.Node)
    openNode: cc.Node = null;

    @property(cc.Node)
    box: cc.Node = null;

    @property(sp.Skeleton)
    man: sp.Skeleton = null;

    @property(sp.Skeleton)
    gold: sp.Skeleton = null;

    @property(sp.Skeleton)
    scatterFlowers: sp.Skeleton = null;

    @property(cc.Node)
    label: cc.Node = null;

    @property(cc.Node)
    goldRain: cc.Node = null;

    onLoad() {
        super.onResize();

        this.openNode.on("click", () => {
            let obj = this.openNode.getComponent(cc.Button);
            obj.enabled = false;
            this.showGold();
            AudioManager.play('click');
        });

        this.btnDownload.on("click", () => {
            CpSDK.ClickArea(0, '下载');
            AudioManager.play('click');
        });

        this.btnDownload_1.on("click", () => {
            CpSDK.ClickArea(0, '下载');
            AudioManager.play('click');
        });
        CpSDK.GameEnd();
    }

    protected start() {
    }

    showGold() {
        AudioManager.play('win');
        cc.tween(this.box)
            .to(0.1, { angle: -15 })
            .to(0.1, { angle: 20 })
            .to(0.1, { angle: -15 })
            .to(0.1, { angle: 20 })
            .to(0.1, { angle: -15 })
            .to(0.1, { angle: 0 })
            .call(() => {
                this.gold.clearTracks();
                this.gold.setStartListener(() => {
                    this.box.active = false;
                });
                this.gold.setAnimation(0, 'texiao', false);
                this.gold.setCompleteListener(() => {
                    this.openNode.active = false;
                    this.goldRain.active = true;
                    this.label.active = true;
                    this.man.node.active = true;
                    this.man.clearTracks();
                    this.man.setAnimation(0, 'idel4', true);
                    this.goldRain.active = true;
                    this.btnDownload.active = true;
                });
            })
            .start();

    }
    // update (dt) {}


    closePanel2() {
        this.CloseForTween();
    }

}
