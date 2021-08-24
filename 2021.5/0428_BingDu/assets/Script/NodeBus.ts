// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NodeBus extends cc.Component {

    private _customData: any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }

    public setData(value) {
        this._customData = value;
    }

    public getData(): any {
        return this._customData;
    }

    // update (dt) {}
}
