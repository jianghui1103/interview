// class的严格模式
// 类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。
// 考虑到未来所有的代码，其实都是运行在模块之中，所以  ES6 实际上把整个语言升级到了严格模式。
// 如果没人调用, 在非严格模式下指向window, 严格模式下指向undefined
class People  {
    say() {
        console.log(this)
    }
}
// 对应的 ES5，应该是
function People() {}
People.prototype.say = function () {
  console.log(this)
}


// new关键字
// 1.创造一个新的对象，即{}
// 2.将这个对象的[[prototype]]指向这个构造函数的.prototype指向的对象
// 3.将1创建的对象作为this的上下文
// 4.如果该函数没有返回对象，则返回this