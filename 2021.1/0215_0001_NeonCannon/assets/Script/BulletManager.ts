import PoolManager from "./Manager/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletManager extends cc.Component {

    @property(cc.Node)
    bullet: cc.Node = null;

    rotateSpeed: number = 0;

    speed: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.rotateSpeed = 300;
        this.speed = 800;
    }

    update(dt) {
        this.bullet.angle -= this.rotateSpeed * dt;
        this.node.y += this.speed * dt;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'wall') {
            PoolManager.instance.putNode(this.node);
        }
    }
}
