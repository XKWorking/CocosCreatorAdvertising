// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import LayerManger from "./Manager/LayerManger";
import MonsterBase from "./MonsterBase";
import Util from "./Utils/Util";

@ccclass
export default class Monster_0 extends MonsterBase {

    @property
    speed = 100;

    private _dir: cc.Vec3 = cc.Vec3.ZERO;


    public SetData(hp: number) {
        super.SetData(hp);

        let rect = cc.rect(-LayerManger.Instance.GetStageW() * 0.5, -LayerManger.Instance.GetStageH() * 0.5, LayerManger.Instance.GetStageW(), LayerManger.Instance.GetStageH());

        let index = Math.floor(Math.random() * 4);
        let rangeLen = 0.5;
        let startDis = 200;
        switch (index) {
            case 0: {
                this.node.position = cc.v3(rect.x - startDis, (rect.y + Math.random() * rect.height) * rangeLen);
                let targetPos = cc.v3(rect.x + rect.width, (rect.y + Math.random() * rect.height) * rangeLen);
                this._dir = targetPos.sub(this.node.position).normalize();
                break;
            }
            case 1: {
                this.node.position = cc.v3(rect.x + rect.width + startDis, (rect.y + Math.random() * rect.height) * rangeLen);
                let targetPos = cc.v3(rect.x, (rect.y + Math.random() * rect.height) * rangeLen);
                this._dir = targetPos.sub(this.node.position).normalize();
                break;
            }
            case 2: {
                this.node.position = cc.v3((rect.x + Math.random() * rect.width) * rangeLen, rect.y - startDis);
                let targetPos = cc.v3((rect.x + Math.random() * rect.width) * rangeLen, rect.y + rect.height);
                this._dir = targetPos.sub(this.node.position).normalize();
                break;
            }
            case 3: {
                this.node.position = cc.v3((rect.x + Math.random() * rect.width) * rangeLen, rect.y + rect.height + startDis);
                let targetPos = cc.v3((rect.x + Math.random() * rect.width) * rangeLen, rect.y);
                this._dir = targetPos.sub(this.node.position).normalize();
                break;
            }
        }
        // this.node.opacity = 0;
    }

    start() {
    }
    update(dt) {
        super.update(dt);
        let pos = this.node.position.add(this._dir.mul(this.speed * dt));

        let rect = cc.rect(-LayerManger.Instance.GetStageW() * 0.5, -LayerManger.Instance.GetStageH() * 0.5, LayerManger.Instance.GetStageW(), LayerManger.Instance.GetStageH());
        if (rect.contains(cc.v2(this.node.position))) {
            if (!rect.contains(cc.v2(pos))) {
                if (pos.x < rect.x || pos.x > rect.x + rect.width) {
                    this._dir.x = -this._dir.x;
                }
                if (pos.y < rect.y || pos.y > rect.y + rect.height) {
                    this._dir.y = -this._dir.y;
                }
                pos = this.node.position.add(this._dir.mul(this.speed * dt * 2));
            }
            this.node.position = pos;
        } else {
            if (rect.contains(cc.v2(pos))) {
                this.node.runAction(cc.fadeIn(0.5));
            }
        }
        this.node.position = pos;
        this.node.angle = Util.getRadianTwoPoint(cc.Vec2.ZERO, cc.v2(this._dir)) * 180 / Math.PI + 90;
    }

    public BeAtk(demage: number) {
        super.BeAtk(demage);
    }


}
