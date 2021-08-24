// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData, { alterAngle, isNullOrUndefined } from "./GlobalData";
import Layer_1 from "./Layer_1";
import LvObjRotate from "./LvObjRotate";
import LayerManger from "./Manager/LayerManger";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LvObjMove extends cc.Component {
    @property({ type: cc.Integer, tooltip: "在数组中的index" })
    selfArrIndex: number = 0;

    @property({ type: cc.Integer, tooltip: "对应角度" })
    selfAngle: number = 0;
    //==========================================
    private _moveSpeed: number = 1000;
    private _isMove: boolean = false;
    private _originPos: cc.Vec2 = cc.v2(0, 0);
    private _selfParent: cc.Node = null;
    private _lvObjCompoundParent: cc.Node = null;
    private _lvObjOriginNode: cc.Node = null;
    private _targetEndPos: cc.Vec2 = cc.v2(0, 0);
    private _isCollision: boolean = false;
    private _selfRotate: LvObjRotate = null;
    private _targetNode: cc.Node = null;
    private _touchTargetPos: cc.Vec2 = cc.v2(0, 0);
    private _isTargetPos: boolean = false;
    private _siblingIndex: number = 0;
    // private _isCompountLvObj: boolean = false;

    onLoad() {
        this._selfParent = this.node.parent;
        this._selfRotate = this._selfParent.getComponent(LvObjRotate);
        this._lvObjCompoundParent = LayerManger.Instance.GetLayer(Layer_1).GetLvObjCompoundParent();
        this._lvObjOriginNode = LayerManger.Instance.GetLayer(Layer_1).GetLvObjOriginNode();
    }

    start() {
    }

    update(dt: number) {
        if (!this._isMove) return
        //旋转角度转化为弧度
        let angle = this._selfParent.angle * 2 / 360 * Math.PI;
        //计算基于Y轴的方向向量
        let dir = cc.v2(Math.sin(angle), Math.cos(angle));
        //方向向量进行单位化
        dir.normalizeSelf();
        //根据方向向量移动位置
        this._selfParent.x += dt * dir.x * this._moveSpeed;
        this._selfParent.y += dt * dir.y * this._moveSpeed;
        if (this.JudgeDistance()) {
            this._isTargetPos = true;
            this._isMove = false;
            this._moveSpeed = 0;
            if (this._isCollision) {
                // let targetNodeAngle: number = this._targetNode.children[0].getComponent(LvObjMove).GetSelfAngle();
                this._targetEndPos = this._selfParent.getPosition();//this._targetNode.getPosition();
                this._selfParent.parent = this._lvObjCompoundParent;
                this._selfParent.setPosition(this._targetEndPos);
                this._selfParent.setSiblingIndex(this._siblingIndex);
                let maxSiblingIndex: number = this._lvObjCompoundParent.childrenCount - 1;
                if (this._siblingIndex === 0) {
                    let rightNode: cc.Node = this._lvObjCompoundParent.children[this._siblingIndex + 1];
                    LayerManger.Instance.GetLayer(Layer_1).VerifyIsSame(this.selfArrIndex, this.selfAngle, null, this._selfParent, rightNode);
                    // LayerManger.Instance.GetLayer(Layer_1).ReviseOffset(null, rightNode, this._selfParent, this.selfAngle, this._siblingIndex, this.selfArrIndex, targetNodeAngle, this._targetNode)
                } else if (this._siblingIndex === maxSiblingIndex) {
                    let leftNode: cc.Node = this._lvObjCompoundParent.children[this._siblingIndex - 1];
                    LayerManger.Instance.GetLayer(Layer_1).VerifyIsSame(this.selfArrIndex, this.selfAngle, leftNode, this._selfParent, null);
                    // LayerManger.Instance.GetLayer(Layer_1).ReviseOffset(leftNode, null, this._selfParent, this.selfAngle, this._siblingIndex, this.selfArrIndex, targetNodeAngle, this._targetNode)
                } else {
                    let leftNode: cc.Node = this._lvObjCompoundParent.children[this._siblingIndex - 1];
                    let rightNode: cc.Node = this._lvObjCompoundParent.children[this._siblingIndex + 1];
                    LayerManger.Instance.GetLayer(Layer_1).VerifyIsSame(this.selfArrIndex, this.selfAngle, leftNode, this._selfParent, rightNode);
                    // LayerManger.Instance.GetLayer(Layer_1).ReviseOffset(leftNode, rightNode, this._selfParent, this.selfAngle, this._siblingIndex, this.selfArrIndex, targetNodeAngle, this._targetNode)
                }
            } else {
                let allChildrenNum: number = this._lvObjCompoundParent.childrenCount;
                if (allChildrenNum === 0) {
                    this.node.getComponent(cc.CircleCollider).tag = 1;
                    this._targetEndPos = this._selfParent.getPosition();
                    this._selfParent.parent = this._lvObjCompoundParent;
                    this._selfParent.setPosition(this._targetEndPos);
                    this._siblingIndex = 0;
                    this._selfParent.setSiblingIndex(0);
                    LayerManger.Instance.GetLayer(Layer_1).CreateLvObj();
                } else if (allChildrenNum === 1) {
                    let pos: cc.Vec2 = this._selfParent.getPosition();
                    let targetPos_1: cc.Vec2 = this._lvObjCompoundParent.children[0].getPosition();
                    let targetPos_2: cc.Vec2 = cc.v2(-targetPos_1.x, -targetPos_1.y);
                    let dir: boolean = this.JudgeMoveDir(pos, targetPos_1, targetPos_2);
                    this._selfRotate.RunRotate(dir, 2, 360);
                }
                else {
                    let maxIndex: number = this._lvObjCompoundParent.childrenCount - 1;
                    let firstObj: cc.Node = this._lvObjCompoundParent.children[0];
                    let lastObj: cc.Node = this._lvObjCompoundParent.children[maxIndex];
                    let firstObjDistance: number = Math.abs(this._selfParent.position.sub(this.ChangePos(this._selfParent, firstObj)).mag());
                    let lastObjDistance: number = Math.abs(this._selfParent.position.sub(this.ChangePos(this._selfParent, lastObj)).mag());
                    if (firstObjDistance < lastObjDistance) {
                        this._siblingIndex = 0;
                        let secoundNode: cc.Node = this._lvObjCompoundParent.children[1];
                        let dir: boolean = LayerManger.Instance.GetLayer(Layer_1).JudgeMoveDir(secoundNode.getPosition(), firstObj.getPosition());
                        this._selfRotate.RunRotate(dir, 2, 360);
                    } else {
                        this._siblingIndex = this._lvObjCompoundParent.childrenCount;
                        let secoundNode: cc.Node = this._lvObjCompoundParent.children[maxIndex - 1];
                        let dir: boolean = LayerManger.Instance.GetLayer(Layer_1).JudgeMoveDir(secoundNode.getPosition(), lastObj.getPosition());
                        this._selfRotate.RunRotate(dir, 2, 360);
                    }

                }
            }
        }

    }

    /**
   * 判断新生成的随机物体移动的方向
   * @param pos 目标节点的位置
   * @param targetPos_1 第一个节点的位置
   * @param targetPos_2 第一个节点的位置对称点
   * @returns true为顺时针
   */
    private JudgeMoveDir(pos: cc.Vec2, targetPos_1: cc.Vec2, targetPos_2: cc.Vec2): boolean {
        if (targetPos_1.x >= 0) {
            if (targetPos_1.y > 0) {//第一象限
                if (pos.x < targetPos_1.x && pos.y > targetPos_2.y) {
                    this._siblingIndex = 0;
                    return true;
                } else {
                    this._siblingIndex = 1;
                    return false;
                }
            } else {//第四象限
                if (pos.x > targetPos_2.x && pos.y > targetPos_1.y) {
                    this._siblingIndex = 1;
                    return true;
                } else {
                    this._siblingIndex = 0;
                    return false;
                }
            }
        } else {
            if (targetPos_1.y > 0) {//第二象限
                if (pos.x < targetPos_2.x && pos.y < targetPos_1.y) {
                    this._siblingIndex = 0;
                    return true;
                } else {
                    this._siblingIndex = 1;
                    return false;
                }
            } else {//第三象限
                if (pos.x > targetPos_1.x && pos.y < targetPos_2.y) {
                    this._siblingIndex = 1
                    return true;
                } else {
                    this._siblingIndex = 0;
                    return false;
                }
            }
        }
    }

    /**
        * 
        * @param node1 要被转换的node
        * @param node2 目标node
        * @returns 
        */
    private ChangePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }



    /**
     * 朝向函数
     * @param targetPos 目标位置 
     */
    public LookAtObject(targetPos: cc.Vec2) {
        //计算朝向
        let orientationX = targetPos.x - this._selfParent.x;
        let orientationY = targetPos.y - this._selfParent.y;
        let dir = cc.v2(orientationX, orientationY);
        //计算夹角弧度(cc.v2(0,1)表示物体基于Y轴方向)
        let angle2 = dir.signAngle(cc.v2(0, 1))
        //弧度转换成欧拉角
        let olj = angle2 / Math.PI * 180;
        // //物体朝向
        this._selfParent.angle = olj;
        this.node.angle = -olj;
        this._isMove = true;
        this._touchTargetPos = targetPos;
    }

    private JudgeDistance(): boolean {
        return this._originPos.sub(this._selfParent.getPosition()).mag() >= 307;
    }


    // private JudgeQuadrant(pos: cc.Vec2): boolean {
    //     if (pos.y >= 0) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (self.tag === 0) {
            this._isCollision = true;
            if (this._isTargetPos) {
                self.tag = 1;
                this._selfRotate.StopRotation();
                this._targetEndPos = this._selfParent.getPosition();
                this._selfParent.parent = this._lvObjCompoundParent;
                this._selfParent.setPosition(this._targetEndPos);
                this._selfParent.setSiblingIndex(this._siblingIndex);
                let maxIndex: number = this._lvObjCompoundParent.childrenCount - 1;
                if (this._siblingIndex === 0) {
                    LayerManger.Instance.GetLayer(Layer_1).VerifyIsSame(this.selfArrIndex, this.selfAngle, null, this._lvObjCompoundParent.children[this._siblingIndex], this._lvObjCompoundParent.children[this._siblingIndex + 1]);
                } else if (this._siblingIndex === maxIndex) {
                    LayerManger.Instance.GetLayer(Layer_1).VerifyIsSame(this.selfArrIndex, this.selfAngle, this._lvObjCompoundParent.children[this._siblingIndex - 1], this._lvObjCompoundParent.children[this._siblingIndex], null);
                } else {
                    console.log("到达目的地的碰撞到不是两边");
                }
            } else {
                self.tag = 1;
                let allChildrenCount: number = this._lvObjCompoundParent.childrenCount;
                let dir_1: cc.Vec2 = cc.v2(0, 0);
                let dir_2: cc.Vec2 = cc.v2(0, 0);
                if (allChildrenCount <= 1) {
                    this._targetNode = this._lvObjCompoundParent.children[0];
                    dir_1 = this._targetNode.getPosition();
                    let angle_1: number = cc.v2(dir_1.x, dir_1.y).signAngle(cc.v2(1, 0));
                    let degree_1: number = angle_1 / Math.PI * 180;
                    degree_1 = alterAngle(degree_1);//Math.abs(degree_1);
                    dir_2 = this._touchTargetPos;
                    let angle_2: number = cc.v2(dir_2.x, dir_2.y).signAngle(cc.v2(1, 0));
                    let degree_2: number = angle_2 / Math.PI * 180;
                    degree_2 = alterAngle(degree_2);//Math.abs(degree_2);
                    if (degree_1 >= degree_2) {
                        this._siblingIndex = 1;
                        // GlobalData.instance.SetOneRotateDir(false);
                        let offsetAngle: number = Math.round(degree_1 - degree_2);
                        let targetAngle: number = this._targetNode.children[0].getComponent(LvObjMove).GetSelfAngle();
                        let rotateAngle: number = (targetAngle + this.selfAngle) / 2;
                        rotateAngle -= offsetAngle;
                        rotateAngle = Math.round(rotateAngle);
                        if (rotateAngle < 1) return;
                        this._targetNode.getComponent(LvObjRotate).RunRotate(true, 2, rotateAngle);
                    } else {
                        this._siblingIndex = 0;
                        // GlobalData.instance.SetOneRotateDir(true);
                        let offsetAngle: number = Math.round(degree_2 - degree_1);
                        let targetAngle: number = this._targetNode.children[0].getComponent(LvObjMove).GetSelfAngle();
                        let rotateAngle: number = (targetAngle + this.selfAngle) / 2;
                        rotateAngle -= offsetAngle;
                        rotateAngle = Math.round(rotateAngle);
                        if (rotateAngle < 1) return;
                        this._targetNode.getComponent(LvObjRotate).RunRotate(false, 2, rotateAngle);
                    }
                } else {
                    this._targetNode = other.node.parent;
                    dir_1 = this._targetNode.getPosition();
                    let angle_1: number = cc.v2(dir_1.x, dir_1.y).signAngle(cc.v2(1, 0));
                    let degree_1: number = angle_1 / Math.PI * 180;
                    degree_1 = alterAngle(degree_1);//Math.abs(degree_1);
                    dir_2 = this._touchTargetPos;
                    let angle_2: number = cc.v2(dir_2.x, dir_2.y).signAngle(cc.v2(1, 0));
                    let degree_2: number = angle_2 / Math.PI * 180;
                    degree_2 = alterAngle(degree_2);//Math.abs(degree_2);
                    let targetIndex: number = this._targetNode.getSiblingIndex();
                    if (degree_1 >= degree_2) {
                        this._siblingIndex = targetIndex + 1;
                    } else {
                        this._siblingIndex = targetIndex;
                    }
                    if (this._siblingIndex === 0) {
                        let degree: number = cc.v2(dir_1.x, dir_1.y).signAngle(cc.v2(dir_2.x, dir_2.y));
                        let offsetAngle: number = Math.abs(degree / Math.PI * 180);
                        let targetAngle: number = this._targetNode.children[0].getComponent(LvObjMove).GetSelfAngle();
                        let rotateAngle: number = (targetAngle + this.selfAngle) / 2;
                        rotateAngle -= offsetAngle;
                        rotateAngle = Math.round(rotateAngle);
                        if (rotateAngle < 1) return;
                        for (const lvObj of this._lvObjCompoundParent.children) {
                            lvObj.getComponent(LvObjRotate).RunRotate(false, 2, rotateAngle);
                        }

                    } else if (this._siblingIndex === allChildrenCount) {
                        let degree: number = cc.v2(dir_1.x, dir_1.y).signAngle(cc.v2(dir_2.x, dir_2.y));
                        let offsetAngle: number = Math.abs(degree / Math.PI * 180);
                        let targetAngle: number = this._targetNode.children[0].getComponent(LvObjMove).GetSelfAngle();
                        let rotateAngle: number = (targetAngle + this.selfAngle) / 2;
                        rotateAngle -= offsetAngle;
                        rotateAngle = Math.round(rotateAngle);
                        if (rotateAngle < 1) return;
                        for (const lvObj of this._lvObjCompoundParent.children) {
                            lvObj.getComponent(LvObjRotate).RunRotate(true, 2, rotateAngle);
                        }
                    } else {
                        let leftNode: cc.Node = this._lvObjCompoundParent.children[this._siblingIndex - 1];
                        let dir_3: cc.Vec2 = leftNode.getPosition();
                        let degree_1: number = cc.v2(dir_1.x, dir_1.y).signAngle(cc.v2(dir_2.x, dir_2.y));
                        let offsetAngle_1: number = Math.abs(degree_1 / Math.PI * 180);
                        let targetAngle_1: number = this._targetNode.children[0].getComponent(LvObjMove).GetSelfAngle();
                        let rotateAngle_1: number = (targetAngle_1 + this.selfAngle) / 2;
                        rotateAngle_1 -= offsetAngle_1;
                        rotateAngle_1 = Math.round(rotateAngle_1);
                        if (rotateAngle_1 >= 1) {
                            for (let i = this._siblingIndex; i < allChildrenCount; i++) {
                                let rotate: LvObjRotate = this._lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                                rotate.RunRotate(false, 2, rotateAngle_1);
                            }
                        }
                        let degree_2: number = cc.v2(dir_3.x, dir_3.y).signAngle(cc.v2(dir_2.x, dir_2.y));
                        let offsetAngle_2: number = Math.abs(degree_2 / Math.PI * 180);
                        let targetAngle_2: number = leftNode.children[0].getComponent(LvObjMove).GetSelfAngle();
                        let rotateAngle_2: number = (targetAngle_2 + this.selfAngle) / 2;
                        rotateAngle_2 -= offsetAngle_2;
                        rotateAngle_2 = Math.round(rotateAngle_2);
                        if (rotateAngle_2 < 1) return;
                        for (let i = 0; i < this._siblingIndex; i++) {
                            let rotate: LvObjRotate = this._lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                            rotate.RunRotate(true, 2, rotateAngle_2);
                        }

                    }
                }
            }
        } else if (self.tag === 1 && other.tag === 1) {
            let maxNodeIndex: number = this._lvObjCompoundParent.childrenCount - 1;
            if (maxNodeIndex < 5) return;
            let selfIndex: number = self.node.parent.getSiblingIndex();
            let otherIndex: number = other.node.parent.getSiblingIndex();
            // console.log("selfIndex:", selfIndex, ",    otherIndex:", otherIndex, ",    maxNodeIndex:", maxNodeIndex);
            if ((selfIndex === 0 && otherIndex === maxNodeIndex) || selfIndex === maxNodeIndex && otherIndex === 0) {
                LayerManger.Instance.GetLayer(Layer_1).GameOver();
            }
        }
    }

    /**
     * 是否到达轨道上
     * @param value  true为到达了
     */
    public SetIsTargetPos(value: boolean) {
        this._isTargetPos = value;
    }

    public SetSiblingIndex(value: number) {
        this._siblingIndex = value;
    }

    public GetSelfArrIndex(): number {
        return this.selfArrIndex;
    }

    /**
     * 
     * 获取对应角度
     */
    public GetSelfAngle(): number {
        return this.selfAngle;
    }
}

