// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import BaseLayer from "./Base/BaseLayer";
import Util from "./Utils/Util";
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import FictionScrollView from "./FictionScrollView";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Node)
    img_Title_1: cc.Node = null;

    @property(cc.Node)
    guidFinger: cc.Node = null;

    @property(cc.Node)
    npcOptionNode: cc.Node = null;

    @property(cc.Node)
    npcInitOptionPos: cc.Node = null;

    @property(cc.Node)
    img_Remind_1: cc.Node = null;

    @property(cc.Node)
    img_Win: cc.Node = null;

    @property(cc.Node)
    failInterface: cc.Node = null;

    @property(cc.Node)
    img_Book: cc.Node = null;

    @property(cc.Node)
    img_BookLight: cc.Node = null;

    @property(cc.Node)
    spotContent_1: cc.Node = null;

    @property(cc.Node)
    spotContent_2: cc.Node = null;

    @property(cc.Node)
    doorNode: cc.Node = null;

    @property(cc.Node)
    left_Door: cc.Node = null;

    @property(cc.Node)
    left_DoorEndPos: cc.Node = null;

    @property(cc.Node)
    right_Door: cc.Node = null;

    @property(cc.Node)
    right_DoorEndPos: cc.Node = null;

    @property(cc.Node)
    fictionScrollView: cc.Node = null;


    @property([cc.Node])
    arr_InitOptionPos: cc.Node[] = [];

    @property([cc.Node])
    arr_OptionNode: cc.Node[] = [];

    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _chooseOptionIndex: number = 0;
    private _isClickOptionButton: boolean = false;
    private _arr_OptionSprite: cc.SpriteFrame[] = [];

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.InitGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        CpSDK.EnterSection(1, "游戏界面");

    }

    update(dt: number) {
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }


    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        this.SelfOptionNodeMove(this.arr_OptionNode[0], this.arr_InitOptionPos[0]);
        this.SelfOptionNodeMove(this.arr_OptionNode[1], this.arr_InitOptionPos[1]);
        this.SelfOptionNodeMove(this.arr_OptionNode[2], this.arr_InitOptionPos[2]);
        this.NpcOptionNodeMove(this.npcOptionNode, this.npcInitOptionPos.position)
        for (const node of this.arr_OptionNode) {
            let spriteFrame: cc.SpriteFrame = node.getComponent(cc.Sprite).spriteFrame;
            this._arr_OptionSprite.push(spriteFrame);
        }
        this.spotContent_1.active = true;
        this.spotContent_2.active = false;
        this.doorNode.active = false;
        AudioManager.play('flyCard');
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                AudioManager.play('flyCard');
            })
            .delay(0.1)
            .call(() => {
                AudioManager.play('flyCard');
            })
            .start();
    }


    private ShowGuidFinger() {
        this.guidFinger.active = true;
        cc.tween(this.guidFinger)
            .call(() => {
                this.guidFinger.parent = this.arr_InitOptionPos[0];
                this.guidFinger.setPosition(cc.v2(0, -60));
            })
            .delay(1.9)
            .call(() => {
                this.guidFinger.parent = this.arr_InitOptionPos[1];
                this.guidFinger.setPosition(cc.v2(0, -60));
            })
            .delay(1.9)
            .call(() => {
                this.guidFinger.parent = this.arr_InitOptionPos[2];
                this.guidFinger.setPosition(cc.v2(0, -60));
            })
            .delay(1.9)
            .union()
            .repeatForever()
            .start();
    }

    /**
     * npc出牌效果
     */
    private NpcOptionNodeMove(node: cc.Node, pos: cc.Vec3) {
        let t = cc.tween;
        t(node)
            .delay(1)
            .call(() => {
                this.ShowNode(this.img_Title_1, true);
            })
            .delay(0.5)
            .call(() => {
                AudioManager.play("playahand");
            })
            .parallel(
                t().to(1, { position: pos }, { easing: 'quadOut' }),
                t().to(1, { scale: 1 })
            )
            .call(() => {
                this._isClickOptionButton = true;
                CpSDK.EnterSection(2, "玩家选择界面");
                this.ShowNode(this.img_Remind_1, true);
                this.Shake(this.img_Remind_1);
                this.ShowGuidFinger();
            })
            .start();
    }

    /**
     * 玩家初始出牌效果
     * @param node 节点
     * @param pos 移动到的位置
     */
    private SelfOptionNodeMove(node: cc.Node, parent: cc.Node) {
        let t = cc.tween;
        t(node)
            .parallel(
                t().to(1, { position: parent.position }, { easing: 'quadOut' }),
                t().to(1, { angle: 0 }),
                t().to(1, { scale: 1 })
            )
            .call(() => {
                node.parent = parent;
                node.setPosition(cc.v2(0, 0));
            })
            .start();
    }

    /**
     * 选择剪刀
     */
    public ChooseOption_1() {
        if (!this._isClickOptionButton) return;
        CpSDK.FirstTouch();
        this._isClickOptionButton = false;
        this._chooseOptionIndex = 0;
        this.SelfOptionNodeTurnUp(this.arr_OptionNode[0]);
        this.SelfOptionNodeTurnDown(this.arr_OptionNode[1]);
        this.SelfOptionNodeTurnDown(this.arr_OptionNode[2]);
    }

    /**
     * 选择布
     */
    public ChooseOption_2() {
        if (!this._isClickOptionButton) return;
        CpSDK.FirstTouch();
        this._isClickOptionButton = false;
        this._chooseOptionIndex = 1;
        this.SelfOptionNodeTurnDown(this.arr_OptionNode[0]);
        this.SelfOptionNodeTurnUp(this.arr_OptionNode[1]);
        this.SelfOptionNodeTurnDown(this.arr_OptionNode[2]);
    }

    /**
     * 选择石头
     */
    public ChooseOption_3() {
        if (!this._isClickOptionButton) return;
        CpSDK.FirstTouch();
        this._isClickOptionButton = false;
        this._chooseOptionIndex = 2;
        this.SelfOptionNodeTurnDown(this.arr_OptionNode[0]);
        this.SelfOptionNodeTurnDown(this.arr_OptionNode[1]);
        this.SelfOptionNodeTurnUp(this.arr_OptionNode[2]);
    }

    private ShowResult(currentNode: cc.Node) {
        CpSDK.EnterSection(3, "显示结果界面");
        cc.tween(this.npcOptionNode)
            .to(0.3, { width: 0 })
            .call(() => {
                switch (this._chooseOptionIndex) {
                    case 0:
                        this.npcOptionNode.getComponent(cc.Sprite).spriteFrame = this._arr_OptionSprite[2];
                        break;
                    case 1:
                        this.npcOptionNode.getComponent(cc.Sprite).spriteFrame = this._arr_OptionSprite[0];
                        break;
                    case 2:
                        this.npcOptionNode.getComponent(cc.Sprite).spriteFrame = this._arr_OptionSprite[1];
                        break;
                }

            })
            .to(0.3, { width: 236 })
            .to(0.5, { scale: 1.5 }, { easing: 'backOut' })
            .call(() => {
                this.img_Win.active = true;

                AudioManager.play("over");
                cc.tween(this.img_Win)
                    .to(0.5, { scale: 0.8 }, { easing: 'backOut' })
                    .delay(0.5)
                    .call(() => {
                        this.ShowNode(this.failInterface, true);
                        cc.tween(this.failInterface)
                            .to(0.5, { scale: 1 }, { easing: 'backOut' })
                            .start();
                        this.ShowBookLight();
                        AudioManager.play('book');
                        cc.tween(this.img_Book)
                            .to(0.3, { width: 0 })
                            .to(0.3, { width: 468 })
                            .start()
                    })
                    .start();
                this.SelfOptionNodeTurnDown(currentNode)
            })
            .start()
    }


    private ShowBookLight() {
        cc.tween(this.img_BookLight)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.img_BookLight)
                    .by(4, { angle: 360 })
                    .union()
                    .repeatForever()
                    .start();
            })
            .start();
    }

    /**
     * 实现上升效果
     * @param currentNode 要上升的节点
     */
    private SelfOptionNodeTurnUp(currentNode: cc.Node) {
        AudioManager.play("playahand");
        this.img_Remind_1.stopAllActions();
        this.HideNode(this.img_Remind_1, true);
        this.guidFinger.stopAllActions();
        this.guidFinger.active = false;
        cc.tween(currentNode)
            .by(0.3, { position: cc.v3(0, 150) })
            .call(() => {
                this.ShowResult(currentNode);
            })
            .start()
    }

    /**
     * 实现下落效果
     * @param node 要下落的节点
     */
    private SelfOptionNodeTurnDown(node: cc.Node) {
        cc.tween(node.parent)
            .by(2, { position: cc.v3(0, -1000) })
            .call(() => {
                node.parent.active = false;
            })
            .start();
        cc.tween(node)
            .by(4, { angle: -360 })
            .start();
    }


    public ClickReadButton() {
        CpSDK.EnterSection(4, "显示读小说界面");
        AudioManager.play("button", 0.8);
        this.img_BookLight.stopAllActions();
        this.HideNode(this.failInterface, true);
        this.spotContent_1.active = false;
        this.spotContent_2.active = true;
        this.doorNode.active = true;
        let lefPos: cc.Vec3 = this.ChangePos(this.left_Door, this.left_DoorEndPos);
        let rightPos: cc.Vec3 = this.ChangePos(this.right_Door, this.right_DoorEndPos);
        AudioManager.play('openDoor');
        cc.tween(this.left_Door)
            .to(1, { position: lefPos })
            .start();
        cc.tween(this.right_Door)
            .to(1, { position: rightPos })
            .call(() => {
                this.fictionScrollView.getComponent(FictionScrollView).StartMove();
            })
            .start();

    }


    /**
     * 游戏结束
     */
    public GameOver() {
        if (this._isGameOver) return;
        this._isGameOver = true;
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }


    /**
   * 激活节点
   * @param node 要激活的节点 
   * @param isAnim 是否有0.5s的缓动效果
   * @param num 透明度，不输入则为255
   */
    public ShowNode(node: cc.Node, isAnim: boolean, num?: number) {
        node.active = true;
        if (num == null) {
            num = 255;
        }
        if (isAnim) {
            cc.tween(node)
                .to(0.5, { opacity: num }, { easing: 'fade' })
                .start();
        } else {
            node.opacity = num;
        }
    }
    /**
     * 关闭节点
     * @param node 要关闭的节点 
     * @param isAnim 是否有0.5s的缓动效果
     * @param num 透明度，不输入则为0
     */
    public HideNode(node: cc.Node, isAnim: boolean, num?: number) {
        if (num == null) {
            num = 0;
        }
        if (isAnim) {
            cc.tween(node)
                .to(0.5, { opacity: num }, { easing: 'fade' })
                .call(() => {
                    if (num != 0) return;
                    node.active = false;
                })
                .start();
        } else {
            node.opacity = num;
            if (num != 0) return;
            node.active = false;
        }
    }



    /**
     * 
     * @param node1 要被转换的node
     * @param node2 目标node
     * @returns 
     */
    public ChangePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }

    /**
     * 摇摆效果
     * @param node 
     */
    private Shake(node: cc.Node) {
        cc.tween(node)
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


}
