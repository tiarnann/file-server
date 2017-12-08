module.exports=(function(express, FileModel){
	if(typeof express === 'undefined' || express == null){
		console.error(`Param express not defined`)
	}

	if(typeof FileModel === 'undefined' || FileModel == null){
		console.error(`Param file not defined`)
	}

	const router = express.Router();
	
	/* Return locking info on file */
	router.get('/files/:fileId/lock',(req, res, next)=>{
		res.status(200)
		res.send({
			'locked': true,
			'fileId': '9876547987654367'
		})
	})

	/* Request lock on a file */
	router.post('/files/:fileId/lock',(req, res, next)=>{
		res.status(200)
		res.send({
			'locked': true,
			'fileId': '9876547987654367',
			'message': 'file locked successfully'
		})
	})

	/* Remove lock on a file */
	router.delete('/files/:fileId/lock',(req, res, next)=>{
		res.status(200)
		res.send({
			'locked': false,
			'fileId': '9876547987654367',
			'message': 'removed file lock successfully'
		})
	})

	return router
})