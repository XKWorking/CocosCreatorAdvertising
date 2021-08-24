import Util from "../Utils/Util";
import { globalData } from "../Config/SystemConfig"
const { ccclass, property, menu } = cc._decorator

@ccclass
@menu('通用组件/自动缩放层')
export default class AutoResizeLayer extends cc.Component {

    @property(cc.Size)
    size = cc.size(720, 1280);

    resizeCallback = null;



    onLoad() {
        this.resizeCallback = () => {
            this.resizeGame();
        }

        this.resizeGame();
        this.setResizeCallback(this.resizeCallback)

        cc.game.on(cc.game.EVENT_HIDE, () => {
            globalData.isShow = false;
        })
        cc.game.on(cc.game.EVENT_SHOW, () => {
            globalData.isShow = true;
        })

    }

    onDestroy() {
        this.clearResizeCallback(this.resizeCallback)
    }

    private resizeGame() {

        // @ts-ignore
        const { width: canvasWidth, height: canvasHeight } = cc.view.getCanvasSize();

        let scale = 1;

        if (this.size.width / this.size.height > canvasWidth / canvasHeight) {
            scale = (canvasWidth / canvasHeight) / (this.size.width / this.size.height)
        }

        globalData.scale = this.node.scale = scale;
        this.node.dispatchEvent(new cc.Event.EventCustom('ResizeView', true));
    }

    /**
    * 设置屏幕尺寸变化时的回调函数 , 可以设置多个不冲突
    * @param callback 
    */
    public setResizeCallback = (callback: Function) => {

        if (_autoResizeLayerData.isFirstRun) {
            _autoResizeLayerData.isFirstRun = false

            cc.view.setResizeCallback(() => {
                _autoResizeLayerData.events.forEach((callbackfn) => {
                    callbackfn()
                })
            })
        }

        _autoResizeLayerData.events.push(callback)
    }

    /**
     * 清除一个屏幕尺寸变化时的回调函数
     * @param callback 
     */
    public clearResizeCallback = (callback: Function) => {
        Util.removeItem(_autoResizeLayerData.events, callback)
    }

}

const _autoResizeLayerData = {
    scale: 1,
    events: [],
    isFirstRun: true
}
