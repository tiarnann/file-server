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

	const File = FileModel
	const AccessControl = AccessControlModel
	const router = express.Router();
	
	router.put('/files/:fileId/:modifier/',(req, res, next)=>{
		const {modifier,fileId} = req.params
		const {value} = req.body

		switch(modifier){
			case 'read':
			case 'write':
			case 'lock':
				res.status(200)
				res.send()
			default:
				res.status(500)
				res.send('unknown modifier')
		}
	})

	return router
})