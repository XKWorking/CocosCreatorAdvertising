// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "./GlobalData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestTube_2 extends cc.Component {
    @property(cc.Node)
    bubbleLight: cc.Node = null;

    @property(cc.Prefab)
    pre_Bubble: cc.Prefab = null;

    @property(cc.Node)
    generateBubblePosition: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    start() {
        this.InitGame();
    }

    // update (dt) {}

    InitGame() {

    }

    onTouchStart(e: cc.Event.EventTouch) {
        GlobalData.instance.SetCurrentTestTube(this.node);
        this.CreateLeftBubble();
        this.bubbleLight.active = true;
    }

    private CreateLeftBubble() {
        let obj = cc.instantiate(this.pre_Bubble);
        obj.setParent(this.generateBubblePosition);
        obj.setPosition(cc.v2(-20, 0))
        let t = cc.tween;
        t(obj)
            .parallel(
                t().to(1.5, { scale: 2 }),
                t().to(1.5, { opacity: 0 }, { easing: 'fade' }),
                t().to(1.5, { position: cc.v3(-20, 200) })
            )
            .call(() => {
                obj.destroy();
            })
            .start();
        t(obj)
            .delay(0.5)
            .call(() => {
                this.CreateRightBubble();
            })
            .start()
    }
    private CreateRightBubble() {
        let obj = cc.instantiate(this.pre_Bubble);
        obj.setParent(this.generateBubblePosition);
        obj.setPosition(cc.v2(20, 0))
        let t = cc.tween;
        t(obj)
            .parallel(
                t().to(1.5, { scale: 2 }),
                t().to(1.5, { opacity: 0 }, { easing: 'fade' }),
                t().to(1.5, { position: cc.v3(20, 200) })
            )
            .call(() => {
                obj.destroy();
            })
            .start();
        t(obj)
            .delay(0.5)
            .call(() => {
                this.CreateLeftBubble();
            })
            .start()
    }
}
