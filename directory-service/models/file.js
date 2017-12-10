module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: String,
		associatedFileId: Schema.Types.ObjectId,
		accessControl:  { type: Schema.Types.ObjectId, ref: 'AccessControl' }
	}, { collection: 'files' })

	return mongoose.model('File', fileSchema) 
})