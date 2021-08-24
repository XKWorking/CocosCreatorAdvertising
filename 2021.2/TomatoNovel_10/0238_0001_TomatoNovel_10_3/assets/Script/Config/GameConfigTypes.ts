type Configs = { global : Config , [key:string] : Config }
type ConfigsEditor = { global : ConfigEditor , [key:string] : ConfigEditor }

type Value = BaseValue|string|boolean|number

class BaseValue{
    type ?: 'boolean' | 'number' | 'int' | 'string' | 'color' // 'image' | 'audio' | 
    label ?=''
    notes ?=''
    value ?: string | boolean | number | null = null
}

class BaseBooleanValue extends BaseValue{
    type ?: 'boolean' = 'boolean'
    value = false
}

class BaseNumberValue extends BaseValue{
    type ?:'number'= 'number'
    value = 0

    // 数字的步长
    step ?:number= 1
    // 数字的最大最小值
    max ?:number
    min ?:number
}

class BaseIntValue extends BaseValue{
    type ?:'int'= 'int'
    value = 0

    // 数字的步长
    step ?:number= 1
    // 数字的最大最小值
    max ?:number
    min ?:number
}

class BaseStringValue extends BaseValue{
    type ?:'string'= 'string'
    value = ''

    // 字符串长度
    maxLength ?: number
}

// class BaseImageValue extends BaseValue{
//     type ?:'image'= 'image'
//     value = ''
// }

// class BaseAudioValue extends BaseValue{
//     type ?:'audio'= 'audio'
//     value = ''
//     volume ?= 1
// }

class BaseColorValue extends BaseValue{
    type ?:'color'= 'color'
    value = ''
}

class Config {
    label ?: string
    preview ?: string
    props ?: Record<string , string | boolean | number | BaseBooleanValue | BaseNumberValue | BaseIntValue | BaseStringValue | BaseColorValue>
    // images ?: Record<string , BaseImageValue|string>
    // audios ?: Record<string , BaseAudioValue|string>
}

class ConfigEditor extends Config{
    props ?: Record<string , BaseBooleanValue | BaseNumberValue | BaseIntValue | BaseStringValue | BaseColorValue>
}

function createValueItem<T extends BaseValue>(Type:{new():T}):(data?:T|string|boolean|number)=>T{
    return function(data:Value){
        if(data instanceof Type){
            return data
        }

        const newData = new Type()

        if(typeof data==='object'){
            for(const i in data){
                newData[i] = data[i]
            }
        }
        else{
            newData.value = data
        }
        return newData
    }
}

const BooleanItem = createValueItem(BaseBooleanValue)
const NumberItem = createValueItem(BaseNumberValue)
const IntItem = createValueItem(BaseIntValue)
const StringItem = createValueItem(BaseStringValue)
// const ImageItem = createValueItem(BaseImageValue)
// const AudioItem = createValueItem(BaseAudioValue)
const ColorItem = createValueItem(BaseColorValue)

const typesMap = {
    'boolean' : BooleanItem ,
    'number' : NumberItem ,
    'int' : IntItem ,
    'string' : StringItem ,
    // 'image' : ImageItem ,
    // 'audio' : AudioItem ,
    'color' : ColorItem
}

export function createConfigs( configs:Configs ) {
    const defaultGameConfig = toCoolplayConfigsEditer(configs)
    
    if(typeof window==='object'){
        window['__gameConfig'] = defaultGameConfig
    }
}


function toCoolplayConfigsEditer(configs:Configs):ConfigsEditor{
    const newConfigs = JSON.parse(JSON.stringify(configs))

    Object.keys( newConfigs ).forEach((configName)=>{
        // initValueItems(newConfigs[configName].images , BaseImageValue)
        // initValueItems(newConfigs[configName].audios , BaseAudioValue)

        const props = newConfigs[configName].props

        if(props){
            for(const i in props){
                props[i] = autoInitValueItem(props[i])
            }
        }
    })

    return newConfigs as ConfigsEditor
}

function autoInitValueItem(value:Value):BaseValue{
    switch(typeof value){
        case 'boolean':
            return BooleanItem(value)
        case 'number':
            return NumberItem(value)
        case 'string':
            return StringItem(value)
        case 'object':
            // @ts-ignore
            return typesMap[value.type](value)
    }
}

function initValueItems<T extends BaseValue>(values:Record<string , Value> , Type:{new():T}){
    if(!values){
        return
    }

    const TypeItem = createValueItem(Type as {new():BaseValue})

    for(const i in values){
        values[i] = TypeItem(values[i])
    }
}
