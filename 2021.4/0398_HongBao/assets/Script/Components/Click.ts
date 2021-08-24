const { ccclass, property } = cc._decorator;

@ccclass
export default class Click extends cc.Component {

    // onLoad () {}

    start() {
        cc.tween(this.node.children[0])
            .by(0.2, { x: -5, y: 5, scale: -0.05 })
            .by(0.2, { x: 5, y: -5, scale: 0.05 })
            .delay(0.5)
            .union()
            .repeatForever()
            .start();
    }

    // update (dt) {}
}
