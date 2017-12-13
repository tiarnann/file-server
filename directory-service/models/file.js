module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const fileSchema = new Schema({
		name: {type:String, unique:true},
		associatedFileId: String,
		accessControl:  mongoose.model('AccessControl').schema,
		createdAt: {type: Date, default:Date.now()},
		modifiedAt: {type: Date, default:''}
	}, { collection: 'files' })

	return mongoose.model('File', fileSchema) 
})