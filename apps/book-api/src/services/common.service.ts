
export const writeLogError=(log,err)=>{
    if(process.env.NODE_ENV != "production"){
    log.error(err.message,err.stack);
    }
}