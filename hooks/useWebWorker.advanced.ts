/**
 * webWorker 高级版
 * @param workerUrl Worker的URL或路径 例如：new URL('./works/test.js', import.meta.url)
 * @returns
 */
export function useWebWorker(workerUrl: string) {
  let worker: Worker | null = new Worker(workerUrl, { type: "module" });

  let isActive = true;
  // 任务队列
  const taskQueue: Array<{ params: any; resolve: Function; reject: Function }> =
    [];
  // 运行队列索引
  let operationQueueIndex = 0;
  // 终止任务索引集合
  let terminateTaskIndexArr = [] as number[];
  // 是否正在处理任务  默认为false
  let isProcessing = false;
  let currentResolve = null as any;
  let currentReject = null as any;

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

  // 终止任务
  const terminateTask = (index: number) => {
    const currentIndex = index - 1; // 转换为0基索引
    if (currentIndex < 0)
      return console.warn(`终止任务失败，任务 ${index} 索引无效`);

    if (currentIndex < operationQueueIndex) {
      console.warn(`终止任务失败，任务 ${index} 已经运行完毕，无法终止`);
    } else if (currentIndex === operationQueueIndex) {
      console.warn(`终止任务失败，任务 ${index} 已经在运行队列中，无法终止`);
      // setTimeout(() => {
      //   terminate();
      //   worker = new Worker(workerUrl, { type: "module" });
      //   operationQueueIndex++;
      //   processNextTask();
      // });
    } else if (currentIndex > operationQueueIndex) {
      terminateTaskIndexArr.push(currentIndex);
      console.warn(`终止任务成功，任务 ${index} 将会被跳过`);
    }
  };
  
  // 成功回调
  const onMessage = (event: MessageEvent) => {
    cleanup();
    currentResolve && currentResolve(event.data);
    Promise.resolve().then(() => {
      currentResolve = null;
      processNextTask();
    });
  };

  // 失败回调
  const onError = (err: ErrorEvent) => {
    cleanup();
    currentReject && currentReject(err);
    currentReject = null;
    Promise.resolve().then(() => {
      processNextTask();
    });
  };

  // 清理监听器
  const cleanup = () => {
    worker?.removeEventListener("message", onMessage);
    worker?.removeEventListener("error", onError);
  };

  // 处理队列中的下一个任务
  const processNextTask = () => {
    // 如果有终止任务索引，跳过这些任务
    while (terminateTaskIndexArr.includes(operationQueueIndex)) {
      operationQueueIndex++;
    }

    // 执行当前任务不存在就不往下走了
    if (!taskQueue[operationQueueIndex]) {
      isProcessing = false;
      operationQueueIndex = 0;
      return;
    }
    isProcessing = true;
    const { params, resolve, reject } = taskQueue[operationQueueIndex];
    operationQueueIndex++;
    currentResolve = resolve;
    currentReject = reject;

    worker?.addEventListener("message", onMessage);
    worker?.addEventListener("error", onError);

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
    terminate,
    terminateTask,
    get isActive() {
      return isActive;
    },
  };
}
