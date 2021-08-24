// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { AnimeLine } from "./FrameAnime";
import BaseLayer from "../Base/BaseLayer";
import { AnimeTypes } from "../Manager/EnumManager";
import LayerManger from "../Manager/LayerManger";
import { globalData } from "../Config/SystemConfig";


type Callback = () => void;
type ShowAnimeType = Callback | '' | AnimeTypes;


const { ccclass, property } = cc._decorator;



@ccclass
export default class PopupPanel extends BaseLayer {
    private CurrAnimeType = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    // start() {}

    // update (dt) {}

    /**
    * 界面打开
    */
    public OpenForTween(animeType: ShowAnimeType = '', callback?: Callback, startData?: any): Promise<void> {
        this._startData = startData;

        if (typeof animeType === 'function') {
            callback = animeType;
            animeType = '';
        }
        this.CurrAnimeType = animeType;

        const target = this.node;

        if (target !== null) {
            const animeLine = AnimeLine.create(target);
            // animeLine.show();
            this.show();

            switch (animeType) {
                case AnimeTypes.FADEIN:
                    animeLine
                        .anime({ 'opacity': 0 })
                        .anime(0.3, [{ 'opacity': 255 }])
                    break
                case AnimeTypes.LEFTIN:
                    animeLine
                        .anime({ 'x': -LayerManger.Instance.GetStageW() })
                        .anime(0.3, [{ 'x': 0 }])
                    break

                case AnimeTypes.TOPIN:
                    animeLine
                        .anime({ 'y': LayerManger.Instance.GetStageH() })
                        .anime(0.3, [{ 'y': 0 }])
                    break

                case AnimeTypes.SCALEIN:
                    animeLine
                        .anime({ 'scale': 0 })
                        .anime(0.3, [{ 'scale': globalData.scale, easingType: cc.easeBackOut() }])
                    break

                default:
                    animeLine
                        .anime({ 'opacity': 0, 'y': '-200' })
                        .anime(0.3, [{ 'opacity': 255 }, { 'y': '+200', 'easingType': cc.easeBackOut() }])
            }

            return animeLine.run().end(callback);
        }
    }

    /**
    * 界面关闭
    */
    public CloseForTween(callback?: Callback): Promise<void> {
        this._startData = null;

        let animeType = this.CurrAnimeType;
        const target = this.node;

        if (target) {
            const animeLine = AnimeLine.create(target);
            switch (animeType) {
                case AnimeTypes.FADEIN:
                    animeLine.anime(0.3, { 'opacity': 0 })
                    break

                case AnimeTypes.LEFTIN:
                    animeLine
                        .anime(0.3, { 'x': -LayerManger.Instance.GetStageW() })
                    break

                case AnimeTypes.TOPIN:
                    animeLine
                        .anime(0.3, { 'y': LayerManger.Instance.GetStageH() })
                    break

                case AnimeTypes.SCALEIN:
                    animeLine
                        .anime(0.3, [{ 'scale': 0, easingType: cc.easeBackIn() }])
                    break

                default:
                    animeLine.anime(0.3, [{ 'opacity': 0 }, { 'y': '-200', 'easingType': cc.easeBackIn() }]).anime({ 'y': '+200' })
            }

            return animeLine.hide().run().end(callback);
        }
        return null;
    }
}
