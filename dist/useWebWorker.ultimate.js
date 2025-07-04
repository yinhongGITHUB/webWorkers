/**
 * webWorker最终版
 * @param workerUrl Worker的URL或路径 例如：new URL('./test.js', import.meta.url)
 * @returns
 */
export function useWebWorker(workerUrl) {
    let worker = new Worker(workerUrl, { type: "module" });
    const result = null;
    const error = null;
    // 是否处于活动状态
    let isActive = true;
    // 任务队列
    const taskQueue = [];
    // 标识是否正在处理任务
    let isProcessing = false;
    // 终止 Worker
    const terminate = () => {
        if (worker) {
            worker.terminate();
        }
        worker = null;
        isActive = false;
    };
    // 处理队列中的下一个任务
    const processNextTask = () => {
        if (taskQueue.length === 0) {
            isProcessing = false; // 如果队列为空，标记为未处理状态
            return;
        }
        isProcessing = true; // 标记为正在处理状态
        // 从队列中取出任务
        const { params, resolve, reject } = taskQueue.shift();
        // 成功回调
        const onMessage = (event) => {
            cleanup(); // 清理监听器
            resolve(event.data); // 解析任务结果
            processNextTask(); // 处理下一个任务
        };
        // 错误回调
        const onError = (err) => {
            cleanup(); // 清理监听器
            reject(err); // 解析错误信息
            processNextTask(); // 处理下一个任务
        };
        // 清理监听器
        const cleanup = () => {
            worker?.removeEventListener('message', onMessage); // 移除消息监听器
            worker?.removeEventListener('error', onError); // 移除错误监听器
        };
        // 添加消息监听器
        worker?.addEventListener('message', onMessage);
        // 添加错误监听器
        worker?.addEventListener('error', onError);
        // 向 Worker 发送任务参数
        worker?.postMessage(params);
    };
    // 执行任务并返回 Promise
    const execute = (params) => {
        return new Promise((resolve, reject) => {
            taskQueue.push({ params, resolve, reject }); // 将任务加入队列
            if (!isProcessing) {
                processNextTask(); // 如果没有正在处理的任务，开始处理队列
            }
        });
    };
    // 返回 Worker 的操作方法
    return {
        execute, // 执行任务
        result, // 任务结果
        error, // 错误信息
        isActive, // Worker 状态
        terminate, // 终止 Worker
    };
}
