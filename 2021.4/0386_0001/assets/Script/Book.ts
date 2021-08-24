// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Book extends cc.Component {

    @property(cc.Sprite)
    book_Left: cc.Sprite = null;

    @property(cc.Sprite)
    book_Middle: cc.Sprite = null;

    @property(cc.Sprite)
    book_Right: cc.Sprite = null;

    @property(cc.Node)
    shade_Left: cc.Node = null;

    @property(cc.Node)
    shade_Middle: cc.Node = null;

    @property(cc.Node)
    shade_Right: cc.Node = null;

    private _bookNum: number = 0;

    @property([cc.SpriteFrame])
    arr_Sprite: cc.SpriteFrame[] = [];

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._bookNum = LayerManger.Instance.GetLayer(Layer_1).GetAllBookNum();
        this.ChangeSprite();
    }

    private ChangeSprite() {
        if (this._bookNum % 2 === 0) {
            this.book_Left.spriteFrame = this.arr_Sprite[0];
            this.book_Middle.spriteFrame = this.arr_Sprite[1];
            this.book_Right.spriteFrame = this.arr_Sprite[2];
        } else {
            this.book_Left.spriteFrame = this.arr_Sprite[3];
            this.book_Middle.spriteFrame = this.arr_Sprite[4];
            this.book_Right.spriteFrame = this.arr_Sprite[5];
        }

    }

    /**
     * 闪一闪效果
     */
    public ShowFlash() {
        this.FlashFx(this.shade_Left);
        this.FlashFx(this.shade_Middle);
        this.FlashFx(this.shade_Right);
    }

    private FlashFx(node: cc.Node) {
        cc.tween(node)
            .to(0.1, { opacity: 180 }, { easing: 'fade' })
            .to(0.1, { opacity: 0 }, { easing: 'fade' })
            .start();
    }
}
