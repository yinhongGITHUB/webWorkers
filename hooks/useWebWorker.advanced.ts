/**
 * webWorker 高级版
 * @param workerUrl Worker的URL或路径 例如：new URL('./works/test.js', import.meta.url)
 * @returns
 */
export function useWebWorker(workerUrl: string) {
  let worker: Worker | null = new Worker(workerUrl, { type: "module" });

  let isActive = true;
  // 任务队列
  const taskQueue: Array<{ params: any; resolve: Function; reject: Function }> = [];
  // 是否正在处理任务  默认为false
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
    // 队列为空就不往下走了
    if (taskQueue.length === 0) {
      isProcessing = false;
      return;
    }

    isProcessing = true; 
    const { params, resolve, reject } = taskQueue.shift()!;

    // 成功回调
    const onMessage = (event: MessageEvent) => {
      cleanup();
      resolve(event.data); 
      processNextTask(); 
    };

    // 失败回调
    const onError = (err: ErrorEvent) => {
      cleanup();
      reject(err); 
      processNextTask(); 
    };

    // 清理监听器
    const cleanup = () => {
      worker?.removeEventListener('message', onMessage);
      worker?.removeEventListener('error', onError);
    };

    worker?.addEventListener('message', onMessage);
    worker?.addEventListener('error', onError);

    // 发送任务
    worker?.postMessage(params);
  };

  // 执行任务并返回 Promise
  const execute = (params: any) => {
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
