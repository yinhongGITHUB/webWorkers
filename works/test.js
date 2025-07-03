//  自定义worker脚本
self.onmessage = function (event) {
  setTimeout(() => {
    // 模拟处理数据
    const result = {
      data: event.data,
      message: "Worker processed data successfully",
      error: null,
    };
    // 发送处理结果回主线程
    self.postMessage(result);
  }, 1000);
};
