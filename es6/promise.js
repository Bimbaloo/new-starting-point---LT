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


let p = new Promise((resolve, reject) => {
    resolve(1)
    console.log(p)
})

let p2 = p.then(r => {
    console.log(r);
    return new Promise((rl, rj) => {
        rl(2)
    })
})

let p3 = p2.then(r => {
    console.log(r);
})