// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Layer_1 from "./Layer_1";
import LayerManger from "./Manager/LayerManger";
import Util from "./Utils/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ObjMove extends cc.Component {
    @property(cc.Node)
    upNode: cc.Node = null;

    @property(cc.Node)
    downNode: cc.Node = null;

    private _moveSpeed: number = 600;
    private _initAngle: number = 360;
    private _upNodeEndPos: cc.Vec3 = cc.v3(0, 0);
    private _downNodeEndPos: cc.Vec3 = cc.v3(0, 0);
    private _arr_ObjPartEndPos: cc.Node[] = [];
    private _arrIndex: number = 10;
    private _isGameStart: boolean = true;
    private _arr_MoveSpeed: number[] = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._arr_ObjPartEndPos = LayerManger.Instance.GetLayer(Layer_1).GetArrObjPartEndPos();
        this._initAngle = Util.randomInteger(0, 1);
        if (this._initAngle === 0) {
            this._initAngle = 360;
        } else {
            this._initAngle = -360;
        }
        if (!this._isGameStart) return;
        this._arr_MoveSpeed.push(300);
        this._arr_MoveSpeed.push(500);
        this._arr_MoveSpeed.push(700);
        this._moveSpeed = Util.randomArray(this._arr_MoveSpeed);
    }

    start() {
        if (!this._isGameStart) return;
        cc.tween(this.node)
            .by(6, { angle: this._initAngle })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    update(dt) {
        this.node.y += dt * this._moveSpeed;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === 'knife') {
            this.node.stopAllActions();
            this.SetMoveSpeed(0);
            self.enabled = false;
            LayerManger.Instance.GetLayer(Layer_1).ShowKnifeEffect();
            LayerManger.Instance.GetLayer(Layer_1).ScatterGold(this.node);
            LayerManger.Instance.GetLayer(Layer_1).ShowCircleEffect();
            this.AssignmentEndPos(this.upNode, this._upNodeEndPos, this._initAngle);
            this.AssignmentEndPos(this.downNode, this._downNodeEndPos, -this._initAngle);
        }
    }

    /**
     * 赋值结束地点
     */
    private AssignmentEndPos(endPosNode: cc.Node, endPos: cc.Vec3, angle: number) {
        let length: number = this._arr_ObjPartEndPos.length - 1;
        let index: number = this.GetIndex(length);
        endPos = LayerManger.Instance.GetLayer(Layer_1).ChangePos(endPosNode, this._arr_ObjPartEndPos[index]);
        this.RotateEffect(endPosNode, 2, angle);
        this.ShowDeathEffect(endPosNode.parent, endPos);
    }

    /**
     * 判断索引值是否重复
     * @param length 数组长度-1
     */
    private GetIndex(length: number): number {
        let index: number = Util.randomInteger(0, length);
        while (index === this._arrIndex) {
            this.GetIndex(length);
        }
        this._arrIndex = index;
        return index;
    }

    /**
     * 旋转效果
     */
    private RotateEffect(node: cc.Node, time: number, endAngle: number) {
        cc.tween(node)
            .by(time, { angle: endAngle })
            .union()
            .repeatForever()
            .start();
    }
    /**
     * 显示死亡特效
     */
    private ShowDeathEffect(node: cc.Node, pos: cc.Vec3) {
        let t = cc.tween;
        t(node)
            .parallel(
                t().by(2, { position: pos }),
                t().to(1, { opacity: 0 }, { easing: 'fade' })
            )
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    public SetIsGameStart(value: boolean) {
        this._isGameStart = value;
    }

    public SetMoveSpeed(value: number) {
        this._moveSpeed = value;
    }
}
