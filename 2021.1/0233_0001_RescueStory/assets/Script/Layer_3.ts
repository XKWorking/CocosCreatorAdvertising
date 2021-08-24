import PopupPanel from "./Panel/PopupPanel";
import LayerManger from "./Manager/LayerManger";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";
import Layer_1 from "./Layer_1";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_3 extends PopupPanel {

    @property(cc.Node)
    restart: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    @property(cc.Node)
    btnDownload: cc.Node = null;


    onLoad() {
        AudioManager.play('fail');
        super.onResize();

        this.restart.on("click", () => {
            LayerManger.Instance.GetLayer(Layer_1).GameRestart();
            this.closePanel2();
            AudioManager.play('click');
        });

        this.btnDownload.on("click", () => {
            CpSDK.ClickArea(0, '下载');
            AudioManager.play('click');
        });
    }

    protected start() {
    }


    update(dt) {
        this.light.angle -= dt * 60;
    }


    closePanel2() {
        this.CloseForTween();
    }
}
