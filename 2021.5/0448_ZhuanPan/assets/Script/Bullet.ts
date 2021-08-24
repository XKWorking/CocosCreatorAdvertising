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
export default class Bullet extends cc.Component {
    private _moveSpeed: number = 800;
    private _isMove: boolean = false;
    private _accumulatedValue: number = 0;
    private _beginAngle: number = 0;

    update(dt: number) {
        if (!this._isMove) return
        //旋转角度转化为弧度
        let angle = this.node.angle * 2 / 360 * Math.PI;
        //计算基于Y轴的方向向量
        let dir = cc.v2(Math.sin(angle), Math.cos(angle));
        //方向向量进行单位化
        dir.normalizeSelf();
        //根据方向向量移动位置
        this.node.x += dt * dir.x * this._moveSpeed;
        this.node.y += dt * dir.y * this._moveSpeed;
        this._accumulatedValue = Math.sqrt(Math.pow(this.node.x, 2) + Math.pow(this.node.y, 2));
        if (this._accumulatedValue >= 350) {
            LayerManger.Instance.GetLayer(Layer_1).JudgeScore(this._beginAngle);
            this.node.destroy();
        }
    }




    /**
     * 朝向函数
     * @param targetPos 目标角度
     */
    public LookAtObject(targetAngle: number) {
        // //计算朝向
        // let orientationX = targetPos.x - this.node.x;
        // let orientationY = targetPos.y - this.node.y;
        // let dir = cc.v2(orientationX, orientationY);
        // //计算夹角弧度(cc.v2(0,1)表示物体基于Y轴方向)
        // let angle2 = dir.signAngle(cc.v2(0, 1))
        // //弧度转换成欧拉角
        // let olj = angle2 / Math.PI * 180;
        // //物体朝向
        // this.node.angle = olj;
        // console.log("51targetPos:", targetPos);
        this.node.angle = -targetAngle;
        this.node.children[0].angle = 2 * targetAngle;
        this._isMove = true;
        this._beginAngle = targetAngle;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === "barrier") {
            AudioManager.play("wrong");
            self.node.opacity = 0;
            this.node.destroy();
        }
    }

}
