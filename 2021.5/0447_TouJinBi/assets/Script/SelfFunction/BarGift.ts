const { ccclass, property } = cc._decorator;

@ccclass
export default class BarGift extends cc.Component {

    // onLoad () {}

    start() {
        cc.tween(this.node.children[0])
            .by(4, { angle: -360 })
            .union()
            .repeatForever()
            .start();
        cc.tween(this.node.children[1])
            .to(0.1, { angle: 3 })
            .to(0.1, { angle: 0 })
            .to(0.1, { angle: -3 })
            .to(0.1, { angle: 0 })
            .union()
            .repeat(2)
            .delay(0.4)
            .union()
            .repeatForever()
            .start();
    }

    // update (dt) {}
}