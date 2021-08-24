import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";
import PoolManager from "./Manager/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Node)
    redPacketParent: cc.Node = null;

    @property(cc.Prefab)
    brokenFx: cc.Prefab = null;
    accel: number = 1000;

    private _hightSpeed: number = 0;
    private _isUp: boolean = false;
    private _isDown: boolean = false;
    private _collisionManager: cc.CollisionManager = cc.director.getCollisionManager();
    private _physicsManager: cc.PhysicsManager = cc.director.getPhysicsManager();

    onLoad() {
        this.openCollision();
        this.openPhysics();
    }

    start() {
    }
    update(dt) {
        if (this._isUp) {
            this._hightSpeed = this.accel * dt;
            this.node.y += this._hightSpeed;
        } else if (this._isDown) {
            this._hightSpeed = - this.accel * dt;
            this.node.y += this._hightSpeed;
        }

    }
    runUpAction() {
        this._isDown = false;
        this._isUp = true;
        this.node.angle = 0;
    }
    runDownAction() {
        this._isUp = false;
        this._isDown = true;
        this.node.angle = 180;
    }

    createBrokenFx(node: cc.Node) {
        let obj = PoolManager.instance.getNode(this.brokenFx, this.redPacketParent);
        obj.setPosition(node.getPosition());
        PoolManager.instance.putNode(node);
        let objFx: sp.Skeleton = obj.getComponent(sp.Skeleton);
        objFx.clearTracks();
        objFx.setAnimation(0, 'texiao', false);
        objFx.setCompleteListener(() => {
            PoolManager.instance.putNode(obj);
        });
        cc.tween(obj)
            .delay(0.3)
            .call(() => {
                LayerManger.Instance.GetLayer(Layer_1).scatterGold(objFx.node);
            })
            .start();
    }



    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'RedPacket') {
            AudioManager.play('gold');
            if (other.tag == 1 || other.tag == 2 || other.tag == 3 || other.tag == 4) {
                this.runDownAction();
                this.createBrokenFx(other.node);
                let tag = other.tag;
                cc.tween(this.node)
                    .delay(0.8)
                    .call(() => {
                        LayerManger.Instance.GetLayer(Layer_1).createRedPacket(tag);
                    })
                    .start();
            }
            if (other.tag == 5 || other.tag == 6 || other.tag == 7 || other.tag == 8) {
                this.runUpAction();
                this.createBrokenFx(other.node);
                let tag = other.tag;
                cc.tween(this.node)
                    .delay(0.8)
                    .call(() => {
                        LayerManger.Instance.GetLayer(Layer_1).createRedPacket(tag);
                    })
                    .start();
            }
        }
        if (other.node.group == 'Gold') {
            LayerManger.Instance.GetLayer(Layer_1).addProgressBar(0.005);
            LayerManger.Instance.GetLayer(Layer_1).createGold();
            LayerManger.Instance.GetLayer(Layer_1).delectGold(other.node);
            PoolManager.instance.putNode(other.node);
            if (this._isUp) {
                this.runDownAction();
            } else {
                this.runUpAction();
            }
        }
        if (other.node.group == 'GoldBrick') {
            LayerManger.Instance.GetLayer(Layer_1).addProgressBar(0.005);
            PoolManager.instance.putNode(other.node);
            if (other.tag == 1) {
                this.runDownAction();
            } else if (other.tag == 2) {
                this.runUpAction();
            }
        }
    }

    addProgressBar(num: number) {
        this.progressBar.progress += num;
    }

    openCollision() {
        this._collisionManager.enabled = true;
    }

    openPhysics() {
        this._physicsManager.enabled = true;
    }
    gameOver() {
        this._isUp = false;
        this._isDown = false;
    }
}
