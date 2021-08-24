// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CpSDK from "./CpTool/SDK/CpSDK";
import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FictionScrollView extends cc.Component {
    @property(cc.Node)
    moveFiction: cc.Node = null;

    @property(cc.Node)
    againReadBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    fictionGuidFinger: cc.Node = null;

    //================================================================
    private _isMoveFiction: boolean = false;
    private _moveSpeed: number = 100;
    private _isClick: boolean = true;
    private _spotHeight_1: number = 0;
    private _spotHeight_2: number = 0;
    private _isFirst: boolean = true;

    onLoad() {
    }

    start() {
        this._spotHeight_1 = Math.floor(this.moveFiction.y) + 1350;
        this._spotHeight_2 = this._spotHeight_1 + 2700;
    }

    update(dt) {
        if (this._isMoveFiction) {
            this.moveFiction.y += dt * this._moveSpeed;
            if (this.moveFiction.y >= this._spotHeight_1) {
                this._isClick = false;
                this._isMoveFiction = false;
                if (this._isFirst) {
                    this._isFirst = false;
                    this._spotHeight_1 = this._spotHeight_2;
                    LayerManger.Instance.GetLayer(Layer_1).ShowNode(this.againReadBtn, true);
                } else {
                    LayerManger.Instance.GetLayer(Layer_1).GameOver();
                }
            }
        }

    }

    private onTouchStart(e: cc.Event.EventTouch) {
        if (!this._isClick) return;
        this._isMoveFiction = false;
    }

    private onTouchMove(e: cc.Event.EventTouch) {
        if (!this._isClick) return;
    }


    private onTouchEnd(e: cc.Event.EventTouch) {
        if (!this._isClick) return;
        this._isMoveFiction = true;
    }

    private onTouchCancel(e: cc.Event.EventTouch) {
        if (!this._isClick) return;
        this._isMoveFiction = true;
    }


    public StartMove() {
        CpSDK.EnterSection(2, "阅读小说界面");
        this._isMoveFiction = true;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.scrollView.enabled = true;
        this.fictionGuidFinger.active = true;
        let t = cc.tween;
        t(this.fictionGuidFinger)
            .parallel(
                t().by(0.8, { position: cc.v3(0, 200) }),
                t().to(0.8, { scale: 0.8 })
            )
            .parallel(
                t().by(0.3, { position: cc.v3(0, -200) }),
                t().to(0.3, { scale: 1 })
            )
            .delay(0.3)
            .union()
            .repeatForever()
            .start();
    }


    public ClickAgainReadButton() {
        AudioManager.play("button",0.8);
        this._isMoveFiction = true;
        this._isClick = true;
        this.againReadBtn.active = false;
    }

    public CloseGuidFinger() {
        if (!this.fictionGuidFinger.activeInHierarchy) return;
        this.fictionGuidFinger.stopAllActions();
        this.fictionGuidFinger.active = false;
    }
}
