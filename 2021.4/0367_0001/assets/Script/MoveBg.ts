// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoveBg extends cc.Component {

    // @property(cc.Node)
    // endParent: cc.Node = null;

    private _moveSpeed: number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
    }

    update(dt) {
        this.node.y -= this._moveSpeed * dt;
    }

    public setMoveSpeed(value: number) {
        this._moveSpeed = value;
    }
}
