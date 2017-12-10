const RoundRobinGenerator = (function*(array){
	let index= 0 
	while(true){
		yield array[index++]
		if(index == array.length){
			index = 0
		}
	}
})


module.exports=RoundRobinGenerator