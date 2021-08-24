import AudioManager from '../Manager/AudioManager'
import './GameConfig'
const { ccclass, executionOrder } = cc._decorator

@ccclass
@executionOrder(-Infinity)
export default class GameConfigLoader extends cc.Component {
    config: any = null

    onLoad() {
        this.config = window['gameConfig'] || window['__gameConfig']

        if (!this.config) {
            return
        }

        this.initProps()
        this.initAudios()
    }

    private initProps() {

        const baseComponents = [
            ...cc.Canvas.instance.getComponents(BaseComponent),
            ...cc.Canvas.instance.getComponentsInChildren(BaseComponent)
        ]

        baseComponents.forEach((component) => {
            const froms = component.__from || {}
            Object.keys(froms).forEach((propertyName) => {
                const { value, finded } = GameConfigLoader.getValueByPath(this.config, froms[propertyName])

                if (!finded) {
                    return
                }

                if (typeof value == 'object' && value.type) {
                    switch (value.type) {
                        case 'number':
                        case 'boolean':
                        case 'int':
                        case 'string':
                            component[propertyName] = value.value
                            break
                        case 'color':
                            component[propertyName] = cc.color(value.value)
                            break
                    }
                }
                else {
                    component[propertyName] = value
                }
            })
        })
    }

    private initAudios() {
        let allAudioConfig = {}

        for (let configName in this.config) {
            if (this.config[configName].audios) {
                Object.assign(allAudioConfig, this.config[configName].audios)
            }
        }

        if (AudioManager.instance.bgm) {

            const audioUrl = AudioManager.instance.bgm.url

            if (audioUrl && audioUrl.match(/\/[^\/]+$/)) {
                const bgmKey = audioUrl.match(/\/[^\/]+$/)[0].slice(1).match(/^[^\.]+/)[0].replace(/-/g, '')
                if (allAudioConfig[bgmKey]) {
                    AudioManager.instance.bgmRelativeVolume = allAudioConfig[bgmKey].volume
                }
            }
        }

        AudioManager.instance.audios.forEach((audio) => {

            if (audio.audioClip && audio.audioClip.url && audio.audioClip.url.match(/\/[^\/]+$/)) {
                const audioKey = audio.audioClip.url.match(/\/[^\/]+$/)[0].slice(1).match(/^[^\.]+/)[0].replace(/-/g, '')
                if (allAudioConfig[audioKey]) {
                    audio.relativeVolume = allAudioConfig[audioKey].volume
                }
            }
        })
    }

    private static getValueByPath(obj: any, path: string) {

        const pathArr = path.split('.').map(value => value.trim())
        const result = {
            finded: false,
            value: null,
        }

        for (let i = 0, tempValue = obj; i < pathArr.length; i++) {
            const name = pathArr[i]

            if (tempValue && name in tempValue) {
                tempValue = tempValue[name]
                if (i === pathArr.length - 1) {
                    result.finded = true
                    result.value = tempValue
                }
            }
            else {
                break
            }
        }

        return result
    }
}

export class BaseComponent extends cc.Component {
    __from !: Record<string, string>
}

export function from(path: string) {
    return function (Class: BaseComponent, propertyName: string) {
        Class.__from = Class.__from || {}
        Class.__from[propertyName] = path
    }
}

