import AutoResizeLayer from "../Components/AutoResizeLayer";
import { BaseComponent } from "../Config/GameConfigLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseLayer extends BaseComponent {
    protected _startData: any = null;

    /**
    * 显示(禁止重写)
    */
    public show(): void {
        let isOnShow = this.node.active == false;
        this.node.active = true;
        if (isOnShow) {
            this.onShow();
            this.onResize();
        }
    }

    /**
     * 隐藏(禁止重写)
     */
    public hide(isRemove: boolean = false): void {
        let isOnHide = false;
        if (isRemove) {
            this.node.destroy();
        } else {
            isOnHide = this.node.active;
            this.node.active = false;
        }

        if (isOnHide) {
            this.onHide();
        }
    }

    protected onShow(): void {

    }

    protected onHide(): void {

    }

    protected onResize(): void {
        if (this.node.getComponent(AutoResizeLayer)) return;
        this.node.addComponent(AutoResizeLayer);
    }
}
