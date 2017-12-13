# CS4400 Internet Applications Assignment 3: File-Server

## Features
- [x] Distributed Transparent File Access
- [x] Security Service
- [x] Directory Service
- [x] Replication
- [x] Caching
- [x] Transactions
- [x] Lock Service
- [ ] API Docs for services


## Overview
### Distributed Transparent File Access
Flat file system. Every file is shared with everyone. The client is a typical AFS client with open, close functions.

* Example - A file being updated
![Locking](https://github.com/tiarnann/file-server/blob/master/docs/gifs/updating-metadata.gif?raw=true)

* Example - Open, Closing functions. Write Mode + Persisting Files
![Write Mode](https://github.com/tiarnann/file-server/blob/master/docs/gifs/pushed-files-persist.gif?raw=true)

### Security Service
* All traffic is encrypted. 
* https between servers
* 3-Key Authentication for Client-to-Server

There are three events that are affected by this given service.
1. User Login
2. User Connect to Server-X
3. Interacting with Server-X

#### Event: User Login
```

[t1]	
User ----> Authentication Server
Request Object: {username, password} 

[t2]	
User <---- Authentication Server
Response Object: {session-key} 

Session-key is encrypted with the users password
```

#### Event: User Connect to Server-X
```

[t1]	
User ----> Authentication Server
	
Request Object: {username, payload: {
	identity: 'Server-X'
	}
} 

Payload is encrypted with the users session-key. This is stored on the Authentication Server and can be looked up with their username: 

[t2]	
User <---- Authentication Server

Response Object: {
	ticket:'object containing the username and session-key of the user encrypted with Server-Xs secret key,
	session-key: 'users session key'
}

The ticket is then used to interact with Server-X.

```

#### Event: Interacting with Server-X
```

[t1]	User ----> Server-X
			{Ticket, Payload} 

Payload is encrypted with the users session-key. The ticket contains the users session-key. Server-X can decrypt the ticket, extract the session-key and then use the extracted key to then decrypt the payload.

[t2]	User <---- Authentication Server
			{Payload}

The response payload is also encrypted with the users session-key.

```
### Client
The client is like any AFS client, it has the following functions.
| Commands | Function |
| ------ | ------ |
| afs login <username> <password> | Authenticates the user. Also fetches and caches all files off the server to the local disk.  |
| afs fetch | Manually fetch and cache all files in the server to the local disk. |
| afs open <file> <write\|read> | Opens a new (write-only) or existing file in a given mode. |
| afs close <file> <write\|read> | Closes a file for a given mode. If for write, it will push the new data up to the cloud. |
| afs rm <file> | Deletes a given file locally and off the server |


### Directory Service
Supports
1. Get a single file
2. Get all files
3. Create a file
4. Update a file
5. Locking
<!-- [Directory Service API can be seen here](http://google.com) -->

### Lock Service
The service is integrated into the directory service. See the api above.
Each time a file is opened for write, the file is then locked so no one can write to it. Once the close has been called the file has been updated, it is then unlocked. To ensure the no body writes a file that they were not supposed to the permissions of the file are changed on-disk for all groups and the server will reject any requests that don't abide by the permissions.

* Example - Locking from another users point-of-view a file is locked to another user.
![Locking](https://github.com/tiarnann/file-server/blob/master/docs/gifs/locking.gif?raw=true)


### Transactions Service
Transactions can be initiated with this service. Transactions are stored with info of the user who started it. The service stores files affected by the transactions in a `shadow-file` collection - shadow files are copies which the actions are performed on instead of the actual files themselves - no files are affected by commits of a transaction till the transaction is completed with the necessary api call.

Supports
1. Start a transaction
2. Commit to transaction
3. Delete a transaction
4. Update a file
5. Locking

<!-- [Transaction Service API can be seen here](http://google.com) -->

### Replication
Replication is integrated into the databases using [Replica Sets](https://docs.mongodb.com/manual/replication/). This provides that there is always a server.

The setup looks like this...
```
			[  Primary	]

 [Secondary]<-Heartbeat->[Secondary]
```

Writes and reads are done through the primary.
In the case that the primary disconnects, a vote will be made between the secondaries and one will be elected the new primary. To make the following setup...
```
 [Primary]<-Heartbeat->[Secondary]
```

### Caching
Caching is simply done by caching files locally on the clients's disk. 
Each time new files are fetched from the directory server the files on disk are updated.

Demo - Logging in, fetching files and caching them locally
![Login Cache](https://github.com/tiarnann/file-server/blob/master/docs/gifs/login-cache.gif?raw=true)


## Installation, Configuration and Running
### Dependencies
* [Redis server](https://redis.io)
* [MongoDB](https://www.mongodb.com)
* [NodeJS](https://nodejs.org/en/download/) Note: This was built with the LTS version.

### Installing
Run the following in the root directory
```bash
	npm install
```

### Configuration
#### HTTPS
You'll want to run the key and cert generator, in the project directory. This will create the https certificates and private keys for each server.
```bash
	./key-generator
```

#### Redis
You'll want to set the port of your redis server inside package.json.
```json
    "redis": {
      "port": 8080,
      "host": "yourhostname",
      "socket": "/someplace/whereever.sock"
    }
```

After this when running, make sure this server is running with
```
	redis-server /location/redis.conf
```
#### MongoDB
You'll want to set the urls to your dbs inside the package.json. 
Same as with redis, obviously make sure to have `mongod` running in the background.

### Running
Now that you've everything setup, you can run the all the servers with
```
	npm start
```