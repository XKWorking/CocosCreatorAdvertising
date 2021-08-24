import { createConfigs } from './GameConfigTypes'

createConfigs({
    // global(config)  必须存在
    "global": {
        // 必须把属性写到 props 里才可以被打包工具正常识别
        "props": {
            // 字符串/数字/布尔类型的值可以直接写值
            'restartCount': 2,
            'preview1_name': 'test1',

            // 也可以写成标准形式 , 添加更多描述信息
            'gameTimer': {
                // 目前只支持 string|number|boolean|color 
                type: 'number',
                value: 100,
                label: '游戏计时器',
                notes: '游戏可以运行的时间 , 单位为秒',
                step: 1,
                max: 20,
                min: 10,
            },

            // 颜色类型的数据必须写成标准形式
            'bgColor': {
                type: 'color',
                value: '#ff0000'
            }
        }
    },
    // 有需要的话也可以写其他的配置(config)里
    "layer1": {
        // 必须把属性写为 props 
        "props": {
            // ...other
        }
    }
})
