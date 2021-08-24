// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FukubukuroMove from "./FukubukuroMove";
import GoldMove from "./GoldMove";
import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedPacketMove extends cc.Component {

    @property(cc.Prefab)
    bubbleExplode: cc.Prefab = null;

    @property(cc.Prefab)
    rippleExplode: cc.Prefab = null;

    @property(cc.Node)
    img_Explode: cc.Node = null;

    private _moveSpeed: number = 500;

    private _objParent: cc.Node = null;

    private _fxParent: cc.Node = null;

    start() {
        this._objParent = LayerManger.Instance.GetLayer(Layer_1).getObjParent();
        this._fxParent = LayerManger.Instance.GetLayer(Layer_1).getObjFxParent();
    }

    update(dt) {
        this.node.y -= this._moveSpeed * dt;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (LayerManger.Instance.GetLayer(Layer_1).getIsGameOver()) {
            LayerManger.Instance.GetLayer(Layer_1).gameOver();
            return;
        }
        if (other.node.group === 'player') {
            if (self.tag === 0) {
                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                self.tag = 1;
                self.node.parent = this._objParent;
                self.node.setSiblingIndex(0);
                self.node.x = 0;
                this.setMoveSpeed(0);
                if (this._objParent.childrenCount > 1) {
                    this.showBig(self.node);
                    this.showBig(this._objParent.children[1]);
                    if (self.node.name === this._objParent.children[1].name) {
                        cc.tween(this.node)
                            .delay(0.35)
                            .call(() => {
                                LayerManger.Instance.GetLayer(Layer_1).scatterGold(self.node);
                                other.node.getComponent(RedPacketMove).createRippleExplode(this._fxParent, other.node.getPosition());
                                this.createRippleExplode(this._fxParent, self.node.getPosition());
                                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                            })
                            .start();
                    }
                }
                if (LayerManger.Instance.GetLayer(Layer_1).getGuidTime()) {
                    LayerManger.Instance.GetLayer(Layer_1).setIsClickButton(true);
                    LayerManger.Instance.GetLayer(Layer_1).setBeginObjMoveSpeed(0);
                    LayerManger.Instance.GetLayer(Layer_1).setBgMoveSpeed(0);
                    LayerManger.Instance.GetLayer(Layer_1).showGuidFinger();
                }
            }
        } else if (other.node.group === 'redPacket') {
            if (other.tag === 0) {
                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                let index = self.node.getSiblingIndex();
                index++;
                other.tag = 1;
                other.node.parent = this._objParent;
                other.node.setSiblingIndex(index);
                other.node.x = 0;
                other.node.getComponent(RedPacketMove).setMoveSpeed(0);
                this.showBig(self.node);
                this.showBig(this._objParent.children[index]);
                let nextIndex = index + 1;
                if (this._objParent.childrenCount > nextIndex) {
                    this.showBig(this._objParent.children[nextIndex]);
                }
                cc.tween(this.node)
                    .delay(0.35)
                    .call(() => {
                        LayerManger.Instance.GetLayer(Layer_1).scatterGold(self.node);
                        other.node.getComponent(RedPacketMove).createRippleExplode(this._fxParent, other.node.getPosition());
                        this.createRippleExplode(this._fxParent, this.node.getPosition());
                        LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                    })
                    .start();
                if (LayerManger.Instance.GetLayer(Layer_1).getGuidTime()) {
                    LayerManger.Instance.GetLayer(Layer_1).gameStart();
                }
            }

        } else if (other.node.group === 'gold') {
            if (other.tag === 0) {
                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                let index = self.node.getSiblingIndex();
                index++;
                other.tag = 1;
                other.node.parent = this._objParent;
                other.node.setSiblingIndex(index);
                other.node.x = 0;
                other.node.getComponent(GoldMove).setMoveSpeed(0);
                this.showBig(self.node);
                this.showBig(this._objParent.children[index]);
                let nextIndex = index + 1;
                if (this._objParent.childrenCount > nextIndex) {
                    this.showBig(this._objParent.children[nextIndex]);
                    if (other.node.name === this._objParent.children[nextIndex].name) {
                        cc.tween(this.node)
                            .delay(0.35)
                            .call(() => {
                                LayerManger.Instance.GetLayer(Layer_1).scatterGold(other.node);
                                other.node.getComponent(GoldMove).createRippleExplode(this._fxParent, other.node.getPosition());
                                this._objParent.children[nextIndex].getComponent(GoldMove).createRippleExplode(this._fxParent, this.node.getPosition());
                                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                            })
                            .start();
                    }
                }
            }

        } else if (other.node.group === 'fukubukuro') {
            if (other.tag === 0) {
                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                let index = self.node.getSiblingIndex();
                index++;
                other.tag = 1;
                other.node.parent = this._objParent;
                other.node.setSiblingIndex(index);
                other.node.x = 0;
                other.node.getComponent(FukubukuroMove).setMoveSpeed(0);
                this.showBig(self.node);
                this.showBig(this._objParent.children[index]);
                let nextIndex = index + 1;
                if (this._objParent.childrenCount > nextIndex) {
                    this.showBig(this._objParent.children[nextIndex]);
                    if (other.node.name === this._objParent.children[nextIndex].name) {
                        cc.tween(this.node)
                        .delay(0.35)
                            .call(() => {
                                LayerManger.Instance.GetLayer(Layer_1).scatterGold(other.node);
                                other.node.getComponent(FukubukuroMove).createRippleExplode(this._fxParent, other.node.getPosition());
                                this._objParent.children[nextIndex].getComponent(FukubukuroMove).createRippleExplode(this._fxParent, this.node.getPosition());
                                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                            })
                            .start();
                    }
                }
            }
        } else if (other.node.group === 'barrier') {
            if (other.tag == 1) {
                this.createBubbleExplode(this._fxParent, this.node.getPosition());
                this.node.destroy();
                LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
                LayerManger.Instance.GetLayer(Layer_1).stopAllObjMove();
                LayerManger.Instance.GetLayer(Layer_1).backUp();
            } else if (other.tag == 2) {
                LayerManger.Instance.GetLayer(Layer_1).goBack();
            }
        } else if (other.node.group === 'death') {
            this.node.destroy();
            LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum();
        }

    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === 'redLine') {
            if (self.tag === 0) return;
            self.enabled = false;
            LayerManger.Instance.GetLayer(Layer_1).gameOver();
        }
    }
    public setMoveSpeed(value: number) {
        this._moveSpeed = value;
    }

    public createBubbleExplode(parent: cc.Node, pos: cc.Vec2) {
        let obj_1 = cc.instantiate(this.bubbleExplode);
        obj_1.setParent(parent);
        obj_1.setPosition(pos);
        let anim_1 = obj_1.getComponent(sp.Skeleton);
        anim_1.clearTracks();
        anim_1.setAnimation(0, 'texiao', false);
        anim_1.setCompleteListener(() => {
            obj_1.destroy();
        });
    }
    public createRippleExplode(parent: cc.Node, pos: cc.Vec2) {
        cc.tween(this.img_Explode)
            .to(0.5, { scale: 1 })
            .start();
        let obj_2 = cc.instantiate(this.rippleExplode);
        obj_2.setParent(parent);
        obj_2.setPosition(pos);
        let anim_2 = obj_2.getComponent(sp.Skeleton);
        anim_2.clearTracks();
        anim_2.setAnimation(0, 'texiao', false);
        anim_2.setCompleteListener(() => {
            obj_2.destroy();
            this.node.destroy();
            LayerManger.Instance.GetLayer(Layer_1).checkSame();
        });
        AudioManager.play('bubble');
    }

    private showBig(node: cc.Node) {
        cc.tween(node)
            .to(0.2, { scaleX: 0.9, scaleY: 1.1 }, { easing: 'sineOut' })
            .to(0.15, { scale: 1 })
            .start();
    }




    // private checkSame(index_1: number, index_2: number) {
    //     cc.tween(this.node)
    //         .delay(0.1)
    //         .call(() => {
    //             console.log('objParent的孩子数量', this._objParent.childrenCount);
    //             if (this._objParent.childrenCount < 2) return;
    //             let obj_1 = this._objParent.children[index_1];
    //             let obj_2 = this._objParent.children[index_2];
    //             if (obj_1.name == obj_2.name) {
    //                 let lastIndex = index_1 - 1;
    //                 LayerManger.Instance.GetLayer(Layer_1).scatterGold(obj_1);
    //                 if (obj_1.name == '0') {
    //                     obj_2.getComponent(FukubukuroMove).createRippleExplode(this._fxParent, obj_2.getPosition());
    //                 } else if (obj_1.name == '1') {
    //                     obj_2.getComponent(GoldMove).createRippleExplode(this._fxParent, obj_2.getPosition());
    //                 } else if (obj_1.name == '2') {
    //                     obj_2.getComponent(RedPacketMove).createRippleExplode(this._fxParent, obj_2.getPosition());
    //                 }
    //                 this.createRippleExplode(this._fxParent, obj_1.getPosition());
    //                 LayerManger.Instance.GetLayer(Layer_1).JudgePlayerObjNum(2);
    //                 this.checkSame(lastIndex, index_1);
    //             }
    //         })
    //         .start();
    // }
}
