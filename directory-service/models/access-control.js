module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const accessControlSchema = new Schema({
		username: { type: String, required: true},
		associatedFileId: Schema.Types.ObjectId,
		access: { 
			'read': { type: String, required: true},
			'write': { type: String, required: true},
			'lock': { type: String, required: true}
		}
	}, { collection: 'access-control' })

	mongoose.model('AccessControl', folderSchema) 
})

r (read)
Allows one to read the contents of file in the directory.
w (write)
Allows one to modify the contents of files in a directory and use chmod on them.
k (lock)