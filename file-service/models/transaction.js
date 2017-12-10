module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const transactionsSchema = new Schema({
		'server': String,
		'port': Number

	}, { collection: 'transactions' })

	return mongoose.model('Transactions', transactionsSchema) 
})



