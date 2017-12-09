module.exports=(function(fs,directory){
	const identitySessionKeys = {
	}

	const FSAPI = function(){}
	
	FSAPI.prototype.set = function(identity,sessionKey) {
		identitySessionKeys[identity] = sessionKey
	}

	FSAPI.prototype.resolve = async function(filename){
		let arrayBuffer = []
		const stream = fs.ReadStream(`${directory}/${filename}`)
		
		stream.on('data',(chunk)=>{
			console.log('chunk', chunk)
			arrayBuffer.push(chunk)
		})

		stream.on('end',()=>{
			console.log('end',Buffer.from(arrayBuffer))
			return Buffer.concat(arrayBuffer)
		})
	}

	FSAPI.prototype.create = async function(filename){
		console.log('create', filename)
		this.resolve(filename)
		.then((fileBuffer)=>{
			console.log(filename, fileBuffer)
		})
	}

	FSAPI.prototype.update = async function(filename){
		console.log('update', filename)
		this.resolve(filename)
		.then((fileBuffer)=>{
			console.log(filename, fileBuffer)
		})
	}

	FSAPI.prototype.delete = async function(filename){
		console.log('delete', filename)
	}

	return new FSAPI()
})