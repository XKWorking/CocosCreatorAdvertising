declare module Yeah {
    function getLang();
}

/**
 * 全局系统配置
 */


//当前工程版本号 大版本.新功能.修复
const Version_Pro: string = "1.4.4";

// 全局适配参数
const globalData = {
    scale: 1,
    isShow: true
}

// 发包工具支持的语言类型 
/**
 * 中文简体       zh-cn
 * 中文繁体       zh-tw
 * 英语           en
 * 韩语           ko
 * 日语           ja
 * 德语           de
 * 法语           fr
 * 西班牙语       es
 * 葡萄牙语       pt
 * 意大利语       it
 * 白俄罗斯语     be
 * 乌克兰语       uk
 * 印度尼西亚语   id
 * 阿拉伯语       ar
 */
const Lang = "zh-cn";


// 环境类型
const isDebug = true;

// 是否开启碰撞开关
const collisionManagerSwitch: boolean = false;

// 是否开启碰撞组件形状开关
const DebugDrawSwitch: boolean = false;

// 是否开启碰撞组件包围盒开关
const DrawBoundingBoxSwitch: boolean = false;


// 常用颜色
const BLACK_COLOR = 0x000000;//黑色
const WHITE_COLOR = 0xFFFFFF;//白色
const GREY_COLOR = 0x333333;//灰色


//视图宽
function GetViewW(): number {
    return cc.view.getVisibleSize().width;
}


//视图高
function GetViewH(): number {
    return cc.view.getVisibleSize().height;
}


// 浏览器语言
function GetLang(): string {
    try {
        return Yeah.getLang();
    } catch (e) {
        return Lang;
    }
}

export {
    globalData,
    BLACK_COLOR,
    WHITE_COLOR,
    GREY_COLOR,
    GetViewW,
    GetViewH,
    GetLang,
    Version_Pro,
    isDebug,
    collisionManagerSwitch,
    DebugDrawSwitch,
    DrawBoundingBoxSwitch
}
