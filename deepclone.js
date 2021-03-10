// 深浅克隆
// 1. JSON parse stringify 
// 缺点：无法实现对函数 regexp等特殊对象的克隆
//      会抛弃对象的constructor,所有的构造函数会指向Object
//      对象有循环饮用，会报错
var obj = {
    name: 'zhangsan',
    age: 13,
    company: {
        name: '腾讯',
        age: 15
    }
}
var obj1 = JSON.parse(JSON.stringify(obj))
// obj.name = '李四',
// obj1.company.name = '阿里'
// console.log(obj,obj1)

// 2. 手写深度克隆
function deepClone(obj){
    let newObj = {};
    for(let key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj,key)) {
            if(typeof obj[key] === 'object') {
                newObj[key] = deepClone(obj[key])
            }else {
                newObj[key] = obj[key]
            }
        }
    }
    return newObj;
}
var obj1 = deepClone(obj)
obj.name = '李四',
obj1.company.name = '阿里'
console.log(obj,obj1)
