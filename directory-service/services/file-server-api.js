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
	})(serverIps)

	const FileAPIService = function(){}
	
	FileAPIService.prototype.request = function(path, method, body=null, headers={}) {
		const url = getUrl()
		const options = {method, headers}

		return fetch(url,options)
	}

	FileAPIService.prototype.read = function(id){
		return this.request(`/files/${id}`, 'GET')

	}

	FileAPIService.prototype.write = function(id, fileBuffer){
		// reply with associated id
		return this.request(`/files/`, 'POST', fileBuffer)

	}

	FileAPIService.prototype.update = function(id, fileBuffer){
		// reply with associated id
		return this.request(`/files/${id}`, 'PUT', fileBuffer)

	}

	FileAPIService.prototype.delete = function(id){
		return this.request(`/files/${id}`, 'DELETE')

	}

	return new API()
})