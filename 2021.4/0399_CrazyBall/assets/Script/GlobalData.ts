// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GlobalData {

    static _instance: GlobalData = null;

    static get instance(): GlobalData {
        if (this._instance == null) {
            this._instance = new GlobalData();
        }

        return this._instance;
    }

    public currentTestTube: cc.Node = null;

    //-------------------------------------------------

    public GetCurrentTestTube(): cc.Node {
        return this.currentTestTube;
    }

    public SetCurrentTestTube(node: cc.Node) {
        this.currentTestTube = node;
    }

}
