/* past1 */
// let p = new Promise((resolve, reject) => {
//     //resolve('duang')
//     console.log("1")
//     setTimeout(()=>{
//         console.log("2")
//         resolve("5")
//     },100)
// })

// p.then(r => {
//     console.log("3")
//     console.log(r);
//     console.log("4")
// });


// let p = new Promise((resolve, reject) => {
//     resolve(1)
//     console.log(p)
// })

// let p2 = p.then(r => {
//     console.log(r);
//     return new Promise((rl, rj) => {
//         rl(2)
//     })
// })

// let p3 = p2.then(r => {
//     console.log(r);
// })

// const someAsyncThing = function () {
//     return new Promise(function (resolve, reject) {
//         // 下面一行会报错，因为x没有声明
//         resolve(x + 2);
//     });
// };

// someAsyncThing().then(function() {
//     return someOtherAsyncThing();
//   }).catch(function(error) {
//     console.log('oh no', error);
//     // 下面一行会报错，因为 y 没有声明
//     y + 2;
//   }).then(function() {
//     console.log('carry on');
//   });

// someAsyncThing().then(function () {
//     return someOtherAsyncThing();
// }).catch(function (error) {
//     console.log('oh no', error);
//     // 下面一行会报错，因为y没有声明
//     y +  2;
// }).catch(function (error) {
//     console.log('carry on', error);
// });



const connectDatabase = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("连接成功")
        }, 1000)
    })
}

const getBooks = (str) => {
    return new Promise((resolve,reject)=>{
        if(str === "高数") {
            return resolve({"book":`恭喜，${str}还在，正在为出货`})
        } else {
            return reject({"book":`对不起，${str}已经被借走了`})
        }
    })
}

const getBorrower = (str) =>{
    return new Promise((resolve,reject)=>{
        if(str === "mazao") {
            return resolve({"name":`恭喜，${str}还未被注册`})
        } else {
            return reject({"name":`对不起，该用户名（${str}）已被注册，请输入新的用户名`})
        }
    })
}

const databasePromise = connectDatabase();

const booksPromise = databasePromise
    .then(e => {
        return getBooks("高数")
    });

const userPromise = databasePromise
    .then(e => {
        return getBorrower("mazao")
    });
console.time("开始")
Promise.all([
    booksPromise,
    userPromise
])
    .then((obj) => {
        console.log(obj)
        console.timeEnd("开始")
    }).catch((err) => {
        console.log(err)
    });

