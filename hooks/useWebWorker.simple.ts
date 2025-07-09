/**
 * webWorker简单版
 * @param workerUrl Worker的URL或路径 例如：new URL('./works/test.js', import.meta.url)
 * @returns
 */

export function useWebWorker(workerUrl: any) {
  let worker: Worker | null = new Worker(workerUrl, { type: "module" });

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
  const execute = (params: any): Promise<any> => {
    if (!isActive) {
      return Promise.reject(new Error("Worker已经被终止或不可用"));
    }

    return new Promise((resolve, reject) => {

      // 成功回调
      const onMessage = (event: MessageEvent) => {
         console.log('worker onMessage', event.data.data);
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
       cleanup();
      };

      // 失败回调
      const onError = (error: ErrorEvent) => {
        reject(new Error(`Worker error: ${error.message}`));
        cleanup();
      };


      const cleanup = () => {
        worker?.removeEventListener("message", onMessage);
        worker?.removeEventListener("error", onError);
      };

      cleanup(); 
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
