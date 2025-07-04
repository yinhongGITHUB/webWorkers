/**
 * webWorker简单版
 * @param workerUrl Worker的URL或路径 例如：new URL('./test.js', import.meta.url)
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
    // 执行任务并返回 Promise
    const execute = (params) => {
        if (!isActive) {
            return Promise.reject(new Error("Worker已经被终止或不可用"));
        }
        return new Promise((resolve, reject) => {
            // 成功回调
            const onMessage = (event) => {
                console.log('worker onMessage', event.data.data);
                if (event.data.error) {
                    reject(new Error(event.data.error));
                }
                else {
                    resolve(event.data);
                }
                cleanup();
            };
            // 错误回调
            const onError = (error) => {
                reject(new Error(`Worker error: ${error.message}`));
                cleanup();
            };
            // 清理监听器
            const cleanup = () => {
                worker?.removeEventListener("message", onMessage);
                worker?.removeEventListener("error", onError);
            };
            // 确保在执行任务前清理旧的监听器
            cleanup();
            // 添加监听器
            worker?.addEventListener("message", onMessage);
            worker?.addEventListener("error", onError);
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
