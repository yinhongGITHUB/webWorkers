## Web Workers 是什么

Web Workers 为 Web 内容在后台线程中运行脚本提供了一种简单的方法，允许你在主线程之外执行 JavaScript 代码，从而避免阻塞用户界面（如滚动、点击等交互）


#### 注意事项

 1. 没有 DOM 访问权限
 2. 全局对象是 self 而非 window
 3. 没有存储访问权限（localStorage/sessionStorage）
 4. 没有 UI 访问权限（alert()/confirm()）
 5. 没有直接的图形渲染能力（canvas/WebGL）
 6. 定时器无法被窗口不可见时节流，需手动清理 并且全局对象为self
 7. 脚本必须是js


#### 自动监听文件变化并实时将ts文件编译成js文件

npm run tsc:watch

#### 运行

npm run start

#### 常见问题

1. 为什么要使用 Web Worker ？

- 提升性能：将耗时任务移至后台，避免主线程卡顿，提升页面响应速度。
- 增强用户体验：确保用户界面（如滚动、点击等交互）流畅运行。
- 任务并行化：利用多线程能力同时处理多个任务，提高计算效率。
- 代码模块化：将复杂的逻辑封装到 Worker 中，简化主线程代码。

2. useWebWorker 到底做了什么？
答：
在业务侧，将较为复杂的运算逻辑、占用主线程时间较长的任务，交由 Web Worker 处理；useWebWorker以任务队列的方式，确保多次执行 execute时， 按顺序处理；




3. 如何使用 useWebWorker ？

- 初始化
```js
// 导入useWebWorker后的初始化
const { execute } = useWebWorker(new URL("./works/test.js", import.meta.url));
```

- 自定义works脚本
```js
self.onmessage = function (event) {
    // event.data  就是下面execute传入的 *参数对象*
    // ToDo......
    // 发送处理结果回主线程
    self.postMessage(result);
};
```
- 具体执行
```js
// 自定义works脚本中 需要接收的 *参数对象*
 execute({ 
    ...params
 })
```

4. 简单版本的 useWebWorker 有什么致命问题？