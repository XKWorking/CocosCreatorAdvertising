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

    private _clickNum: number = 0;
    private _isShow: boolean = true;
    private _isGuidOver: boolean = false;
    private arr_Construction: cc.Node[] = [];
    private arr_InitPos: cc.Vec2[] = [];
    private arr_LeftZombie: cc.Node[] = [];
    private arr_RightZombie: cc.Node[] = [];

    private _constructionNum: number = 0;
    private _isShowGuidFinger_5: boolean = true;

    private _isLaunchBullet: boolean = false;
    private _isOpenLayer: boolean = false;

    private _width: number = 0;
    private _height: number = 0;

    public resetData() {
        this._clickNum = 0;
        this._isShow = true;
        this._isGuidOver = false;
        this.arr_Construction = [];
        this.arr_InitPos = [];
        this.arr_LeftZombie = [];
        this.arr_RightZombie = [];
        this._constructionNum = 0;
        this._isShowGuidFinger_5 = true;
        this._isLaunchBullet = false;
        this._isOpenLayer = false;

        this._width = 0;
        this._height = 0;
    }

    public getClickNum(): number {
        return this._clickNum;
    }

    public addClickNum() {
        this._clickNum++;
    }
    public getIsShow(): boolean {
        return this._isShow;
    }
    public setIsShow(isShow: boolean) {
        this._isShow = isShow;
    }
    public getIsGuidOver(): boolean {
        return this._isGuidOver;
    }
    public setIsGuidOver(isGuidOver: boolean) {
        this._isGuidOver = isGuidOver;
    }

    public getArr() {
        return this.arr_Construction;
    }
    public getArrLength() {
        return this.arr_Construction.length;
    }

    public addObj(node: cc.Node) {
        this.arr_Construction.push(node);
    }

    public delectObj(node: cc.Node) {
        let index = this.arr_Construction.indexOf(node);
        this.arr_Construction.splice(index, 1);
    }
    public getWidth(): number {
        return this._width;
    }
    public setWidth(num: number) {
        this._width = num;
    }
    public getHeight(): number {
        return this._height;
    }
    public setHeight(num: number) {
        this._height = num;
    }

    public getArrInitPos(index: number): cc.Vec2 {
        return this.arr_InitPos[index];
    }

    public addInitPos(pos: cc.Vec2) {
        this.arr_InitPos.push(pos);
    }
    public clearInitPos() {
        this.arr_InitPos = [];
    }
    public getLeftZombie() {
        if (this.arr_LeftZombie == null) {
            return null;
        }
        return this.arr_LeftZombie[0];
    }
    public getLeftZombieNum() {
        if (this.arr_LeftZombie == null) {
            return 0;
        }
        return this.arr_LeftZombie.length;
    }
    public addLeftZombie(node: cc.Node) {
        this.arr_LeftZombie.push(node);
    }
    public delectLeftZombie() {
        this.arr_LeftZombie.shift();
    }
    public getRightZombie() {
        if (this.arr_RightZombie == null) {
            return null;
        }
        return this.arr_RightZombie[0];
    }
    public getRightZombieNum() {
        if (this.arr_RightZombie == null) {
            return 0;
        }
        return this.arr_RightZombie.length;
    }
    public addRightZombie(node: cc.Node) {
        this.arr_RightZombie.push(node);
    }
    public delectRightZombie() {
        this.arr_RightZombie.shift();
    }

    public getLaunchBullet() {
        return this._isLaunchBullet;
    }
    public setLaunchBullet(value: boolean) {
        this._isLaunchBullet = value;
    }
    public getOpenLayer() {
        return this._isOpenLayer;
    }
    public setOpenLayer(value: boolean) {
        this._isOpenLayer = value;
    }

    public getConstructionNum() {
        return this._constructionNum;
    }
    public addConstructionNum() {
        this._constructionNum++;
    }
    public reduceConstructionNum() {
        this._constructionNum--;
    }
    public getShowGuidFinger_5() {
        return this._isShowGuidFinger_5;
    }
    public setShowGuidFinger_5() {
        this._isShowGuidFinger_5 = false;
    }
}
