// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Barrier extends cc.Component {

    @property(cc.Node)
    selfParentRotate: cc.Node = null;

    // =======================================
    private _rotateSpeed: number = 50;
    private _isGameOver: boolean = false;
    // onLoad () {}

    start() {

    }

    update(dt) {
        if (this._isGameOver) return;
        this.selfParentRotate.angle -= dt * this._rotateSpeed;
        if (this.selfParentRotate.angle <= -360) {
            this.selfParentRotate.angle = 0;
        }
    }
}
