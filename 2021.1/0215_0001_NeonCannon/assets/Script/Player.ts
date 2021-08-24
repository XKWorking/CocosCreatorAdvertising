const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    private posL: number = 0;
    private posR: number = 0;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.posL = -360;
        this.posR = 360;
    }

    // start() {}

    update(dt) {

    }
    //触摸屏幕拖动事件
    public touchEvent(event) {
        let delta = event.getDelta();
        if (this.node.x > this.posR) {
            this.node.x = this.posR;
        } else if (this.node.x < this.posL) {
            this.node.x = this.posL;
        } else {
            this.node.x += delta.x;
        }
        // this.y += delta.y;

    }
}
