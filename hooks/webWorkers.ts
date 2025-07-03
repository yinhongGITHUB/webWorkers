
/**
 * 
 * @param workerUrl Worker的URL或路径 例如：new URL('./test.js', import.meta.url)
 * @returns 
 */

export function useWorker(workerUrl: any) {
  const worker = new Worker(workerUrl, { type: 'module' });
  let isActive = true;


  // 执行任务并返回 Promise
  const execute = (params:any): Promise<any> => {
    if (!isActive) {
      return Promise.reject(new Error('Worker已经被终止或不可用'));
    }

    return new Promise((resolve, reject) => {
      // 成功回调
      const onMessage = (event: MessageEvent) => {
        console.log('event.data',event.data);
        
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
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
      };

      // 添加监听器
      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);

      // 发送任务
      worker.postMessage(params);
    });
  };

  return {
    execute,
    isActive,
    terminate: () => {
      worker.terminate();
      isActive = false;
    }
  };
}  