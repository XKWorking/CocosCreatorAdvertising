// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import BaseLayer from "./Base/BaseLayer";
import Util from "./Utils/Util";
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import LvObjMove from "./LvObjMove";
import PoolManager from "./Manager/PoolManager";
import LvObjRotate from "./LvObjRotate";
import GlobalData from "./GlobalData";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    gameProgressView: cc.Node = null;

    @property(cc.Node)
    guid_Finger: cc.Node = null;

    @property(cc.Node)
    lvObjEffect: cc.Node = null;

    @property(cc.Node)
    lvObjParent: cc.Node = null;

    @property(cc.Node)
    lvObjOriginNode: cc.Node = null;

    @property(cc.Node)
    lvObjCompoundParent: cc.Node = null;

    @property(cc.Prefab)
    pre_LvObjLight: cc.Prefab = null;

    @property(cc.Prefab)
    pre_CompoundEffect: cc.Prefab = null;

    @property(cc.Node)
    goldEndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    @property(cc.Node)
    startShade: cc.Node = null;

    @property([cc.Prefab])
    arr_LvObjs: cc.Prefab[] = [];
    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _currentLvObj: cc.Node = null;
    private _compoundNum: number = 0;
    private _isCreateLvObj: boolean = false;
    private _isRandomObj: boolean = false;


    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.InitGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");
    }

    update(dt: number) {
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
        if (this._isGameOver) return;
        if (!this._isCreateLvObj) return;
        let pos: cc.Vec2 = this._currentLvObj.parent.convertToNodeSpaceAR(e.getLocation());
        this._currentLvObj.children[0].getComponent(LvObjMove).LookAtObject(pos);
        this._isCreateLvObj = false;
        this._isRandomObj = true;
    }


    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        this._currentLvObj = this.lvObjParent.children[1];
        this._isCreateLvObj = true;
    }

    /**
     * 游戏结束
     */
    public GameOver() {
        if (this._isGameOver) return;
        this._isGameStart = false;
        this._isGameOver = true;
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }

    /**
     * 创建物体
     */
    public CreateLvObj() {
        if (this._isGameOver) return;
        if (this.lvObjParent.childrenCount >= 2) return;
        let index: number = Util.randomInteger(0, 3);// 0;// 
        if (index >= 2) {
            index = 2;
        }
        let obj = cc.instantiate(this.arr_LvObjs[index]);
        obj.setParent(this.lvObjParent);
        obj.setPosition(cc.v2(0, 0));
        this._currentLvObj = obj;
        this.ModificationOffset(0);
    }

    public ModificationOffset(beginIndex: number) {
        if (this.lvObjCompoundParent.childrenCount <= 1) {
            this._isCreateLvObj = true;
            return;
        }
        let dir_1: cc.Vec2 = cc.v2(0, 0);
        let dir_2: cc.Vec2 = cc.v2(0, 0);
        let angle: number = 0;
        let degree: number = 0;
        let targetAngle: number = 0;
        let offsetAngle: number = 0;
        let isEdit: boolean = false;
        for (let i: number = beginIndex; i < this.lvObjCompoundParent.childrenCount - 1; i++) {
            let leftObj: cc.Node = this.lvObjCompoundParent.children[i];
            let leftAngle: number = leftObj.children[0].getComponent(LvObjMove).GetSelfAngle();
            let rightObj: cc.Node = this.lvObjCompoundParent.children[i + 1];
            let rightAngle: number = rightObj.children[0].getComponent(LvObjMove).GetSelfAngle();
            dir_1.x = leftObj.x;
            dir_1.y = leftObj.y;
            dir_2.x = rightObj.x;
            dir_2.y = rightObj.y;
            angle = dir_1.signAngle(dir_2);
            degree = angle / Math.PI * 180;
            degree = Math.abs(degree);
            targetAngle = (leftAngle + rightAngle) / 2;
            if (targetAngle >= degree) {
                offsetAngle = targetAngle - degree;
                if (offsetAngle < 1) {
                    continue;
                } else {
                    let dir: boolean = false;
                    dir = this.JudgeMoveDir(leftObj.getPosition(), rightObj.getPosition());
                    isEdit = true;
                    beginIndex = i;
                    this.ModificationOffsetMove(i, dir, offsetAngle, isEdit);
                    break;
                }
            } else {
                offsetAngle = degree - targetAngle;
                if (offsetAngle < 1) {
                    continue;
                } else {
                    let dir: boolean = false;
                    dir = this.JudgeMoveDir(rightObj.getPosition(), leftObj.getPosition());
                    isEdit = true;
                    beginIndex = i;
                    this.ModificationOffsetMove(i, dir, offsetAngle, isEdit);
                    break;
                }
            }
        }
        cc.tween(this.node)
            .delay(0.4)
            .call(() => {
                if (!isEdit) {
                    this._isCreateLvObj = true;
                }
            })
            .start();

    }

    private ModificationOffsetMove(index: number, dir: boolean, offsetAngle: number, isEdit: boolean) {
        for (let i: number = 0; i <= index; i++) {
            let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
            rotate.RunRotate(dir, 1, offsetAngle);
        }
        cc.tween(this.node)
            .delay(0.2)
            .call(() => {
                if (isEdit) {
                    this.ModificationOffset(index);
                }
            })
            .start();
    }

    /**
     * 校验挨着的两个物体是否相同
     * @param index 相同物体在数组中的index
     * @param sameAngle 相同物体对应的角度
     * @param leftNode 左边的节点
     * @param midNode 中间的节点
     * @param rightNode 右边的节点
     */
    public VerifyIsSame(index: number, sameAngle: number, leftNode: cc.Node, midNode: cc.Node, rightNode: cc.Node) {
        // return;
        if (this._isGameOver) return;
        let isCreateNewLvObj: boolean = true;
        let rotateAngle: number = sameAngle;
        if (leftNode === null) {
            if (midNode.name === rightNode.name) {
                this.CompountMove(index, sameAngle, rotateAngle, midNode, rightNode, true, 0);
                isCreateNewLvObj = false;
                this._isRandomObj = false;
            }
        } else if (rightNode === null) {
            if (leftNode.name === midNode.name) {
                this.CompountMove(index, sameAngle, rotateAngle, leftNode, midNode, true, 1);
                isCreateNewLvObj = false;
                this._isRandomObj = false;
            }
        } else if (midNode === null) {
            if (leftNode.name === rightNode.name) {
                rotateAngle = sameAngle / 2;
                this.CompountMove(index, sameAngle, rotateAngle, leftNode, rightNode, true, 3);
                isCreateNewLvObj = false;
                this._isRandomObj = false;
            }
        } else {
            if (leftNode.name === midNode.name) {
                if (midNode.name === rightNode.name) {
                    this.CompountMove(index, sameAngle, rotateAngle, leftNode, rightNode, false, 2);
                    isCreateNewLvObj = false;
                    this._isRandomObj = false;
                } else {
                    this.CompountMove(index, sameAngle, rotateAngle, leftNode, midNode, true, 1);
                    isCreateNewLvObj = false;
                    this._isRandomObj = false;
                }
            } else if (midNode.name === rightNode.name) {
                this.CompountMove(index, sameAngle, rotateAngle, midNode, rightNode, true, 0);
                isCreateNewLvObj = false;
                this._isRandomObj = false;
            }
        }

        if (this._isRandomObj) {
            this.CreateTwoLvObj();
            this._isRandomObj = false;
            return;
        }

        if (isCreateNewLvObj) {
            this.CreateLvObj();
        }
    }

    private CreateTwoLvObj() {
        // return;
        if (this._isGameOver) return;
        let randomSiblingIndex: number = Util.randomInteger(0, 1);
        let arr_RandeomNum: number[] = [0, 1, 2];
        let time: number = 0;
        if (randomSiblingIndex === 0) {
            let targetObj: cc.Node = this.lvObjCompoundParent.children[0];
            let targetPos: cc.Vec2 = targetObj.getPosition();
            let targetPos_2: cc.Vec2 = this.lvObjCompoundParent.children[1].getPosition();
            let targetLvObjMove: LvObjMove = targetObj.children[0].getComponent(LvObjMove);
            let targetId: number = targetLvObjMove.GetSelfArrIndex();
            let targetAngle: number = targetLvObjMove.GetSelfAngle();
            arr_RandeomNum.splice(targetId, 1);
            let randomId: number = Util.randomArray(arr_RandeomNum);
            let newLvObj = cc.instantiate(this.arr_LvObjs[randomId]);
            newLvObj.children[0].getComponent(cc.CircleCollider).tag = 1;
            newLvObj.setParent(this.lvObjCompoundParent);
            newLvObj.setPosition(targetPos);
            newLvObj.setSiblingIndex(randomSiblingIndex);
            let selfAngle: number = newLvObj.children[0].getComponent(LvObjMove).GetSelfAngle();
            let rotateAngle: number = (targetAngle + selfAngle) / 2;
            let dir: boolean = this.JudgeMoveDir(targetPos, targetPos_2);
            newLvObj.getComponent(LvObjRotate).RunRotate(dir, 2, rotateAngle);
            time = rotateAngle / 150;
        } else if (randomSiblingIndex === 1) {
            let maxIndex: number = this.lvObjCompoundParent.childrenCount - 1;
            let targetObj: cc.Node = this.lvObjCompoundParent.children[maxIndex];
            let targetPos: cc.Vec2 = targetObj.getPosition();
            let targetPos_2: cc.Vec2 = this.lvObjCompoundParent.children[maxIndex - 1].getPosition();
            let targetLvObjMove: LvObjMove = targetObj.children[0].getComponent(LvObjMove);
            let targetId: number = targetLvObjMove.GetSelfArrIndex();
            let targetAngle: number = targetLvObjMove.GetSelfAngle();
            arr_RandeomNum.splice(targetId, 1);
            let randomId: number = Util.randomArray(arr_RandeomNum);
            let newLvObj = cc.instantiate(this.arr_LvObjs[randomId]);
            newLvObj.children[0].getComponent(cc.CircleCollider).tag = 1;
            newLvObj.setParent(this.lvObjCompoundParent);
            newLvObj.setPosition(targetPos);
            let selfAngle: number = newLvObj.children[0].getComponent(LvObjMove).GetSelfAngle();
            let rotateAngle: number = (targetAngle + selfAngle) / 2;
            let dir: boolean = this.JudgeMoveDir(targetPos, targetPos_2);
            newLvObj.getComponent(LvObjRotate).RunRotate(dir, 2, rotateAngle);
            time = rotateAngle / 150;
        }
        cc.tween(this.node)
            .delay(time)
            .call(() => {
                this.CreateLvObj();
            })
            .start();
    }

    /**
     * 判断物体移动的方向
     * @param firstNodePos 第一个节点的位置
     * @param secoundNodePos 第二个节点的位置
     * @returns true为顺时针
     */
    public JudgeMoveDir(firstNodePos: cc.Vec2, secoundNodePos: cc.Vec2): boolean {
        if (firstNodePos.y >= 0) {
            if (secoundNodePos.y >= 0) {
                if (secoundNodePos.x >= firstNodePos.x) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (firstNodePos.x < 0) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if (secoundNodePos.y <= 0) {
                if (secoundNodePos.x >= firstNodePos.x) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (firstNodePos.x < 0) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }


    /**
     * 合成效果移动并消除相同物体
     * @param index 相同物体在数组中的index
     * @param sameAngle 相同物体对应的角度
     * @param rotateAngle   合体的旋转角度
     * @param leftNode 相同物体左边
     * @param rightNode 相同物体右边
     * @param isTwoObjCompount true为相同物体为2个 false为三个
     * @param samePosNum 0为与左边相同，1为与右边相同，2为与左右都相同,3为两个往中间缩
     */
    private CompountMove(index: number, sameAngle: number, rotateAngle: number, leftNode: cc.Node, rightNode: cc.Node, isTwoObjCompount: boolean, samePosNum: number) {
        // return;
        if (this._isGameOver) return;
        let time: number = rotateAngle / 150;
        let leftSiblingIndex: number = leftNode.getSiblingIndex();
        let rightSiblingIndex: number = rightNode.getSiblingIndex();
        let allChildrenNum: number = this.lvObjCompoundParent.childrenCount;
        if (samePosNum === 0) {
            let dir_1: boolean = this.JudgeMoveDir(leftNode.getPosition(), rightNode.getPosition());
            for (let i: number = rightSiblingIndex; i < allChildrenNum; i++) {
                let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                rotate.RunRotate(dir_1, 2, rotateAngle);
            }
        } else if (samePosNum === 1) {
            let dir_1: boolean = this.JudgeMoveDir(rightNode.getPosition(), leftNode.getPosition());
            for (let i: number = 0; i <= leftSiblingIndex; i++) {
                let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                rotate.RunRotate(dir_1, 2, rotateAngle);
            }

        } else if (samePosNum === 2) {
            let middleSiblingIndex: number = leftSiblingIndex + 1;
            let middleNode: cc.Node = this.lvObjCompoundParent.children[middleSiblingIndex];
            let dir_1: boolean = this.JudgeMoveDir(middleNode.getPosition(), leftNode.getPosition());
            let dir_2: boolean = !dir_1;
            for (let i: number = 0; i <= leftSiblingIndex; i++) {
                let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                rotate.RunRotate(dir_1, 2, rotateAngle);
            }
            for (let i: number = rightSiblingIndex; i < allChildrenNum; i++) {
                let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                rotate.RunRotate(dir_2, 2, rotateAngle);
            }
        } else if (samePosNum === 2) {
            let dir_1: boolean = this.JudgeMoveDir(rightNode.getPosition(), leftNode.getPosition());
            let dir_2: boolean = !dir_1;
            for (let i: number = 0; i <= leftSiblingIndex; i++) {
                let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                rotate.RunRotate(dir_1, 2, rotateAngle);
            }
            for (let i: number = rightSiblingIndex; i < allChildrenNum; i++) {
                let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                rotate.RunRotate(dir_2, 2, rotateAngle);
            }
        }
        // return;
        if (isTwoObjCompount) {
            cc.tween(this.node)
                .delay(time)
                .call(() => {
                    let createPos: cc.Vec2 = cc.v2(0, 0);
                    if (samePosNum === 0) {
                        createPos = leftNode.getPosition();
                    } else if (samePosNum === 1) {
                        createPos = rightNode.getPosition();
                    } else if (samePosNum === 3) {
                        createPos.x = (leftNode.x + rightNode.x) / 2;
                        createPos.y = (leftNode.y + rightNode.y) / 2;
                    }
                    this.CreateLight(createPos);
                    this.CreateCompoundEffect(createPos);
                    leftNode.removeFromParent();
                    rightNode.removeFromParent();
                    this.CreateLvCompountObj(index, sameAngle, leftSiblingIndex, createPos);

                })
                .start();
        } else {
            let middleSiblingIndex: number = leftSiblingIndex + 1;
            let middleNode: cc.Node = this.lvObjCompoundParent.children[middleSiblingIndex];
            cc.tween(this.node)
                .delay(time)
                .call(() => {
                    let createPos: cc.Vec2 = middleNode.getPosition();
                    this.CreateLight(createPos);
                    this.CreateCompoundEffect(createPos);
                    leftNode.removeFromParent();
                    middleNode.removeFromParent();
                    rightNode.removeFromParent();
                    this.CreateLvCompountObj(index, sameAngle, leftSiblingIndex, createPos);
                })
                .start();
        }
    }

    /**
     * 创建合成后的物体
     * @param selfArrIndex 相同物体在数组的下标
     * @param sameAngle 相同物体对应的角度
     * @param siblingIndex 在父类的下标
     * @param pos 合成物体在父类下的位置
     */
    private CreateLvCompountObj(selfArrIndex: number, sameAngle: number, siblingIndex: number, pos: cc.Vec2) {
        // return;
        if (this._isGameOver) return;
        let compountObjIndex: number = selfArrIndex + 1;
        if (compountObjIndex === 4) {
            AudioManager.play('upGrade');
            this.ScatterGold(pos);
            this.CreateLight(pos);
            let allChildrenNum: number = this.lvObjCompoundParent.childrenCount;
            let rotateAngle: number = sameAngle / 2;
            let time: number = rotateAngle / 150;
            if (allChildrenNum === 0) return;
            if (siblingIndex === 0) {
                let rightNode: cc.Node = this.lvObjCompoundParent.children[siblingIndex];
                let dir: boolean = this.JudgeMoveDir(pos, rightNode.getPosition());
                for (let i: number = 0; i < allChildrenNum; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir, 2, rotateAngle);
                }
            } else if (siblingIndex === allChildrenNum) {
                let leftNode: cc.Node = this.lvObjCompoundParent.children[siblingIndex - 1];
                let dir: boolean = this.JudgeMoveDir(pos, leftNode.getPosition());
                for (let i: number = 0; i < allChildrenNum; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir, 2, rotateAngle);
                }
            } else {
                let leftNode: cc.Node = this.lvObjCompoundParent.children[siblingIndex - 1];
                let leftLvObjMove: LvObjMove = leftNode.children[0].getComponent(LvObjMove);
                let leftSelfArrIndex: number = leftLvObjMove.GetSelfArrIndex();
                let leftSameAngle: number = leftLvObjMove.GetSelfAngle();
                let rightNode: cc.Node = this.lvObjCompoundParent.children[siblingIndex];
                let dir_1: boolean = this.JudgeMoveDir(pos, leftNode.getPosition());
                let dir_2: boolean = !dir_1;//this.JudgeMoveDir(rightNode.getPosition(), pos);
                for (let i: number = 0; i < siblingIndex; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir_1, 2, rotateAngle);
                }
                for (let i: number = siblingIndex; i < allChildrenNum; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir_2, 2, rotateAngle);
                }
                cc.tween(this.node)
                    .delay(time)
                    .call(() => {
                        this.VerifyIsSame(leftSelfArrIndex, leftSameAngle, leftNode, null, rightNode);
                    })
                    .start();
            }
        } else {
            AudioManager.play('compounde');
            let compountObj: cc.Node = cc.instantiate(this.arr_LvObjs[compountObjIndex]);
            compountObj.children[0].getComponent(cc.CircleCollider).tag = 1;
            compountObj.setParent(this.lvObjCompoundParent);
            compountObj.setPosition(pos);
            compountObj.setSiblingIndex(siblingIndex);
            let maxSiblingIndex: number = this.lvObjCompoundParent.childrenCount - 1;
            if (maxSiblingIndex <= 0) {
                this.CreateLvObj();
                return;
            }
            let compountObjAngle: number = compountObj.children[0].getComponent(LvObjMove).GetSelfAngle();
            let rotateAngle: number = (compountObjAngle - sameAngle) / 2;
            let time: number = rotateAngle / 150;
            let leftNode: cc.Node = null;
            let rightNode: cc.Node = null;
            if (siblingIndex === 0) {
                rightNode = this.lvObjCompoundParent.children[siblingIndex + 1];
                let dir: boolean = this.JudgeMoveDir(rightNode.getPosition(), pos);
                for (let i: number = 1; i <= maxSiblingIndex; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir, 2, rotateAngle);
                }
            } else if (siblingIndex === maxSiblingIndex) {
                leftNode = this.lvObjCompoundParent.children[siblingIndex - 1];
                let dir: boolean = this.JudgeMoveDir(leftNode.getPosition(), pos);
                for (let i: number = 0; i < maxSiblingIndex; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir,2, rotateAngle);
                }
            } else {
                leftNode = this.lvObjCompoundParent.children[siblingIndex - 1];
                rightNode = this.lvObjCompoundParent.children[siblingIndex + 1];
                let dir_1: boolean = this.JudgeMoveDir(leftNode.getPosition(), pos);
                let dir_2: boolean = !dir_1;
                for (let i: number = 0; i < siblingIndex; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir_1, 2, rotateAngle);
                }
                for (let i: number = siblingIndex + 1; i <= maxSiblingIndex; i++) {
                    let rotate: LvObjRotate = this.lvObjCompoundParent.children[i].getComponent(LvObjRotate);
                    rotate.RunRotate(dir_2, 2, rotateAngle);
                }
            }
            // return;
            cc.tween(this.node)
                .delay(time)
                .call(() => {
                    this.VerifyIsSame(compountObjIndex, compountObjAngle, leftNode, compountObj, rightNode)
                })
                .start();
        }
    }



    /**
     * 创建消除光效
     */
    public CreateLight(pos: cc.Vec2) {
        let obj = PoolManager.instance.getNode(this.pre_LvObjLight, this.lvObjEffect);
        obj.setPosition(pos);
        cc.tween(obj)
            .to(0.3, { scale: 1 }, { easing: 'backOut' })
            .call(() => {
                obj.scale = 0;
                PoolManager.instance.putNode(obj);
            })
            .start();
    }

    /**
     * 创建合成特效
     */
    public CreateCompoundEffect(pos: cc.Vec2) {
        let obj = PoolManager.instance.getNode(this.pre_CompoundEffect, this.lvObjEffect);
        obj.setPosition(pos);
        let anim: sp.Skeleton = obj.getComponent(sp.Skeleton);
        anim.clearTracks();
        anim.setAnimation(0, 'texiao', false);
        anim.setCompleteListener(() => {
            PoolManager.instance.putNode(obj);
        });

    }

    private AddProgressWidth(value: number) {
        this.gameProgressView.width = (this.gameProgressView.width * 10 + value) / 10;
    }


    /**
    * 实现金币飞的效果
    * @param generateNode 生成的地点
    */
    private ScatterGold(pos: cc.Vec2) {
        let v = 1000;
        let s = Util.getDistance(this.goldEndPos.getPosition(), pos);
        let t = 0;

        t = s / v;

        for (let i: number = 0; i < 5; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.lvObjEffect.addChild(star);
            cc.tween(star)
                .set({ position: cc.v3(pos.x, pos.y), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-50, 50), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.ChangePos(star, this.goldEndPos) })
                .call(() => {
                    star.destroy();
                    this.AddProgressWidth(388);
                    if (i === 4) {
                        this.CreateLvObj();
                        this._compoundNum++;
                        if (this._compoundNum === 3) {
                            this.GameOver();
                        }
                    }
                })
                .start();
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

    public GetLvObjCompoundParent(): cc.Node {
        return this.lvObjCompoundParent;
    }

    public GetLvObjOriginNode(): cc.Node {
        return this.lvObjOriginNode;
    }


    public ClickShadeStart(event) {
        if (this._isGameOver) return;
        if (!this._isCreateLvObj) return;
        CpSDK.FirstTouch();
        let pos: cc.Vec2 = this._currentLvObj.parent.convertToNodeSpaceAR(event.touch._point);
        this._currentLvObj.children[0].getComponent(LvObjMove).LookAtObject(pos);
        this._isCreateLvObj = false;
        this._isRandomObj = true;
        this.startShade.active = false;
        this.guid_Finger.active = false;
    }


}
