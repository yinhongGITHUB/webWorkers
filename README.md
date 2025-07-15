## Web Workers 及 useWebWorker 详解

### 一、Web Workers 是什么

Web Workers 为 Web 内容在后台线程中运行脚本提供了一种简单的方法，允许你在主线程之外执行 JavaScript 代码，从而避免阻塞用户界面（如滚动、点击等交互）
<img src="https://github.com/yinhongGITHUB/webWorkers/blob/master/imgs/thread.png" alt="图片描述" width="100%">

### 二、Web Workers 注意事项

 1. 没有 DOM 访问权限
 2. 全局对象是 self 而非 window
 3. 没有存储访问权限（localStorage/sessionStorage）
 4. 没有 UI 访问权限（alert()/confirm()）
 5. 没有直接的图形渲染能力（canvas/WebGL）
 6. 定时器无法被窗口不可见时节流，需手动清理
 7. 脚本必须是js


### 三、运行相关命令

| 功能描述         | 命令             |
| ------------------ | ------------------- |
| 启动项目          | `npm run start`     |
| 监听 TS 文件变化并编译 | `npm run tsc:watch` |

#### 四、常见问题

##### 1. 为什么要使用 Web Worker ？

- 提升性能：将耗时任务移至后台，避免主线程卡顿，提升页面响应速度。
- 增强用户体验：确保用户界面（如滚动、点击等交互）流畅运行。
- 任务并行化：利用多线程能力同时处理多个任务，提高计算效率。
- 代码模块化：将复杂的逻辑封装到 Worker 中，简化主线程代码。

##### 2. useWebWorker 到底做了什么？
答：
在业务侧，将较为复杂的运算逻辑、占用主线程时间较长的任务，交由 Web Worker 处理；useWebWorker以任务队列的方式，确保多次执行 execute时， 按顺序处理；

##### 3. 如何使用 useWebWorker ？

- 自定义works脚本
```js
// self.js

self.onmessage = function (event) {
    // event.data  就是下面execute传入的 *参数对象*
    // ToDo......
    // 发送处理结果回主线程
    self.postMessage(result);
};
```
- 初始化与具体执行
```js
// index.js

// 导入useWebWorker后的初始化
const { execute } = useWebWorker(new URL("./works/test.js", import.meta.url));

// 自定义works脚本中 需要接收的 *参数对象*
 execute({ 
    ...params
 })
```

##### 4. 简单版本的 useWebWorker 为什么特意在代码中备注不要调用cleanup清除？

我的本意是每次调用execute,都给worker实例添加不同的onMessage,这样在每次调用execute,都会触发所有的onMessage回调,然后通过比较**业务侧**传入参数和**脚本侧**传入参数,来判断是否是同一任务的onMessage回调,如果在每个成功的onMessage最后,清除掉自身,那么在没有deepEqual的情况下,将会打印多次首次调用execute所传入的参数(这里的多次取决于execute被调用了几次):
<img src="https://github.com/yinhongGITHUB/webWorkers/blob/master/imgs/add-message.png" alt="图片描述" width="100%">

```js
// 例子中的错误输出为:
// 我是一个参数1
// 我是一个参数1
// 我是一个参数1
```
这是因为Promise被提前结束了,无法打印正确的输出

##### 5. 为什么分初级版、中级版、高级版,判定标准是什么?

| 功能描述&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 说明        |
| ------------------------------------ | ------------------- |
| 初级版         | 仅考虑功能实现,并且多次调用execute时,会给同一worker实例添加多个onMessage回调,占用资源不说,还有内存泄漏的风险.     |
| 中级版 | 解决了初级版本的多次绑定onMessage回调问题,但受限于设计,无法正确打印结果,仅仅为了引出高级版而存在. |
| 高级版(建议使用) | 引入任务队列设计,串行编译结果,即能正确打印输出,又能避免过多的内存消耗. |

##### 6. 高级版效果演示
<img src="https://github.com/yinhongGITHUB/webWorkers/blob/master/imgs/ultimate-impact.gif" alt="图片描述" width="100%">