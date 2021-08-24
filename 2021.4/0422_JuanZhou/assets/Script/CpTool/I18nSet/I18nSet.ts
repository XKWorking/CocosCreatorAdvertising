import { LangType } from "../../Manager/EnumManager";
import { GetLang } from "../../Config/SystemConfig";

const { ccclass, property } = cc._decorator;


@ccclass
export default class I18nSet extends cc.Component {
    private _langTypeArr = ["zh-cn", "zh-tw", "en", "ko", "ja", "de", "fr", "es", "pt", "it", "be", "uk", "id", "ar"];

    @property(cc.Sprite)
    targetNode: cc.Sprite = null;

    @property(cc.SpriteFrame)
    img_default: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_cn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_tw: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_en: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_ko: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_ja: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_de: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_fr: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_es: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_pt: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_it: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_be: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_uk: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_id: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    img_ar: cc.SpriteFrame = null;

    @property()
    _type = LangType.EN;

    @property({
        type: cc.Enum(LangType),
        displayName: '查看当前资源配置',
        tooltip: 'zh-CN : 简体中文\n zh-TW : 繁体中文\n en : 英语\n ko : 韩语\n ja : 日语\n de : 德语\n fr : 法语\n es : 西班牙语\n pt : 葡萄牙语\n it : 意大利语\n be : 白俄罗斯语\n uk : 乌克兰语\n id : 印度尼西亚语\n ar : 阿拉伯语'
    })
    get type() {
        return this._type
    }
    set type(value: number) {
        this.targetNode.getComponent(cc.Sprite).spriteFrame = this.getCurrLang(value);
        this._type = value;
    }

    onLoad() {
        let currType = GetLang();

        switch (currType) {
            case I18nSet.Types.ZH_CN:
                this.img_cn ? this.targetNode.spriteFrame = this.img_cn : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.ZH_TW:
                this.img_tw ? this.targetNode.spriteFrame = this.img_tw : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.EN:
                this.img_en ? this.targetNode.spriteFrame = this.img_en : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.KO:
                this.img_ko ? this.targetNode.spriteFrame = this.img_ko : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.JA:
                this.img_ja ? this.targetNode.spriteFrame = this.img_ja : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.DE:
                this.img_de ? this.targetNode.spriteFrame = this.img_de : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.FR:
                this.img_fr ? this.targetNode.spriteFrame = this.img_fr : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.ES:
                this.img_es ? this.targetNode.spriteFrame = this.img_es : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.PT:
                this.img_pt ? this.targetNode.spriteFrame = this.img_pt : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.IT:
                this.img_it ? this.targetNode.spriteFrame = this.img_it : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.BE:
                this.img_be ? this.targetNode.spriteFrame = this.img_be : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.UK:
                this.img_uk ? this.targetNode.spriteFrame = this.img_uk : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.ID:
                this.img_id ? this.targetNode.spriteFrame = this.img_id : this.targetNode.spriteFrame = this.img_default;
                break;
            case I18nSet.Types.AR:
                this.img_ar ? this.targetNode.spriteFrame = this.img_ar : this.targetNode.spriteFrame = this.img_default;
                break;
            default:
                this.targetNode.spriteFrame = this.img_default;
                break;
        }
    }

    getCurrLang(lang: number) {
        let _lang = this._langTypeArr[lang];
        switch (_lang) {
            case I18nSet.Types.ZH_CN:
                return this.img_cn;
            case I18nSet.Types.ZH_TW:
                return this.img_tw;
            case I18nSet.Types.EN:
                return this.img_en;
            case I18nSet.Types.KO:
                return this.img_ko;
            case I18nSet.Types.JA:
                return this.img_ja;
            case I18nSet.Types.DE:
                return this.img_de;
            case I18nSet.Types.FR:
                return this.img_fr;
            case I18nSet.Types.ES:
                return this.img_es;
            case I18nSet.Types.PT:
                return this.img_pt;
            case I18nSet.Types.IT:
                return this.img_it;
            case I18nSet.Types.BE:
                return this.img_be;
            case I18nSet.Types.UK:
                return this.img_uk;
            case I18nSet.Types.ID:
                return this.img_id;
            case I18nSet.Types.AR:
                return this.img_ar;
            default:
                return this.img_default;
        }
    }

    static Types = {
        ZH_CN: "zh-cn",
        ZH_TW: "zh-tw",
        EN: "en",
        KO: "ko",
        JA: "ja",
        DE: "de",
        FR: "fr",
        ES: "es",
        PT: "pt",
        IT: "it",
        BE: "be",
        UK: "uk",
        ID: "id",
        AR: "ar"
    }

    // update (dt) {}
}

