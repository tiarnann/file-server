	router.get('/files/:fileId', function(req, res, next) {

	router.post('/files/', function(req, res, next) {

		const {payload} = req.body
		const {data, name} = payload

	router.put('/files/:fileId', function(req, res, next) {
		const {payload} = req.body
		const {fileId} = req.params
		const {data, name} = payload

module.exports=(function(fileServerIp, fetch){
	const baseUrl = fileServerIp

	const DirectoryAPIService = function(){}
	
	DirectoryAPIService.prototype.request = function(path, method, body=null, headers={}) {
		const url = `${baseUrl}${path}`
		const options = {method, headers}

		return fetch(url,options)
	}

	DirectoryAPIService.prototype.read = function(id){
		return this.request(`/files/${id}`, 'GET')
	}

	DirectoryAPIService.prototype.write = function(id, fileBuffer){
		return this.request(`/files/`, 'POST', fileBuffer)
	}

	DirectoryAPIService.prototype.update = function(id, name, fileBuffer){
		return this.request(`/files/${id}`, 'PUT', fileBuffer)
	}

	DirectoryAPIService.prototype.delete = function(id){
		return this.request(`/files/${id}`, 'DELETE')
	}

	return new DirectoryAPIService()
})