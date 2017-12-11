module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: String,
		associatedFileId: String,
		accessControl:  mongoose.model('AccessControl').schema
	}, { collection: 'files' })

	return mongoose.model('File', fileSchema) 
})