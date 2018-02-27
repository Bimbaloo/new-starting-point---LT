var rp = require('request-promise')

/* 头条大佬demo */

console.log('1')

async function async1 () {
  console.log('async1 start')
  await async2()  // 相当于返回一个promise,promise里面的函数是同步的，只有返回的resolve和reject才是异步的
    // const a =await async2();
    // console.log(a)
  console.log('async1 end')
}

async function async2 () {
  console.log('async2')
    // return Promise.resolve("20")
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')

// 1
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout

/* 头条大佬demo */

/* demo 1 */
// const call1Promise = rp('http://example.com/');

// call1Promise.then(result1 => {
//     // Executes after the first request has finished
//     console.log(result1);

//     const call2Promise = rp('http://example.com/');
//     const call3Promise = rp('http://example.com/');

//     return Promise.all([call2Promise, call3Promise]);
// }).then(arr => {
//     // Executes after both promises have finished
//     console.log(arr[0]);
//     console.log(arr[1]);
// })

/* demo 2 */

// const call2Promise = () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("1")
//         }, 100)
//     })
// }
// const call3Promise = () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("2")
//         }, 100)
//     })
// }

// // Encapsulate the solution in an async function
// async function solution() {
//     // Wait for the first HTTP call and print the result
//     //console.log(await rp('http://example.com/'));

//     console.time("3的时间")
//     const response2 = await call2Promise();
//     const response3 = await call3Promise();
//     console.log("3")
//     console.timeEnd("3的时间")
//     console.log(response2);
//     console.log(response3);
//     console.log("5")
// }

// // Call the async function
// solution().then(() => console.log('Finished'));

/* demo4 */
// async function p() {
//     const a  = await rp('http://example.com/')

//     return a
// }
// p().then((e)=>{
//     console.log(e)
// })

// async function p0() {
//     console.log("0")
//     const a  = await 200
//     return a
// }
// p0().then((e)=>{
//     console.log(e)
// })

// async function f() {
//     return await 123;
//   }

//   f().then(v => console.log(v))