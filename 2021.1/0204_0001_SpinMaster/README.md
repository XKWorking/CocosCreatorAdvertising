# Example Pro

# version:cocos creator 2.3.3

# 更新日志 2020.11.19 拆分Utils 分为ArrayUtil MathUtil NodeUtil ObjectUtil TimerUtil

# 更新日志 2020.11.18 添加数值滚动 按钮果冻效果 长按触发组件

# 更新日志 2020.11.18 SystemConfig 添加全局碰撞管理器开关 添加随机数文件

# 更新日志 2020.10.15 Util 添加公用手指引导 添加节点坐标转换方法 

# 更新日志 2020.10.9 删除CountDownUtil 修改TimerUtil

# 更新日志 2020.10.9 增加EventManager

# 更新日志 2020.9.30 增加GameConfig和修改视频播放组件

# 更新日志 2020.9.27 I8nSet  补全发包工具支持语言

# 更新日志 2020.9.15 AudioManager 新增设置音效音量功能

# 更新日志 2020.8.27 新增TimerUtil

# 更新日志 2020.8.20 新增Util 数组、字符串等方法

# 更新日志 2020.8.15 整合popupPanel和LayerManager

新建Layer可直接继承BaseLayer或者popupPanel，打开Layer通过LayerManager获取对应的Layer，调用基类得show/OpenForTween，关闭调用hide/CloseForTween

新建Layer需要在onload方法中调用super.onResize() 可自动实现自动适配


> 项目结构
>> Scene <br>
>> Texture <br>
>> Script 
>>> Base <br>
>>> Components <br>
>>> Consts <br>
>>> CpTool <br>
>>> Manager <br>
>>> Panel
