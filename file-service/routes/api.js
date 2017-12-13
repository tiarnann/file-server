module.exports=(function(express, file){
	const File = file
	const router = express.Router();
	
	/* read home page. */
	router.get('/files/:fileId', function(req, res, next) {
		const {payload} = req.body
		const {name} = payload
			
		File.find({'name': name},(err, file)=>{
			if(err){
				res.send(500)
			}

			res.send(file)
		})
	})

	/* write file */
	router.post('/files/:fileId', function(req, res, next) {
		const {payload} = req.body
		const {file} = payload
		const {name, data} = file

		File.create(file, (err, file)=>{
			if(err){
				res.send(500)
			}

			res.send(200)
		})
	})

	/* update file */
	router.put('/files/:fileId', function(req, res, next) {
		const {payload} = req.body
		const {file} = payload
		const {name, data} = file

		File.update({'name':name},file,(err, file)=>{
			if(err){
				res.send(500)
			}

			res.send(200)
		})
	})

	/* delete home page. */
	router.delete('/files/:fileId', function(req, res, next) {
		File.remove({'name':name},(err, file)=>{
			if(err){
				res.send(500)
			}

			res.send(200)
		})
	})

	return router
})