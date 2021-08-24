const { ccclass, property } = cc._decorator;

@ccclass
export default class Click extends cc.Component {

    // onLoad () {}

    start() {
        cc.tween(this.node.children[0])
            .by(0.2, { x: -5, y: 5, scale: -0.1 })
            .by(0.2, { x: 5, y: -5, scale: 0.1 })
            .delay(1)
            .union()
            .repeatForever()
            .start();
    }

    // update (dt) {}
}
