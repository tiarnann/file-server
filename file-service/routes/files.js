module.exports=(function(express, file){
	if(typeof express === 'undefined' || express == null){
		console.error(`Param express not defined`)
	}

	if(typeof file === 'undefined' || file == null){
		console.error(`Param file not defined`)
	}

	const File = file
	const router = express.Router();
	
	router.get('/',(req, res, next)=>{
		res.status(200)
		res.send('ok')
	})

	/* read home page. */
	router.get('/files/:fileId', (req, res, next)=>{
		const {fileId} = req.params
		const {payload} = req.body
			
		File.findOne({'_id': fileId})
			.then((file)=>{
				res.status(200)
				res.send(file)
			})
			.catch((err)=>{
				res.send(404)
			})
	})

	/* 
		write file 
		replies with associatedFileId for the new file
	*/
	router.post('/files', (req, res, next)=>{
		const {data} = req.body
		console.log(req.body)
		console.log(data)
		const newFile = new File({'data': data})

		console.log(newFile)

		newFile.save()
			.then((result)=>result.toJSON())
			.then((result)=>{
				res.status(200)
				res.send({
					'associatedFileId': result._id
				})
			})
			.catch((err)=>{
				res.status(404)
				res.send('file not found')
			})
	})

	/* update file */
	router.put('/files/:fileId', (req, res, next)=>{
		const {fileId} = req.params
		const {payload} = req.body
		const {data} = req.body
		

		File.update({'_id':fileId}, {data})
			.then((result)=>{
				res.status(200)
				res.send({
					'associatedFileId':fileId
				})
			})
			.catch((err)=>{
				res.send(err)
			})
	})

	/* delete home page. */
	router.delete('/files/:fileId', (req, res, next)=>{
		const {fileId} = req.params

		File.findByIdAndRemove(fileId)
			.then((result)=>{
				res.status(200)
				res.send()
			})
			.catch((err)=>{
				res.send(err)
			})
	})

	return router
})