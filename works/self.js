//  自定义worker脚本
self.onmessage = function (event) {
  console.log("event.data", event.data);

  let timeID = setTimeout(() => {
    clearTimeout(timeID);
    // 模拟处理数据
    const result = {
      data: event.data,
      message: "Worker 处理成功",
      error: null,
    };
    // 模拟耗时操作
    // let res = 0;
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // for (let i = 0; i < 1e9; i++) {
    //   res += i;
    // }
    // 发送处理结果回主线程
    self.postMessage(result);

  }, 5000);
};
