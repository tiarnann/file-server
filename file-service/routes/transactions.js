module.exports=(function(express, transaction, shadowFile){
	if(typeof express === 'undefined' || express == null){
		console.error(`Param express not defined`)
	}

	if(typeof transaction === 'undefined' || transaction == null){
		console.error(`Param transaction not defined`)
	}

	const Transaction = transaction
	const ShadowFile = shadowFile
	const router = express.Router();
	
	/* perform  transaction. */
	router.post('/transactions/', (req, res, next)=>{
		const {host, port} = req
		
		Transaction.insert({server:host, port:port })
		.then((result)=>{
			const transactionId = result._id
			res.status(200)
			res.send({transactionId})
		})
		.catch(()=>{
		})
	})

	const verifyServerForTransaction = (req, res, next)=>{
		const transactionId = req.params.tId
		const {host, port} = req

		Transaction.findOne({'_id':transactionId})
		.then(transaction=>{
			if(transaction.server != host || transaction.port != port){
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
	router.put('/transactions/:tId', (req, res, next)=>{
		const payload = req.body
		const {transaction} = req
		const transactionId = transaction._id

		Transaction.findById(transactionId)
		.then(()=>{
			/**/
		})
		.catch(()=>{
			res.status(500)
			res.send('database connection failure for  creating')
		})
	})

	/* complete transaction. */
	router.get('/transactions/:tId', (req, res, next)=>{
		const {transaction} = req
		const transactionId = transaction._id
		
		res.status(200)
	})

	/* cancel transaction. */
	router.delete('/transactions/:tId', (req, res, next)=>{
		const {transaction} = req
		const transactionId = transaction._id

		Transaction.remove({'_id':transactionId})
		.then(()=>{
			return ShadowFile.remove({'tId':transactionId})
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