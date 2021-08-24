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

    private _goldeNum: number = 0;
    private _lastScore: number = 0;
    private _isOpenLayer_2: boolean = true;

    public getGoldeNum() {
        return this._goldeNum;
    }

    public addGoldNum() {
        this._goldeNum++;
    }

    public reduceGoldNum() {
        this._goldeNum--;
    }

    public getLastScore(): number {
        return this._lastScore;
    }
    public setLastScore(value: number) {
        this._lastScore = value;
    }

    public getIsOpenLayer_2(): boolean {
        return this._isOpenLayer_2;
    }
    public setIsOpenLayer_2(value: boolean) {
        this._isOpenLayer_2 = value;
    }

}
