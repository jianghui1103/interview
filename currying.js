// 柯里化函数介绍
//把接受多个参数的函数转换成接受一个单一参数的函数


// 普通计算两个数的和
var sum = function(x,y) {
    return x + y
}
sum(1,2);

// 柯里化
var foo = function(x) {
    return function(y) {
    }
}
foo(3)(4)  

// 那么sum(1)(2)(3)(4)(5)...(n) 怎么做

var add = function add(a,b) {
    return a + b;
}
function curry(add,n) {
    var count = 0;
    var arr = []
    return function reply(arg) {
        arr.push(arg);
        if(++count >= n) {
            return arr.reduce(function(p,c){
                return p = add(p,c)
            })
        }else {
            return reply
        }
    }
}

var sum1 = curry(add,4);
sum1(2)(2)(3)(4)

// 实现四个数的相加
// sum2(1)(2)(3,4)
var add1 = function add1(a,b,c,d){
    return a+b+c+d;
}
function curry1(fn){
    var arr = [];
    return function curried(...args) {
        arr = [...arr, ...args]
        if(arr.length >= fn.length) {
            return fn(...arr)
        }
        return curried
    }
}
var sum2 = curry1(add1);
console.log(sum2(1)(2)(2,3))

