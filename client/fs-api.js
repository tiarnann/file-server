const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const opener = require('opener')

module.exports=(function(open, fetch, fs, path, directory){
	const cwd = directory
	const identitySessionKeys = {}
	const urls = {
		'file-server': `http://localhost:${process.env.npm_package_config_file_server_port}/api`,
		'directory-server': `http://localhost:${process.env.npm_package_config_dir_server_port}/api`,
		'transactions-server': `http://localhost:${process.env.npm_package_config_transactions_server_port}/api`
	}

	const permissionFor = (access)=>{
		let permission = fs.constants.F_OK

		if(access.read){
			return fs.constants.R_OK + fs.constants.X_OK
		}
		else if(access.write){
			return fs.constants.R_OK + fs.constants.X_OK + fs.constants.W_OK
		}
		else if(access.lock){
			return fs.constants.F_OK
		}

		return permission
	}

	const FSAPI = function(authentication){
		this.authentication = authentication
	}

	FSAPI.prototype.request = async function(identity,path, method, body=null, headers={}) {
		const sessionKey = this.authentication.sessionKeyFor('user')
		const ticket = this.authentication.sessionKeyFor(identity)

		/* Prepare message*/
		if(body){
			headers['Content-Type'] = 'application/json'
			body['username'] = this.authentication.username()
			body['session-key'] = sessionKey
			const encryptedPayload = await this.authentication.encrypt(body)

			const message = {
				ticket: ticket,
				payload: encryptedPayload
			}
			
			body = JSON.stringify(message)
			console.log(message)
		} else {
			headers['ticket'] = ticket
			headers['username'] = this.authentication.username()
		}


		const baseUrl = urls[identity]
		const url = `${baseUrl}${path}`
		const options = {method, headers, body}

		return fetch(url,options)
	}

	FSAPI.prototype.fetch = async function(id){
		let url = `/files/`

		if(id){
			url += id
		}

		return this.request(`directory-server`, url, `GET`)
			.then(res=>res.json())
			.then((fileArrayOrSingle)=>{
				if(typeof fileArrayOrSingle.length == 'number')
				{
					return fileArrayOrSingle.map((file)=>{
						file.data = Buffer.from(file.data)
						const location = path.join(cwd, file.name)
						fs.writeFileSync(location, file.data)
						return file
					})
				}else {
					// Single file
					fileArrayOrSingle.data = Buffer.from(fileArrayOrSingle.data)
					return fileArrayOrSingle
				}
			})
	}

	FSAPI.prototype.open = async function(id, filename, mode){
		const location = path.join(cwd, filename)
		const exists = fs.existsSync(location)

		if(!exists){
			if(mode == 'write'){
				console.log(`Creating file ${filename}...`)
				fs.writeFileSync(location, '')
				open(location)
				return
			} else {
				throw new Error(`file: "${location}" does not exist`)
			}
		}

		switch(mode){
			case 'read':
				console.log(`Opening "${filename}" for read.`)
				open(location)
				break
			case 'write':
				this.modify(id, filename, 'lock', true)
				.then(response=>{
					if(response.status == 423){
						console.log('File already locked.')
						throw new Error()
					}
				})
				.then(()=>{
					console.log(`Locking "${filename}" for write.`)
					console.log(`Opening "${filename}" for write.`)
					open(location)
				})
				.catch((err)=>{
					console.log(`Can't open "${filename}" for write.`)
				})
				break
			default: 
				throw new Error(`unsupported file mode`)
		}
	}

	FSAPI.prototype.close = async function(id, filename, mode){
		const location = path.join(cwd, filename)
		const exists = fs.existsSync(location)
		const noPermissions =  permissionFor({})

		if(!exists){
			throw new Error(`file: "${location}" does not exist`)
		}

		switch(mode){
			case 'read':
				break
			case 'write':
				if(id){
					this.update(id, filename).then(()=>{
					})
				} else {
					this.create(filename).then(()=>{
					})
				}
				break
			default: 
				throw new Error(`unsupported file mode`)
		}
	}

	FSAPI.prototype.create = async function(filename){
		this.resolve(filename)
		.then((fileBuffer)=>{
			return this.request(`directory-server`, `/files/`, `POST`, {name: filename, data: fileBuffer.toString()})
		})
		.then(()=>{
			console.log(`Created file and pushed to server...`)
		})
	}

	FSAPI.prototype.update = async function(id,filename){
		let url = `/files/`
		let method = `POST`

		if(id){
			url += id
			method = `PUT`
		}

		this.resolve(filename)
		.then((fileBuffer)=>{
			return this.request(`directory-server`, url, method, {name: filename, data: fileBuffer.toString()})
		})
		.then(res=>res.json())
		.then(json=>{
			const location = path.join(cwd,filename)
			const {data} = json
			console.log(`Updated file data pushed to server...`)
		})
		.catch((err)=>{
			console.log(err)
		})
	}

	FSAPI.prototype.delete = async function(filename){
		this.resolve(filename)
		.then((fileBuffer)=>{
			return this.request(`directory-server`, `/files/${id}`, `DELETE`)
		})
	}

	FSAPI.prototype.modify = async function(id, filename, modifier, value){
		return this.resolve(filename)
		.then(()=>{
			return this.request(`directory-server`, `/files/${id}/${modifier}`, `PUT`, {value})
		})
	}

	FSAPI.prototype.resolve = function(filename){
		return new Promise((resolve, reject) => {
			let arrayBuffer = []
			const location = path.join(cwd, filename)
			const stream = fs.ReadStream(location)
			
			stream.on('data',(chunk)=>{
				arrayBuffer.push(chunk)
			})

			stream.on('end',()=>{
				resolve(Buffer.concat(arrayBuffer))
			})
		});
	}

	FSAPI.prototype.startTransaction = function(){
		return this.request(`transactions-server`, `/transactions/`, `POST`)
	}

	FSAPI.prototype.deleteTransaction = function(id){
		return this.request(`transactions-server`, `/transactions/${id}`, `DELETE`)
	}

	return FSAPI
}).bind(null,opener,fetch,fs, path)