/**
 * webWorker 中级版---------失败的版本,只为引出最终版本而存在 " 男人 "
 * @param workerUrl Worker的URL或路径 例如：new URL('./works/test.js', import.meta.url)
 * @returns
 */
export function useWebWorker(workerUrl) {
    let worker = new Worker(workerUrl, { type: "module" });
    let isActive = true;
    // 终止Worker
    const terminate = () => {
        if (worker) {
            worker.terminate();
        }
        worker = null;
        isActive = false;
    };
    let currentParams = null;
    let currentReject = null;
    let currentResolve = null;
    // 成功回调
    const onMessage = (event) => {
        console.log("监听器响应，任务参数:", currentParams, "收到数据:", event.data.data);
        if (event.data.error) {
            currentReject(new Error(event.data.error));
        }
        else {
            currentResolve(event.data);
        }
        cleanup();
    };
    // 失败回调
    const onError = (error) => {
        currentReject(new Error(`Worker error: ${error.message}`));
        cleanup();
    };
    // 清理监听器
    const cleanup = () => {
        currentParams = null;
        currentReject = null;
        currentResolve = null;
        worker?.removeEventListener("message", onMessage);
        worker?.removeEventListener("error", onError);
    };
    // 执行任务并返回 Promise
    const execute = (params) => {
        if (!isActive) {
            return Promise.reject(new Error("Worker已经被终止或不可用"));
        }
        return new Promise((resolve, reject) => {
            // cleanup();
            worker?.addEventListener("message", onMessage);
            worker?.addEventListener("error", onError);
            currentParams = params;
            currentReject = reject;
            currentResolve = resolve;
            // 发送任务
            worker?.postMessage(params);
        });
    };
    return {
        execute,
        isActive,
        terminate: terminate,
    };
}
