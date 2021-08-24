import GlobalData from "./GlobalData";

const { ccclass, property } = cc._decorator;

const CALC_RECT_WIDTH = 60;
const CLEAR_LINE_WIDTH = 60;
@ccclass
export default class ScrapeArea extends cc.Component {

    @property(cc.Node)
    guid: cc.Node = null;

    @property(cc.Node)
    acceptTaskBtn: cc.Node = null;

    //=============================================
    private maskNode = null;
    private ticketNode = null;

    tempDrawPoints: cc.Vec2[] = [];


    // 激活主节点的监听事件
    onLoad() {
        this.maskNode = this.node.children[0].getComponent(cc.Mask);
        this.ticketNode = this.node;
        this.tempDrawPoints = [];
        this.polygonPointsList = [];
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        // 生成小格子，用来辅助统计涂层的刮开比例
        for (let x = 0; x < this.ticketNode.width; x += CALC_RECT_WIDTH) {
            for (let y = 0; y < this.ticketNode.height; y += CALC_RECT_WIDTH) {
                this.polygonPointsList.push({
                    rect: cc.rect(x - this.ticketNode.width / 2, y - this.ticketNode.height / 2, CALC_RECT_WIDTH, CALC_RECT_WIDTH),
                    isHit: false
                });
            }
        }
    }

    start() {

    }

    /**
     * 结束刮图的动作监听
     */
    endScrape() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: cc.Event.EventTouch) {
        this.commonFunc(event);
        this.guid.active = false;
        let point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
    }

    onTouchMove(event: cc.Event.EventTouch) {
        this.commonFunc(event);
        let point = this.ticketNode.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
        this.calcProgress();
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        this.tempDrawPoints = [];
        this.calcProgress();
    }
    onTouchCancel(event: cc.Event.EventTouch) {
        this.tempDrawPoints = [];
        this.calcProgress();
    }

    calcDebugger: boolean = false; // 辅助开关，开启则会绘制划开涂层所属的小格子
    calcProgress() {
        let hitItemCount = 0;
        let ctx = this.ticketNode.getComponent(cc.Graphics);
        this.polygonPointsList.forEach((item) => {
            if (!item.isHit) return;
            hitItemCount += 1;

            if (!this.calcDebugger) return;
            ctx.rect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
            ctx.fillColor = cc.color(216, 18, 18, 255);
            ctx.fill();
        });
        if (Math.ceil((hitItemCount / this.polygonPointsList.length) * 100) >=63) {
            this.ShowAcceptTaskBtn();
        }
    }



    private ShowAcceptTaskBtn() {
        this.acceptTaskBtn.active = true;
    }


    onDestroy() {
        this.endScrape();
    }

    commonFunc(event) {
        let point: cc.Vec2 = event.touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        this.addCircle(point);
    }

    addCircle(point) {
        let graphics = this.maskNode._graphics;
        let color = cc.color(0, 0, 0, 255);
        graphics.circle(point.x, point.y, 60, 60);
        graphics.lineWidth = 2;
        graphics.fillColor = color;
        // graphics.strokeColor = color;
        graphics.fill();

    }



    clearMask(pos) {
        let mask: any = this.maskNode.getComponent(cc.Mask);
        let stencil = mask._graphics;
        const len = this.tempDrawPoints.length;
        this.tempDrawPoints.push(pos);

        if (len <= 1) {
            // 只有一个点，用圆来清除涂层
            stencil.circle(pos.x, pos.y, CLEAR_LINE_WIDTH / 2);
            stencil.fill();

            // 记录点所在的格子
            this.polygonPointsList.forEach((item) => {
                if (item.isHit) return;
                const xFlag = pos.x > item.rect.x && pos.x < item.rect.x + item.rect.width;
                const yFlag = pos.y > item.rect.y && pos.y < item.rect.y + item.rect.height;
                if (xFlag && yFlag) item.isHit = true;
            });
        } else {
            // 存在多个点，用线段来清除涂层
            let prevPos = this.tempDrawPoints[len - 2];
            let curPos = this.tempDrawPoints[len - 1];

            stencil.moveTo(prevPos.x, prevPos.y);
            stencil.lineTo(curPos.x, curPos.y);
            stencil.lineWidth = CLEAR_LINE_WIDTH;
            stencil.lineCap = cc.Graphics.LineCap.ROUND;
            stencil.lineJoin = cc.Graphics.LineJoin.ROUND;
            stencil.strokeColor = cc.color(255, 255, 255, 255);
            stencil.stroke();

            // 记录线段经过的格子
            this.polygonPointsList.forEach((item) => {
                item.isHit = item.isHit || cc.Intersection.lineRect(prevPos, curPos, item.rect);
            });
        }
    }


    private polygonPointsList: { rect: cc.Rect; isHit: boolean }[] = [];

    reset() {
        this.tempDrawPoints = [];
        this.polygonPointsList = [];
        this.ticketNode.getComponent(cc.Graphics).clear();

        // 生成小格子，用来辅助统计涂层的刮开比例
        for (let x = 0; x < this.ticketNode.width; x += CALC_RECT_WIDTH) {
            for (let y = 0; y < this.ticketNode.height; y += CALC_RECT_WIDTH) {
                this.polygonPointsList.push({
                    rect: cc.rect(x - this.ticketNode.width / 2, y - this.ticketNode.height / 2, CALC_RECT_WIDTH, CALC_RECT_WIDTH),
                    isHit: false
                });
            }
        }
    }


}

