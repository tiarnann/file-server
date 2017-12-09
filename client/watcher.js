module.exports=(function(events,fs){
	
	const Watcher = function(directory='.', ignoredExtensions=[]){
		this.ignoredExtensions = ignoredExtensions.reduce((obj,extension)=>{
			obj[extension] = true
			return obj 
		},{})

		fs.watch(directory, this.listen.bind(this))
	}

	Watcher.prototype = events.EventEmitter
	
	Watcher.prototype.event = function(event, exists){
		if(event == 'rename'){
			if(exists){
				return 'rename'
			} else{
				return 'delete'
			}
		}

		return event
	}

	Watcher.prototype.listen = function(event, name){
		const ignore = this.shouldIgnore(name)

		if(ignore){
			this.emit('ignored', name)
		}
		const associatedEvent = this.event(event)

		this.emit(associatedEvent, name)
	}

	Watcher.prototype.shouldIgnore = function(filename){
		const splitName = name.split('.')
		const isDotFile = (splitName[0] == '')
		const extension = (splitName.length > 1)?splitName.pop():''

		if(isDotFile){ return true}
		if(this.ignoredExtensions[filename]){ return true }

		return false
	}

	return Watcher
})
