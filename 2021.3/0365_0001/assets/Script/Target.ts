// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "./GlobalData";
import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";
import Util from "./Utils/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Target extends cc.Component {
    private _isLeft: boolean = false;
    private _isRight: boolean = false;
    private _moveSpeed: number = 300;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.init();
    }
    public init() {
        this._isLeft = GlobalData.instance.getLeft();
        this._isRight = GlobalData.instance.getRight();
        if (LayerManger.Instance.GetLayer(Layer_1).getTargetMove()) {
            if (this._isLeft === false && this._isRight === false) {
                let num = Util.randomInteger(0, 1);
                if (num === 1) {
                    this._isLeft = true;
                } else {
                    this._isRight = true;
                }
            }
            this._moveSpeed = Util.randomInteger(250, 350);
        }
    }
    update(dt) {
        if (this._isLeft) {
            this.node.x -= this._moveSpeed * dt;
        } else if (this._isRight) {
            this.node.x += this._moveSpeed * dt;
        }
    }



    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === 'arrow') {
            AudioManager.play('success');
            GlobalData.instance.setLeft(this._isLeft);
            GlobalData.instance.setRight(this._isRight);
            this._isLeft = false;
            this._isRight = false;
            other.enabled = false;
            self.enabled = false;
            other.node.stopAllActions();
            let parent = other.node.parent.parent;
            let offset = self.node.x - parent.x;
            other.node.parent = self.node.getChildByName('view');
            other.node.setPosition(-offset, -257.5);
            offset = Math.abs(offset);
            if (offset <= 39) {
                LayerManger.Instance.GetLayer(Layer_1).showLabelScore(10, self.node.getPosition());
                LayerManger.Instance.GetLayer(Layer_1).createScatterGoldFx(self.node.getPosition());
                LayerManger.Instance.GetLayer(Layer_1).scatterGold(self.node, 10);
                LayerManger.Instance.GetLayer(Layer_1).shake();
                this.selfMove(true);
            } else if (offset <= 69) {
                LayerManger.Instance.GetLayer(Layer_1).showLabelScore(9, self.node.getPosition());
                LayerManger.Instance.GetLayer(Layer_1).scatterGold(self.node, 5);
                this.selfMove(false);
            } else if (offset <= 87) {
                LayerManger.Instance.GetLayer(Layer_1).showLabelScore(8, self.node.getPosition());
                LayerManger.Instance.GetLayer(Layer_1).scatterGold(self.node, 5);
                this.selfMove(false);
            } else if (offset <= 106) {
                LayerManger.Instance.GetLayer(Layer_1).showLabelScore(7, self.node.getPosition());
                LayerManger.Instance.GetLayer(Layer_1).scatterGold(self.node, 5);
                this.selfMove(false);
            } else {
                LayerManger.Instance.GetLayer(Layer_1).showLabelScore(6, self.node.getPosition());
                LayerManger.Instance.GetLayer(Layer_1).scatterGold(self.node, 5);
                this.selfMove(false);
            }
        } else if (other.node.group === 'leftWall') {
            this.turnRightMove();
        } else if (other.node.group === 'rightWall') {
            this.turnLeftMove();
        }
    }

    /**
     * 实现靶的前后移动效果
     */
    private selfMove(isAction: boolean) {
        let isGameOver = LayerManger.Instance.GetLayer(Layer_1).getIsGameOver();
        if (isGameOver) return;
        if (isAction) {
            LayerManger.Instance.GetLayer(Layer_1).nextLevel(1);
            cc.tween(this.node)
                .by(0.1, { position: cc.v2(0, 50) })
                .by(0.1, { position: cc.v2(0, -50) })
                .call(() => {
                    LayerManger.Instance.GetLayer(Layer_1).delectArrowArrFirstElement();
                    LayerManger.Instance.GetLayer(Layer_1).delectTargetArrFirstElement();
                })
                .start();
        } else {
            LayerManger.Instance.GetLayer(Layer_1).nextLevel(0);
            LayerManger.Instance.GetLayer(Layer_1).delectArrowArrFirstElement();
        }
    }
    /**
     * 向左移动
     */
    private turnLeftMove() {
        this._isLeft = true;
        this._isRight = false;
    }
    /**
     * 向右移动
     */
    private turnRightMove() {
        this._isLeft = false;
        this._isRight = true;
    }

}
