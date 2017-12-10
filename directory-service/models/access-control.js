module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const accessControlSchema = new Schema({
		associatedFileId: {type: String, required: true},
		permissions: { 
			'read': { type: Boolean, default: true},
			'write': { type: Boolean, default: true},
			'lock': { type: Boolean, default: false}
		}
	}, { collection: 'access-control' })

	return mongoose.model('AccessControl', accessControlSchema) 
})