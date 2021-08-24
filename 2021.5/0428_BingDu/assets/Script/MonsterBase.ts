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

    // @property(cc.SpriteFrame)
    // shadowFrame: cc.SpriteFrame = null;

    private _hp: number = 6000;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    start() {

    }

    public SetData(hp: number) {
        this.SetHp(hp);
    }

    update(dt) {
    }

    public SetHp(num: number) {
        this._hp = Math.floor(num);

        this.hpNum.string = this._hp.toString();

        if (num <= 2500) {
            this.mSprite.spriteFrame = this.sprFrame[1];
            this.node.scaleX = (this.node.scaleX > 0 ? 1 : -1) * 1;
            this.node.scaleY = (this.node.scaleY > 0 ? 1 : -1) * 1;
        } else {
            this.mSprite.spriteFrame = this.sprFrame[0];
            this.node.scaleX = (this.node.scaleX > 0 ? 1 : -1) * 1.2;
            this.node.scaleY = (this.node.scaleY > 0 ? 1 : -1) * 1.2;
        }
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
        // LayerManger.Instance.GetLayer(Layer_1).ShowDeathEffect(this.node);

        this.node.removeFromParent();

        LayerManger.Instance.GetLayer(Layer_1).ShowGoldNum(5, this.node.position);
    }

    // update (dt) {}
}
