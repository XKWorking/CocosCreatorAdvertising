// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import BaseLayer from "./Base/BaseLayer";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Sprite)
    book1: cc.Sprite = null;

    @property(cc.Sprite)
    book2: cc.Sprite = null;

    @property(cc.Sprite)
    book3: cc.Sprite = null;

    @property(cc.Node)
    point1: cc.Node = null;

    @property(cc.Node)
    point2: cc.Node = null;

    @property(cc.Node)
    point3: cc.Node = null;

    @property(cc.Prefab)
    gold: cc.Prefab = null;

    @property(cc.Node)
    golds: cc.Node = null;

    @property(cc.Node)
    books: cc.Node = null;

    private pos: cc.Vec2 = cc.v2(0, 0);

    private bookList: cc.Sprite[] = [];

    private pointList: cc.Node[] = [];

    readonly changeCD = 3;

    private cuteTime = 0;

    private changeID = 0;

    private moveSpeed = 20;

    private sibling = 10

    onLoad() {
        super.onResize();
        this.bookList = [this.book1, this.book2, this.book3];
        this.pointList = [this.point1, this.point2, this.point3];
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");

        this.books.scale = 0;
        cc.tween(this.books)
            .to(0.7, { scale: 1 }, cc.easeBackOut())
            .start();
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    update(dt: number) {
        this.cuteTime += dt;
        if (this.cuteTime >= this.changeCD) {
            this.changeBook();
            this.changeID++;
            if (this.changeID > 2) {
                this.changeID = 0;
            }
            this.cuteTime = 0;
        }
    }

    changeBook() {
        this.sibling++;
        this.bookList[2 - this.changeID].node.setSiblingIndex(this.sibling);
        for (let i = 0; i < 3; i++) {
            let nextIndex = (this.changeID + i + 1) % 3;
            this.bookMove(this.bookList[i], this.pointList[nextIndex])
        }
    }

    bookMove(book: cc.Sprite, nextPoint: cc.Node) {
        let s = this;
        cc.tween(book.node)
            .to(0.3, { x: nextPoint.x, y: nextPoint.y })
            .call(() => {
                this.createrGold();
                this.scheduleOnce(this.createrGold, 1.2);
            })
            .start();
    }

    createrGold() {
        AudioManager.play('scatterGold');
        let obj = cc.instantiate(this.gold);
        this.golds.addChild(obj);
        obj.setPosition(this.pos);
    }
}
