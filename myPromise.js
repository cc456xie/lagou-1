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