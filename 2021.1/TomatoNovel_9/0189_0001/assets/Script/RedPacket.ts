import AudioManager from "./Manager/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedPacket extends cc.Component {

    @property(cc.Node)
    redPacketTop: cc.Node = null;

    @property(cc.Node)
    redPacketMid: cc.Node = null;

    @property(cc.Node)
    gold: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Prefab)
    goldFx: cc.Prefab = null;

    private pos: cc.Vec2 = cc.v2(0, 0);

    onLoad() {
        this.node.scale = 0;
        this.showRedPacket();
    }

    protected start() {
    }

    showRedPacket() {
        cc.tween(this.node)
            .to(0.6, { scale: 1 })
            .call(() => {
                this.showFinger();
                this.closeRedPacketMid();
                this.showRedPacketTop();
            })
            .start();
    }

    showFinger() {
        cc.tween(this.finger)
            .by(0.6, { position: cc.v2(0, 260) })
            .start();
    }

    closeRedPacketMid() {
        cc.tween(this.redPacketMid)
            .to(0.6, { opacity: 0 })
            .start();
    }
    showRedPacketTop() {
        cc.tween(this.redPacketTop)
            .to(0.6, { opacity: 120 })
            .call(() => {
                this.showGold();
                this.showGoldFx();
            })
            .start();
    }

    showGold() {
        cc.tween(this.gold)
            .to(0.6, { opacity: 255 })
            .delay(0.5)
            .call(() => {
                this.closeRedPacket();
            })
            .start();
    }

    showGoldFx() {
        AudioManager.play('scatterGold');
        let obj = cc.instantiate(this.goldFx);
        this.gold.addChild(obj);
        obj.setPosition(this.pos);
    }

    closeRedPacket() {
        cc.tween(this.node)
            .to(0.8, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
