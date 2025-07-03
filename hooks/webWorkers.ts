/**
 *
 * @param workerUrl Worker的URL或路径 例如：new URL('./test.js', import.meta.url)
 * @returns
 */

export function useWorker(workerUrl: any) {
  let worker = new Worker(workerUrl, { type: "module" });
  let isActive = true;

  // 终止Worker
  const terminate = () => {
    if (worker) {
      worker.terminate();
    }
    isActive = false;
  };

  // 执行任务并返回 Promise
  const execute = (params: any): Promise<any> => {
    if (!isActive) {
      return Promise.reject(new Error("Worker已经被终止或不可用"));
    }

    worker = new Worker(workerUrl, { type: "module" });

    return new Promise((resolve, reject) => {
      // 成功回调
      const onMessage = (event: MessageEvent) => {
      
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
          cleanup();
      };

      // 错误回调
      const onError = (error: ErrorEvent) => {
        reject(new Error(`Worker error: ${error.message}`));
        cleanup();
      };

      // 清理监听器
      const cleanup = () => {
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
        terminate();
      };

      // 添加监听器
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      // 发送任务
      worker.postMessage(params);
    });
  };

  return {
    execute,
    isActive,
    terminate: terminate,
  };
}
