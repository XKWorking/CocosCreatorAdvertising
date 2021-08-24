import GlobalData from "./GlobalData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JinBiMagager extends cc.Component {


    @property(cc.Label)
    goldContent: cc.Label = null;


    goldNum: number = 0;

    start() {
        this.goldNum = GlobalData.instance.getGoldNum() / 10;
        this.goldContent.string = this.goldNum.toString(10);
    }
    update(dt) {
        this.goldNum = GlobalData.instance.getGoldNum() / 10;
        this.goldContent.string = this.goldNum.toString(10);
    }
}
