module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const accessControlSchema = new Schema({
		owner: String,
		associatedFileId: Schema.Types.ObjectId,
		access: { 
			'read': { type: String, required: true, default: true},
			'write': { type: String, required: true, default: true},
			'lock': { type: String, required: true, default: false}
		}
	}, { collection: 'access-control' })

	return mongoose.model('AccessControl', accessControlSchema) 
})