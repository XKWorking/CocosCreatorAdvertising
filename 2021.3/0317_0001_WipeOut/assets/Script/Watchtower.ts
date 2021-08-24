// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "./GlobalData";
import Layer_1 from "./Layer_1";
import Layer_2 from "./Layer_2";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Watchtower extends cc.Component {

    @property(cc.Prefab)
    leftBullet: cc.Prefab = null;

    @property(cc.Prefab)
    rightBullet: cc.Prefab = null;

    @property(cc.Node)
    muzzlePos_1: cc.Node = null;

    @property(cc.Node)
    muzzlePos_2: cc.Node = null;

    private _time: number = 0;

    private _isLuanch: boolean = false;

    onLoad() {
    }

    start() {
    }

    update(dt) {
        if (!this._isLuanch) return;
        if (GlobalData.instance.getLaunchBullet()) {
            this._time += dt;
            if (this._time >= 0.8) {
                this.createBullet_1();
                this.createBullet_2();
                this._time = 0;
            }
        }
    }

    createBullet_1() {
        if (GlobalData.instance.getLeftZombie() == null && GlobalData.instance.getRightZombie() == null) {
            if (GlobalData.instance.getOpenLayer()) return;
            GlobalData.instance.setOpenLayer(true);
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            return;
        }
        let obj = cc.instantiate(this.leftBullet);
        obj.setParent(this.muzzlePos_1);
        obj.setPosition(cc.v2(0, 0));
    }
    createBullet_2() {
        if (GlobalData.instance.getLeftZombie() == null && GlobalData.instance.getRightZombie() == null) {
            if (GlobalData.instance.getOpenLayer()) return;
            GlobalData.instance.setOpenLayer(true);
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            return;
        }
        let obj = cc.instantiate(this.rightBullet);
        obj.setParent(this.muzzlePos_2);
        obj.setPosition(cc.v2(0, 0));
    }



    showNode(node: cc.Node) {
        node.active = true;
    }
    hideNode(node: cc.Node) {
        node.active = false;
    }
    changePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }

    public getIsLaunch() {
        return this._isLuanch;
    }
    public setIsLaunch(value: boolean) {
        this._isLuanch = value;
    }
}
