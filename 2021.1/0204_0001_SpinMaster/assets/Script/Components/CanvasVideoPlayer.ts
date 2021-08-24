// import { clearInterval, clearTimeout, setInterval, setTimeout } from "../Util"

const { ccclass , property, menu , executionOrder } = cc._decorator


@ccclass('VideoSrc')
class VideoSrc {

    @property({
        type : cc.Asset,
        displayName : '视频文件'
    })
    videoFile : cc.Asset = null
    
    videoTag : HTMLVideoElement

    @property({
        displayName : '视频名称'
    })
    name = ''

    isCanplay = false
}


@ccclass
@executionOrder(-1)
@menu('通用组件/MP4视频播放器')
export default class CanvasVideoPlayer extends cc.Component {
    

    private static instances : CanvasVideoPlayer[] = []
    private static instancesPausedStatus :boolean[] = []
    private static instancesVolume : number[] = []
    private static isMute = false
    
    static useMute(){
        CanvasVideoPlayer.isMute = true
        CanvasVideoPlayer.instances.forEach((video , index)=>{
            CanvasVideoPlayer.instancesVolume[index] = video.volume
            video.volume = 0
        })
    }

    static exitMute(){
        CanvasVideoPlayer.isMute = false
        CanvasVideoPlayer.instances.forEach((video , index)=>{
            video.volume = CanvasVideoPlayer.instancesVolume[index]
        })
    }

    static pause(){
        CanvasVideoPlayer.instances.forEach((video , index)=>{
            CanvasVideoPlayer.instancesPausedStatus[index] = video.paused
            video.pause()
        })
    }

    static resume(){
        CanvasVideoPlayer.instances.forEach((video , index)=>{
            if(CanvasVideoPlayer.instancesPausedStatus[index]===false){
                video.play()
            }
        })
    }



    @property({displayName:'音量'})
    get volume():number{
        return this._volume
    }
    set volume(volume: number){
        if(CanvasVideoPlayer.isMute){
            CanvasVideoPlayer.instancesVolume[CanvasVideoPlayer.instances.indexOf(this)] = volume
            this._volume = 0
            if(this.player){
                this.player.volume = 0
                this.player.muted = volume===0
            }
            return
        }

        this._volume = volume
        if(this.player){
            this.player.volume = volume
            this.player.muted = volume===0
        }
    }

    @property({displayName:'循环播放'})
    get loop(){
        return this._loop
    }
    set loop(value: boolean){
        this._loop = value
        if(this.player){
            this.player.loop = value
        }
    }

    @property({
        // type : cc.Size,
        displayName : '视频显示大小',
        tooltip : '默认为节点大小',
    })
    private videoViewSize = cc.size(0,0)


    @property({
        type : [VideoSrc],
        displayName : '视频源',
    })
    private videoSrcs : VideoSrc[] = []
    private selectedVideo = ''


    @property
    private _volume = 1
    @property
    private _loop = false

    private sprite: cc.Sprite = null
    private canvasVideo = document.createElement('canvas')
    private player: HTMLVideoElement
    private videoTexture = new cc.Texture2D()

    ended = true

    onLoad(){

        this.videoViewSize.height = this.videoViewSize.height || this.node.height
        this.videoViewSize.width = this.videoViewSize.width || this.node.width
        
        this.sprite = this.node.getComponent(cc.Sprite) || this.addComponent(cc.Sprite)

        const canplayCallback = ()=>{
            if( this.videoSrcs.every(videoFile=>videoFile.isCanplay) ){
                emit(this,'canplay')
            }
        }

        this.videoSrcs.forEach((videoFile)=>{
            const video = videoFile.videoTag || document.createElement('video')
            video.src = videoFile.videoFile.url

            video.crossOrigin = ''
            video.preload = 'auto'
            video['playsInline'] = true
            video.setAttribute('x5-video-player-type' , 'h5')
            video.setAttribute('x5-video-player-fullscreen' , 'true')
            video.setAttribute('x5-playsinline' , 'true')
            video.setAttribute('webkit-playsinline' , 'true')
            video.setAttribute('playsInline' , 'true')
            video.oncanplay = ()=>{
                videoFile.isCanplay = true
                canplayCallback()
            }
            video.load()
            videoFile.videoTag = video
        })
    }

    update() {
        this.renderVideo()
    }
    onDestroy() {
        this.pause()
    }


    private renderVideo(){
        // @ts-ignore
        const _texture = this.videoTexture._texture

        if(_texture){
            if(!_texture.__Player){
                _texture.__Player = this
                _texture.__setImage = _texture._setImage
                _texture._setImage = function(glFmt:any , options:any){
                    options.image = this.__Player.player
                    options.height = this.__Player.player.videoHeight
                    options.width = this.__Player.player.videoWidth
                    this.__setImage(glFmt , options)
                }
            }
        }

        this.videoTexture.handleLoadedTexture()
        this.node.height = this.videoViewSize.height
        this.node.width = this.videoViewSize.width
    }

    private selectVideo(name:string){
        
        const target = this.videoSrcs.find((videoSrc)=>videoSrc.name == name)

        if(target && target.videoFile && target.videoFile.url){
            if(this.player){
                this.player.pause()
                this.player.currentTime = 0
            }

            this.selectedVideo = target.name

            const video = target.videoTag
            video.volume = this.volume
            video.loop = this.loop

            video.onended = ()=>{
                this.ended = true
                emit(this, 'ended')
            }

            this.scheduleOnce(()=>{
                this.canvasVideo.height = video.videoHeight
                this.canvasVideo.width = video.videoWidth
                this.videoTexture.initWithElement(this.canvasVideo)
                this.sprite.spriteFrame = new cc.SpriteFrame(this.videoTexture)
                this.renderVideo()
            })
            this.player = video
        }
    }

    play(videoName?:string) {
        if(videoName && videoName !== this.selectedVideo){
            this.selectVideo(videoName)
        }

        if(this.player){
            this.player.play()
            this.ended = false
        }
    }

    autoPlay(videoName?:string) : Promise<void> {
        this.play(videoName)

        return new Promise((resolve , reject)=>{
            const timer = setTimeout(()=>{
                clearInterval(checker)
                reject()
            },300)

            const checker = setInterval(()=>{
                if( this.paused == false ){
                    clearTimeout(timer)
                    resolve()
                }
            },10)
        })
    }

    pause() {
        if(this.player){
            this.player.pause()
        }
    }
    toggle() {
        if (this.player.paused) {
            this.play()
        }
        else {
            this.pause()
        }
    }
    replay() {
        this.currentTime = 0
        this.play()
    }


    get height(): number {
        return this.videoViewSize.height
    }
    set height(value:number){
        this.videoViewSize.height = value
    }

    get width(): number {
        return this.videoViewSize.width
    }
    set width(value:number){
        this.videoViewSize.width = value
    }

    get currentTime(): number {
        return this.player ? this.player.currentTime : 0
    }
    set currentTime(value: number) {
        this.ended = false
        this.player.currentTime = value
    }


    get paused() {
        if( ! this.player ){
            return true
        }
        return this.player.paused
    }

    get duration() {
        if(this.player){
            return this.player.duration
        }
        return 999999
    }
}


window['CanvasVideoPlayer'] = CanvasVideoPlayer

/**
 * 冒泡派发一个事件给父节点们
 * @param type
 */
export function emit(self:cc.Node|cc.Component , type:string , data?:any){
    const e = new cc.Event.EventCustom(type , true);

    e.setUserData(data)
    if(self instanceof cc.Component){
        self.node.dispatchEvent(e)
    }
    else{
        self.dispatchEvent(e)
    }
}

interface Timeout{
    callback : Function
    time : number
    timePlus : number
    repeat : number
}

const _timeoutData = {
    _time : 0,
    _idCount : 0,
    _timeoutMap : new Map() as Map<number,Timeout> ,
    _scheduler: null as cc.Scheduler ,
    _canvas : null as cc.Canvas
}

function _timeloop(dt:number){

    _timeoutData._time += dt

    if(_timeoutData._timeoutMap.size == 0){
        return
    }
    const deleteKeys = []
    _timeoutData._timeoutMap.forEach((timeout,key)=>{

        if(timeout.time > _timeoutData._time){
            return
        }

        timeout.repeat--
        if(timeout.repeat>0){
            timeout.time += _timeoutData._time - timeout.time + timeout.timePlus
        }
        else{
            deleteKeys.push(key)
        }

        timeout.callback()
    })

    deleteKeys.forEach((key)=>{
        _timeoutData._timeoutMap.delete(key)
    })
}

/**
 * 
 * @param time 毫秒
 */
export function delay(time=0) {
    return new Promise((ok)=> setTimeout(ok,time) )
}

export function setTimeout(callback:Function , time=0 , repeat=1):number{

    if(!_timeoutData._scheduler){
        _timeoutData._scheduler = cc.director.getScheduler()
        _timeoutData._scheduler.schedule(_timeloop,cc.Canvas.instance,0)
        _timeoutData._canvas = cc.Canvas.instance
    }

    if(_timeoutData._canvas != cc.Canvas.instance){
        _timeoutData._timeoutMap.clear()
        _timeoutData._scheduler.unschedule(_timeloop, _timeoutData._canvas)
        _timeoutData._scheduler.schedule(_timeloop,cc.Canvas.instance,0)
        _timeoutData._canvas = cc.Canvas.instance
    }

    _timeoutData._idCount++

    _timeoutData._timeoutMap.set(_timeoutData._idCount, {
        time : time/1000 + _timeoutData._time,
        timePlus : time/1000,
        callback ,
        repeat ,
    })

    return _timeoutData._idCount

}

export function setInterval(callback:Function , time=0 , repeat=Infinity):number{
    return setTimeout(callback , time , repeat)
}

export function clearTimeout(id:number){
    _timeoutData._timeoutMap.delete(id)
}

export function clearInterval(id:number){
    clearTimeout(id)
}
