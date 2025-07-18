// 深度判断两个对象是否相等
export function deepEqual(obj1, obj2) {
    if (obj1 === obj2)
        return true;
    if (typeof obj1 !== "object" ||
        typeof obj2 !== "object" ||
        obj1 == null ||
        obj2 == null)
        return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length)
        return false;
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key]))
            return false;
    }
    return true;
}
/**
 * webWorker 初级版
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
    // 执行任务并返回 Promise
    const execute = (params) => {
        if (!isActive) {
            return Promise.reject(new Error("Worker已经被终止或不可用"));
        }
        return new Promise((resolve, reject) => {
            // 成功回调
            const onMessage = (event) => {
                console.log("监听器响应，任务参数:", params, "收到数据:", event.data.data);
                if (!deepEqual(event.data.data.test, params.test))
                    return;
                if (event.data.error) {
                    reject(new Error(event.data.error));
                }
                else {
                    resolve(event.data);
                }
                // 这里不能在没有deepEqual的情况下清除
                // cleanup();
            };
            // 失败回调
            const onError = (error) => {
                reject(new Error(`Worker error: ${error.message}`));
                // 这里不能在没有deepEqual的情况下清除
                // cleanup();
            };
            const cleanup = () => {
                worker?.removeEventListener("message", onMessage);
                worker?.removeEventListener("error", onError);
            };
            worker?.addEventListener("message", onMessage);
            worker?.addEventListener("error", onError);
            // 发送任务
            worker?.postMessage(params);
        });
    };
    return {
        execute,
        terminate,
        get isActive() {
            return isActive;
        },
    };
}
