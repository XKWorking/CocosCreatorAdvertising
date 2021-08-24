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

    public goldeNum: number = 0;
    public isGameOver: boolean = false;

    public getGoldeNum() {
        return this.goldeNum;
    }

    public addGoldNum() {
        this.goldeNum++;
    }

    public reduceGoldNum() {
        this.goldeNum--;
    }

    public getIsGameOver() {
        return this.isGameOver;
    }
    public setIsGameOver(value: boolean) {
        this.isGameOver = value;
    }

}
