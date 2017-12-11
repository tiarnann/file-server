module.exports=(function(fileServerIp, fetch){
	const baseUrl = fileServerIp

	const FileAPIService = function(){}
	
	FileAPIService.prototype.request = function(path, method, body=null, headers={}) {
		const url = `${baseUrl}${path}`
		const options = {method, headers}

		if(body){
			options.body = JSON.stringify(body)
			options.headers['Content-Type'] = 'application/json'
		}

		return fetch(url, options)
	}

	FileAPIService.prototype.read = function(id){
		return this.request(`/files/${id}`, 'GET')
	}

	FileAPIService.prototype.write = function(fileBuffer){
		return this.request(`/files/`, 'POST', fileBuffer)
	}

	FileAPIService.prototype.update = function(id, fileBuffer){
		return this.request(`/files/${id}`, 'PUT', fileBuffer)
	}

	FileAPIService.prototype.delete = function(id){
		return this.request(`/files/${id}`, 'DELETE')
	}

	return new FileAPIService()
})