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

    public powerNum: number = 0;
    public isGameOver: boolean = false;
    public score: number = 0;

    public getPowerNum() {
        return this.powerNum;
    }

    public setPowerNum(num: number) {
        this.powerNum = num;
    }

    public getIsGameOver() {
        return this.isGameOver;
    }
    public setIsGameOver(value: boolean) {
        this.isGameOver = value;
    }

    public getScore() {
        return this.score;
    }
    public setScore(num: number) {
        this.score = num;
    }

}
