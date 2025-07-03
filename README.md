## 自封在webWorkers hook

Web Workers 是浏览器提供的一种机制，允许你在主线程之外执行 JavaScript 代码，从而避免阻塞用户界面（如滚动、点击等交互）
JavaScript 是单线程的，长时间运行的计算会阻塞主线程，导致页面卡顿。Web Workers 允许将计算任务移至后台线程

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