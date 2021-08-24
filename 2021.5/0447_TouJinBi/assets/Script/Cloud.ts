// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Cloud extends cc.Component {

    @property({ type: cc.Integer, tooltip: "云移动的速度" })
    moveSpeed: number = 250;

    private _moveSpeed: number = 0;

    // onLoad () {}


    private InitCloud() {
        this._moveSpeed = this.moveSpeed;
    }

    start() {
        this.InitCloud();
    }

    update(dt) {
        this.node.x += dt * this._moveSpeed;
        if (this.node.x >= 1400) {
            this.node.x = -1400;
        }
    }
}
