import GlobalData from "./GlobalData";
import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";
import PoolManager from "./Manager/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Gold3 extends cc.Component {

    speed: number = 0;

    @property(cc.Label)
    goldTitle: cc.Label = null;

    @property
    goldNum: number = 29;

    @property(cc.Prefab)
    jinbi: cc.Prefab = null;


    isCreate: boolean = false;

    hp: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.hp = 3;
        this.speed = 350;
        this.goldNum = 29;
        this.goldTitle.string = 'R' + this.goldNum;
        this.isCreate = true;

    }

    update(dt) {
        this.goldTitle.string = 'R' + this.goldNum;
        this.node.y -= this.speed * dt;
        if (this.hp <= 0) {
            this.goldNum = 0;
            GlobalData.instance.reduceGoldNum(10);
            this.createJinBi();
            this.node.destroy();
        }
    }

    createJinBi() {
        if (this.isCreate) {
            LayerManger.Instance.GetLayer(Layer_1).scatterGold(this.node);
            this.isCreate = false;
        }
    }


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'Bullet') {
            this.hp--;
            this.goldNum -= 10;
            GlobalData.instance.addGoldNum(100);
            PoolManager.instance.putNode(other.node);
            // let node = other.node;
            // node.destroy();
        }
    }
}
