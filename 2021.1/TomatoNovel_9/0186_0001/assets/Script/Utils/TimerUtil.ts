
interface Timeout {
    callback: () => void
    time: number
    timePlus: number
    repeat: number
}

export default class TimerUtil {
    private static _time = 0
    private static _timeoutMap: Map<string, Timeout> = new Map()
    private static _scheduler: cc.Scheduler = null
    private static _canvas: cc.Canvas = null

    private static _timeloop(dt: number) {

        TimerUtil._time += dt

        if (TimerUtil._timeoutMap.size == 0) {
            return
        }

        const deleteKeys = []

        TimerUtil._timeoutMap.forEach((timeout, key) => {

            if (timeout.time > TimerUtil._time) {
                return
            }

            timeout.repeat--

            if (timeout.repeat > 0) {
                timeout.time += TimerUtil._time - timeout.time + timeout.timePlus
            }
            else {
                deleteKeys.push(key)
            }

            timeout.callback()
        })

        deleteKeys.forEach((key) => {
            TimerUtil._timeoutMap.delete(key)
        })
    }


    static setTimeout(key: string, callback: () => void, time = 0, repeat = 1): string {

        TimerUtil.hasKey(key);

        if (!TimerUtil._scheduler) {
            TimerUtil._scheduler = cc.director.getScheduler()
            TimerUtil._scheduler.schedule(TimerUtil._timeloop, cc.Canvas.instance, 0)
            TimerUtil._canvas = cc.Canvas.instance
        }

        if (TimerUtil._canvas != cc.Canvas.instance) {
            TimerUtil._timeoutMap.clear()
            TimerUtil._scheduler.unschedule(TimerUtil._timeloop, TimerUtil._canvas)
            TimerUtil._scheduler.schedule(TimerUtil._timeloop, cc.Canvas.instance, 0)
            TimerUtil._canvas = cc.Canvas.instance
        }

        // TimerUtil._idCount++

        TimerUtil._timeoutMap.set(key, {
            time: time / 1000 + TimerUtil._time,
            timePlus: time / 1000,
            callback,
            repeat,
        })
        return key

    }

    static setInterval(key: string, callback: () => void, time = 0, repeat = Infinity): string {
        return TimerUtil.setTimeout(key, callback, time, repeat)
    }

    static clearTimeout(key: string) {
        TimerUtil.delKey(key);
        TimerUtil._timeoutMap.delete(key)
    }

    static clearInterval(key: string) {
        TimerUtil.clearTimeout(key);
    }

    private static hasKey(key: string) {
        if (TimerUtil._timeoutMap.has(key)) {
            console.warn(key, "计时器key已经存在");
            return
        }
    }

    private static delKey(key: string) {
        if (!TimerUtil._timeoutMap.has(key)) {
            console.warn(key, "计时器key不存在");
            return
        }
        if (TimerUtil._timeoutMap.has(key)) {
            TimerUtil._timeoutMap.delete(key);
        }
    }

}
