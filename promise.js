/*
    promise是一个对象，代表了一个异步操作的最终完成或者失败，可以解决回调地域的问题
    Promise 会约定 
        1. 在本轮 事件循环 运行完成之前，回调函数是不会被调用的。
        2. 即使异步操作已经完成， .then() 添加的回调函数都会执行
        3. 通过.then() 可以添加多个回调函数，他们会按照插入顺序进行

    链式调用
        连续执行两个或者多个异步操作是一个常见的需求，在上一个完成后，开始下一个操作，并且带着上一个操作的结果
        const promise2 = doSomething().then(successCallback, failureCallback);
        过去想要多重异步操作，则会导致回调地狱
        doSomething(function(result) {
            doSomethingElse(result, function(newResult) {
                doThirdThing(newResult, function(finalResult) {
                    console.log('Got the final result: ' + finalResult);
                }, failureCallback);
            }, failureCallback);
        }, failureCallback);

        doSomething().then(function(result) {
            return doSomethingElse(result);
        })
        .then(function(newResult) {
            return doThirdThing(newResult);
        })
        .then(function(finalResult) {
            console.log('Got the final result: ' + finalResult);
        })
        .catch(failureCallback);

    catch后续链式操作
        在回调的失败的时候，想要继续使用链式操作，则可以使用catch，对于链式操作中抛出一个失败后还想继续做点什么就可以使用
        new Promise((resolve, reject) => {
            console.log('初始化');

            resolve();
        })
        .then(() => {
            throw new Error('有哪里不对了');
            console.log('执行「这个」”');
        })
        .catch(() => {
            console.log('执行「那个」');
        })
        .then(() => {
            console.log('执行「这个」，无论前面发生了什么');
        });

        第一个.then 报错了，使用.catch可以继续执行接下来的代码

    Promise.all
        会返回一个新的promise对象，所有promise对象触发成功后才会触发成功
        Promise.all([func1(), func2(), func3()]).then(([result1, result2, result3]) => { dosomething });
    Promise.allSettled
        会返回一个新的promise对象，所有promise对象触发后（已兑现或者已拒绝）才会触发成功
        Promise.allSettled([func1(), func2(), func3()]).then(([result1, result2, result3]) => { dosomething });
    Promise.any
        会返回一个新的promise对象，使用第一个已兑现状态的promise来返回，如下例子
        const pErr = new Promise((resolve, reject) => {
            reject("总是失败");
        });

        const pSlow = new Promise((resolve, reject) => {
            setTimeout(resolve, 500, "最终完成");
        });

        const pFast = new Promise((resolve, reject) => {
            setTimeout(resolve, 100, "很快完成");
        });

        Promise.any([pErr, pSlow, pFast]).then((value) => {
            console.log(value);
            // pFast fulfils first
        })
        // 期望输出: "很快完成"
        如果没有成功则返回一个错误
    Promise.race
        返回一个promise，其中一个promise解决或者拒绝，返回的promise就会解决或者拒绝
        const promise1 = new Promise((resolve, reject) => {
            setTimeout(resolve, 500, 'one');
        });

        const promise2 = new Promise((resolve, reject) => {
            setTimeout(resolve, 100, 'two');
        });

        Promise.race([promise1, promise2]).then((value) => {
            console.log(value);
        });
        > two
    Promise.resolve
        返回一个带有成功原因的promise对象
    Promise.reject
        返回一个带有失败原因的promise对象
        

    Promise 状态
        待定        pending     初始状态
        已兑现      fulfilled   操作成功
        已拒绝      rejected    操作失败

*/




/*
Promise 解决了什么问题？
Promise 的业界实现都有哪些？
Promise 常用的 API 有哪些？
能不能手写一个符合 Promise/A+ 规范的 Promise?
Promise 在事件循环中的执行过程是怎样的？
Promise 有什么缺陷，可以如何解决？

链接：https://juejin.cn/post/6850037281206566919

*/


// promise 有三个状态：pending，fulfilled，or rejected；「规范 Promise/A+ 2.1」
// new promise时， 需要传递一个executor()执行器，执行器立即执行；
// executor接受两个参数，分别是resolve和reject；
// promise  的默认状态是 pending；
// promise 有一个value保存成功状态的值，可以是undefined/thenable/promise；「规范 Promise/A+ 1.3」
// promise 有一个reason保存失败状态的值；「规范 Promise/A+ 1.5」
// promise 只能从pending到rejected, 或者从pending到fulfilled，状态一旦确认，就不会再改变；
// promise 必须有一个then方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；「规范 Promise/A+ 2.2」
// 如果调用 then 时，promise 已经成功，则执行onFulfilled，参数是promise的value；
// 如果调用 then 时，promise 已经失败，那么执行onRejected, 参数是promise的reason；
// 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调onRejected；
const PENDING = 'PENDING'; // 等待
const FULFILLED = 'FULFILLED'; // 成功
const REJECTED = 'REJECTED'; // 失败
class Promise{
    constructor(executor){
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallback = [];
        this.onRejectedCallback = [];

        let resolve = (value)=>{
            if(this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onRejectedCallback.forEach(fn=>fn())
            }
        }
        let reject = (reason)=>{
            if(this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallback.forEach(fn=>fn())
            }
        }
        try{
            executor(resolve,reject)
        }catch{
            reject(error)
        }

    }
    then(onFulfilled, onRejected){
        if(this.status === FULFILLED) {
            onFulfilled(this.value)
        }
        if(this.status === REJECTED){
            onRejected(this.reason)
        }
        if(this.status === PENDING) {
            this.onFulfilledCallback.push(()=>{
                onFulfilled(this.value)
            })
            this.onRejectedCallback.push(()=>{
                onRejected(this.reason)
            })
        }
    }
}

const promise = new Promise((resolve,reject)=>{
    setTimeout(resolve('成功'),10)
}).then(res=>{
    console.log('success',res)
},err=>{
    console.log('error', err)
})

// then 的参数 onFulfilled 和 onRejected 可以缺省，如果 onFulfilled 或者 onRejected不是函数，将其忽略，且依旧可以在下面的 then 中获取到之前返回的值；「规范 Promise/A+ 2.2.1、2.2.1.1、2.2.1.2」
// promise 可以 then 多次，每次执行完 promise.then 方法后返回的都是一个“新的promise"；「规范 Promise/A+ 2.2.7」
// 如果 then 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调中；
// 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.2.7.2」
// 如果 then 的返回值 x 是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功；如果失败，就走下一个 then 的失败；如果抛出异常，就走下一个 then 的失败；「规范 Promise/A+ 2.2.7.3、2.2.7.4」
// 如果 then 的返回值 x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.3.1」
// 如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；「规范 Promise/A+ 2.3.3.3.3」
