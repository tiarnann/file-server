module.exports=(function(express, file, accessControl, FileAPIService){
	const File = file
	const AccessControl = accessControl
	const router = express.Router();
	
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
		File.find({}).populate({
    		path: 'accessControl',
    		select: 'permissions'
  		})
		.then((files)=>{
			res.status(200)
			res.send(files)
		})
		.catch(()=>{
			res.send(500)
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

		AccessControl.find({username, associatedFileId: fileId})
		.then((control)=>{
			if(write == false){
				const err = new Error(`user doesn't have read permissions`)
				err.status = 423
				throw err
				return
			}
		})
		.then(()=>{
			return FileAPIService.update(fileId, data)
		})		
	})

	/**
	 * @api {post} /files/:fileId  Get result of transaction (completes transaction)
	 * @apiName WriteFile
	 * @apiGroup Directory
	 *
	 * @apiParam {String} id of associated transaction.
	 *
	 * @apiSuccess (200) {Object[]} Returns an updated list [File]
	 */
	router.post('/files/', function(req, res, next) {
		const {payload} = req.body
		const {username} = req.headers
		const {data,name} = payload

		FileAPIService.write(data)
			.then(res=>res.json())
			.then(json=>json.associatedFileId)
			.then(associatedFileId=>{
				return AccessControl.create({username, associatedFileId})
			})
			.then(accessControl=>{	
				const {_id, associatedFileId} = accessControl._doc
				return File.create({name, associatedFileId, accessControl: _id})
			})
			.then(result=>{
				const file = result._doc
				const {name, associatedFileId} = file
				res.status(200)
				res.send({name, associatedFileId})
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

		AccessControl.find({username, associatedFileId: fileId})
		.then((control)=>{
			if(write == false){
				const err = new Error(`user doesn't have read permissions`)
				err.status = 423
				throw err
				return
			}
		})
		.then(()=>{
			return FileAPIService.update(fileId, data)
		})		
		.then(res=>res.json())
		.then(json=>json.associatedFileId)
		.then(associatedFileId=>{
			return File.updateOne({associatedFileId}, {name})
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

		FileAPIService.delete(fileId)
			.then(json=>{
				return File.remove({associatedFileId:fileId})
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