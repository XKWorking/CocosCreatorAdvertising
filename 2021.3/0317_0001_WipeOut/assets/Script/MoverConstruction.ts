// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "./GlobalData";
import Layer_1 from "./Layer_1";
import AudioManager from "./Manager/AudioManager";
import LayerManger from "./Manager/LayerManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoverConstruction extends cc.Component {

    @property(cc.Node)
    wasteland: cc.Node = null;
    @property(cc.Node)
    construction: cc.Node = null;
    @property(cc.Node)
    newConstruction: cc.Node = null;
    @property(cc.Node)
    selfInitParent: cc.Node = null;
    @property(cc.Node)
    chooseConstruction: cc.Node = null;
    @property(cc.Node)
    redBg: cc.Node = null;
    @property(cc.Node)
    greeBg: cc.Node = null;
    @property(cc.Node)
    confirm: cc.Node = null;
    @property(cc.Node)
    cancel: cc.Node = null;
    @property(cc.Node)
    delect: cc.Node = null;
    @property(cc.Prefab)
    pre_UpGrade: cc.Prefab = null;
    @property(cc.Prefab)
    vapour: cc.Prefab = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    private _isUp: boolean = false;
    private _isSlide: boolean = true;
    private _isMove: boolean = true;
    private _isCreate: boolean = false;
    private _newObj: cc.Node = null;
    private _width: number = 0;
    private _height: number = 0;
    // private _endPos: cc.Vec2 = cc.v2(0, 0);

    private xNum: number = 0;
    private upNum: number = 0;

    private _isCollider: boolean = false;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    start() {
        this._width = GlobalData.instance.getWidth();
        this._height = GlobalData.instance.getHeight();
        LayerManger.Instance.GetLayer(Layer_1).addArrDelect(this.delect);
    }

    update(dt) {
    }

    createNewObj() {
        this._newObj = cc.instantiate(this.node);
        this._newObj.opacity = 0;
        this._newObj.parent = this.selfInitParent;
        this._newObj.setPosition(cc.v2(0, 0));
    }
    delectNewObj() {
        this._newObj = null;
    }
    moveSelf(pos: cc.Vec2) {
        if (!this._isSlide) return;
        this.construction.setSiblingIndex(2);
        this.createNewObj();
        this.node.setParent(this.construction);
        this.node.setPosition(pos);
        this.node.opacity = 255;
        this.hideChooseConstruction();
        let arrObj = GlobalData.instance.getArr();
        arrObj.forEach((temp) => {
            temp.getChildByName('red').active = true;
        });
        this._isSlide = false;
    }
    onTouchStart(event) {
        if (GlobalData.instance.getLaunchBullet()) return;
        LayerManger.Instance.GetLayer(Layer_1).clickHideArrDelect();
        if (this.node.parent.name === 'newConstruction') {
            this.showNode(this.delect);
            this.node.setSiblingIndex(5);
        }
        if (this.guidFinger.activeInHierarchy) {
            this.guidFinger.stopAllActions();
            this.moveFinger();
        }
    }
    onTouchMove(event) {
        if (!this._isMove) return;
        if (event.getLocationY() >= 460) {
            this._isUp = true;
            this.moveSelf(event.getLocation());
            this.node.x = event.getLocationX();
            this.node.y = event.getLocationY();
            if (this._isCreate) {
                if (!this.redBg.activeInHierarchy) return;
                this.redBg.active = false;
                this.greeBg.active = true;
            } else {
                if (this.redBg.activeInHierarchy) return;
                this.redBg.active = true;
            }
        } else {
            if (this._isUp) {
                this.node.x = event.getLocationX();
                this.node.y = event.getLocationY();
                if (this._isCreate) {
                    if (!this.redBg.activeInHierarchy) return;
                    this.redBg.active = false;
                    this.greeBg.active = true;
                } else {
                    if (this.redBg.activeInHierarchy) return;
                    this.redBg.active = true;
                }
            }
        }

    }

    onTouchCancel(event) {
        if (!this._isMove) return;
        this.redBg.active = false;
        this.greeBg.active = false;
        if (this._isCreate) {
            this._isMove = false;
            this.showNode(this.confirm);
            this.showNode(this.cancel);

            if (!GlobalData.instance.getIsGuidOver()) {
                LayerManger.Instance.GetLayer(Layer_1).moveFinger_2(this.confirm);
                this.cancel.getComponent(cc.Button).enabled = false;
            }
            if (GlobalData.instance.getLaunchBullet()) return;
            let pos = event.getLocation();
            if (pos.x <= 125) {
                this.xNum = - 125;
            } else if (pos.x >= this._width - 125) {
                this.xNum = 125;
            }
            if (pos.y >= this._height - 175) {
                this.upNum = 175;
            } else if (pos.y <= 175) {
                this.upNum = -175;
            }
            LayerManger.Instance.GetLayer(Layer_1).moveCamera(this.xNum, this.upNum);
        } else {
            this._newObj = null;
            this.node.opacity = 0;
            this.node.parent = this.selfInitParent;
            this.node.setPosition(cc.v2(0, 0));
            this.showChooseConstruction();
            this.redBg.active = true;
            this.greeBg.active = true;
            this._isUp = false;
            this._isSlide = true;
        }
        let arrObj = GlobalData.instance.getArr();
        arrObj.forEach((temp) => {
            temp.getChildByName('red').active = false;
        });
    }

    onTouchEnd(event) {
        if (!this._isMove) return;
        this.redBg.active = false;
        this.greeBg.active = false;
        if (this._isCreate) {
            this._isMove = false;
            this.showNode(this.confirm);
            this.showNode(this.cancel);
            if (!GlobalData.instance.getIsGuidOver()) {
                LayerManger.Instance.GetLayer(Layer_1).moveFinger_2(this.confirm);
                this.cancel.getComponent(cc.Button).enabled = false;
            }
            if (GlobalData.instance.getLaunchBullet()) return;
            let pos = event.getLocation();
            if (pos.x <= 125) {
                this.xNum = - 125;
            } else if (pos.x >= this._width - 125) {
                this.xNum = 125;
            }
            if (pos.y >= this._height - 175) {
                this.upNum = 175;
            } else if (pos.y <= 175) {
                this.upNum = -175;
            }
            LayerManger.Instance.GetLayer(Layer_1).moveCamera(this.xNum, this.upNum);
        } else {
            this._newObj = null;
            this.node.opacity = 0;
            this.node.parent = this.selfInitParent;
            this.node.setPosition(cc.v2(0, 0));
            this.showChooseConstruction();
            this.redBg.active = true;
            this.greeBg.active = true;
            this._isUp = false;
            this._isSlide = true;
        }
        let arrObj = GlobalData.instance.getArr();
        arrObj.forEach((temp) => {
            temp.getChildByName('red').active = false;
        });
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'construction') {
            this._isCreate = false;
            this._isCollider = false;
        } else if (other.node.group == 'constructionPos') {
            this._isCreate = true;
            this._isCollider = true;
        } else if (other.node.group == 'otherObj') {
            this._isCreate = false;
            this._isCollider = false;
        } else if (other.node.group == 'wasteland') {
            this._isCreate = false;
            this._isCollider = false;
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider) {

        if (other.node.group == 'constructionPos') {
            if (!this._isCollider) return;
            this._isCreate = true;
        }
        if (other.node.group == 'construction') {
            this._isCreate = false;
            this._isCollider = false;
        } else if (other.node.group == 'wasteland') {
            this._isCreate = false;
            this._isCollider = false;
        } else if (other.node.group == 'otherObj') {
            this._isCreate = false;
            this._isCollider = false;
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == 'constructionPos') {
            this._isCreate = false;
        } else if (other.node.group == 'construction') {
            this._isCollider = true;
        } else if (other.node.group == 'wasteland') {
            this._isCollider = true;
        } else if (other.node.group == 'otherObj') {
            this._isCollider = true;
        }
    }

    clickConfirm() {
        LayerManger.Instance.GetLayer(Layer_1).goBack();
        this.hideNode(this.confirm);
        this.hideNode(this.cancel);
        this.createFx(this.node.getPosition());
        GlobalData.instance.addObj(this.node);
        LayerManger.Instance.GetLayer(Layer_1).showText_2();
        LayerManger.Instance.GetLayer(Layer_1).showNextContent();
        GlobalData.instance.addClickNum();
        let num = GlobalData.instance.getClickNum();
        this.newConstruction.setSiblingIndex(0);
        if (!GlobalData.instance.getIsGuidOver()) {
            LayerManger.Instance.GetLayer(Layer_1).guidOver();
            LayerManger.Instance.GetLayer(Layer_1).hideFinger();
            GlobalData.instance.setIsGuidOver(true);
        }
        if (num >= 2 && num < 6) {
            this.showChooseConstruction();
            LayerManger.Instance.GetLayer(Layer_1).turnLeftPos();
        } else if (num >= 6) {
            LayerManger.Instance.GetLayer(Layer_1).skipLayer();
            if (GlobalData.instance.getArrLength() < 6) {
                this.showChooseConstruction();
            }
        }
        if (this.selfInitParent.name == 'fruiter') {
            AudioManager.play('fruiter');
            LayerManger.Instance.GetLayer(Layer_1).changeIndex(1);
        } else if (this.selfInitParent.name == 'stable') {
            AudioManager.play('stable');
            LayerManger.Instance.GetLayer(Layer_1).changeIndex(2);
        } else if (this.selfInitParent.name == 'watchtower') {
            AudioManager.play('watchtower');
            this.node.getComponent('Watchtower').setIsLaunch(true);
            LayerManger.Instance.GetLayer(Layer_1).changeIndex(3);
        } else if (this.selfInitParent.name == 'hospital') {
            AudioManager.play('hospital');
            LayerManger.Instance.GetLayer(Layer_1).changeIndex(4);
        }
        let wordPoint = this.construction.convertToWorldSpaceAR(this.node.position);
        let nodePonit = this.newConstruction.convertToNodeSpaceAR(wordPoint);
        this.node.parent = this.newConstruction;
        this.node.setPosition(nodePonit);
        GlobalData.instance.addConstructionNum();
        if (GlobalData.instance.getConstructionNum() === 5) {
            this.showGuidFinger_5();
        }
        LayerManger.Instance.GetLayer(Layer_1).clickHideArrDelect();
    }

    private showGuidFinger_5() {
        if (GlobalData.instance.getShowGuidFinger_5()) {
            GlobalData.instance.setShowGuidFinger_5();
            cc.tween(this.guidFinger)
                .delay(5)
                .call(() => {
                    if (GlobalData.instance.getConstructionNum() <= 5) {
                        let pos = this.changePos(this.guidFinger, this.node);
                        pos.x += 50;
                        pos.y += 50;
                        this.guidFinger.setPosition(pos);
                        this.showNode(this.guidFinger);
                        this.fingerBreath();
                        this.hideChooseConstruction();
                    }
                })
                .start();
        }
    }

    private fingerBreath() {
        cc.tween(this.guidFinger)
            .delay(0.2)
            .to(0.2, { scale: 0.6 })
            .to(0.2, { scale: 0.4 })
            .union()
            .repeatForever()
            .start();
    }
    private moveFinger() {
        if (this.guidFinger.activeInHierarchy) {
            this.guidFinger.stopAllActions();
            let pos = this.changePos(this.guidFinger, this.delect);
            // pos.x += 50;
            pos.y += 50;
            cc.tween(this.guidFinger)
                .to(0.5, { position: pos })
                .call(() => {
                    this.fingerBreath();
                })
                .start();
        }
    }
    clickCancel() {
        LayerManger.Instance.GetLayer(Layer_1).goBack();
        this._isMove = true;
        this.hideNode(this.confirm);
        this.hideNode(this.cancel);
        this.showChooseConstruction();
        this.node.opacity = 0;
        this.node.parent = this.selfInitParent;
        this.node.setPosition(cc.v2(0, 0));
        this.redBg.active = true;
        this.greeBg.active = true;
        this._isUp = false;
        this._isSlide = true;
        LayerManger.Instance.GetLayer(Layer_1).clickHideArrDelect();
    }

    clickDelect() {
        this.createVapour(this.node);
        GlobalData.instance.delectObj(this.node);
        this.node.destroy();
        if (GlobalData.instance.getArrLength() < 6) {
            this.showChooseConstruction();
        }
        GlobalData.instance.reduceConstructionNum();
        if (this.guidFinger.activeInHierarchy) {
            this.hideNode(this.guidFinger);
        }
        LayerManger.Instance.GetLayer(Layer_1).clickHideArrDelect();
    }

    createVapour(node: cc.Node) {
        let obj = cc.instantiate(this.vapour);
        obj.setParent(this.newConstruction);
        let pos = this.changePos(obj, node);
        obj.setPosition(pos);
    }
    showNode(node: cc.Node) {
        node.active = true;
    }
    hideNode(node: cc.Node) {
        node.active = false;
    }


    showChooseConstruction() {
        this.showNode(this.chooseConstruction);
    }

    hideChooseConstruction() {
        this.hideNode(this.chooseConstruction);
    }
    createFx(pos: cc.Vec2) {
        AudioManager.play('upGrade');
        let obj = cc.instantiate(this.pre_UpGrade);
        obj.setParent(this.construction);
        pos.x += 10;
        pos.y -= 30;
        obj.setPosition(pos);
        let anim = obj.getComponent(sp.Skeleton);
        anim.clearTracks();
        anim.setAnimation(0, 'texiao', false);
        anim.setCompleteListener(() => {
            obj.destroy();
        });
    }
    changePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }
}
