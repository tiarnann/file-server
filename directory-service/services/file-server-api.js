module.exports=(function(serverIps, fetch){
	const getUrl = (function(ips){
		const urls = ips
		const length = urls.length
		let i = 0

		return function(){
			const next = urls[i]
			i = (i+1) % length 
			return next
		}
	})()

	const API = function(){}
	
	API.prototype.request = function(path, method, body=null, headers={}) {
		const url = getUrl()
		const options = {method, headers}

		return fetch(url,options)
	}

	API.prototype.read = function(){
		return this.request(`/files/${id}`, 'GET')

	}

	API.prototype.write = function(payload){
		return this.request(`/files/${id}`, 'POST',payload)

	}

	API.prototype.update = function(){
		return this.request(`/files/${id}`, 'PUT',payload)

	}

	API.prototype.delete = function(){
		return this.request(`/files/${id}`, 'DELETE')

	}

	return new API()
})