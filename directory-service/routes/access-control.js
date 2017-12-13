module.exports=(function(express, FileModel, AccessControlModel){
	if(typeof express === 'undefined' || express == null){
		console.error(`Param express not defined`)
	}

	if(typeof FileModel === 'undefined' || FileModel == null){
		console.error(`Param FileModel not defined`)
	}

	if(typeof AccessControlModel === 'undefined' || AccessControlModel == null){
		console.error(`Param AccessControlModel not defined`)
	}

	// Models //
	const File = FileModel
	const AccessControl = AccessControlModel
	
	const router = express.Router();

	/**
	 * @api {put} /files/:fileId/lock/ Lock a given file.
	 * @apiName PutAccessControl
	 * @apiGroup AccessControl
	 *
	 * @apiParam {Number} Id of the file being locked.
	 * 
	 * @apiSuccess (200) {Object} [an object containing the created transactionId]
	 * @apiError (423) {Object} [The file is already locked]
	 * @apiErrorExample {Object} [title]
	 * 	{
	 * 		error: 'file already locked'
	 * 	}
	 */
	router.put('/files/:fileId/lock/',(req, res, next)=>{
		const {fileId} = req.params
		const {payload} = req.body
		const {value} = payload

		const accessControl = {'lock':value}

		// Updating only if the file is not locked //
		File.findByIdAndUpdate(fileId, {accessControl}).$where('this.accessControl.lock == false')
		.then((file)=>{
			if(file == null && accessControl.lock){
				res.status(423)
				res.send({
					error: 'file already locked'
				})
			}

			res.status(200)
			res.send()
		})
		.catch((err)=>{
			res.status(500)
			res.send()
		})
	})

	return router
})
