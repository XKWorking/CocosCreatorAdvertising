const { ccclass, property } = cc._decorator;

@ccclass
export default class Click extends cc.Component {

    // onLoad () {}

    start() {
        cc.tween(this.node.children[2])
            .by(0.2, { x: -5, y: 5, scale: -0.05 })
            .call(() => {
                cc.tween(this.node.children[0])
                    .to(0.4, { scale: 1, opacity: 255 })
                    .to(0.7, { scale: 2.5, opacity: 0 })
                    .to(0, { scale: 0.1 })
                    .start();
                cc.tween(this.node.children[1])
                    .to(0.3, { scale: 1.5, opacity: 255 })
                    .to(0.5, { scale: 2.5, opacity: 0 })
                    .to(0, { scale: 0.3 })
                    .start();
            })
            .by(0.2, { x: 5, y: -5, scale: 0.05 })
            .delay(1.5)
            .union()
            .repeatForever()
            .start();
    }

    // update (dt) {}
}
