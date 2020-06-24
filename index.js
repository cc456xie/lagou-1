// class MyPromise{
// 	constructor(arg) {
// 	}
// 	status='arg'
// 	say2 = () =>{console.log(this.status+ '2')}
	
	
// }

var m = new Promise((resolve,reject)=>{
	resolve('123')
})


Promise.allSettled([m,'9']).then(res => console.log(res))