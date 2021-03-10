// 深浅克隆
// 1. JSON parse stringify 
var obj = {
    name: 'zhangsan',
    age: 13,
    company: {
        name: '腾讯',
        age: 15
    }
}
var obj1 = JSON.parse(JSON.stringify(obj))
obj.name = '李四',
obj1.company.name = '阿里'
console.log(obj,obj1)
// 浅克隆
