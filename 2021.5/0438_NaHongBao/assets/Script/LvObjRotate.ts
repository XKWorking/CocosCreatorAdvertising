// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";


export enum Axis {
    PositiveX, // 正 X 轴
    PositiveY, // 正 Y 轴
    NegativeX, // 负 X 轴
    NegativeY, // 负 Y 轴
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class LvObjRotate extends cc.Component {

    @property({ tooltip: '是否始终面向目标节点' })
    public faceToTarget: boolean = false;

    @property({
        type: cc.Enum(Axis),
        tooltip: '面向目标节点的轴：\n- PositiveX：正 X 轴\n- PositiveY：正 Y 轴\n- NegativeX：负 X 轴\n- NegativeY：负 Y 轴',
        visible() { return this.faceToTarget }
    })


    // @property({ type: cc.Node, tooltip: '围绕旋转的目标' })
    /**
     * 围绕旋转的目标
     */
    private target: cc.Node = null;

    private faceAxis: Axis = Axis.NegativeY;

    private angle: number = 0; // 角度

    private radius: number = 0; // 半径

    private isRotating: boolean = false; // 标志位，是否正在旋转

    private _isClockWise: boolean = true;//是否是顺时针旋转

    private _timePerRound: number = 0;//旋转一圈的时间

    private _targetAngle: number = 0;//旋转角度
    private _tempAngle: number = 0;//累加角度
    private _offsetAngle: number = 0;//误差角度
    private _isStopRotate: boolean = false;

    onLoad(){
        this.target = LayerManger.Instance.GetLayer(Layer_1).GetLvObjOriginNode();
    }

    start() {
    }

    update(dt) {
        if (!this.isRotating || !this.target) return;
        // 将角度转换为弧度
        let radian = Math.PI / 180 * this.angle;
        // 更新节点的位置
        this.node.x = this.target.x + this.radius * Math.cos(radian);
        this.node.y = this.target.y + this.radius * Math.sin(radian);
        // 更新节点的角度
        if (this.faceToTarget) {
            switch (this.faceAxis) {
                case Axis.PositiveX:
                    this.node.angle = this.angle + 180;
                    break;
                case Axis.PositiveY:
                    this.node.angle = this.angle + 90;
                    break;
                case Axis.NegativeX:
                    this.node.angle = this.angle;
                    break;
                case Axis.NegativeY:
                    this.node.angle = this.angle - 90;
                    break;
            }
        }
        if (this._isStopRotate) {
            this.StopRotation();
            return;
        }
        // 计算下一帧的角度
        let anglePerFrame = dt * (360 / this._timePerRound);
        this._tempAngle += anglePerFrame;
        if (this._tempAngle >= this._targetAngle) {
            this._offsetAngle = this._targetAngle + anglePerFrame - this._tempAngle;
            if (this._isClockWise) {
                this.angle -= this._offsetAngle;
            }
            else {
                this.angle += this._offsetAngle;
            }
            this._isStopRotate = true;
        } else {
            if (this._isClockWise) {
                this.angle -= anglePerFrame;
            }
            else {
                this.angle += anglePerFrame;
            }
            // 重置角度，避免数值过大
            if (this.angle >= 360) {
                this.angle %= 360;
            }
            else if (this.angle <= -360) {
                this.angle %= -360;
            }
        }
    }


    /**
 * 开始围绕目标节点旋转
 * @param isClockWise true为顺时针旋转
 * @param timePerRound 旋转一圈的时间
 * @param targetAngle 目标角度，到达就停止旋转
 * @param faceToTarget 是否始终面向目标节点
 * @param faceAxis 面向目标节点的轴
 */
    public RunRotate( isClockWise: boolean, timePerRound: number, targetAngle: number, faceToTarget?: boolean, faceAxis?: Axis) {
        this._isClockWise = isClockWise;
        this._timePerRound = timePerRound;
        this._targetAngle = targetAngle;
        if (faceToTarget) this.faceToTarget = faceToTarget;
        if (faceAxis) this.faceAxis = faceAxis;
        if (!this.target) {
            cc.log('No target!');
            return;
        }
        // 计算初始角度和半径
        this.angle = this.GetAngle(this.target.getPosition(), this.node.getPosition());
        this.radius = 307;//this.GetDistance(this.target.getPosition(), this.node.getPosition());
        // 开始
        this.isRotating = true;
    }

    // /**
    //  * 获取两点间的角度
    //  * @param p1 点1
    //  * @param p2 点2
    //  */
    // private GetAngle(p1: cc.Vec2, p2: cc.Vec2): number {
    //     return Math.atan(p2.y - p1.y / p2.x - p1.x);
    // }

    /**
       * 获取两点间的角度
       * @param p1 点1
       * @param p2 点2
       */
    GetAngle(p1: cc.Vec2, p2: cc.Vec2): number {
        //计算出朝向
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        var dir = cc.v2(dx, dy);

        //根据朝向计算出夹角弧度
        var angle = dir.signAngle(cc.v2(1, 0));

        //将弧度转换为欧拉角
        var degree = angle / Math.PI * 180;

        return -degree
    }



    /**
     * 获取两点间的距离
     * @param p1 点1
     * @param p2 点2
     */
    private GetDistance(p1: cc.Vec2, p2: cc.Vec2): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    /**
     * 停止旋转
     */
    public StopRotation() {
        this.isRotating = false;
        this._tempAngle = 0;
        this._isStopRotate = false;
    }
}
