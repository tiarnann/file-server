module.exports=(function(express, transactionModel, shadowFileModel){
	if(typeof express === 'undefined' || express == null){
		console.error(`Param express not defined`)
	}

	if(typeof transactionModel === 'undefined' || transactionModel == null){
		console.error(`Param transactionModel not defined`)
	}


	if(typeof shadowFileModel === 'undefined' || shadowFileModel == null){
		console.error(`Param shadowFileModel not defined`)
	}

	const Transaction = transactionModel
	const ShadowFile = shadowFileModel
	const router = express.Router();
	
	/* perform  transaction. */
	router.post('/transactions/', (req, res, next)=>{
		const {host, port} =  {host:'localhost'}

		Transaction.create({server: host, port:port })
		.then((result)=>{
			const transactionId = result._id
			res.status(200)
			res.send({transactionId})
		})
		.catch((err)=>{
			console.log(err)
		})
	})

	const verifyServerForTransaction = (req, res, next)=>{
		const transactionId = req.params.tId
		const {host} = req

		Transaction.findById(transactionId)
		.then(transaction=>{
			if(transaction.server != host){
				res.status(400)
				res.send('unauthorised non matching server/port for transactionId')
			}else {
				req.transaction = transaction
				next()
			}
		})
		.catch(()=>{
			res.status(500)
			res.send('database connection failure for api/transactions/:tId')
		})
	}

	/* add change to transaction. */
	router.put('/transactions/:tId',verifyServerForTransaction, (req, res, next)=>{
		const payload =	[
			{'data': new Buffer('hello'),
			'associatedFileId': "5a33c3ef9cf0d59091cdc83f",
			'transactionId': req.transaction._id
		},
			{'data': new Buffer('hello'),
			'associatedFileId': "5a33c3ef9cf0d59091cac83f",
			'transactionId': req.transaction._id}
		] 

		ShadowFile.insertMany(payload, { upsert : true })
		.then(()=>{
			res.status(200)
			res.send()
		})
		.catch(()=>{
			res.status(500)
			res.send('database connection failure for  creating')
		})
	})

	/* complete transaction. */
	router.get('/transactions/:tId',verifyServerForTransaction, (req, res, next)=>{
		const {transaction} = req
		res.status(200)
		res.send(req.transaction)
	})

	/* cancel transaction. */
	router.delete('/transactions/:tId',verifyServerForTransaction, (req, res, next)=>{
		const {transaction} = req
		const transactionId = transaction._id

		Transaction.remove({'_id':transactionId})
		.then(()=>{
			return ShadowFile.remove({'transactionId':transactionId})
		})
		.then(()=>{
			res.status(200)
			res.send()
		})
		.catch(()=>{
			res.status(500)
			res.send('database connection failure for  creating')
		})
	})

	return router
})