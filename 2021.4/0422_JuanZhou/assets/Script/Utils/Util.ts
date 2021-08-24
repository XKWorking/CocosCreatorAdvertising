import {
    DirectionType, ActionNodeType, DuraLevel, ActionShowType, ActionHiddenType, PercentLevel, ActionSlideType
} from "../Manager/EnumManager";
import TimerUtil from "./TimerUtil";
import { isDebug } from "../Config/SystemConfig";



let isShake: boolean = false;//是否正在抖动中

const { ccclass, property } = cc._decorator;
@ccclass

export default class Util {
    public static Const_Dura = [0.3, 0.5, 0.8] as const;
    public static Const_Dura_panel = [0.2, 0.25, 0.4] as const;
    public static Const_Prencent = [1.1, 1.15, 1.2] as const;
    //action func
    public static shake(display: cc.Node, times: number = 2, offset: number = 4, speed: number = 32, callback?: Function): void {
        if (isShake) {
            return;
        }
        isShake = true;
        var point = cc.v2(display.x, display.y);
        var offsetXY: Array<number> = [0, 0];

        var count: number = 0;
        var id: number = setInterval(() => {
            offsetXY[count % 2] = (count++) % 4 < 2 ? 0 : offset;
            if (count > (times * 4 + 1)) {
                isShake = false;
                clearInterval(id);
                count = 0;
                if (callback) callback();
            }
            display.x = offsetXY[0] + point.x;
            display.y = offsetXY[1] + point.y;
        }, speed);
    }

    /**
     * 呼吸/旋转动画
     * @param node 动画节点node
     * @param type 动画类型 ActionNodeType
     * @param duraType 动画节奏等级类型 DuraLevel
     * @param disType 缩放百分比类型 PercentLevel
     */

    public static RunActionNode<T>(node: cc.Node, type: ActionNodeType, duraType: DuraLevel = DuraLevel.Medium, disType: PercentLevel = PercentLevel.Medium): cc.Tween<T> {
        switch (type) {
            case ActionNodeType.BreathScale: {
                let dis = node.scale;
                return cc.tween(node)
                    .repeatForever(
                        cc.tween().to(Util.Const_Dura[duraType], { scale: Util.Const_Prencent[disType] * dis }).to(Util.Const_Dura[duraType], { scale: dis })
                    )
                    .start();
            }
            case ActionNodeType.rotate: {
                return cc.tween(node)
                    .repeatForever(
                        cc.tween().by(Util.Const_Dura[duraType] * 10, { angle: 360 })
                    )
                    .start();
            }
        }
    }

    /**
     * 手指滑动/滑动晃动效果
     * @param node 动作节点
     * @param type 动作类型
     * @param pos1 初始位置
     * @param pos2 结束位置
     * @param duraTime 动作节奏
     */
    public static RunActionSlide(node: cc.Node, type: ActionSlideType, pos: Array<cc.Vec2>,
        duraTime: number, posIndex: number = 1, flag: boolean = false) {
        switch (type) {
            case ActionSlideType.Slide: {
                return cc.tween(node)
                    .to(duraTime, { position: pos[posIndex] })
                    .delay(0.1)
                    .call(() => {
                        if (posIndex + 1 < pos.length) {
                            posIndex++;
                        } else {
                            posIndex = 1;
                            node.setPosition(pos[0]);
                        }
                        this.RunActionSlide(node, type, pos, duraTime, posIndex);
                    })
                    .start();
            }
            case ActionSlideType.SlideSaggle: {
                return cc.tween(node)
                    .repeat(2, cc.tween().by(0.3, { x: -20, y: 20 }).by(0.2, { x: 20, y: -20 }))
                    .to(flag ? 0 : duraTime, { position: pos[posIndex] })
                    .call(() => {
                        if (posIndex + 1 < pos.length) {
                            this.RunActionSlide(node, type, pos, duraTime, ++posIndex);
                        } else {
                            this.RunActionSlide(node, type, pos, duraTime, 0, true);
                        }
                    })
                    .start();
                break;
            }
        }
    }

    /**
     * 显示节点动画
     * @param node 动画节点 node
     * @param type 显示类型 ActionShowType
     * @param duraType 动画节奏等级类型 DuraLevel
     */
    public static RunActionShow(node: cc.Node, type: ActionShowType = ActionShowType.Back, duraType = DuraLevel.Medium): Promise<void> {
        return new Promise((reslove) => {
            let _node: any = node;
            if (_node._isTweenShow) return;
            _node.active = true;
            let scale = _node.scale;
            let alpha = _node.opacity;
            _node.attr({ _scale: scale, _alpha: alpha, _isTweenShow: true });

            switch (type) {
                case ActionShowType.Back: {
                    _node.scale = 0;
                    _node.opacity = 0;
                    return cc.tween(_node).to(Util.Const_Dura_panel[duraType], { scale: scale, opacity: alpha }, { easing: 'backOut' })
                        .call(() => {
                            _node._isTweenHide = false;
                            reslove();
                        })
                        .start();
                }
                case ActionShowType.FadeIn: {
                    _node.opacity = 0;
                    return cc.tween(_node).to(Util.Const_Dura_panel[duraType], { opacity: alpha })
                        .call(() => {
                            _node._isTweenHide = false;
                            reslove();
                        })
                        .start();
                }
                case ActionShowType.ScaleIn: {
                    node.scale = 0;
                    return cc.tween(_node).to(Util.Const_Dura_panel[duraType], { scale: scale })
                        .call(() => {
                            _node._isTweenHide = false;
                            reslove();
                        })
                        .start();
                }
            }
        })
    }

    /**
     * 隐藏节点动画
     * @param node 动画节点 node
     * @param type 显示类型 ActionHiddenType
     * @param duraType 动画节奏等级类型 DuraLevel
     */
    public static RunActionHidden(node: cc.Node, type: ActionHiddenType = ActionHiddenType.BackOut, duraType = DuraLevel.Medium) {
        return new Promise((reslove) => {
            let _node: any = node;
            if (_node._isTweenHide) return;
            _node.attr({ _isTweenHide: true });
            switch (type) {
                case ActionHiddenType.BackOut: {
                    return cc.tween(node).to(Util.Const_Dura_panel[duraType], { scale: 0 }, { easing: "backIn" })
                        .call(() => {
                            _node.active = false;
                            _node.opacity = _node._alpha;
                            _node.scale = _node._scale;
                            _node._isTweenShow = false;
                            reslove();
                        })
                        .start();
                }
                case ActionHiddenType.FadeOut: {
                    return cc.tween(node).to(Util.Const_Dura_panel[duraType], { opacity: 0 })
                        .call(() => {
                            _node.active = false;
                            _node.opacity = _node._alpha;
                            _node.scale = _node._scale;
                            _node._isTweenShow = false;
                            reslove();
                        })
                        .start();
                }
                case ActionHiddenType.ScaleOut: {
                    return cc.tween(node).to(Util.Const_Dura_panel[duraType], { scale: 0 })
                        .call(() => {
                            _node.active = false;
                            _node.opacity = _node._alpha;
                            _node.scale = _node._scale;
                            _node._isTweenShow = false;
                            reslove();
                        })
                        .start();
                }
            }
        })
    }

    /**
     * 手指引导
     * @param node 
     * @param arr
     * @param posIndex
     */

    public static RunActionFinger(node: cc.Node, arr: any[], posIndex: number = 0) {
        let tw = cc.tween;
        tw(node)
            .to(0.6, { position: arr[posIndex] })
            .repeat(3,
                tw()
                    .by(0.2, { y: 20 })
                    .by(0.2, { y: -20 })
            )
            .call(() => {
                let count = posIndex + 1 > arr.length - 1 ? 0 : posIndex + 1;
                this.RunActionFinger(node, arr, count);
            })
            .start();
    }

    /**
     * 打字效果
     * @param _node 目标lable
     * @param str  要显示的文字
     */
    public static showGuideInfo(_node: cc.Label, str: string) {
        let i = 0;
        function cb() {
            i++;
            _node.string += str[i - 1];
        }
        TimerUtil.setInterval("guide", cb, 200, str.length);
    }

    /**
     * 数字滚动效果
     * @param target 节点
     * @param options 设置项 example Util.LableEffect(this.testLable, { time: 5000, initNum: 0, num: 888, regulator: 10 })
     */
    public static LableEffect(target: any, options: any) {
        options = options || {};
        if (options.initNum == options.num) return;
        var time = options.time,//总时间--毫秒为单位
            finalNum = options.num, //要显示的真实数值
            regulator = options.regulator || 100, //调速器，改变regulator的数值可以调节数字改变的速度         
            step = (finalNum - options.initNum) / (time / regulator),/*每30ms增加的数值--*/
            count = options.initNum, //计数器      
            initial = options.initNum;

        var timer = setInterval(() => {
            count = count + step;
            if (count >= finalNum && options.initNum < finalNum) {
                clearInterval(timer);
                count = finalNum;
            }

            if (count <= finalNum && options.initNum > finalNum) {
                clearInterval(timer);
                count = finalNum;
            }
            //t未发生改变的话就直接返回        
            var t = Math.floor(count);
            if (t == initial) return;
            initial = t;
            target.string = initial + "";
        }, 30);
    }

    /**
     * 翻牌效果
     * @param arr 
     */
    public static FlipCard(_node: cc.Node) {
        let t = cc.tween;
        t(_node)
            .to(0.3, { scaleX: 0, scaleY: 1 })
            .to(0.3, { scaleX: 1, scaleY: 1 })
            .start()
    }


    // array func

    /**
     * 在一个数组中随机获取一个元素
     * @param {Array} arr 数组
     * @returns 随机出来的结果
     */
    public static randomArray<T>(arr: T[]) {
        return arr.length > 0 ? arr[Math.floor(arr.length * Math.random())] : null;
    }

    /**
     * 交换数组中的两项
     * @param arr		给定数组
     * @param index1	要交换的序号1
     * @param index2	要交换的序号2
     */
    public static swap(arr: any[], index1: number, index2: number): void {
        if (index1 == index2) return;
        var tmp: any = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = tmp;
    }

    /**
     * 查找数组项
     * @param arr	给定数组
     * @param value	给定项值
     * @param prop	项值对应的属性名（若指定，则改为比较数组项的属性值）
     * @return		若找到，则返回数组项所在的序号（若有多个满足，则返回最小的匹配序号），否则返回-1
     */
    public static find(arr: any[], value: any, prop: string = null): number {
        for (var i: number = 0; i < arr.length; i++) {
            if (prop) {
                if (arr[i][prop] == value) return i;
            }
            else {
                if (arr[i] == value) return i;
            }
        }
        return -1;
    }

    /**
     * 删除数组里的子项
     * @param arr 
     * @param item 
     */
    public static removeItem = <T>(arr: T[], item: T): boolean => {
        const index = arr.indexOf(item)
        if (index != -1) {
            arr.splice(index, 1)
            return true
        }
        return false
    }

    /**
     * 获取一个区间的随机整数 (from, end)
     * @param {number} from 最小值
     * @param {number} end 最大值
     * @returns {number}
     */
    public static randomInteger(from, end) {
        var random = Math.floor(Math.random() * (end - from + 1) + from);
        return random;
    }

    /**
     * 获取一个区间的随机数
     * @param min 最小值
     * @param max 最大值
     */
    public static random(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    };

    /**
    * 区间数
    * @param min 最小值
    * @param max 最大值
    * @param value 
    */
    public static interval(min: number, max: number, value: number): number {
        return Math.max(min, Math.min(max, value));
    };

    /**
     * 获取字符串长度，中文为2
     * @param {string} str
     * @returns {number}
     */
    public static getLength(str: string): number {
        let strArr = str.split("");
        let length = 0;
        for (let i = 0; i < strArr.length; i++) {
            let s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    }

    /**
     * 判断一个字符串是否包含中文
     * @param {string} str
     * @returns {boolean}
     */
    public static isChinese(str: string): boolean {
        let reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    }

    /**
     * 判断字符串相等
     * @param s1			给定字符串1
     * @param s2			给定字符串2
     * @param ignoreCase	是否忽略大小写
     */
    public static isEqual(s1: string, s2: string, ignoreCase: boolean = false): boolean {
        return ignoreCase ? s1.toLowerCase() == s2.toLowerCase() : s1 == s2;
    }

    /**
     * 打乱数组中的元素
     * @param {Array} arr
     */
    public static upset(arr: Array<any>) {
        let len = arr.length;
        let index;
        let tmp;
        for (let i = len - 1; i >= 0; i--) {
            index = (Math.random() * i) | 0;
            tmp = arr[i];
            arr[i] = arr[index];
            arr[index] = tmp;
        }
    }

    /**
     * 随机码
     */
    public static nonce(size: number): string {
        let result = "";
        for (let i = 0; i < size; i++) {
            if (Math.random() < 0.5) {
                result += String.fromCharCode(0x30 + Math.floor(Math.random() * (0x39 - 0x30)));
            } else {
                result += String.fromCharCode(0x41 + Math.floor(Math.random() * (0x5A - 0x41)));
            }
        }

        return result;
    }

    /**
     * 获取系统当前时间
     * @param type 
     */

    public static currentTime(type: number = 1): string {
        let date = new Date();
        if (type == 1) {
            return this.cover(date.getHours()) + ":" + this.cover(date.getMinutes()) + ":" + this.cover(date.getSeconds());
        } else if (type == 2) {
            return date.getFullYear() + "-" + this.cover(date.getMonth() + 1) + "-" + this.cover(date.getDate()) + " " + this.cover(date.getHours()) + ":" + this.cover(date.getMinutes()) + ":" + this.cover(date.getSeconds());
        } else if (type == 3) {
            return this.cover(date.getHours()) + ":" + this.cover(date.getMinutes());
        }

        return "";
    }
    private static cover(value: number): string {
        return value >= 10 ? value.toString() : "0" + value;
    }

    /**
     * 深度复制
     * @param {any} obj
     * @return {any}
     */
    public static copy(obj: any): any {
        let newObj = null;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        let keys = Object.keys(obj);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            newObj[key] = this.copy(obj[key]);
        }
        return newObj;
    }

    /**
     * 弧度制转换为角度值
     * @param {number} radian
     * @returns {number}
     */
    public static getAngle(radian: number): number {
        return 180 * radian / Math.PI;
    }

    /**
     * 角度值转换为弧度制
     * @param {number} angle
     */
    public static getRadian(angle: number): number {
        return angle / 180 * Math.PI;
    }

    /**
     * 获取两点间弧度
     * @param {Point} p1
     * @param {Point} p2
     * @returns {number}
     */
    public static getRadianTwoPoint(p1: cc.Vec2, p2: cc.Vec2): number {
        let xdis = p2.x - p1.x;
        let ydis = p2.y - p1.y;
        return Math.atan2(ydis, xdis);
    }

    /**
     * 获取两点间旋转角度（顺时针）
     * @param {Point} p1
     * @param {Point} p2
     * @returns {number}
     */
    public static getAngleTwoPoint(p1: cc.Vec2, p2: cc.Vec2): number {
        let vy = p2.y - p1.y;
        let vx = p2.x - p1.x;
        let ang = 0;

        if (vy == 0) {
            if (vx < 0) {
                return 180;
            }
            return 0;
        }
        if (vx == 0) { //正切是vy/vx所以vx==0排除
            if (vy > 0) {
                ang = 90;
            }
            else if (vy < 0) {
                ang = 270;
            }
            return ang;
        }

        ang = this.getAngle(Math.atan(Math.abs(vy) / Math.abs(vx)));
        if (vx > 0) {
            if (vy < 0) {
                ang = 360 - ang;
            }
        }
        else {
            if (vy > 0) {
                ang = 180 - ang;
            }
            else {
                ang = 180 + ang;
            }
        }
        return ang;
    }

    /**
     * 获取两点间距离
     * @param {Point} p1
     * @param {Point} p2
     * @returns {number}
     */
    public static getDistance(p1: cc.Vec2, p2: cc.Vec2): number {
        let disX = p2.x - p1.x;
        let disY = p2.y - p1.y;
        let disQ = Math.pow(disX, 2) + Math.pow(disY, 2);
        return Math.sqrt(disQ);
    }

    /**
     * 精确到小数点后多少位（舍尾）
     * @param {number} 精确值
     * @param {number} 精确位数
     * @return {number}
     * */
    public static exactCount(exactValue: number, count: number = 0): number {
        let num = Math.pow(10, count);
        let value = (exactValue * num) | 0;
        return value / num;
    }

    /**
     *  角度换算方向
     *  将360度 平滑分为八个方向 
     *  正北90   正东 180
     * @param r 
     */
    public static directionByAngle(r: number): DirectionType {

        if ((r <= (0 + 22.5)) || (r <= 360) && (r >= (360 - 22.5))) {
            console.log("正西");
            return DirectionType.W;
        }

        if (r < (315 + 22.5) && r >= (315 - 22.5)) {
            console.log("西南");
            return DirectionType.SW;
        }

        if (r < (270 + 22.5) && r >= (270 - 22.5)) {
            console.log("正南");
            return DirectionType.S;
        }

        if (r < (225 + 22.5) && r >= (225.5 - 22.5)) {
            console.log("东南");
            return DirectionType.SE;
        }

        if (r < (180 + 22.5) && r >= (180 - 22.5)) {
            console.log("正东");
            return DirectionType.E;
        }

        if (r < (135 + 22.5) && r >= (135 - 22.5)) {
            console.log("东北");
            return DirectionType.NE;
        }

        if (r < (90 + 22.50) && r >= (90 - 22.5)) {
            console.log("正北");
            return DirectionType.N;
        }

        if (r < (45 + 22.50) && r >= (45 - 22.5)) {
            console.log("西北");
            return DirectionType.NW;
        }
        return DirectionType.ERROR;
    }

    /**
     * 打印日志
     * @param msg 
     */
    public static log(...msg: any) {
        if (isDebug) {
            for (let msg in arguments) {
                cc.log(arguments[msg]);
            }
        }
    }

    /**
     * 从节点1移动到节点b，无视层级
     * @param node1 移动的节点
     * @param node2 目标节点
     * @param time  所需时间
     * @param callback 回调函数
     */
    public static node1ToNode2(node1: cc.Node, node2: cc.Node, time: number, callback?: Function) {
        var wordPoint = node2.parent.convertToWorldSpaceAR(node2.position);
        var nodePonit = node1.parent.convertToNodeSpaceAR(wordPoint);
        
        cc.tween(node1)
            .to(time, { position: nodePonit })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    }

    /**
     * 得到一个该节点的世界坐标
     * @param node 
     */

    public static localConvertWorldPointAR(node) {
        if (node) {
            return node.parent.convertToWorldSpaceAR(node.position);
        }
        return null;
    }

    /**
     * 把世界坐标转换为节点坐标
     * @param node 节点
     * @param worldPoint 世界坐标
     */

    public static worldConvertLocalPointAR(node, worldPoint) {
        if (node) {
            return node.parent.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    }
}







