import BaseLayer from "../Base/BaseLayer";
import { Version_Pro, collisionManagerSwitch, DebugDrawSwitch, DrawBoundingBoxSwitch } from "../Config/SystemConfig";
import Util from "../Utils/Util";
import CpSDK from "../SDK/CpSDK";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LayerManger extends cc.Component {

    public static Instance: LayerManger = null;
    // public static GetInstance() {
    //     if (this.Instance == null) {
    //         // this.Instance = new cc.Node("UIMaskManager").addComponent(this);
    //         this.Instance = cc.find("Canvas").addComponent(this);
    //     }
    //     return this.Instance;
    // }

    protected onLoad() {
        LayerManger.Instance = this;
        Util.log('工程版本：' + Version_Pro);
        Util.log('SDK版本：' + CpSDK._Version);

        // let _collisionManager = cc.director.getCollisionManager();
        // if (!_collisionManager) return;
        // _collisionManager.enabled = collisionManagerSwitch;
        // _collisionManager.enabledDebugDraw = DebugDrawSwitch;
        // _collisionManager.enabledDrawBoundingBox = DrawBoundingBoxSwitch;
    }

    public GetLayer<T extends BaseLayer>(type: { prototype: T }): T {
        return this.node.getComponentInChildren<T>(type);
    }
    public GetStageW(): number {
        return cc.view.getVisibleSize().width;
    }
    public GetStageH(): number {
        return cc.view.getVisibleSize().height;
    }



    // update (dt) {}

}
