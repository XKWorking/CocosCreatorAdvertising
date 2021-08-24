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
export default class FictionScrollView extends cc.Component {
    @property(cc.Node)
    moveFiction: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    bookGuidFinger: cc.Node = null;

    @property(cc.Label)
    label_Time: cc.Label = null;

    //================================================================
    private _isMoveFiction: boolean = false;
    private _moveSpeed: number = 100;
    private _isClick: boolean = true;
    private _spotHeight: number = 0;
    private _countDownTime: number = 10;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
        this._spotHeight = Math.floor(this.moveFiction.y) + 3050;
    }

    update(dt) {
        if (this._isMoveFiction) {
            this.moveFiction.y += dt * this._moveSpeed;
            if (this.moveFiction.y >= this._spotHeight) {
                this._isClick = false;
                this._isMoveFiction = false;
                this.unschedule(this.CountDown);
                LayerManger.Instance.GetLayer(Layer_1).GameOver();
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
        this._isMoveFiction = true;
        this.scrollView.enabled = true;
        let t = cc.tween;
        t(this.bookGuidFinger)
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
        this.schedule(this.CountDown, 1);
    }

    public CloseGuidFinger(e) {
        if (!this.bookGuidFinger.activeInHierarchy) return;
        this.bookGuidFinger.stopAllActions();
        this.bookGuidFinger.active = false;
    }



    /**
    * 倒计时
    */
    private CountDown() {
        this._countDownTime -= 1;
        this.label_Time.string = this._countDownTime + 's';
        if (this._countDownTime <= 0) {
            this.unschedule(this.CountDown);
            this._isClick = false;
            this._isMoveFiction = false;
            LayerManger.Instance.GetLayer(Layer_1).GameOver();
        }
    }
}
