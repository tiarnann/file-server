module.exports=(function(fs,directory){
	const identitySessionKeys = {
	}

	const FSAPI = function(){}
	
	FSAPI.prototype.set = function(identity,sessionKey) {
		identitySessionKeys[identity] = sessionKey
	}

	FSAPI.prototype.request = async function(identity,path, method, body=null, headers={}) {
		const sessionKey = identitySessionKeys['user']
		const ticket = identitySessionKeys['user']

		/* Prepare message*/
		if(body != null){
			body['session-key'] = sessionKey
			const encryptedPayload = auth.encrypt(body).with(sessionKey)

			const message = {
				ticket: ticket,
				payload: encryptedPayload
			}	

			body = message
		}


		const url = `${baseUrl}${path}`
		const options = {method, headers, body}

		return fetch(url,options)
	}

	FSAPI.prototype.request = async function(identity,path, method, body=null, headers={}) {
	}

	FSAPI.prototype.create = async function(filename){
		console.log('create', filename)
		this.resolve(filename)
		.then((fileBuffer)=>{
			console.log(filename, fileBuffer)
			this.create()
		})
	}

	FSAPI.prototype.update = async function(id, filename){
		this.resolve(filename)
		.then((fileBuffer)=>{
			return this.request(`directory-server`, `/files/${id}`, `PUT`, {name: filename, data:fileBuffer})
		})
	}

	FSAPI.prototype.delete = async function(filename){
		this.resolve(filename)
		.then((fileBuffer)=>{
			return this.request(`directory-server`, `/files/${id}`, `DELETE`)
		})
	}

	FSAPI.prototype.modify = async function(id,filename, modifier,value){
		this.resolve(filename)
		.then(({value})=>{
			return this.request(`directory-server`, `/files/${id}/modifier`, `PUT`)
		})
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

	return new FSAPI()
})