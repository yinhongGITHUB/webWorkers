import { useWorker } from "./dist/webWorkers.js";

// 具体用法

const { execute } = useWorker(new URL("./works/test.js", import.meta.url));

// 执行任务
// 注意：如果worker已经被终止或不可用，execute会返回一个拒绝的Promise
// 这里的参数可以根据你的worker脚本需要进行调整
execute({ test: "我是一个参数1" })
  .then((result) => {
    console.log("Worker result:", result.data);
  })
  .catch((error) => {
    console.error("Worker error:", error);
  });
  
execute({ test: "我是一个参数2" })
  .then((result) => {
  console.log("Worker result:", result.data);
  })
  .catch((error) => {
    console.error("Worker error:", error);
  });

execute({ test: "我是一个参数3" })
  .then((result) => {
   console.log("Worker result:", result.data);
  })
  .catch((error) => {
    console.error("Worker error:", error);
  });


