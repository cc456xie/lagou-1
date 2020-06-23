
// setTimeout(function(){
//     var a = 'hello'
// 	setTimeout(function(){
// 		var b = 'lagou'
// 		setTimeout(function(){
// 			var c = 'I ❤ U'
// 			console.log(a + b + c)
// 		},10)
// 	},10)
// },10)
// function step2(data){
// 	return new Promise((resolve,reject) => {
// 	setTimeout(() =>{
// 		resolve(data + 'lagou')
// 	},10)	
// })
// }
// function step3(data){
// 	return new Promise((resolve,reject) => {
// 	setTimeout(() =>{
// 		resolve(data + 'I ❤ U')
// 	},10)	
// })
// }
// new Promise((resolve,reject) => {
// 	setTimeout(() =>{
// 		resolve('hello')
// 	},10)	
// }).then(step2).then(step3).then(res => console.log(res))


//第二题

const fp = require('lodash/fp')

const cars = [
	{  name:'Ferrari FF',horsepower:660,dollar_value:700000,in_stock:true },
	{ name:'Spyker C12 Zagato',horsepower:650,dollar_value:64800,in_stock:false },
	{  name:'Jaguar XKR-S',horsepower:550,dollar_value:132000,in_stock:false },
	{  name:'Audi R8',horsepower:525,dollar_value:142000,in_stock:false },
	{  name:'Aston Martin One-77',horsepower:750,dollar_value:1850000,in_stock:true },
	{  name:'Pagani Huayra',horsepower:700,dollar_value:1300000,in_stock:false },
]

//1
//使用函数组合fp.flowRight重新实现下面这个函数

// let isLastInStock = function(cars) {
// 	let last_car = fp.last(cars)
// 	return fp.prop('in_stock',last_car)
// }

// const last = cars => fp.last(cars)
//  const prop = car => fp.prop('in_stock',car)

// let comp = fp.flowRight(prop,last)

// console.log(comp(cars))

//2
// const first = cars => fp.first(cars)
// const prop = car => fp.prop('name',car)
// let comp = fp.flowRight(prop,first)

// console.log(comp(cars))

//3
// let _average = function(xs){
// 	return fp.reduce(fp.add,0,xs)/xs.length
// }
// let averageDollarValue = function(cars){
// 	let dollar_values = fp.map(function(car){
// 		return car.dollar_value
// 	},cars)
// 	return _average(dollar_values)
// }

// const map = cars => fp.map(car => car.dollar_value,cars)

// let averageDollarValue = fp.flowRight(_average,map)

// console.log(averageDollarValue(cars))

//4
// let _underscore = fp.replace(/\W+/g,'_')

// const mapName = cars => fp.map(car => car.name,cars)


// let sanitizeNames = fp.flowRight(fp.map(fp.flowRight(fp.toLower,_underscore)),mapName)

// console.log(sanitizeNames(cars))

// 三 
//1
// const {Maybe,Container} = require('./support.js')
// let maybe = Maybe.of([5,6,1])
// let ex1 = (maybe,count) =>{
// 	return maybe.map(value=> fp.map(item => fp.add(item,count),value))
// }
// console.log(ex1(maybe,5))

//2
// const {Maybe,Container} = require('./support.js')
// let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
// let ex2 = s => {
// 	return s.map(x => fp.first(x))
// }
// console.log(ex2(xs))

//3
// const {Maybe,Container} = require('./support.js')
// let safeProp = fp.curry(function (x,o){
// 	return Maybe.of(o[x])
// })
// let user = { id:2,name:'Albert' }
// let ex3 = x => {
// 	return fp.first(safeProp('name')(x)._value)
// }
// console.log(ex3(user))

//4
const {Maybe,Container} = require('./support.js')
let ex4 = function(n) {
	if(n)
	return parseInt(n)
}
let ex5 = function(n) {
	return Maybe.of(n).map(n => parseInt(n))._value
}

console.log(ex4(5.5),ex5(5.5))