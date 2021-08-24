// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MonsterBase extends cc.Component {

    @property(cc.Sprite)
    mSprite: cc.Sprite = null;
    @property(cc.Label)
    hpNum: cc.Label = null;
    @property([cc.SpriteFrame])
    sprFrame: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    shadowFrame: cc.SpriteFrame = null;

    public _shadow: cc.Node = null;

    private _hp: number = 100;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._shadow = new cc.Node();
        this._shadow.addChild(new cc.Node());
        LayerManger.Instance.GetLayer(Layer_1).shadowParent.addChild(this._shadow);
        this._shadow.children[0].addComponent(cc.Sprite).spriteFrame = this.shadowFrame;
        this._shadow.y = 5000;
    }

    start() {

    }

    public SetData(hp: number) {
        this.SetHp(hp);
    }

    update(dt) {
        this._shadow.position = this.node.position.add(cc.v3(20, -20));
        this._shadow.children[0].scaleX = this.node.scaleX;
        this._shadow.children[0].scaleY = this.node.scaleY;
        this._shadow.children[0].angle = this.node.angle;
        this._shadow.opacity = this.node.opacity;
    }

    public SetHp(num: number) {
        this._hp = num;
        let str = this.numFormat(num, 0);
        let size = 50 / str.length;
        this.hpNum.fontSize = size;
        this.hpNum.string = str;
        this._hp = num;

        switch (str.charAt(str.length - 1)) {
            case 'K': {
                this.mSprite.spriteFrame = this.sprFrame[1];
                this.node.scaleX = (this.node.scaleX > 0 ? 1 : -1) * 1.2;
                this.node.scaleY = (this.node.scaleY > 0 ? 1 : -1) * 1.2;
                break;
            }
            case 'M': {
                this.mSprite.spriteFrame = this.sprFrame[2];
                this.node.scaleX = (this.node.scaleX > 0 ? 1 : -1) * 1.5;
                this.node.scaleY = (this.node.scaleY > 0 ? 1 : -1) * 1.5;
                break;
            }
            default: {
                this.mSprite.spriteFrame = this.sprFrame[0];
                this.node.scaleX = (this.node.scaleX > 0 ? 1 : -1) * 1;
                this.node.scaleY = (this.node.scaleY > 0 ? 1 : -1) * 1;
                break;
            }
        }
    }

    private numFormat(num, digits): string {
        const si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "K" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    public BeAtk(num: number) {
        this._hp -= num;
        if (this._hp <= 0) {
            this.death();
        }
        this.SetHp(this._hp);
        LayerManger.Instance.GetLayer(Layer_1).ShowAtkEffect(this.node);

        AudioManager.play("atk");
    }
    protected death() {
        LayerManger.Instance.GetLayer(Layer_1).ShowDeathEffect(this.node);

        this.node.removeFromParent();

        this._shadow.removeFromParent();

        LayerManger.Instance.GetLayer(Layer_1).ShowGoldNum(5, this.node.position);
    }

    // update (dt) {}
}
