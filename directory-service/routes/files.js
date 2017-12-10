module.exports=(function(express, file, FileAPIService){
	const File = file
	const router = express.Router();
	
	/* read home page. */
	router.get('/files/:fileId', function(req, res, next) {
		const {fileId} = req.params
		 // .const {name}
		res.send(200)
		res.send({fileId})

		// File.findOne({name})
		// FileAPIService.read(id)
		
		// FileAPIService.update(id, fileBuffer){
		// FileAPIService.delete(id)
	})

	/* write file */
	router.post('/files/', function(req, res, next) {
		const {payload} = req.body
		const {data, name} = payload

		FileAPIService.write(data)
			.then(res=>res.json())
			.then(json=>json.associatedFileId)
			.then(associatedFileId=>{
				return File.create({name, associatedFileId})
			})
			.then(result=>{
				const {name, associatedFileId} = result
				res.status(200)
				res.send({name, associatedFileId})
			})
			.catch(()=>{
				res.send(500)
				res.send(`couldn't write file`)
			})
	})

	/* update file */
	router.put('/files/:fileId', function(req, res, next) {
		const {payload} = req.body
		const {fileId} = req.params
		const {data, name} = payload

		FileAPIService.update(fileId, data)
			.then(res=>res.json())
			.then(json=>json.associatedFileId)
			.then(associatedFileId=>{
				return File.updateOne({associatedFileId}, {name})
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

	/* delete home page. */
	router.delete('/files/:fileId', function(req, res, next) {
		const {fileId} = req.params

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