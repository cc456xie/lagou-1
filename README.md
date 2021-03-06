# 第一次作业

## 一，谈谈我是如何理解js异步编程的，eventloop、消息队列都是做什么的，什么是宏任务，什么是微任务？

答： 由于浏览器的特性，JS被设计成了一种单线程语言，如果按照完全同步的模式执行代码，那么一些耗时操作会阻塞住执行流程，浏览器迟迟不能显示出应有的结果，导致用户体验大打折扣。JS异步编程就是为了解决种种问题的，JS将所有任务分为同步任务和异步任务，由于浏览器是多线程的，异步任务在进入执行栈后，会分配对应的线程给这个异步任务去执行，而JS主线程则不等待这个异步任务的结果继续往下执行，当异步任务执行完毕后会返回一个回调函数，这个回调函数会进入消息队列，等到下一次`事件循环`从`消息队列`压入执行站栈执行。
`Event loop`就是`事件循环机制`，事件循环和消息队列是规范JS代码执行顺序的一种机制，能够让同步任务和异步任务按照相应的顺序执行，从而得到更好的执行顺序和用户体验。每一次事件循环，都会从消息队列取出第一个等待的宏任务，并且在下一次`宏任务`入栈之前，将所有入栈的`微任务`执行完毕。 JS将所有的任务划分为`宏任务`和`微任务`,宏任务一般有`主代码块`，`setTimeout`，`setInterval`，在ie和node中的`setImmediate`，浏览器中的`requestAnimationFrame`，微任务一般有`process.nextTick`,`promise`,`MutationObserver	`。 `宏任务`和`微任务`之间的关系，可以用银行办理业务来比喻，客户排完队办理一个业务，这个业务就是宏任务，当办理完成后，柜员会问客户还有没有其他业务需要办理，客户如果没有了，就可以离开，轮到下个客户（也就是下个宏任务）办理业务了，如果客户想起还有一些东西要办理，就顺便将这些东西办理了，而不用再到后面去排队，这些顺便办理的东西，就是微任务。所以，需要处理的微任务总会在下一次事件循环（也就是下个宏任务开始执行的时候）之前执行完毕。


## 代码题 一，将下面异步代码使用Promsie的方式改进

```
setTimeout(function(){
    var a = 'hello'
	setTimeout(function(){
		var b = 'lagou'
		setTimeout(function(){
			var c = 'T ❤ U'
			console.log(a + b + c)
		},10)
	},10)
},10)
```
答：
```
function step2(data){
	return new Promise((resolve,reject) => {
	setTimeout(() =>{
		resolve(data + 'lagou')
	},10)	
})
}
function step3(data){
	return new Promise((resolve,reject) => {
	setTimeout(() =>{
		resolve(data + 'I ❤ U')
	},10)	
})
}
new Promise((resolve,reject) => {
	setTimeout(() =>{
		resolve('hello')
	},10)	
}).then(step2).then(step3).then(res => console.log(res))
```
## 二，基于以下代码完成下面四个练习
```
const fp = require('lodash/fp')

const cars = [
	{  name:'Ferrari FF',horsepower:660,dollar_value:700000,in_stock:true },
	{ name:'Spyker C12 Zagato',horsepower:650,dollar_value:64800,in_stock:false },
	{  name:'Jaguar XKR-S',horsepower:550,dollar_value:132000,in_stock:false },
	{  name:'Audi R8',horsepower:525,dollar_value:142000,in_stock:false },
	{  name:'Aston Martin One-77',horsepower:750,dollar_value:1850000,in_stock:true },
	{  name:'Pagani Huayra',horsepower:700,dollar_value:1300000,in_stock:false },
]
```
### 使用函数组合fp.flowRight重新实现下面这个函数
```
 let isLastInStock = function(cars) {
	let last_car = fp.last(cars)
 	return fp.prop('in_stock',last_car)
 }
```
答
```
const last = cars => fp.last(cars)
const prop = car => fp.prop('in_stock',car)

let comp = fp.flowRight(prop,last)

console.log(comp(cars))
```
### 使用fp.flowRight，fp.prop,fp.first获取第一个car的name
答：
```
const first = cars => fp.first(cars)
const prop = car => fp.prop('name',car)
let comp = fp.flowRight(prop,first)

console.log(comp(cars))
```
### 使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现
```
let _average = function(xs){
	return fp.reduce(fp.add,0,xs)/xs.length
}
let averageDollarValue = function(cars){
	let dollar_values = fp.map(function(car){
		return car.dollar_value
	},cars)
	return _average(dollar_values)
}
```
答:
```
let _average = function(xs){
	return fp.reduce(fp.add,0,xs)/xs.length
}
const map = cars => fp.map(car => car.dollar_value,cars)

let averageDollarValue = fp.flowRight(_average,map)

```
###  使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：
```
let _underscore = fp.replace(/\W+/g,'_')
```
答：
```
let _underscore = fp.replace(/\W+/g,'_')

const mapName = cars => fp.map(car => car.name,cars)


let sanitizeNames = fp.flowRight(fp.map(fp.flowRight(fp.toLower,_underscore)),mapName)

console.log(sanitizeNames(cars))
```
## 三，基于下面提供的代码，完成后续四个练习

### 使用fp.add和fp.map创建一个能使functor里的值增加的函数ex1
```
const {Maybe,Container} = require('./support.js')
let maybe = Maybe.of([5,6,1])
let ex1 = (maybe,count) =>{
	return maybe.map(value=> fp.map(item => fp.add(item,count),value))
}
```

### 实现一个函数ex2，能够使用fp.first获取列表的第一个元素
答：
```
const {Maybe,Container} = require('./support.js')
let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
let ex2 = s => {
	return s.map(x => fp.first(x))
}
```
### 实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
答：
```
const {Maybe,Container} = require('./support.js')
let safeProp = fp.curry(function (x,o){
	return Maybe.of(o[x])
})
let user = { id:2,name:'Albert' }
let ex3 = x => {
	return fp.first(safeProp('name')(x)._value)
}
```
### 使用Maybe重写ex4，不要有if语句
```
const {Maybe,Container} = require('./support.js')
let ex4 = function(n) {
	if(n)
	return parseInt(n)
}
//重写：
let ex4 = function(n) {
	return Maybe.of(n).map(n => parseInt(n))._value
}
```

## 手写实现MyPromise源码

```
const PENDING = 'pending' //等待态
const FULFILLED = 'fulfilled' //成功态
const REJECTED = 'rejected' //失败态
class MyPromise{
	constructor(executor) {
		try{
			executor(this.resolve,this.reject)
		}catch(e){
			this.reject(e)
		}
	    
	}
	//初始状态为pending
	status = PENDING
	//成功的值
	value = undefined
	//失败的值
	reason = undefined
	// 成功回调数组
	successCallback = []
	//失败回调数组
	failCallback = []
	resolve = value => {
		//状态不可更改
		if(this.status !== PENDING) return
		this.status = FULFILLED
		this.value = value
		// 判断successCallback是否存在
		//this.successCallback && this.successCallback(this.value)
		while(this.successCallback.length > 0)
		{
			// 从数组头部取出回调函数执行
			this.successCallback.shift()(this.value)
		}
	}
	reject = reason => {
		if(this.status !== PENDING) return
		this.status = REJECTED
		this.reason = reason
		// 判断failCallback是否存在
		//this.failCallback && this.failCallback(this.reason)
		while(this.failCallback.length > 0)
		{
			// 从数组头部取出回调函数执行
			this.failCallback.shift()(this.reason)
		}
	}
	then(successCallback,failCallback){
		successCallback = successCallback ? successCallback:value => value	
				
		failCallback = failCallback ? failCallback:reason => {throw reason}
		//通过状态判断该执行哪个回调
		let newPromise = new MyPromise((resolve,reject) =>{
			
			
	    if(this.status === FULFILLED)
		{
			//异步执行，以拿到newPromise
			setTimeout(() => {
				try{let x = successCallback(this.value)
				resolvePromise(newPromise,x,resolve,reject) //将成功回调的值传给下个promise的then
				}catch(e){
					reject(e)
				}
				
			},0)			
		}
		else if(this.status === REJECTED)		
		{
			//异步执行，以拿到newPromise
			// if(!failCallback)
			// failCallback = successCallback
			setTimeout(() => {
			let x = failCallback(this.reason)
			resolvePromise(newPromise,x,resolve,reject) //将成功回调的值传给下个promise的then
		    },0)
		}
		else {
			// 存储成功和失败回调
			this.successCallback.push(() => {
				//异步执行，以拿到newPromise
				setTimeout(() => {
					try{let x = successCallback(this.value)
					resolvePromise(newPromise,x,resolve,reject) //将成功回调的值传给下个promise的then
					}catch(e){
						reject(e)
					}
					
				},0)			
			})
			this.failCallback.push(() => {
				//异步执行，以拿到newPromise
				setTimeout(() => {
				let x = failCallback(this.reason)
				resolvePromise(newPromise,x,resolve,reject) //将成功回调的值传给下个promise的then
				},0)
			})		
		}
	   })
	  return newPromise
	}
	finally(callback){
		return this.then(value => {
			// 等待callback执行完成后返回value
			return MyPromise.resolve(callback()).then(() => value)
		},reason => {
           return  MyPromise.resolve(callback()).then(() => reason)
		})
	}
	static all(array){
		let results = []
		let count = 0
		return new MyPromise((resolve,reject) => {
			function addData(key,value){
				count++
				results[key] = value
				if(count === array.length)
				resolve(results)
			}
			for(let i=0;i<array.length;i++)
			{
				let item = array[i]
				if(item instanceof MyPromise){
					// promise对象
					item.then(value => addData(i,value),reason => {
						reject(reason)
					})
				}else{
					// 普通值
					addData(i,item)
				}
			
			}
			
		})
	}
	static resolve(value){
		if(value instanceof MyPromise) return value
		return new MyPromise(resolve => resolve(value))
	}
	
	catch(failCallback){
		return this.then(undefined,failCallback)
	}
	// promise.race 等待最先改变状态的那个promise，直接resolve或reject即可
	static race(array){
		return new Promise((resolve,reject) => {
			for(let i=0;i<array.length;i++)
			{
				let item = array[i]
				if(item instanceof MyPromise)
				{
					item.then(value => {
						resolve(value)
					},reason => {
						reject(reason)
					})
				}
				else
				{
					Promise.resolve(item).then(value => {
						resolve(value)
					},reason => {
						reject(reason)
					})
				}
			}
		})
	}
	// promise.allSettled
	static allSettled(array)
	{
		// 结果数组
			let results = []
			let count = 0
			return new MyPromise((resolve,reject) => {
				function addData(key,value){
					count++
					results[key] = value
					//等所有promise都resovle或reject后，resolve这个promise实例
					if(count === array.length)
					{
						//console.log(results)
						resolve(results)
					}
					
				}
				for(let i=0;i<array.length;i++)
				{
					let item = array[i]
					if(item instanceof MyPromise){
						// promise对象 当返回值是MyPromise对象时，直接调用他的then方法返回对应的状态，并且添加到结果数字中
						item.then(value => addData(i,{status:'fulfilled',value:value}),reason => addData(i,{status:'rejected',reason:reason}))
					}else{
						// 普通值 如果是普通值，通过MyPromsie方法将其包装为Mypromise对象，并且在then中加入结果数组
						Promise.resolve(item).then(value => addData(i,{status:'fulfilled',value:value}))												
					}
				}
				
			})
	}
	
}
// 判断then回调函数返回值的类型并返回对应的结果
function resolvePromise(newPromise,x,resolve,reject){
	if(x === newPromise)
	return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
	if(x instanceof MyPromise)
	{
		// promise对象
		x.then(value => {
			resolve(value)
		},reason => {
			reject(reason)
		})
	}
	else{
		//普通值
		resolve(x)
	}
}


module.exports = MyPromise
```