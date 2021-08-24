const { ccclass , property , menu } = cc._decorator

@ccclass('Audio')
class Audio {
    @property()
    name = ''

    @property({
        'type' : cc.AudioClip
    })
    audioClip : cc.AudioClip = null

    relativeVolume = 1
}

@ccclass
@menu('通用组件/音频管理器')
export default class AudioManager extends cc.Component {
    nowBgm : cc.AudioClip = null
    bgmPlaying = false

    static instance : AudioManager = null

    @property({
        'type' : cc.AudioClip
    }) bgm: cc.AudioClip = null
    @property() bgmVolume = 1

    bgmRelativeVolume = 1

    @property({
        'type' : [Audio]
    })
    audios : Audio[] = []

    static canPlayAduio = false


    constructor() {
        super()
        AudioManager.instance = this
    }

    start(): void {

        const playBgmCallback = ()=>{
            document.removeEventListener('mousedown' , playBgmCallback , true)
            document.removeEventListener('touchstart' , playBgmCallback , true)
            AudioManager.playBgm()
        }

        document.addEventListener('mousedown' , playBgmCallback , true)
        document.addEventListener('touchstart' , playBgmCallback , true)

        if(!window['notAutoPlayBgm']){
            AudioManager.playBgm()
        }
    }

    static getAudioClipByName(name:string):cc.AudioClip{
        return AudioManager.instance.audios.find((audio)=>audio.name===name).audioClip
    }


    /**
     * 播放指定的bgm或者默认bgm(同一个bgm重复调用并不会重复播放)
     * @param name
     */
    static playBgm(name?: string):void{
        if(name){
            const audio = AudioManager.instance.audios.find((_audio)=>_audio.name===name)

            AudioManager._playBgm(audio.audioClip , AudioManager.instance.bgmVolume * AudioManager.instance.bgmRelativeVolume)
            AudioManager.instance.nowBgm = audio.audioClip
        }
        else{
            AudioManager._playBgm(AudioManager.instance.bgm , AudioManager.instance.bgmVolume * AudioManager.instance.bgmRelativeVolume)
            AudioManager.instance.nowBgm = AudioManager.instance.bgm
        }

        AudioManager.canPlayAduio = true
    }

    /**
     * 停止播放当前bgm
     * @param name
     */
    static stopBgm(): void {
        AudioManager._stopAudio(AudioManager.instance.nowBgm)
    }

    /**
     * 恢复播放当前的bgm
     */
    static resumeBgm(): void {
        AudioManager._resumeAudio(AudioManager.instance.nowBgm)
    }

    /**
     * 暂停播放当前的bgm
     */
    static pauseBgm(): void {
        AudioManager._pauseAudio(AudioManager.instance.nowBgm)
    }

    /**
     * 停止播放一个指定的音效
     * @param name
     */
    static stop(name: string): void {
        AudioManager._stopAudio(AudioManager.getAudioClipByName(name))
    }

    /**
     * 播放一个指定的音效
     * @param name
     */
    static play(name: string , volume = 1): void {
        if( AudioManager.canPlayAduio != true ){
            return
        }

        const audio = AudioManager.instance.audios.find((audio)=>audio.name===name)
        if(audio){
            AudioManager._playAudio(audio.audioClip , volume * audio.relativeVolume )
        }
    }


    private static audioIds = {}
    private static audioIdsTimeouts = {}

    /**
     * 播放一个指定路径的音效
     * @param src
     * @param volume
     */
    private static _playAudio(src: any , volume = 1): void {

        if (!src) {
            return
        }

        // (防抖动)33毫秒内只播放一次相同的音频
        if (src in AudioManager.audioIdsTimeouts && AudioManager.audioIdsTimeouts[src] + 33 > Date.now()) {
            return
        }

        AudioManager.audioIdsTimeouts[src] = Date.now()
        AudioManager.audioIds[src] = cc.audioEngine.play(src , false , volume)
    }

    /**
     * 播放一个指定路径的bgm
     * @param src
     * @param volume
     */
    private static _playBgm(src: any , volume = 1): void {
        if (!src) {
            return
        }

        if (src in AudioManager.audioIds) {
            if (cc.audioEngine.getState(AudioManager.audioIds[src]) !== cc.audioEngine.AudioState.PLAYING) {
                cc.audioEngine.resume(AudioManager.audioIds[src])
            }
            return
        }

        AudioManager.audioIds[src] = cc.audioEngine.play(src , true , volume)
    }

    /**
     * 恢复一个指定路径的音效
     * @param src
     */
    private static _resumeAudio(src: any): void {
        if (!src) {
            return
        }

        if (src in AudioManager.audioIds) {
            cc.audioEngine.resume(AudioManager.audioIds[src])
        }
    }

    /**
     * 暂停一个指定路径的音效
     * @param src
     */
    private static _pauseAudio(src: any): void {
        if (!src) {
            return
        }
        if (src in AudioManager.audioIds) {
            cc.audioEngine.pause(AudioManager.audioIds[src])
        }
    }


    /**
     * 停止一个指定路径的音效
     * @param src
     */
    private static _stopAudio(src: any): void {
        if (!src) {
            return
        }
        if (src in AudioManager.audioIds) {
            cc.audioEngine.stop(AudioManager.audioIds[src])
            delete AudioManager.audioIds[src]
            // audioIds[src] = null
        }
    }
}





