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

    public oneRotateDir: boolean = false;

    public GetOneRotateDir(): boolean {
        return this.oneRotateDir;
    }

    public SetOneRotateDir(value: boolean) {
        this.oneRotateDir = value;
    }

}

export function isNullOrUndefined(v) {
    if (v === null || v === undefined) {
        return true;
    }
    return false;
}

export function alterAngle(angle: number) {
    if (angle < 0) {
        angle += 360;
        return angle;
    }
    return angle;
}



