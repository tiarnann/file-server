module.exports=(function(express, file, accessControl, FileAPIService,){
	const File = file
	const AccessControl = accessControl
	const router = express.Router();
	
	const caching = (req, res, next)=>{
		const cached = req.redis.get(req.route, function(err, cached){
			if(cached){
				res.send(JSON.parse(cached))
			} else {
				next()
			}
		})

	}
	/**
	 * @api {get} /files/ Get file all files
	 * @apiName GetFile
	 * @apiGroup Transaction
	 *
	 * @apiParam {String} id of associated transaction.
	 *
	 * @apiSuccess (200) {Object[]} Returns an list of files
	 */
	router.get('/files/', function(req, res, next) {
		File.find({})
			.then((fileArray)=>fileArray.map(file=>file.toJSON()))
			.then(files=>{
				// Map each file and fetch its data from the file server //
				const filesWithData = files.map(file=>{
					return FileAPIService.read(file.associatedFileId)
						.then(response=>response.json())
						.then(json=>{
							const buffer = json.data
							file.data = buffer.data
							return file
						})
				})
				return Promise.all(filesWithData)
			})
			.then(files=>{
				res.status(200)
				res.send(files)
			})
			.catch(()=>{
				res.status(500)
				res.send(`couldn't write file`)
			})
	})

	/**
	 * @api {get} /files/:fileId Get file
	 * @apiName GetFile
	 * @apiGroup Transaction
	 *
	 * @apiParam {String} id of associated transaction.
	 *
	 * @apiSuccess (200) {Object[]} Returns an updated list [File]
	 */
	router.get('/files/:fileId', function(req, res, next) {
		const {fileId} = req.params
		const {username} = req.headers

		File.findById(fileId)
			.then(file=>{
				file = file.toJSON()

				// Fetch the files data from the file server //
				return FileAPIService.read(file.associatedFileId)
					.then(response=>response.json())
					.then(json=>{
						const buffer = json.data
						file.data = buffer.data
						return file
					})
			})
			.then(file=>{
				res.status(200)
				res.send(file)
			})
			.catch(()=>{
				res.status(500)
				res.send(`couldn't read file`)
			})	
	})

	/**
	 * @api {post} /files/:fileId  Get result of transaction (completes transaction)
	 * @apiName WriteFile
	 * @apiGroup Directory
	 *
	 * @apiParam {String} id of associated transaction.
	 *
	 * @apiSuccess (200) {Object[]} Returns a new file with 
	 */
	router.post('/files/', function(req, res, next) {
		const {payload} = req.body
		const {username} = req.headers
		const {data,name} = payload

		FileAPIService.write({data})
			.then(response=>response.json())
			.then(json=>json.associatedFileId)
			.then(associatedFileId=>{
				return File.create({'name':name, 'associatedFileId':associatedFileId,'accessControl':{}})
			})
			.then(result=>{
				const doc = result.toJSON()
				doc.data = data
				res.status(200)
				res.send(doc)
			})
			.catch(()=>{
				res.send(500)
				res.send(`couldn't write file`)
			})
	})

	/**
	 * @api {put} /files/:fileId Get result of transaction (completes transaction)
	 * @apiName UpdateFile
	 * @apiGroup Directory
	 *
	 * @apiParam {String} id of associated transaction.
	 *
	 * @apiSuccess (200) {Object[]} Returns an updated list [File]
	 */
	router.put('/files/:fileId', function(req, res, next) {
		const {payload} = req.body
		const {fileId} = req.params
		const {username} = req.headers
		const {data, name} = payload

		File.findById(fileId)
		.then(file=>{
			return FileAPIService.update(file.associatedFileId, {data})
		})
		.then(()=>{
			return File.findByIdAndUpdate(fileId, {'accessControl':{'lock':false}, 'modifiedAt': Date.now()})
		})
		.then(result=>{
			res.status(200)
			res.send(result)
		})
		.catch((err)=>{
			res.send(err.status || 500)
			res.send(err.message || `couldn't write file`)
		})
	})

	/**
	 * @api {delete} /files/:fileId Get result of transaction (completes transaction)
	 * @apiName DeleteFile
	 * @apiGroup Directory
	 *
	 * @apiParam {String} id of associated transaction.
	 *
	 * @apiSuccess (200) {Object[]} Returns an updated list [File]
	 */
	router.delete('/files/:fileId', function(req, res, next) {
		const {fileId} = req.params
		const {username} = req.headers

		File.findById(fileId)
		.then((file)=>{
			return FileAPIService.delete(file.associatedFileId)
		})
		.then(json=>{
			return File.remove({_id: fileId})
		})
		.then(result=>{
			res.status(200)
			res.send(result)
		})
		.catch(()=>{
			res.send(500)
			res.send(`couldn't write file`)
		})
	})

	return router
})