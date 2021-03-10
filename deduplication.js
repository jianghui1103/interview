
const arr = [2,1,3,4,51,2,3,1];
// 输出去重后的数组，尽量多的方法
// 1. 设置出现的元素为key，value为个数，最后提取出key
const deduplication1 = arr => {
    let obj = {}
    arr.forEach(v => {
        if(obj[v]) {
            obj[v] += 1;
        }else {
            obj[v] = 1;
        }
    });
    return [...Object.keys(obj)]
}
// console.log(deduplication1(arr))

// 使用map , map和obj区别就是map比较随意键上可以是任意类型的，obj只能是string 和 symbol ， map的key 可以为任意值，obj不能和原型上的冲突
const deduplication2 = arr => {
    let map = new Map();
    arr.forEach(v=>{
        map.set(v,1)
    })
    return [...map.keys()]
}

// 使用filter
const deduplication3 = arr =>{
    return arr.filter((v,index)=>arr.indexOf(v) === index )
}

// 使用set
const deduplication4 = arr => {
    return [...new Set(arr)]
}
// 使用reduce
const deduplication5  = arr => arr.reduce((temp, v) => temp.includes(v) ? temp : [...temp, v], [])