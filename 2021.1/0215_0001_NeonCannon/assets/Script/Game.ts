import PoolManager from "./Manager/PoolManager";
import CpSDK from "./SDK/CpSDK";
import LayerManger from "./Manager/LayerManger";
import Layer2 from "./Layer2";
import AudioManager from "./Manager/AudioManager";
import { GetViewH, GetViewW } from "./Config/SystemConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    guide: cc.Node = null;

    @property(cc.Node)
    plane: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property
    timeNum: number = 15;//    倒计时的时间为15秒

    @property(cc.Node)
    Layer2: cc.Node = null;

    @property(cc.Prefab)
    redPackeds: cc.Prefab[] = [];

    @property(cc.Node)
    redPackedNode: cc.Node = null;

    @property(cc.Node)
    bullets: cc.Node = null;

    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    private temp: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.startClick, this);

        cc.macro.ENABLE_MULTI_TOUCH = false;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true; // 开启碰撞
        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.resizeBg();
        });
        this.resizeBg();
    }

    start() {
        this.time.string = '15s';
        this.timeNum = 15;
        this.Layer2.active = false;
    }

    update(dt) {
        if (this.timeNum <= 0) {
            this.unschedule(this.createBullet);
            this.unschedule(this.createRedPacked);
            this.unschedule(this.runTime);
            this.redPackedNode.active = false;
            // this.Layer2.active = true;
            if (this.temp) return;


            this.temp = true;
            LayerManger.Instance.GetLayer(Layer2).OpenForTween();
            AudioManager.play('goldClip');
        }
    }

    startClick() {
        CpSDK.FirstTouch();
        this.timeInit();
        this.schedule(this.createBullet, 0.3);
        this.schedule(this.createRedPacked, 0.8);
        this.guide.active = false;
        this.offClick();
    }

    offClick() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.startClick, this);
    }
    timeInit() {
        if (this.timeNum >= 0) {
            this.schedule(this.runTime, 1);
        }
    }

    runTime() {
        if (this.timeNum >= 1) {
            this.timeNum = this.timeNum - 1;
            this.time.string = this.timeNum.toString() + 's';
        }
    }

    createBullet() {
        var newbullet = PoolManager.instance.getNode(this.bullet, this.bullets);
        newbullet.setPosition(cc.v2(this.plane.position.x, 0));
    }
    createRedPacked() {
        let num: number = this.random(0, 3);
        var newGold = cc.instantiate(this.redPackeds[num]);
        this.redPackedNode.addChild(newGold);
        newGold.x = this.random(-250, 250);
    }

    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    resizeBg() {
        this.node.scale = 1;
        this.node.width = 1200;
        this.node.height = GetViewH();
    }
}