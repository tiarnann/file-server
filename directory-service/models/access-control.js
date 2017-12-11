module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const accessControlSchema = new Schema({ 
		'read': { type: Boolean, required: true, default: true},
		'write': { type: Boolean, required: true, default: true},
		'lock': { type: Boolean, required: true, default: false}
	}, { collection: 'access-control' })

	return mongoose.model('AccessControl', accessControlSchema) 
})