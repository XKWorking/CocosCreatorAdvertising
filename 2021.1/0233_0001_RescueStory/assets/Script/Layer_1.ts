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
import { globalData } from "./Config/SystemConfig";
import Counter from "./Components/Counter";
import LayerManger from "./Manager/LayerManger";
import Layer_2 from "./Layer_2";
import CpSDK from "./CpTool/SDK/CpSDK";
import PoolManager from "./Manager/PoolManager";
import AudioManager from "./Manager/AudioManager";
import Layer_3 from "./Layer_3";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    btn_DownLoad_1: cc.Node = null;

    @property(cc.Label)
    label_Money: cc.Label = null;

    @property(cc.Sprite)
    game_level_1: cc.Sprite = null;

    @property(cc.Sprite)
    game_level_2: cc.Sprite = null;

    @property(cc.Sprite)
    game_level_3: cc.Sprite = null;

    @property(cc.SpriteFrame)
    game_level_status: cc.SpriteFrame[] = [];

    @property(sp.Skeleton)
    bonusball: sp.Skeleton = null;

    @property(cc.Node)
    showContent: cc.Node = null;

    @property(cc.Prefab)
    countdown: cc.Prefab = null;

    @property(cc.Prefab)
    dog: cc.Prefab = null;

    @property(cc.Prefab)
    hammerBall: cc.Prefab = null;

    @property(cc.Prefab)
    successGold: cc.Prefab = null;

    @property([cc.Prefab])
    arr_Questions: cc.Prefab[] = [];

    @property(cc.Node)
    questions: cc.Node = null;

    @property(sp.Skeleton)
    man: sp.Skeleton = null;

    @property(sp.Skeleton)
    girl: sp.Skeleton = null;

    @property(sp.Skeleton)
    host: sp.Skeleton = null;

    @property(cc.Node)
    box: cc.Node = null;

    @property(cc.Node)
    screen_1: cc.Node = null;

    @property(cc.Node)
    screen_2: cc.Node = null;

    @property(sp.Skeleton)
    audience: sp.Skeleton = null;

    @property(cc.Node)
    road: cc.Node = null;

    @property(cc.Node)
    trophyDesk: cc.Node = null;

    @property(cc.Node)
    leftNode: cc.Node = null;

    @property(cc.Node)
    rightNode: cc.Node = null;

    @property(cc.Node)
    reminderClickLeft: cc.Node = null;

    @property(cc.Node)
    reminderClickRight: cc.Node = null;

    @property(cc.Node)
    chooseBtn_0: cc.Node = null;

    @property(cc.Node)
    chooseBtn_1: cc.Node = null;

    @property(cc.Sprite)
    changeBtn_Left: cc.Sprite = null;

    @property(cc.Sprite)
    changeBtn_Right: cc.Sprite = null;

    @property([cc.SpriteFrame])
    answer_0: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    answer_1: cc.SpriteFrame[] = [];

    @property(cc.Node)
    rightAns_0: cc.Node = null;

    @property(cc.Node)
    wrongAns_0: cc.Node = null;

    @property(cc.Node)
    rightAns_1: cc.Node = null;

    @property(cc.Node)
    wrongAns_1: cc.Node = null;

    @property(cc.Node)
    chooseMask_0: cc.Node = null;

    @property(cc.Node)
    chooseMask_1: cc.Node = null;

    @property(cc.Prefab)
    answerContent: cc.Prefab = null;

    @property(cc.Node)
    manPos: cc.Node = null;

    @property(cc.Node)
    girlPos: cc.Node = null;

    @property([cc.Node])
    arr_Results: cc.Node[] = [];

    @property([cc.Sprite])
    arr_ResultsIcon: cc.Sprite[] = [];

    @property([cc.SpriteFrame])
    arr_FhIcon: cc.SpriteFrame[] = [];

    @property(sp.Skeleton)
    leiDian: sp.Skeleton = null;

    @property(cc.Prefab)
    caidai: cc.Prefab = null;

    @property(cc.Node)
    node_EndPos: cc.Node = null;

    @property(cc.Prefab)
    pre_FlyGold: cc.Prefab = null;

    // ================================================ //


    private _money: number = 0;

    private _playNum: number = 0;

    private _isCanClick = false;

    private _level_Index = 0;

    private _beginTime = 0;

    private _endingTime = 2;

    private _isRunTime = false;

    private _playerChooseTrue = false;

    private _playerChooseLeft = false;

    onLoad() {
        super.onResize();
        this.onBindTouch();
        this._level_Index = 1;

        this.chooseBtn_0.on("click", () => {
            if (!this._isCanClick) return;
            if (this.chooseMask_0.active) return;
            AudioManager.play('click');
            this.reminderClickLeft.active = false;
            this.reminderClickRight.active = false;
            this.showbtnMask(0)
            switch (this._level_Index) {
                case 1: {
                    this.choose_1_0();
                    this._isRunTime = false;
                    this._beginTime = 0;
                    this._playerChooseTrue = false;
                    this._playerChooseLeft = true;
                    break;
                }
                case 2: {
                    this.choose_2_0();
                    this._isRunTime = false;
                    this._beginTime = 0;
                    this._playerChooseTrue = true;
                    this._playerChooseLeft = true;
                    break;
                }
                // case 3: {
                //     this.choose_3_0();
                //     this._isRunTime = false;
                //     this._beginTime = 0;
                //     this._playerChooseTrue = false;
                //     this._playerChooseLeft = true;
                //     break;
                // }
            };
            this._isCanClick = false;
        });
        this.chooseBtn_1.on("click", () => {
            if (!this._isCanClick) return;
            if (this.chooseMask_1.active) return;
            AudioManager.play('click');
            this.reminderClickLeft.active = false;
            this.reminderClickRight.active = false;
            this.showbtnMask(1)
            switch (this._level_Index) {
                case 1: {
                    this.choose_1_1();
                    this._isRunTime = false;
                    this._beginTime = 0;
                    this._playerChooseTrue = true;
                    this._playerChooseLeft = false;
                    break;
                }
                case 2: {
                    this.choose_2_1();
                    this._isRunTime = false;
                    this._beginTime = 0;
                    this._playerChooseTrue = false;
                    this._playerChooseLeft = false;
                    break;
                }
                // case 3: {
                //     this.choose_3_1();
                //     this._isRunTime = false;
                //     this._beginTime = 0;
                //     this._playerChooseTrue = true;
                //     this._playerChooseLeft = false;
                //     break;
                // }
            };
            this._isCanClick = false;
        });

    }

    changeMoney(num: number): string {
        num = this._money / 1000;
        return num.toString();
    }

    protected start() {
        this.label_Money.string = this.changeMoney(this._money);

        CpSDK.EnterSection(1, "游戏界面");

        this.chooseBtn_0.getComponent(cc.Button).enabled = false;
        this.chooseBtn_1.getComponent(cc.Button).enabled = true;
        this.host.clearTracks();
        this.host.setAnimation(0, 'ani_begin', false);
        this.host.addAnimation(0, 'ani_begin2', false);
        this.host.setEndListener(() => {
            cc.tween(this.box)
                .to(0.3, { opacity: 255 })
                .delay(0.8)
                .call(() => {
                    this.hideScreen2();
                })
                .start();
            this.createQuestion(0, 0);
        });
        this.man.clearTracks();
        this.man.setAnimation(0, 'idel3', true);
        this.girl.clearTracks();
        this.girl.setAnimation(0, 'Standby1', true);
        this.game_level_1.spriteFrame = this.game_level_status[1];
        this.game_level_2.spriteFrame = this.game_level_status[0];
        this.game_level_3.spriteFrame = this.game_level_status[0];

    }

    update(dt: number) {
        this.label_Money.string = this.changeMoney(this._money);
        if (this._isRunTime) {
            this._beginTime += dt;
            if (this._beginTime >= this._endingTime) {
                this.showReminder();
                this._isRunTime = false;
                this._beginTime = 0;
            }
        }
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }

    createAnswerQuestion(num: number, isMan: boolean) {
        if (isMan) {
            let obj = PoolManager.instance.getNode(this.answerContent, this.manPos);
            let sprite = obj.getChildByName('content').getComponent(cc.Sprite);
            obj.setPosition(cc.v2(0, 0));
            if (num == 1) {
                sprite.spriteFrame = this.answer_0[0];
            } else if (num == 2) {
                sprite.spriteFrame = this.answer_0[1];
            } else if (num == 3) {
                sprite.spriteFrame = this.answer_0[2];
            } else if (num == 4) {
                sprite.spriteFrame = this.answer_1[0];
            } else if (num == 5) {
                sprite.spriteFrame = this.answer_1[1];
            } else if (num == 6) {
                sprite.spriteFrame = this.answer_1[2];
            }
            cc.tween(obj)
                .delay(0.3)
                .call(() => {
                    PoolManager.instance.putNode(obj);
                })
                .start();
            this.man.clearTracks();
            AudioManager.play('scare');
            this.man.setAnimation(0, 'Doubtidel', true);
            this.man.addAnimation(0, 'idel3', true);
        } else {
            let obj = PoolManager.instance.getNode(this.answerContent, this.girlPos);
            let sprite = obj.getChildByName('content').getComponent(cc.Sprite);
            sprite.node.scaleX = -0.8;
            obj.setPosition(cc.v2(0, 0));
            if (num == 1) {
                sprite.spriteFrame = this.answer_0[0];//错的
            } else if (num == 2) {
                sprite.spriteFrame = this.answer_0[1];//对的
            } else if (num == 3) {
                sprite.spriteFrame = this.answer_0[2];//错的
            } else if (num == 4) {
                sprite.spriteFrame = this.answer_1[0];//对的
            } else if (num == 5) {
                sprite.spriteFrame = this.answer_1[1];//错的
            } else if (num == 6) {
                sprite.spriteFrame = this.answer_1[2];//对的
            }
            cc.tween(obj)
                .delay(0.3)
                .call(() => {
                    PoolManager.instance.putNode(obj);
                    if (num == 1 || num == 4) {
                        this.arr_Results[0].active = true;
                        cc.tween(this.arr_Results[0])
                            .delay(0.3)
                            .call(() => {
                                this.createQuestion(2, 2);
                            })
                            .start();
                    }
                    else if (num == 2 || num == 5) {
                        this.arr_Results[1].active = true;
                        cc.tween(this.arr_Results[1])
                            .delay(0.6)
                            .call(() => {
                                this.createQuestion(2, 2);
                            })
                            .start();
                    }
                    else if (num == 3 || num == 6) {
                        this.arr_Results[2].active = true;
                        cc.tween(this.arr_Results[2])
                            .delay(0.6)
                            .call(() => {
                                this.createQuestion(2, 2);
                            })
                            .start();
                    }
                })
                .start();
            this.girl.clearTracks();
            this.girl.setAnimation(0, 'doubt2', true);
            this.girl.addAnimation(0, 'Standby1', true);
        }

    }

    createQuestion(num_1: number, num_2: number) {
        let obj = PoolManager.instance.getNode(this.arr_Questions[num_1], this.questions);
        obj.setScale(0);
        obj.opacity = 0;
        obj.setPosition(cc.v2(35, 35));
        cc.tween(obj)
            .to(0.2, { opacity: 255 })
            .to(0.3, { scale: 1.85 })
            .delay(1)
            .call(() => {
                if (num_2 == 1) {
                    AudioManager.play('scare');
                    this.man.clearTracks();
                    this.man.setAnimation(0, 'Doubtidel', true);
                    AudioManager.play('doubt21');
                    this.girl.clearTracks();
                    this.girl.setAnimation(0, 'doubt2', true);
                    this.createLevel_1();
                } else if (num_2 == 2) {
                    this.showResult(this._playerChooseLeft, this._playerChooseTrue);
                } else if (num_2 == 3) {
                    if (this._level_Index == 2) {
                        this.game_level_1.spriteFrame = this.game_level_status[2];
                        this.game_level_2.spriteFrame = this.game_level_status[1];
                        this.man.clearTracks();
                        AudioManager.play('scare');
                        this.man.setAnimation(0, 'Doubtidel', true);
                        this.girl.clearTracks();
                        AudioManager.play('doubt21');
                        this.girl.setAnimation(0, 'doubt2', true);
                        this.createHammer();
                        this.arr_ResultsIcon[6].node.active = false;
                        this.arr_ResultsIcon[7].node.active = false;
                    }
                    // else if (this._level_Index == 3) {
                    //     this.game_level_2.spriteFrame = this.game_level_status[2];
                    //     this.game_level_3.spriteFrame = this.game_level_status[1];
                    //     this.man.clearTracks();
                    //     AudioManager.play('scare');
                    //     this.man.setAnimation(0, 'Doubtidel', true);
                    //     this.girl.clearTracks();
                    //     AudioManager.play('doubt21');
                    //     this.girl.setAnimation(0, 'doubt2', true);
                    //     this.createBall();
                    //     this.arr_ResultsIcon[6].node.active = false;
                    //     this.arr_ResultsIcon[7].node.active = false;
                    // }
                } else if (num_2 == 4) {
                    this.man.clearTracks();
                    AudioManager.play('scare');
                    this.man.setAnimation(0, 'Doubtidel', true);
                    this.girl.clearTracks();
                    AudioManager.play('doubt21');
                    this.girl.setAnimation(0, 'doubt2', true);
                    this.createLevel_2();
                }
                // else if (num_2 == 5) {
                //     this.man.clearTracks();
                //     AudioManager.play('scare');
                //     this.man.setAnimation(0, 'Doubtidel', true);
                //     this.girl.clearTracks();
                //     AudioManager.play('doubt21');
                //     this.girl.setAnimation(0, 'doubt2', true);
                //     this.createLevel_3();
                // }
                PoolManager.instance.putNode(obj);
            })
            .start();
        return obj;
    }

    createCaiDai() {
        AudioManager.play('firework');
        let obj = cc.instantiate(this.caidai);
        obj.setParent(this.bonusball.node);
        obj.setPosition(cc.v2(0, 400));
    }

    createDog() {
        let obj = PoolManager.instance.getNode(this.dog, this.showContent);
        obj.setPosition(cc.v2(0, -60));
        let anim = obj.getComponent(sp.Skeleton);
        AudioManager.play('bark');
        anim.clearTracks();
        if (this._playNum == 0) {
            console.log(this._playNum);
            anim.timeScale = 0.6;
        } else {
            console.log(this._playNum);
            anim.timeScale = 1
        }
        anim.setAnimation(0, 'ani_runIdle', false);
        anim.setCompleteListener(() => {
            if (this._playNum < 1) {
                this._playNum++;
                PoolManager.instance.putNode(obj);
                this.createDog();
            } else {
                this._playNum = 0;
                PoolManager.instance.putNode(obj);
                this.createQuestion(1, 1);
            }
        });
    }

    createHammer() {
        let obj = PoolManager.instance.getNode(this.hammerBall, this.showContent);
        obj.setPosition(cc.v2(0, -25));
        let anim = obj.getComponent(sp.Skeleton);
        AudioManager.play('throw');
        anim.clearTracks();
        if (this._playNum == 0) {
            console.log(this._playNum);
            anim.timeScale = 0.5;
        } else {
            console.log(this._playNum);
            anim.timeScale = 1
        }
        anim.setAnimation(0, 'ani_boneidel', false);
        anim.setCompleteListener(() => {
            if (this._playNum < 1) {
                this._playNum++;
                PoolManager.instance.putNode(obj);
                this.createHammer();
            } else {
                this._playNum = 0;
                PoolManager.instance.putNode(obj);
                this.createQuestion(4, 4);
            }
        });
    }

    // createBall() {
    //     let obj = PoolManager.instance.getNode(this.hammerBall, this.showContent);
    //     obj.setPosition(cc.v2(0, -40));
    //     let anim = obj.getComponent(sp.Skeleton);
    //     AudioManager.play('flyin');
    //     anim.clearTracks();
    //     if (this._playNum == 0) {
    //         console.log(this._playNum);
    //         anim.timeScale = 0.5;
    //     } else {
    //         console.log(this._playNum);
    //         anim.timeScale = 1
    //     }
    //     anim.setAnimation(0, 'ani_ballidel', false);
    //     anim.setCompleteListener(() => {
    //         if (this._playNum < 1) {
    //             this._playNum++;
    //             PoolManager.instance.putNode(obj);
    //             this.createBall();
    //         } else {
    //             this._playNum = 0;
    //             PoolManager.instance.putNode(obj);
    //             this.createQuestion(4, 5);
    //         }
    //     });
    // }

    createSuccessGold() {
        let obj = PoolManager.instance.getNode(this.successGold, this.showContent);
        // obj.setPosition(cc.v2(0, -60));
    }

    showReminder() {//posNode: cc.Node
        if (this._level_Index == 1) {
            this.chooseBtn_0.getComponent(cc.Button).enabled = false;
            this.chooseBtn_1.getComponent(cc.Button).enabled = true;
            this.reminderClickLeft.active = false;
            this.reminderClickRight.active = true;
        } else if (this._level_Index == 2) {
            // this.chooseBtn_0.getComponent(cc.Button).enabled = true;
            // this.chooseBtn_1.getComponent(cc.Button).enabled = false;
            this.reminderClickLeft.active = true;
            this.reminderClickRight.active = false;
        }
        //  else if (this._level_Index == 3) {
        //     // this.chooseBtn_0.getComponent(cc.Button).enabled = false;
        //     // this.chooseBtn_1.getComponent(cc.Button).enabled = true;
        //     this.reminderClickLeft.active = false;
        //     this.reminderClickRight.active = true;
        // }
    }

    createLevel_1() {
        this.showChooseBtn(1);
        // this.showReminder();
        this.chooseBtn_0.getComponent(cc.Button).enabled = false;
        this.chooseBtn_1.getComponent(cc.Button).enabled = true;
        this.reminderClickLeft.active = false;
        this.reminderClickRight.active = true;

    }

    createLevel_2() {
        this._isRunTime = true;
        this.showChooseBtn(2);
    }

    // createLevel_3() {
    //     this._isRunTime = true;
    //     this.showChooseBtn(3);
    // }

    hideScreen2() {
        cc.tween(this.screen_2)
            .to(0.8, { opacity: 0 })
            .delay(0.5)
            .call(() => {
                this.createDog();
            })
            .start();
    }

    showScreen2() {
        cc.tween(this.screen_2)
            .to(0.1, { opacity: 255 })
            .call()
            .start();
    }

    showRoad() {
        cc.tween(this.road)
            .to(0.6, { scaleX: 1.2 })
            .call(() => {
                this.showTrophyDesk();
            })
            .start();
    }

    showTrophyDesk() {
        cc.tween(this.trophyDesk)
            .by(1, { position: cc.v2(0, 400) })
            .start();
    }

    showAudience(isLaught: boolean) {
        if (isLaught) {
            this.audience.clearTracks();
            this.audience.setAnimation(0, "ani_happy", false);
            this.audience.setCompleteListener(() => {
                this.closeAudience();
            });
        } else {
            this.audience.clearTracks();
            AudioManager.play('cheer', 0.5);
            this.audience.setAnimation(0, "ani_happy", true);
        }
    }

    closeAudience() {
        this.audience.clearTracks();
        this.audience.addAnimation(0, "ani_idle", true)
    }

    private showChooseBtn(num: number) {
        this.chooseBtn_0.active = true;
        this.chooseBtn_1.active = true;
        this.chooseMask_0.active = false;
        this.chooseMask_1.active = false;
        this.rightAns_0.active = false;
        this.rightAns_1.active = false;
        this.wrongAns_0.active = false;
        this.wrongAns_1.active = false;
        this.chooseBtn_0.scale = 0;
        this.chooseBtn_1.scale = 0;
        if (num == 1) {
            this.changeBtn_Left.spriteFrame = this.answer_0[0];
            this.changeBtn_Right.spriteFrame = this.answer_1[0];
        } else if (num == 2) {
            this.changeBtn_Left.spriteFrame = this.answer_0[1];
            this.changeBtn_Right.spriteFrame = this.answer_1[1];
        } 
        // else if (num == 3) {
        //     this.changeBtn_Left.spriteFrame = this.answer_0[2];
        //     this.changeBtn_Right.spriteFrame = this.answer_1[2];
        // }
        cc.tween(this.chooseBtn_0)
            .to(0.5, { opacity: 255, scale: 1 }, { easing: 'backOut' })
            .start();
        cc.tween(this.chooseBtn_1)
            .to(0.5, { opacity: 255, scale: 1 }, { easing: 'backOut' })
            .start();
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this._isCanClick = true;
            })
            .start();
    }
    private hiddenChooseBtn() {
        cc.tween(this.chooseBtn_0)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.chooseBtn_0.active = false;
            })
            .start();
        cc.tween(this.chooseBtn_1)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.chooseBtn_1.active = false;
            })
            .start();
        this.chooseBtn_0.getComponent(cc.Button).enabled = true;
        this.chooseBtn_1.getComponent(cc.Button).enabled = true;
    }
    private showResult(isLeft: boolean, isTrue: boolean) {
        if (isTrue) {
            AudioManager.play('right', 0.75);
            this.showAudience(false);
            if (isLeft) {
                this.rightAns_0.active = true;
                this.rightAns_0.opacity = 0;
                this.rightAns_0.scale = 2;
                this.rightAns_0.runAction(cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeIn(0.5)));
                AudioManager.play('yeah');
                this.man.clearTracks();
                this.man.setAnimation(0, 'idel4', false);
                AudioManager.play('shrink_2', 0.75);
                this.girl.clearTracks();
                this.girl.setAnimation(0, 'fear2', false);
                this.scatterGold(this.chooseBtn_0);
            } else {
                this.rightAns_1.active = true;
                this.rightAns_1.opacity = 0;
                this.rightAns_1.scale = 2;
                this.rightAns_1.runAction(cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeIn(0.5)));
                AudioManager.play('yeah');
                this.man.clearTracks();
                this.man.setAnimation(0, 'idel4', false);
                AudioManager.play('shrink_2', 0.75);
                this.girl.clearTracks();
                this.girl.setAnimation(0, 'fear2', false);
                this.scatterGold(this.chooseBtn_1);
            }
            if (this._level_Index == 1) {
                this.arr_ResultsIcon[0].node.active = true;
                this.arr_ResultsIcon[0].spriteFrame = this.arr_FhIcon[0];
                this.arr_ResultsIcon[3].node.active = true;
                this._level_Index++;
            } else if (this._level_Index == 2) {

                this.arr_ResultsIcon[1].node.active = true;
                this.arr_ResultsIcon[1].spriteFrame = this.arr_FhIcon[0];
                this.arr_ResultsIcon[4].node.active = true;
                this.arr_ResultsIcon[4].spriteFrame = this.arr_FhIcon[1];
                this._level_Index++;
            }
            //  else if (this.game_level_3) {
            //     this.arr_ResultsIcon[2].node.active = true;
            //     this.arr_ResultsIcon[2].spriteFrame = this.arr_FhIcon[0];
            //     this.arr_ResultsIcon[5].node.active = true;
            //     this._level_Index++;
            // }
            this.arr_ResultsIcon[6].node.active = true;
            this.arr_ResultsIcon[6].spriteFrame = this.arr_FhIcon[2];
            this.arr_ResultsIcon[7].node.active = true;
            this.arr_ResultsIcon[7].spriteFrame = this.arr_FhIcon[3];
            AudioManager.play('shortcircuit');
            this.leiDian.node.active = true;
            this.leiDian.clearTracks();
            this.leiDian.setStartListener(() => {
                cc.tween(this.girl)
                    .delay(1.2)
                    .call(() => {
                        this.girl.enabled = false;
                    })
                    .start();
            });
            this.leiDian.setAnimation(0, 'texiao', false);
            this.leiDian.setCompleteListener(() => {
                this.girl.enabled = true;
                this.leiDian.node.active = false;
                this.girl.clearTracks();
                AudioManager.play('hum');
                this.girl.setAnimation(0, 'aonao', false);
                this.girl.addAnimation(0, 'Standby1', false);
                this.hiddenChooseBtn();
                this.closeAudience();
                if (this._level_Index == 3) {
                    this.game_level_2.spriteFrame = this.game_level_status[2];
                    this.showScreen2();
                    this.showRoad();
                    this.bonusball.clearTracks();
                    this.bonusball.setAnimation(0, 'ani_open', false);
                    this.createCaiDai();
                    cc.tween(this.node)
                        .delay(2)
                        .call(() => {
                            this.GameWin();
                        })
                        .start();
                    return;
                }
                this.createQuestion(3, 3);
            });
        } else {
            AudioManager.play('wrong', 1);
            // this.showAudience(true);
            if (isLeft) {
                this.wrongAns_0.active = true;
                this.wrongAns_0.opacity = 0;
                this.wrongAns_0.scale = 2;
                this.wrongAns_0.runAction(cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeIn(0.5)));
                this.man.clearTracks();
                AudioManager.play('surprised_2');
                this.man.setAnimation(0, 'scaryidel', false);
                this.girl.clearTracks();
                AudioManager.play('yeah_2');
                this.girl.setAnimation(0, 'happy', false);
            } else {
                this.wrongAns_1.active = true;
                this.wrongAns_1.opacity = 0;
                this.wrongAns_1.scale = 2;
                this.wrongAns_1.runAction(cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeIn(0.5)));

                this.man.clearTracks();
                AudioManager.play('surprised_2');
                this.man.setAnimation(0, 'scaryidel', false);
                this.girl.clearTracks();
                AudioManager.play('yeah_2');
                this.girl.setAnimation(0, 'happy', false);
            }
            if (this._level_Index == 1) {
                this.arr_ResultsIcon[0].node.active = true;
                this.arr_ResultsIcon[0].spriteFrame = this.arr_FhIcon[1];
                this.arr_ResultsIcon[3].node.active = true;
            } else if (this._level_Index == 2) {

                this.arr_ResultsIcon[1].node.active = true;
                this.arr_ResultsIcon[1].spriteFrame = this.arr_FhIcon[1];
                this.arr_ResultsIcon[4].node.active = true;
                this.arr_ResultsIcon[4].spriteFrame = this.arr_FhIcon[0];
            }
            // else if (this.game_level_3) {
            //     this.arr_ResultsIcon[2].node.active = true;
            //     this.arr_ResultsIcon[2].spriteFrame = this.arr_FhIcon[1];
            //     this.arr_ResultsIcon[5].node.active = true;
            // }
            this.arr_ResultsIcon[6].node.active = true;
            this.arr_ResultsIcon[6].spriteFrame = this.arr_FhIcon[3];
            this.arr_ResultsIcon[7].node.active = true;
            this.arr_ResultsIcon[7].spriteFrame = this.arr_FhIcon[2];
            this.GameFail();
        }
        this.arr_Results[0].active = false;
        this.arr_Results[1].active = false;
        this.arr_Results[2].active = false;
    }
    private showbtnMask(index: number) {
        if (index == 0) {
            this.chooseMask_0.active = true;
        } else {
            this.chooseMask_1.active = true;
        }
    }
    private choose_1_0() {
        cc.tween(this.node)
            // .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(1, true);
            })
            .start();
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(4, false);
            })
            .start();
    }
    private choose_1_1() {
        cc.tween(this.node)
            // .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(4, true);
            })
            .start();
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(1, false);
            })
            .start();
    }
    private choose_2_0() {
        cc.tween(this.node)
            // .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(2, true);
            })
            .start();
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(5, false);
            })
            .start();
    }
    private choose_2_1() {
        cc.tween(this.node)
            // .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(5, true);
            })
            .start();
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.createAnswerQuestion(2, false);
            })
            .start();
    }
    // private choose_3_0() {
    //     cc.tween(this.node)
    //         // .delay(0.5)
    //         .call(() => {
    //             this.createAnswerQuestion(3, true);
    //         })
    //         .start();
    //     cc.tween(this.node)
    //         .delay(0.5)
    //         .call(() => {
    //             this.createAnswerQuestion(6, false);
    //         })
    //         .start();
    // }
    // private choose_3_1() {
    //     cc.tween(this.node)
    //         // .delay(0.5)
    //         .call(() => {
    //             this.createAnswerQuestion(6, true);
    //         })
    //         .start();
    //     cc.tween(this.node)
    //         .delay(0.5)
    //         .call(() => {
    //             this.createAnswerQuestion(3, false);
    //         })
    //         .start();
    // }
    private GameFail() {
        this.btn_DownLoad_1.active = false;
        AudioManager.play('laugh', 0.5);
        LayerManger.Instance.GetLayer(Layer_3).OpenForTween();
    }
    private GameWin() {
        this.btn_DownLoad_1.active = false;
        LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
    }
    public GameRestart() {
        this._isCanClick = true;
        if (this._level_Index == 1) {
            this.createDog();
            this.arr_ResultsIcon.forEach((tem) => {
                tem.node.active = false;
            });
        } else if (this._level_Index == 2) {
            this.createHammer();
            this.arr_ResultsIcon[1].node.active = false;
            this.arr_ResultsIcon[2].node.active = false;
            this.arr_ResultsIcon[4].node.active = false;
            this.arr_ResultsIcon[5].node.active = false;
            this.arr_ResultsIcon[6].node.active = false;
            this.arr_ResultsIcon[7].node.active = false;
        }
        //  else if (this._level_Index == 3) {
        //     this.createBall();
        //     this.arr_ResultsIcon[2].node.active = false;
        //     this.arr_ResultsIcon[5].node.active = false;
        //     this.arr_ResultsIcon[6].node.active = false;
        //     this.arr_ResultsIcon[7].node.active = false;
        // }
        this.hiddenChooseBtn();
        this.man.clearTracks();
        this.man.addAnimation(0, 'idel3', true);
        this.girl.clearTracks();
        this.girl.addAnimation(0, 'Standby1', true);
        this.closeAudience();
    }
    public downLoad() {
        CpSDK.ClickArea(0, '下载');
    }

    scatterGold(GoldNode) {
        AudioManager.play('redPackedClip');
        let v = 800;
        let s = Util.getDistance(this.node_EndPos.getPosition(), GoldNode.getPosition());
        let t = 0;
        t = s / v;
        for (let i = 0; i < 8; i++) {
            let star = cc.instantiate(this.pre_FlyGold);
            star.opacity = 0;
            this.node.addChild(star);

            cc.tween(star)
                .set({ position: this.node2Ctnode1(star, GoldNode), opacity: 0 })
                .delay(0.05 * i)
                .by(0.4, { x: Util.random(-100, 100), y: Util.random(-50, 50), opacity: 255 }, { easing: 'backOut' })
                .to(t, { position: this.node2Ctnode1(star, this.node_EndPos) })
                .call(() => {
                    AudioManager.play('getmorecoin', 2);
                    star.destroy();
                    this._money += 12485;
                })
                .start();
        }
    }
    node2Ctnode1(node1, node2) {
        let wordPoint = node2.parent.convertToWorldSpaceAR(node2.position);
        let nodePonit = node1.parent.convertToNodeSpaceAR(wordPoint);
        return nodePonit;
    }
}
