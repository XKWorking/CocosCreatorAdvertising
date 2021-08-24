// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuidLine extends cc.Component {


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === "barrier") {
            self.node.opacity = 0;
        }
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === "barrier") {
            self.node.opacity = 255;
        }
    }


}
