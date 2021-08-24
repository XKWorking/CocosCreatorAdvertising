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
import BezierRender from "./Panel/bezier-render";
import { GetViewH } from "./Config/SystemConfig";
import AudioManager from "./Manager/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Layer_1 extends BaseLayer {

    @property(cc.Node)
    levelInterface_1: cc.Node = null;

    @property(cc.Node)
    levelInterface_2: cc.Node = null;

    @property(cc.Node)
    levelInterface_3: cc.Node = null;
    /**
     * 翻页速度
     */
    @property({})
    Pagespeed: number = 0;
    /**
     * 翻页材质
     */
    @property(cc.Material)
    mater: cc.Material = null;
    /**
     * 翻页截图存储节点
     */
    @property(cc.Node)
    page: cc.Node = null;
    /**
     * 当前题目父类
     */
    @property(cc.Node)
    book: cc.Node = null;
    /**
     * 翻页背面纹理
     */
    @property({ type: cc.Texture2D })
    backspr: cc.Texture2D = null
    /**
     * 翻页背面node
     */
    @property({ type: cc.Node })
    backnode: cc.Node = null
    /**
     * 答题关卡题目下标
     */
    private Checkpoint = 0;
    /**
     * 是否翻页
     */
    private isTurnpage = [null, null];
    /**
     * 是否可以点击
     */
    private isclick = false;

    @property([cc.Node])
    arr_LevelOption_1: cc.Node[] = [];

    @property([cc.Node])
    arr_LevelOption_2: cc.Node[] = [];

    @property([cc.Node])
    arr_LevelOption_3: cc.Node[] = [];
    // ================================================ //

    private _isGameStart: boolean = false;
    private _isGameOver: boolean = false;
    private _isFirst: boolean = true;
    private _arr_LevelButton_1: cc.Button[] = [];
    private _arr_LevelButton_2: cc.Button[] = [];
    private _arr_LevelButton_3: cc.Button[] = [];
    private _lastNode: cc.Node = null;
    private _isClickButton: boolean = true;


    onLoad() {
        super.onResize();
        this.onBindTouch();
        this.InitGame();
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    protected start() {
        this._lastNode = this.levelInterface_1;
        for (const button of this.arr_LevelOption_1) {
            this._arr_LevelButton_1.push(button.getComponent(cc.Button));
        }
        for (const button of this.arr_LevelOption_2) {
            this._arr_LevelButton_2.push(button.getComponent(cc.Button));
        }
        for (const button of this.arr_LevelOption_3) {
            this._arr_LevelButton_3.push(button.getComponent(cc.Button));
        }
        let t = cc.tween;
        for (const btnOption of this.arr_LevelOption_1) {
            btnOption.on("click", () => {
                if (!this._isClickButton) return;
                this._isClickButton = false;
                AudioManager.play("button");
                // this.isTurnpage[0] = this.levelInterface_1.children[0];
                t(btnOption)
                    .parallel(
                        t().to(0.3, { scale: 3 }),
                        t().to(0.3, { opacity: 0 }, { easing: 'fade' })
                    )
                    .call(() => {
                        this.isclick = true;
                        // this.levelInterface_1.active = false;
                        this._lastNode = this.levelInterface_1;
                        this.book = this.levelInterface_2.children[0];
                        this.levelInterface_2.active = true;
                        if (this._isFirst) {
                            CpSDK.FirstTouch();
                            CpSDK.EnterSection(3, "第2题界面");
                        } else {
                            CpSDK.EnterSection(8, "第2题界面");
                        }
                        this.ResetNode(btnOption);
                        this.captureAndShow();
                    })
                    .start();
                this.ChooseEffect(btnOption);
                this.DontClickButton(this._arr_LevelButton_1);
            }, this)
        }
        for (const btnOption of this.arr_LevelOption_2) {
            btnOption.on("click", () => {
                if (!this._isClickButton) return;
                this._isClickButton = false;
                AudioManager.play("button");
                // this.isTurnpage[0] = this.levelInterface_2.children[0];
                t(btnOption)
                    .parallel(
                        t().to(0.3, { scale: 3 }),
                        t().to(0.3, { opacity: 0 }, { easing: 'fade' })
                    )
                    .call(() => {
                        // this.levelInterface_2.active = false;
                        this.isclick = true;
                        this._lastNode = this.levelInterface_2;
                        this.book = this.levelInterface_3.children[0];
                        this.levelInterface_3.active = true;
                        if (this._isFirst) {
                            CpSDK.EnterSection(4, "第3题界面");
                        } else {
                            CpSDK.EnterSection(9, "第3题界面");
                        }
                        this.ResetNode(btnOption);
                        this.captureAndShow();
                    })
                    .start();
                this.ChooseEffect(btnOption);
                this.DontClickButton(this._arr_LevelButton_2);
            }, this)
        }
        for (let index = 0; index < this.arr_LevelOption_3.length; index++) {
            const btnOption = this.arr_LevelOption_3[index];
            btnOption.on("click", () => {
                if (!this._isClickButton) return;
                this._isClickButton = false;
                AudioManager.play("button");
                // this.isTurnpage[0] = this.levelInterface_3.children[0];
                t(btnOption)
                    .parallel(
                        t().to(0.3, { scale: 3 }),
                        t().to(0.3, { opacity: 0 }, { easing: 'fade' })
                    )
                    .call(() => {
                        this.levelInterface_3.active = false;
                        this.levelInterface_1.active = true;
                        this.ResetNode(btnOption);
                    })
                    .start();
                this.GameOver();
                this.ChooseEffect(btnOption);
                this.DontClickButton(this._arr_LevelButton_3);
            }, this)
        }
    }

    private _angle: number = 0
    private _rightToLeft = true
    private _waitTime = 0
    private di = false;
    private anglePerDt = 180;
    update(dt: number) {
        if (!this.di) { return }

        if (this._rightToLeft) {
            this._angle += dt * this.anglePerDt
            if (this._angle > 180) {
                this._angle = 180
                if (this._waitTime++ > 3) {
                    this._rightToLeft = false
                    this._waitTime = 0
                }
                this._isClickButton = true;
            }
            if (this._angle > 60) {
                this._lastNode.active = false;
            }
        } else {
            this.dangqian.active = false;
            this.backnode.active = true;
            this.di = false;
            this.isclick = false;
            // this._angle -= dt * anglePerDt
            // if (this._angle < 0) {
            //     this._angle = 0
            //     if (this._waitTime++ > 100) {
            //         this._rightToLeft = true
            //         this._waitTime = 0
            //     }
            // }
        }


        this.dangqian.getComponent(BezierRender).updateAngle(this._angle)
    }

    onBindTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(e: cc.Event.EventTouch) {
        CpSDK.FirstTouch();
    }


    private InitGame() {
        // this.gameContent.scale = this.gameContent.scale / globalData.scale;
        // this.levelInterface_1.active = true;
        // this.levelInterface_2.active = false;
        // this.levelInterface_3.active = false;
        this._isClickButton = true;
        if (this._isFirst) {
            CpSDK.EnterSection(1, "游戏开始界面");
            CpSDK.EnterSection(2, "第1题界面");
        } else {
            CpSDK.EnterSection(6, "游戏开始界面");
            CpSDK.EnterSection(7, "第1题界面");
        }
    }


    /**
     * 重新开始
     */
    public AgainGame() {
        this.InitGame();
        this.ClickButton();
    }


    /**
     * 游戏结束
     */
    private GameOver() {
        if (this._isFirst) {
            LayerManger.Instance.GetLayer(Layer_2).OpenForTween();
            this._isFirst = false;
        } else {

            LayerManger.Instance.GetLayer(Layer_2).InitGame();
        }
    }

    /**
     * 选中效果
     */
    private ChooseEffect(node: cc.Node) {
        node.children[0].active = true;
        node.children[1].active = false;
        node.children[2].active = true;
    }


    /**
     * 重置节点
     */
    private ResetNode(node: cc.Node) {
        node.scale = 1;
        node.opacity = 255;
        node.children[0].active = false;
        node.children[1].active = true;
        node.children[2].active = false;

    }

    /**
     * 可以点击按钮
     */
    private ClickButton() {
        for (const button of this._arr_LevelButton_1) {
            button.enabled = true;
        }
        for (const button of this._arr_LevelButton_2) {
            button.enabled = true;
        }
        for (const button of this._arr_LevelButton_3) {
            button.enabled = true;
        }
    }

    /**
     * 不可以点击按钮
     */
    private DontClickButton(buttons: cc.Button[]) {
        for (const button of buttons) {
            button.enabled = false;
        }
    }


    private texture
    private dangqian: cc.Node = null;
    capture() {
        //需要自己自行再创建一个 Camera depth要高于MainCamera 不然会黑屏 
        let camera = cc.find('Canvas/Camera').getComponent(cc.Camera);
        let pos = this.book.parent.convertToWorldSpaceAR(this.book.position)
        camera.node.x = pos.x;
        camera.node.y = pos.y - GetViewH() - 1;

        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
        //cc.TEXTURE2_D_PIXEL_FORMAT_RGB_A8888,0x88F0
        camera.targetTexture = texture;
        this.texture = texture;


        let width = this.texture.width;
        let height = this.texture.height;

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = this.book.width * this.node.scale;
        canvas.height = (this.book.height - 50) * this.node.scale;

        /**
         * 报错没关系
         */
        camera.render();
        let data = this.texture.readPixels();

        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        var dataURL = canvas.toDataURL("image/jpeg");
        var img = document.createElement("img");
        img.src = dataURL;
        return img;
    }


    //需要截屏时 调用此方法
    captureAndShow() {

        var img = this.capture();
        let texture = new cc.Texture2D();
        texture.initWithElement(img);

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);

        this.dangqian = new cc.Node();
        // this.dangqian.y -= 25;
        // this.dangqian.x += 2;
        this.dangqian.addComponent(BezierRender).setMaterial(0, this.mater);

        this.dangqian.getComponent(BezierRender).setspr(spriteFrame.getTexture(), this.backspr)
        this.dangqian.width = this.book.width;
        this.dangqian.height = this.book.height;
        this.page.addChild(this.dangqian);

        this.anglePerDt = 180;
        this._rightToLeft = true;
        this._waitTime = 0;
        this._angle = 0;
        this.di = true;

        AudioManager.play("fanye");
    }

    public GetIsFirst() {
        return this._isFirst;
    }
}
