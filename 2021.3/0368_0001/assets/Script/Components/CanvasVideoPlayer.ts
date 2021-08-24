// import { clearInterval, clearTimeout, emit, setInterval, setTimeout } from "../Util"

const { ccclass, property, menu, executionOrder } = cc._decorator


@ccclass('VideoSrc')
class VideoSrc {

    @property({
        type: cc.Asset,
        displayName: '视频文件'
    })
    videoFile: cc.Asset = null

    videoTag: HTMLVideoElement

    @property({
        displayName: '视频名称'
    })
    name = ''

    isCanplay = false
}


@ccclass
@executionOrder(-1)
@menu('通用组件/MP4视频播放器')
export default class CanvasVideoPlayer extends cc.Component {


    private static instances: CanvasVideoPlayer[] = []
    private static instancesPausedStatus: boolean[] = []
    private static instancesVolume: number[] = []
    private static isMute = false

    static useMute() {
        CanvasVideoPlayer.isMute = true
        CanvasVideoPlayer.instances.forEach((video, index) => {
            CanvasVideoPlayer.instancesVolume[index] = video.volume
            video.volume = 0
        })
    }

    static exitMute() {
        CanvasVideoPlayer.isMute = false
        CanvasVideoPlayer.instances.forEach((video, index) => {
            video.volume = CanvasVideoPlayer.instancesVolume[index]
        })
    }

    static pause() {
        CanvasVideoPlayer.instances.forEach((video, index) => {
            CanvasVideoPlayer.instancesPausedStatus[index] = video.paused
            video.pause()
        })
    }

    static resume() {
        CanvasVideoPlayer.instances.forEach((video, index) => {
            if (CanvasVideoPlayer.instancesPausedStatus[index] === false) {
                video.play()
            }
        })
    }



    @property({ displayName: '音量' })
    get volume(): number {
        return this._volume
    }
    set volume(volume: number) {
        if (CanvasVideoPlayer.isMute) {
            CanvasVideoPlayer.instancesVolume[CanvasVideoPlayer.instances.indexOf(this)] = volume
            this._volume = 0
            if (this.player) {
                this.player.volume = 0
                this.player.muted = volume === 0
            }
            return
        }

        this._volume = volume
        if (this.player) {
            this.player.volume = volume
            this.player.muted = volume === 0
        }
    }

    @property({ displayName: '循环播放' })
    get loop() {
        return this._loop
    }
    set loop(value: boolean) {
        this._loop = value
        if (this.player) {
            this.player.loop = value
        }
    }

    @property({
        // type : cc.Size,
        displayName: '视频显示大小',
        tooltip: '默认为节点大小',
    })
    private videoViewSize = cc.size(0, 0)


    @property({
        type: [VideoSrc],
        displayName: '视频源',
    })
    private videoSrcs: VideoSrc[] = []
    private selectedVideo = ''


    @property
    private _volume = 1
    @property
    private _loop = false

    private sprite: cc.Sprite = null
    private canvas = document.createElement('canvas')
    private gl: WebGLRenderingContext = null
    private player: HTMLVideoElement
    private videoTexture = new cc.Texture2D()

    ended = true

    onLoad() {

        this.videoViewSize.height = this.videoViewSize.height || this.node.height
        this.videoViewSize.width = this.videoViewSize.width || this.node.width

        this.canvas.height = this.videoViewSize.height
        this.canvas.width = this.videoViewSize.width

        this.gl = this.canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true })

        // document.body.appendChild( this.canvas )
        // this.canvas.style.position = 'fixed'
        // this.canvas.style.bottom = '0'
        // this.canvas.style.left = '0'
        // this.canvas.style.height = '100px'
        // this.canvas.onclick = ()=>{
        //     this.player.play()
        // }

        this.sprite = this.node.getComponent(cc.Sprite) || this.addComponent(cc.Sprite)

        const gl = this.gl
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, "attribute vec2 vx;varying vec2 tx;void main(){gl_Position=vec4(vx.x*2.0-1.0,1.0-vx.y*2.0,0,1);tx=vx;}");
        gl.compileShader(vs);

        var ps = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(ps, "precision mediump float;uniform sampler2D sm;varying vec2 tx;void main(){gl_FragColor=texture2D(sm,tx);}");
        gl.compileShader(ps);

        var shader = gl.createProgram();
        gl.attachShader(shader, vs);
        gl.attachShader(shader, ps);
        gl.linkProgram(shader);
        gl.useProgram(shader);

        var vx_ptr = gl.getAttribLocation(shader, "vx");
        gl.enableVertexAttribArray(vx_ptr);
        gl.uniform1i(gl.getUniformLocation(shader, "sm"), 0);

        var vx = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vx);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);

        var ix = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        const update = () => {
            setTimeout(update, 30)

            if (!this.player || this.player.paused) {
                return
            }

            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, tex)

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.player)


            gl.bindBuffer(gl.ARRAY_BUFFER, vx)
            gl.vertexAttribPointer(vx_ptr, 2, gl.FLOAT, false, 0, 0)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix)
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
        }

        update()

        const canplayCallback = () => {
            if (this.videoSrcs.every(videoFile => videoFile.isCanplay)) {
                emit(this, 'canplay')
            }
        }

        this.videoSrcs.forEach((videoFile) => {
            const video = videoFile.videoTag || document.createElement('video')
            video.src = videoFile.videoFile.url

            video.crossOrigin = ''
            video.preload = 'auto'
            video['playsInline'] = true
            video.setAttribute('x5-video-player-type', 'h5')
            video.setAttribute('x5-video-player-fullscreen', 'true')
            video.setAttribute('x5-playsinline', 'true')
            video.setAttribute('webkit-playsinline', 'true')
            video.setAttribute('playsInline', 'true')
            video.oncanplay = () => {
                videoFile.isCanplay = true
                canplayCallback()
            }
            video.load()
            videoFile.videoTag = video

            video.style.height = '0'
            video.style.width = '0'
            video.style.opacity = '0'
            video.style.display = 'block'
            document.body.appendChild(video)
        })
    }

    update() {
        this.renderVideo()
    }
    onDestroy() {
        this.pause()
    }


    private renderVideo() {
        // @ts-ignore
        const _texture = this.videoTexture._texture

        if (_texture) {
            if (!_texture.__Player) {
                _texture.__Player = this
                _texture.__setImage = _texture._setImage
                _texture._setImage = function (glFmt: any, options: any) {
                    options.image = this.__Player.canvas
                    options.height = this.__Player.canvas.height
                    options.width = this.__Player.canvas.width

                    this.__setImage(glFmt, options)
                }
            }
        }

        this.videoTexture.handleLoadedTexture()
        this.node.height = this.videoViewSize.height
        this.node.width = this.videoViewSize.width
    }

    private selectVideo(name: string) {

        const target = this.videoSrcs.find((videoSrc) => videoSrc.name == name)

        if (target && target.videoFile && target.videoFile.url) {
            if (this.player) {
                this.player.pause()
                this.player.currentTime = 0
            }

            this.selectedVideo = target.name

            const video = target.videoTag
            video.volume = this.volume
            video.loop = this.loop

            video.onended = () => {
                this.ended = true
                emit(this, 'ended')
            }

            this.scheduleOnce(() => {
                this.videoTexture.initWithElement(this.canvas)
                this.sprite.spriteFrame = new cc.SpriteFrame(this.videoTexture)
                this.renderVideo()
            })

            this.player = video
        }
    }

    play(videoName?: string) {
        if (videoName && videoName !== this.selectedVideo) {
            this.selectVideo(videoName)
        }

        if (this.player) {
            this.player.play()
            this.ended = false
        }
    }

    autoPlay(videoName?: string): Promise<void> {
        this.play(videoName)

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                clearInterval(checker)
                reject()
            }, 300)

            const checker = setInterval(() => {
                if (this.paused == false) {
                    clearTimeout(timer)
                    resolve()
                }
            }, 10)
        })
    }

    pause() {
        if (this.player) {
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
    set height(value: number) {
        this.videoViewSize.height = value
    }

    get width(): number {
        return this.videoViewSize.width
    }
    set width(value: number) {
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
        if (!this.player) {
            return true
        }
        return this.player.paused
    }

    get duration() {
        if (this.player) {
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
export function emit(self: cc.Node | cc.Component, type: string, data?: any) {
    const e = new cc.Event.EventCustom(type, true);

    e.setUserData(data)
    if (self instanceof cc.Component) {
        self.node.dispatchEvent(e)
    }
    else {
        self.dispatchEvent(e)
    }
}