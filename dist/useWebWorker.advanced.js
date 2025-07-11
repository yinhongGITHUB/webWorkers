/**
 * webWorker 高级版
 * @param workerUrl Worker的URL或路径 例如：new URL('./works/test.js', import.meta.url)
 * @returns
 */
export function useWebWorker(workerUrl) {
    let worker = new Worker(workerUrl, { type: "module" });
    let isActive = true;
    // 任务队列
    const taskQueue = [];
    // 是否正在处理任务  默认为false
    let isProcessing = false;
    let currentResolve = null;
    let currentReject = null;
    // 终止 Worker
    const terminate = () => {
        if (worker) {
            worker.terminate();
        }
        // 清理监听器
        cleanup();
        worker = null;
        isActive = false;
    };
    // 成功回调
    const onMessage = (event) => {
        cleanup();
        currentResolve && currentResolve(event.data);
        currentResolve = null;
        processNextTask();
    };
    // 失败回调
    const onError = (err) => {
        cleanup();
        currentReject && currentReject(err);
        currentReject = null;
        processNextTask();
    };
    // 清理监听器
    const cleanup = () => {
        worker?.removeEventListener("message", onMessage);
        worker?.removeEventListener("error", onError);
    };
    // 处理队列中的下一个任务
    const processNextTask = () => {
        // 队列为空就不往下走了
        if (taskQueue.length === 0) {
            isProcessing = false;
            return;
        }
        isProcessing = true;
        const { params, resolve, reject } = taskQueue.shift();
        currentResolve = resolve;
        currentReject = reject;
        worker?.addEventListener("message", onMessage);
        worker?.addEventListener("error", onError);
        // 发送任务
        worker?.postMessage(params);
    };
    // 执行任务并返回 Promise
    const execute = (params) => {
        if (!isActive) {
            return Promise.reject(new Error("Worker已经被终止或不可用"));
        }
        return new Promise((resolve, reject) => {
            taskQueue.push({ params, resolve, reject });
            if (!isProcessing) {
                processNextTask();
            }
        });
    };
    return {
        execute,
        isActive,
        terminate,
    };
}
