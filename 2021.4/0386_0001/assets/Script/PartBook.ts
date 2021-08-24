// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PartBook extends cc.Component {

    @property(cc.Node)
    moveNode: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    public TurenLeftMove(distance: number) {
        this.moveNode.x -= distance;
    }

    public TurenRightMove(distance: number) {
        this.moveNode.x += distance;
    }
}
