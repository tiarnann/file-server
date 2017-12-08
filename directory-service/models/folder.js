module.exports=(function(mongoose){
	const Schema = mongoose.Schema;

	const folderSchema = new Schema({
		name: { type: String, required: true, trim: true },
		// sizeInBytes: { type: Number, required: true, default: 0 },
		relative: { type: String, required: true, trim: true },
		timestamps: { 
			created: {
				type: Date, required: true, default: Date.now()
			}, 
			updated: {
				type: Date, required: true, default: Date.now()
			} 
		},
		files:[{type: Schema.Types.ObjectId, ref: 'File'}]
	}, { collection: 'folders' })

	mongoose.model('Folder', folderSchema) 
})