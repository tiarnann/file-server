const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

module.exports=(function(fetch, fs, path, directory){
	const cwd = directory
	const identitySessionKeys = {}
	const urls = {
		'file-server': 'http://localhost3002/api',
		'directory-server': 'http://localhost:3001/api'
	}

	const FSAPI = function(authentication){
		this.authentication = authentication
	}

	FSAPI.prototype.request = async function(identity,path, method, body=null, headers={}) {
		const sessionKey = this.authentication.sessionKeyFor('user')
		const ticket = this.authentication.sessionKeyFor(identity)

		console.log(ticket)
		console.log(sessionKey)

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

		const baseUrl = urls[identity]
		const url = `${baseUrl}${path}`
		const options = {method, headers, body}

		return fetch(url,options)
	}

	FSAPI.prototype.fetch = async function(id){
		let url = `/files/`
		console.log(id)
		if(id){
			url += id
			console.log(url)
		}

		return this.request(`directory-server`, url, `GET`)
			.then(res=>res.json())
			.then((fileArrayOrSingle)=>{
				if(fileArrayOrSingle.length)
				{
					return fileArrayOrSingle.map((file)=>{
						file.data = Buffer.from(file.data)
						const location = path.join(cwd, file.name)
						console.log(location)
						fs.writeFileSync(location, file.data)
						fs.chmodSync(location, '0')
						return file
					})
				}

				// Single file
				console.log(fileArrayOrSingle.data)
				fileArrayOrSingle.data = Buffer.from(fileArrayOrSingle.data)
				return fileArrayOrSingle
			})
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

	FSAPI.prototype.modify = async function(id, filename, modifier,value){
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

	return FSAPI
}).bind(null,fetch,fs, path)