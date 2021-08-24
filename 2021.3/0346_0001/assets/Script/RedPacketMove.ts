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
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    selfPrefab: cc.Prefab = null;

    @property(cc.Node)//切开后的部分1
    apart_1: cc.Node = null;

    @property(cc.Node)// 切开后的部分2
    apart_2: cc.Node = null;

    @property(cc.Prefab)
    score: cc.Prefab = null;

    @property(cc.Prefab)
    effectFx: cc.Prefab = null;

    @property(cc.Boolean)
    isGold: boolean = false;

    private _selfParent: cc.Node = null;
    private _apart_StartPos_1: cc.Vec3 = null;
    private _apart_StartPos_2: cc.Vec3 = null;
    private _endAngle: number = 0;
    private _judgeAngle: number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this._selfParent = this.node.parent;
    }

    update(dt) {
    }

    private apart() {
        let obj = cc.instantiate(this.selfPrefab);
        obj.setParent(this._selfParent);
        obj.x = this.node.x;
        obj.y = this.node.y;
        let objApart_1 = obj.getChildByName('apart_1');
        let objApart_2 = obj.getChildByName('apart_2');
        this._endAngle = this.node.angle;
        this.apart_1.active = true;
        this.apart_2.active = true;
        this._apart_StartPos_1 = this.changePos(objApart_1, this.apart_1);
        this._apart_StartPos_2 = this.changePos(objApart_2, this.apart_2);


        this.apart_1.parent = obj;
        this.apart_1.setPosition(this._apart_StartPos_1);
        this.apart_1.angle = this._endAngle;
        this.apart_2.parent = obj;
        this.apart_2.setPosition(this._apart_StartPos_2);
        this.apart_2.angle = this._endAngle;
        this.node.active = false;
        this._judgeAngle = Math.abs(this._endAngle % 360);
        if (this.isGold) {
            if (this._judgeAngle >= 0 && this._judgeAngle <= 90) {
                this.moveDownLeft(this.apart_1);
                this.moveDownRight(this.apart_2);
            } else if (this._judgeAngle > 90 && this._judgeAngle <= 270) {
                this.moveDownLeft(this.apart_2);
                this.moveDownRight(this.apart_1);
            } else if (this._judgeAngle > 270) {
                this.moveDownLeft(this.apart_1);
                this.moveDownRight(this.apart_2);
            }
        } else {
            if (this._judgeAngle <= 180) {
                this.moveDownLeft(this.apart_2);
                this.moveDownRight(this.apart_1);
            } else {
                this.moveDownLeft(this.apart_1);
                this.moveDownRight(this.apart_2);
            }
        }
    }

    private moveDownLeft(node: cc.Node) {
        cc.tween(node)
            .by(3, { position: cc.v2(-500, -2000) }, { easing: 'quadIn' })
            .call(() => {
                node.destroy();
            })
            .start();

    }
    private moveDownRight(node: cc.Node) {
        cc.tween(node)
            .by(3, { position: cc.v2(500, -2000) }, { easing: 'quadIn' })
            .call(() => {
                node.destroy();
            })
            .start();

    }
    private showScore() {
        let obj = cc.instantiate(this.score);
        obj.setParent(this._selfParent);
        let pos = this.node.getPosition();
        pos.y += 100;
        obj.setPosition(pos);
        let t = cc.tween;
        t(obj)
            .parallel(
                t().by(0.5, { position: cc.v2(0, 300) }),
                t().to(0.5, { opacity: 0 }, { easing: 'fade' })
            )
            .start();
    }

    private showEffectFx() {
        let obj = cc.instantiate(this.effectFx);
        obj.setParent(this._selfParent);
        obj.setPosition(this.node.getPosition());
        cc.tween(obj)
            .delay(0.3)
            .to(0.5, { opacity: 0 }, { easing: 'fade' })
            .call(() => {
                obj.destroy();
            })
            .start();
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === 'knifeShadow') {
            AudioManager.play('move');
            this.showEffectFx();
            this.apart();
            this.showScore();
            LayerManger.Instance.GetLayer(Layer_1).scatterGold(this.node);
            GlobalData.instance.addScore(10);
            if (self.tag === 1) {
                LayerManger.Instance.GetLayer(Layer_1).startCreateObj();
            }
        }
    }

    private changePos(node1: cc.Node, node2: cc.Node) {
        let wordPoint = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }
}
