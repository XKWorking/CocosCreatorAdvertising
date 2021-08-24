// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "./GlobalData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    @property(cc.Boolean)
    isLeft: boolean = false;

    private _otherNode: cc.Node = null;
    private _moveSpeed: number = 500;

    private _angle: number = 0;
    private _dir: cc.Vec2 = cc.v2(0, 0);

    start() {
        this.lookAtObject()
    }

    update(dt: number) {
        //旋转角度转化为弧度
        this._angle = this.node.rotation * 2 / 360 * Math.PI;
        //计算基于Y轴的方向向量
        this._dir = cc.v2(Math.sin(this._angle), Math.cos(this._angle));
        //方向向量进行单位化
        this._dir.normalizeSelf();
        //根据方向向量移动位置
        this.node.x += dt * this._dir.x * this._moveSpeed;
        this.node.y += dt * this._dir.y * this._moveSpeed;
        if (this._otherNode == null) {
            this.delectObj();
            return;
        }
        this.lookAtObject();
    }
    //朝向函数
    public lookAtObject() {
        //计算朝向
        if (this.isLeft) {
            this._otherNode = GlobalData.instance.getLeftZombie();
        } else {
            this._otherNode = GlobalData.instance.getRightZombie();
        }
        if (this._otherNode == null) return;

        let pos = this.changePos(this.node, this._otherNode);
        let orientationX = pos.x - this.node.x;
        let orientationY = pos.y - this.node.y;
        let dir = cc.v2(orientationX, orientationY);
        //计算夹角弧度(cc.v2(0,1)表示物体基于Y轴方向)
        let angle2 = dir.signAngle(cc.v2(0, 1))
        //弧度转换成欧拉角
        let olj = angle2 / Math.PI * 180;

        //物体朝向
        this.node.rotation = olj;

    }

    changePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }
    private delectObj() {
        cc.tween(this.node)
            .delay(3)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
