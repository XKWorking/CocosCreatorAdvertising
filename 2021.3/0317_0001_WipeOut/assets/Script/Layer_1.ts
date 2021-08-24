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
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import AudioManager from "./Manager/AudioManager";
import GlobalData from "./GlobalData";
import { GetViewH, GetViewW } from "./Config/SystemConfig";
import Layer_3 from "./Layer_3";
import Util from "./Utils/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {
    @property(cc.Integer)
    gameTime: number = 0;
    @property(cc.Node)
    canvas: cc.Node = null;
    @property(cc.Node)
    camera: cc.Node = null;
    @property(cc.Node)
    light_1: cc.Node = null;
    @property(cc.Node)
    Becca_01: cc.Node = null;
    @property(cc.Animation)
    anim_Becca: cc.Animation = null;
    @property(cc.Node)
    beccaSpeak: cc.Node = null;
    @property(cc.Node)
    light_2: cc.Node = null;
    @property(cc.Node)
    Maddie_01: cc.Node = null;
    @property(cc.Animation)
    anim_Maddie: cc.Animation = null;
    @property(cc.Node)
    maddieSpeak: cc.Node = null;
    @property(cc.Node)
    light_3: cc.Node = null;
    @property(cc.Node)
    Sarge_01: cc.Node = null;
    @property(cc.Animation)
    anim_Sarge: cc.Animation = null;
    @property(cc.Node)
    sargeSpeak: cc.Node = null;
    @property(cc.Node)
    finger: cc.Node = null;
    @property(cc.Node)
    fruiter: cc.Node = null;
    @property(cc.Node)
    stable: cc.Node = null;
    @property(cc.Node)
    watchtower: cc.Node = null;
    @property(cc.Node)
    hospital: cc.Node = null;
    @property(cc.Node)
    chooseConstruction: cc.Node = null;
    @property(cc.Prefab)
    vapour: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    scrollContent: cc.Node = null;
    @property(cc.Node)
    countDownBeginPos: cc.Node = null;
    @property(cc.Node)
    countDownEndPos: cc.Node = null;



    @property(cc.Node)
    img_CountDown: cc.Node = null;
    @property(cc.Label)
    label_CountDown: cc.Label = null;
    @property(cc.Node)
    img_Zombie: cc.Node = null;
    @property(cc.Node)
    redScreen: cc.Node = null;
    @property(cc.Node)
    img_Remind: cc.Node = null;
    @property(cc.Node)
    FemaleZombieNode: cc.Node = null;
    @property(cc.Node)
    InfectedPersonNode: cc.Node = null;
    @property(cc.Node)
    MaleZombieNode: cc.Node = null;

    @property(cc.Prefab)
    pre_FemaleZombie: cc.Prefab = null;
    @property(cc.Prefab)
    pre_InfectedPerson: cc.Prefab = null;
    @property(cc.Prefab)
    pre_MaleZombie: cc.Prefab = null;

    @property(cc.Node)
    zombieParent: cc.Node = null;

    @property(cc.Node)
    zombieBeginPos_1: cc.Node = null;
    @property(cc.Node)
    zombieBeginPos_2: cc.Node = null;

    @property(cc.Node)
    zombieEndPos_1: cc.Node = null;
    @property(cc.Node)
    zombieEndPos_2: cc.Node = null;

    @property(cc.Sprite)
    guidArrows: cc.Sprite = null;

    @property(cc.Node)
    arrowsDir: cc.Node = null;


    @property(cc.ProgressBar)
    wallHP_1: cc.ProgressBar = null;

    @property(cc.Sprite)
    wallHpBar_1: cc.Sprite = null;

    @property(cc.SpriteFrame)
    wallHpBarBg: cc.SpriteFrame = null;

    @property([cc.Node])
    arr_Dot: cc.Node[] = [];
    @property([cc.Node])
    arr_Content: cc.Node[] = [];
    @property([cc.Sprite])
    arr_Text: cc.Sprite[] = [];
    @property([cc.Sprite])
    arr_Next: cc.Sprite[] = [];
    @property([cc.Node])
    arr_Wasteland: cc.Node[] = [];
    @property([cc.Node])
    arr_Shovel: cc.Node[] = [];
    @property([cc.BoxCollider])
    arr_TagNode: cc.BoxCollider[] = [];
    @property([cc.Node])
    arr_Construction: cc.Node[] = [];
    // ================================================ //
    private _isClick: boolean = false;
    private _isShowText: boolean = true;
    private _width: number = 0;
    private _leftNum: number = 0;
    private _isMoveCamera: boolean = false;
    private _gameTime: number = 60;
    private _arr_DelectNode: cc.Node[] = [];
    private _wallHp_1: number = 100;
    private _wallHp_2: number = 100;
    private _zombieNum: number = 0;
    // private _isStartTime: boolean = false;

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.initGame();
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
    resizeChooseConstruction() {
        if (GetViewW() > GetViewH()) {
            console.log('横屏');
            this._isMoveCamera = false;
            this.arr_Content.forEach((temp) => {
                temp.scale = 1.6;
            });
        } else {
            console.log('竖屏');
            this.arr_Content.forEach((temp) => {
                temp.scale = 0.8;
            });
            if (GlobalData.instance.getLaunchBullet()) return;
            this._isMoveCamera = true;
        }
        cc.tween(this.canvas)
            .delay(0.1)
            .call(() => {
                this._width = this.canvas.width
                if (this._width >= 1280) {
                    this._width = 1280;
                    this.scrollContent.x = 0;
                }
                this.scrollView.node.width = this._width;
                let obj = this.scrollView.node.getChildByName('view');
                obj.width = this._width;
                GlobalData.instance.setHeight(this.canvas.height);
                GlobalData.instance.setWidth(this.canvas.width);
                this.addInitPos();
                this._leftNum = this.scrollContent.x;
            })
            .start();
    }
    public initGame() {
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.showNode(this.beccaSpeak, true);
                this.showNode(this.light_1, true);
                this.showDot_1();
                this.showNode(this.arr_Content[0], true);
                this.showText_1();
                this.showAnim(this.anim_Becca);
            })
            .start();
        this.arr_Shovel.forEach((temp) => {
            this.hideNode(temp, false);
        });
        this.node.on('ResizeView', (event) => {
            event.stopPropagation();
            this.resizeChooseConstruction();
        });
        this.resizeChooseConstruction();
        this._gameTime = this.gameTime;
    }

    private countDown() {
        this._gameTime--;
        this.label_CountDown.string = this._gameTime.toString();
        if (this._gameTime <= 10) {
            cc.tween(this.img_CountDown)
                .to(0.5, { scale: 0.6 })
                .to(0.5, { scale: 0.8 })
                .union()
                .repeatForever()
                .start();
            cc.tween(this.img_Zombie)
                .to(0.5, { scale: 0.6 })
                .to(0.5, { scale: 0.8 })
                .union()
                .repeatForever()
                .start();
            cc.tween(this.img_CountDown)
                .to(0.1, { angle: 5 })
                .to(0.1, { angle: 0 })
                .to(0.1, { angle: -5 })
                .to(0.1, { angle: 0 })
                .delay(0.1)
                .union()
                .repeat(1)
                .union()
                .repeatForever()
                .start();
        }
        if (this._gameTime <= 3) {
            AudioManager.play('alarm');
        }
        if (this._gameTime <= 0) {
            this.clickHideArrDelect();
            this.hideNode(this.chooseConstruction, true);
            this.img_CountDown.stopAllActions();
            this.hideNode(this.img_CountDown, true);
            this.hideNode(this.img_Zombie, true);
            this.createZombie_1();
            this.createZombie_2();
            this.unschedule(this.countDown);
            GlobalData.instance.setLaunchBullet(true);
            this.hideFinger();
            this.hideNode(this.guidArrows.node, false);
            this.hideNode(this.img_Remind, false);
            this.hideNode(this.arr_Shovel[0], false);
            this.hideNode(this.arr_Shovel[1], false);
            this.hideNode(this.arr_Shovel[2], false);
            this.hideNode(this.arr_Shovel[3], false);
            cc.tween(this.node)
                .call(() => {
                    AudioManager.play('fRoar');
                })
                .delay(1.2)
                .call(() => {
                    AudioManager.play('iRoar');
                })
                .delay(1.2)
                .call(() => {
                    AudioManager.play('mRoar');
                })
                .union()
                .repeatForever()
                .start();
        }
    }
    private createZombie_1() {
        this._zombieNum++;
        let obj = cc.instantiate(this.pre_FemaleZombie);
        obj.setParent(this.zombieParent)
        obj.setPosition(this.zombieBeginPos_1.getPosition());
        this.moveZombie(obj, this.zombieEndPos_1.getPosition());
        GlobalData.instance.addRightZombie(obj);
        if (this._zombieNum >= 50) return;
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                this.createZombie_3();
            })
            .start();
    }
    private createZombie_2() {
        this._zombieNum++;
        let obj = cc.instantiate(this.pre_InfectedPerson);
        obj.setParent(this.zombieParent)
        obj.setPosition(this.zombieBeginPos_2.getPosition());
        this.moveZombie(obj, this.zombieEndPos_2.getPosition());
        GlobalData.instance.addLeftZombie(obj);
        if (this._zombieNum >= 50) return;
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                this.createZombie_2();
            })
            .start();
    }
    private createZombie_3() {
        this._zombieNum++;
        let obj = cc.instantiate(this.pre_MaleZombie);
        obj.setParent(this.zombieParent)
        obj.setPosition(this.zombieBeginPos_1.getPosition());
        this.moveZombie(obj, this.zombieEndPos_1.getPosition());
        GlobalData.instance.addRightZombie(obj);
        if (this._zombieNum >= 50) return;
        cc.tween(this.node)
            .delay(0.3)
            .call(() => {
                this.createZombie_1();
            })
            .start();
    }
    private moveZombie(node: cc.Node, endPos: cc.Vec2) {
        cc.tween(node)
            .to(5, { position: endPos })
            .start();
    }
    guidStart() {
        this.arr_Construction.forEach((temp) => {
            temp.setContentSize(0, 0);
        });
        this.scrollView.enabled = false;
    }
    guidOver() {
        this.arr_Construction.forEach((temp) => {
            temp.setContentSize(250, 350);
        });
        this.scrollView.enabled = true;
    }
    showDot_1() {
        cc.tween(this.arr_Dot[0])
            .delay(0.4)
            .to(0.4, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Dot[1])
                    .to(0.4, { opacity: 255 }, { easing: 'fade' })
                    .call(() => {
                        cc.tween(this.arr_Dot[2])
                            .to(0.4, { opacity: 255 }, { easing: 'fade' })
                            .call(() => {
                                this.arr_Dot[0].opacity = 0;
                                this.arr_Dot[1].opacity = 0;
                                this.arr_Dot[2].opacity = 0;
                                this.showDot_1();
                            })
                            .start();
                    })
                    .start()
            })
            .start()
    }
    showDot_2() {
        cc.tween(this.arr_Dot[3])
            .delay(0.4)
            .to(0.4, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Dot[4])
                    .to(0.4, { opacity: 255 }, { easing: 'fade' })
                    .call(() => {
                        cc.tween(this.arr_Dot[5])
                            .to(0.4, { opacity: 255 }, { easing: 'fade' })
                            .call(() => {
                                this.arr_Dot[3].opacity = 0;
                                this.arr_Dot[4].opacity = 0;
                                this.arr_Dot[5].opacity = 0;
                                this.showDot_2();
                            })
                            .start();
                    })
                    .start()
            })
            .start()
    }
    showDot_3() {
        cc.tween(this.arr_Dot[6])
            .delay(0.4)
            .to(0.4, { opacity: 255 }, { easing: 'fade' })
            .call(() => {
                cc.tween(this.arr_Dot[7])
                    .to(0.4, { opacity: 255 }, { easing: 'fade' })
                    .call(() => {
                        cc.tween(this.arr_Dot[8])
                            .to(0.4, { opacity: 255 }, { easing: 'fade' })
                            .call(() => {
                                this.arr_Dot[6].opacity = 0;
                                this.arr_Dot[7].opacity = 0;
                                this.arr_Dot[8].opacity = 0;
                                this.showDot_3();
                            })
                            .start();
                    })
                    .start()
            })
            .start()
    }
    showNextContent() {
        if (!this._isShowText) return;
        this.showNode(this.maddieSpeak, true);
        this.showNode(this.light_2, true);
        this.showDot_2();
        this.showNode(this.arr_Content[1], true);
    }
    showText_1() {
        if (!this._isShowText) return;
        this.showNext(0);
        this._isClick = true;
        cc.tween(this.arr_Text[0])
            .to(0.5, { fillRange: -1 })
            .call(() => {
                cc.tween(this.arr_Text[0].node)
                    .delay(5)
                    .call(() => {
                        this.clickNext_1();
                    })
                    .start();
            })
            .start();
    }
    showText_2() {
        if (!this._isShowText) return;
        this.showAnim(this.anim_Maddie);
        this.showNext(1);
        this._isClick = true;
        cc.tween(this.arr_Text[1])
            .to(0.5, { fillRange: -1 })
            .call(() => {
                cc.tween(this.arr_Text[1].node)
                    .delay(5)
                    .call(() => {
                        this.clickNext_2();
                    })
                    .start();
            })
            .start();
    }
    showText_3() {
        if (!this._isShowText) return;
        this.showNext(2);
        this._isClick = true;
        cc.tween(this.arr_Text[2])
            .to(0.5, { fillRange: -1 })
            .call(() => {
                cc.tween(this.arr_Text[2].node)
                    .delay(5)
                    .call(() => {
                        this.clickNext_3();
                    })
                    .start();
            })
            .start();
    }
    showNext(num: number) {
        cc.tween(this.arr_Next[num])
            .to(0.5, { fillRange: 1 })
            .to(0, { fillRange: 0 })
            .delay(0.1)
            .to(0.5, { fillRange: 1 })
            .union()
            .repeatForever()
            .start();
    }
    clickNext_1() {
        if (!this._isClick) return;
        this.arr_Text[0].node.stopAllActions();
        this.hideNode(this.beccaSpeak, false);
        this.hideNode(this.light_1, false);
        this.hideNode(this.arr_Content[0], true);
        this._isClick = false;
        this.showFinger();
        this.showNode(this.arr_Shovel[0], true);
        this.moveCountDown();
        this.schedule(this.countDown, 1);
    }
    clickNext_2() {
        if (!this._isClick) return;
        this.arr_Text[1].node.stopAllActions();
        this.hideNode(this.maddieSpeak, false);
        this.hideNode(this.light_2, false);
        this.hideNode(this.arr_Content[1], true);
        this._isClick = false;
        this.showText_3();
        this.showAnim(this.anim_Sarge);
        this.showNode(this.sargeSpeak, true);
        this.showNode(this.light_3, true);
        this.showDot_3();
        this.showNode(this.arr_Content[2], true);
        this.clickHideArrDelect();
    }
    clickNext_3() {
        if (!this._isClick) return;
        this.arr_Text[2].node.stopAllActions();
        this._isShowText = false;
        this.hideNode(this.sargeSpeak, false);
        this.hideNode(this.light_3, false);
        this.hideNode(this.arr_Content[2], true);
        this._isClick = false;
        this.showNode(this.arr_Shovel[1], true);
        this.showNode(this.arr_Shovel[2], true);
        this.showNode(this.arr_Shovel[3], true);
        this.clickHideArrDelect();
    }

    showConstruction() {
        this.showNode(this.chooseConstruction, true);
    }

    clearWasteland_1() {
        this.createVapour(this.arr_Wasteland[0]);
        this.hideNode(this.arr_Shovel[0], false);
        this.hideNode(this.arr_Wasteland[0], true);
        this.finger.stopAllActions();
        this.showConstruction();
        let obj = this.finger.getChildByName('guideLight');
        this.hideNode(obj, false);
        this.moveFinger();
        this.guidStart();
        this.arr_TagNode[0].tag = 1;
    }

    clearWasteland_2() {
        this.createVapour(this.arr_Wasteland[1]);
        this.hideShovel(1);
        this.hideNode(this.arr_Wasteland[1], true);
        this.arr_TagNode[1].tag = 1;
        this.clickHideArrDelect();
    }

    clearWasteland_3() {
        this.createVapour(this.arr_Wasteland[2]);
        this.hideShovel(2);
        this.hideNode(this.arr_Wasteland[2], true);
        this.arr_TagNode[2].tag = 1;
        this.clickHideArrDelect();
    }

    clearWasteland_4() {
        this.createVapour(this.arr_Wasteland[3]);
        this.hideShovel(3);
        this.hideNode(this.arr_Wasteland[3], true);
        this.arr_TagNode[3].tag = 1;
        this.clickHideArrDelect();
    }

    showFinger() {
        if (GlobalData.instance.getIsGuidOver()) return;
        let pos = this.changePos(this.finger, this.arr_Shovel[0]);
        pos.x += 15;
        pos.y += 10;
        this.finger.setPosition(pos);
        this.showNode(this.finger, true);
        cc.tween(this.finger)
            .delay(0.2)
            .to(0.2, { scale: 0.6 })
            .to(0.2, { scale: 0.4 })
            .union()
            .repeatForever()
            .start();

    }
    private showRemindBreathe() {
        cc.tween(this.img_Remind)
            .to(0.5, { scale: 1 })
            .to(0.5, { scale: 0.8 })
            .union()
            .repeatForever()
            .start();
    }
    private showGuidArrows() {
        cc.tween(this.guidArrows)
            .to(0.5, { fillRange: 1 })
            .to(0, { fillRange: 0 })
            .delay(0.1)
            .union()
            .repeatForever()
            .start();
    }
    private lookAtObject() {
        //计算朝向
        let pos = this.changePos(this.guidArrows.node, this.arrowsDir);
        let orientationX = pos.x - this.guidArrows.node.x;
        let orientationY = pos.y - this.guidArrows.node.y;
        let dir = cc.v2(orientationX, orientationY);
        //计算夹角弧度(cc.v2(0,1)表示物体基于Y轴方向)
        let angle2 = dir.signAngle(cc.v2(0, 1))
        //弧度转换成欧拉角
        let olj = angle2 / Math.PI * 180;

        //物体朝向
        this.guidArrows.node.rotation = olj;
    }
    moveFinger() {
        if (GlobalData.instance.getIsGuidOver()) return;
        let pos = this.changePos(this.finger, this.fruiter);
        pos.y += 100;
        cc.tween(this.finger)
            .to(0.5, { position: pos })
            .call(() => {
                let pos_1 = this.changePos(this.finger, this.arrowsDir);
                cc.tween(this.finger)
                    .delay(0.2)
                    .to(0.5, { position: pos_1 })
                    // .by(0.5, { position: cc.v2(0, 200) })
                    .delay(0.2)
                    .to(0.5, { position: pos })
                    // .by(0, { position: cc.v2(0, -200) })
                    .union()
                    .repeatForever()
                    .start();
            })
            .start();
        let pos_1 = this.changePos(this.img_Remind, this.stable);
        pos_1.x -= 150;
        pos_1.y += 300;
        this.img_Remind.setPosition(pos_1);
        this.showNode(this.img_Remind, true);
        this.showRemindBreathe();
        let pos_2 = this.changePos(this.guidArrows.node, this.fruiter);
        pos_2.x += 50;
        pos_2.y += 100;
        this.guidArrows.node.setPosition(pos_2);
        this.lookAtObject();
        this.showNode(this.guidArrows.node, true);
        this.showGuidArrows();
    }

    moveFinger_2(node: cc.Node) {
        if (GlobalData.instance.getIsGuidOver()) return;
        this.finger.stopAllActions();
        let pos = this.changePos(this.finger, node);
        // pos.x += 30;
        pos.y += 10;
        this.finger.setPosition(pos);
        cc.tween(this.finger)
            .delay(0.2)
            .to(0.2, { scale: 0.6 })
            .to(0.2, { scale: 0.4 })
            .union()
            .repeatForever()
            .start();
        this.hideNode(this.img_Remind, true);
        this.hideNode(this.guidArrows.node, true);

    }
    hideFinger() {
        this.finger.stopAllActions();
        this.finger.active = false;
    }


    moveCountDown() {
        let t = cc.tween;
        t(this.countDownBeginPos)
            .parallel(
                t().to(0.5, { position: this.countDownEndPos.getPosition() }),
                t().to(0.5, { scale: 1 })
            )
            .start();
    }

    createVapour(node: cc.Node) {
        let obj = cc.instantiate(this.vapour);
        obj.setParent(this.arr_Wasteland[4]);
        let pos = this.changePos(obj, node);
        obj.setPosition(pos);
    }

    skipLayer() {

    }

    hideShovel(index: number) {
        this.arr_Shovel[index].active = false;
        let num = 0;
        this.arr_Shovel.forEach((temp) => {
            if (temp.activeInHierarchy) {
                num++;
            }
        });
        if (num > 0) return;
        this.showConstruction();
        // this.turnLeftPos();
        cc.tween(this.scrollContent)
            .call(() => {
                this.turnLeftPos();
            })
            .start();
    }

    showAnim(anim: cc.Animation) {
        anim.play();
    }

    hideAnim(anim: cc.Animation) {
        anim.stop();
    }

    moveCamera(x: number, y: number) {
        if (this._isMoveCamera) {
            cc.tween(this.camera)
                .by(0.3, { position: cc.v2(x, 0) })
                .start();
        } else {

            cc.tween(this.camera)
                .by(0.3, { position: cc.v2(0, y) })
                .start();
        }
    }
    goBack() {
        cc.tween(this.camera)
            .to(0.3, { position: cc.v2(0, 0) })
            .start();
    }

    addInitPos() {
        GlobalData.instance.clearInitPos();
        GlobalData.instance.addInitPos(this.fruiter.getPosition());
        GlobalData.instance.addInitPos(this.stable.getPosition());
        GlobalData.instance.addInitPos(this.watchtower.getPosition());
        GlobalData.instance.addInitPos(this.hospital.getPosition());
    }

    changeIndex(num: number) {
        switch (num) {
            case 1:
                this.fruiter.setSiblingIndex(3);
                break;
            case 2:
                this.stable.setSiblingIndex(3);
                break;
            case 3:
                this.watchtower.setSiblingIndex(3);
                break;
            case 4:
                this.hospital.setSiblingIndex(3);
                break;
        }
        this.turnLeftPos();
    }

    turnLeftPos() {
        this.scrollContent.x = this._leftNum;
    }


    public showRedScreen() {
        cc.tween(this.redScreen)
            .to(0.5, { opacity: 255 }, { easing: 'fade' })
            .to(0.5, { opacity: 0 }, { easing: 'fade' })
            .union()
            .repeatForever()
            .start();

    }
    public hideRedScreen() {
        this.hideNode(this.redScreen, false);
    }
    showNode(node: cc.Node, isAnim: boolean, num?: number) {
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

    hideNode(node: cc.Node, isAnim: boolean, num?: number) {
        if (num == null) {
            num = 0;
        }
        if (isAnim) {
            cc.tween(node)
                .to(0.5, { opacity: num }, { easing: 'fade' })
                .call(() => {
                    node.active = false;
                })
                .start();
        } else {
            node.opacity = num;
            if (num != 0) return;
            node.active = false;
        }
    }

    changePos(node1: cc.Node, node2: cc.Node): cc.Vec3 {
        let wordPoint: cc.Vec3 = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit: cc.Vec3 = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }
    downLoad() {
        CpSDK.ClickFinishDownloadBar(1, "结束下载按钮");
    }

    public addArrDelect(node: cc.Node) {
        this._arr_DelectNode.push(node);
    }
    public clickHideArrDelect() {
        if (this._arr_DelectNode == null) return;
        if (this._arr_DelectNode.length == 0) return;
        this._arr_DelectNode.forEach((temp) => {
            if (temp.activeInHierarchy) {
                temp.active = false;
            }
        });
    }
    public reduceHp_1(node: cc.Node) {
        this._wallHp_1 -= 10;
        if (this._wallHp_1 <= 50) {
            this.wallHpBar_1.spriteFrame = this.wallHpBarBg;
        }
        this.wallHP_1.progress = this._wallHp_1 / 100;
        if (this._wallHp_1 <= 0) {
            this.node.stopAllActions();
            node.stopAllActions();
            this.redScreen.stopAllActions();
            this.hideRedScreen();
            if (GlobalData.instance.getOpenLayer()) return;
            GlobalData.instance.setOpenLayer(true);
            LayerManger.Instance.GetLayer(Layer_3).OpenForTween();
            return;
        }
        cc.tween(node)
            .delay(1)
            .call(() => {
                this.reduceHp_1(node);
            })
            .start();
    }

}
