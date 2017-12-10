module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const shadowFileSchema = new Schema({
		'data': Buffer,
		'associatedFileId': Schema.Types.ObjectId,
		'transactionId': Schema.Types.ObjectId
	}, { collection: 'shadow-files' })

	return mongoose.model('ShadowFile', shadowFileSchema) 
})



