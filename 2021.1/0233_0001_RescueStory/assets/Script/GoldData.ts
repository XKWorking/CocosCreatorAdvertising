


const { ccclass, property } = cc._decorator;

@ccclass
export default class GoldData extends cc.Component {
    static _instance: GoldData = null;

    static get instance(): GoldData {
        if (this._instance == null) {
            this._instance = new GoldData();
        }

        return this._instance;
    }

    private _isPortrait: boolean = true;

    public getIsPortrait(): boolean {
        return this._isPortrait;
    }
    public setIsPortrait(isBool: boolean) {
        this._isPortrait = isBool;
    }
}

