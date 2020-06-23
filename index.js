class MyPromise{
	constructor(arg) {
	}
	status='arg'
	say2 = () =>{console.log(this.status+ '2')}
	
	
}

var m = new MyPromise('pending')

m.say2()