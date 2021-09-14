import * as mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

const mongod=MongoMemoryServer.create();

//connect to db
export const connect=async ()=>{
    
    const uri=(await mongod).getUri();
    const mongooseOpts={
        useNewUrlParser:true,
        useUnifiedTopology:true,
    //     poolsize:10,
    //     useCreateIndex:true,
    // useFindAndModify:true
    }
    await mongoose.createConnection(uri,mongooseOpts).then(res=>{
        console.log("Connected");
    });
}

//disconnect and close connection
export const closeDatabase=async ()=>{
    await mongoose.connection.close();
    (await mongod).stop();
}