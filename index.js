// import { useWebWorker } from "./dist/useWebWorker.simple.js";
import { useWebWorker } from "./dist/useWebWorker.middle.js";
// import { useWebWorker } from "./dist/useWebWorker.ultimate.js";

// 具体用法
const { execute } = useWebWorker(new URL("./works/test.js", import.meta.url));

// 执行任务
// 注意：如果worker已经被终止或不可用，execute会返回一个拒绝的Promise
// 这里的参数可以根据你的worker脚本需要进行调整
execute({ test: "我是一个参数1" })
  .then((result) => {
    console.log("Worker result1:", result.data);
  })
  .catch((error) => {
    console.error("Worker error1:", error);
  });
  
execute({ test: "我是一个参数2" })
  .then((result) => {
  console.log("Worker result2:", result.data);
  })
  .catch((error) => {
    console.error("Worker error2:", error);
  });

execute({ test: "我是一个参数3" })
  .then((result) => {
   console.log("Worker result3:", result.data);
  })
  .catch((error) => {
    console.error("Worker error3:", error);
  });


