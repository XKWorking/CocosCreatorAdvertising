// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
 
const { ccclass, property } = cc._decorator;
 
@ccclass
export default class PoolManager extends cc.Component {
 
    dictPool = {}
    dictPrefab = {}
 
    static _instance: PoolManager = null;
 
    static get instance(): PoolManager {
        if (this._instance == null) {
            this._instance = new PoolManager();
        }
 
        return this._instance;
    }
 
    /**
     * 根据预设从对象池中获取对应节点
     */
    getNode(prefab: cc.Prefab, parent: cc.Node) {
        let name = prefab.data.name;
        this.dictPrefab[name] = prefab;
        let node: cc.Node = null;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this.dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = cc.instantiate(prefab);
            }
        } else {
            //没有对应对象池，创建！
            let pool = new cc.NodePool();
            this.dictPool[name] = pool;
 
            node = cc.instantiate(prefab);
        }
 
        node.parent = parent;
        return node;
    }
 
    /**
     * 将对应节点放回对象池中
     */
    putNode(node: cc.Node) {
        let name = node.name;
        let pool = null;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this.dictPool[name];
        } else {
            //没有对应对象池，创建！
            pool = new cc.NodePool();
            this.dictPool[name] = pool;
        }
 
        pool.put(node);
    }
 
    /**
     * 根据名称，清除对应对象池
     */
    clearPool(name: string) {
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }
}
 
 
