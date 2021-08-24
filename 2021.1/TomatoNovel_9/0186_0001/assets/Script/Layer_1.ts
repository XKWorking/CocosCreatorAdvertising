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
import Util from "./Utils/Util";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    button_down: cc.Node = null;

    @property(cc.Node)
    golds: cc.Node = null;

    @property(cc.Prefab)
    gold: cc.Prefab = null;

    @property(cc.Node)
    zis: cc.Node = null;

    @property(cc.Prefab)
    zi: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    redPacket: cc.Prefab = null;

    @property(cc.SpriteFrame)
    arr_Sprite: cc.SpriteFrame[] = [];

    private arr_RedPacket: cc.Node[] = [];

    private arr_pos: number[] = [];

    private contentPos: number = -115;

    private redPacketPos: number = 300;

    private pos: cc.Vec2 = cc.v2(0, -115);

    private goldNum: number = 0;

    onLoad() {
        super.onResize();
        this.shake();
        // this.createGold();
        // this.schedule(this.createGold, 2);
        AudioManager.playBgm();
        this.initContentPos();
        this.initRedPacket();
    }

    protected start() {
        CpSDK.EnterSection(1, "展示界面");
    }

    initContentPos() {
        this.content.setPosition(cc.v2(0, -115));
        for (let i: number = 0; i < 21; i++) {
            this.arr_pos.push(this.contentPos);
            this.contentPos += 185;
        }
    }

    initRedPacket() {
        for (let i: number = 0; i <= this.getArr_PosLenght(); i++) {
            this.createRedPacket(this.redPacketPos);
            this.redPacketPos -= 185;
        }
        cc.tween(this.node)
            .call(() => {
                this.slideContent();
                this.schedule(this.slideContent, 5.5);
            })
            .start();
    }

    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "下载按钮");
    }

    createRedPacket(pos: number) {
        let obj = cc.instantiate(this.redPacket);
        this.content.addChild(obj);
        obj.setPosition(cc.v2(0, pos));
        let ranSprite: cc.SpriteFrame = Util.randomArray(this.arr_Sprite);
        let sprite: cc.Sprite = obj.getComponent(cc.Sprite);
        sprite.spriteFrame = ranSprite;
        this.arr_RedPacket.push(obj);
    }

    createGold() {
        if (this.goldNum < 2) {
            if (this.goldNum == 0) {
                this.createzi();
            }
            AudioManager.play('scatterGold');
            let obj = cc.instantiate(this.gold);
            this.golds.addChild(obj);
            obj.setPosition(cc.v2(0, 0));
            cc.tween(obj)
                .to(1, { opacity: 0 })
                .call(() => {
                    this.goldNum++;
                    this.createGold();
                })
                .start();
        }
    }

    createzi() {
        let obj = cc.instantiate(this.zi);
        this.zis.addChild(obj);
        obj.setPosition(cc.v2(0, 0));
        obj.scale = 0;
        cc.tween(obj)
            .to(0.6, { scale: 1 })
            .delay(2.3)
            .call(() => {
                obj.destroy();
                this.goldNum = 0;
            })
            .start();
    }

    slideContent() {//0=-115 1=-70 2=115 3=300
        let num: number = Util.randomInteger(10, 20);
        cc.tween(this.content)
            .to(0.7, { position: cc.v2(0, this.getArr_Pos(2)) })
            .to(1, { position: cc.v2(0, this.getArr_Pos(num - 1)) })
            .to(0.7, { position: cc.v2(0, this.getArr_Pos(num)) })
            .call(() => {
                this.createGold();
            })
            .start();
        this.changeSprite();
    }

    changeSprite() {
        for (let i: number = 0; i < this.arr_RedPacket.length; i++) {
            let ranSprite: cc.SpriteFrame = Util.randomArray(this.arr_Sprite);
            let sprite: cc.Sprite = this.arr_RedPacket[i].getComponent(cc.Sprite);
            sprite.spriteFrame = ranSprite;
        }
        this.content.setPosition(this.pos);
    }

    getArr_PosLenght(): number {
        return this.arr_pos.length;
    }

    getArr_Pos(num: number): number {
        return this.arr_pos[num];
    }

    shake() {
        cc.tween(this.button_down)
            .by(0.1, { angle: 3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: -3 })
            .by(0.1, { angle: 3 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }
}
