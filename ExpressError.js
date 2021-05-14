// Usage:
//app.get((req, res, next) =>{
// try{
//  throw new ExpressError('Invalid Password', 403);
// } catch (e){
//   next(e);
// }
//}
//app.use(PageNotFound);
//app.use(ExpressErrorHandler);

function pageNotFound(req, res, next) {
    return res.status(404).json({msg:'Not Found', status:404});
}

function expressErrorHandler(err, req, res, next){
    const status = err.status || 500;
    const msg = err.msg;
    console.error(err.stack);
    return res.status(status).json({msg, status});
}


class ExpressError extends Error {
    constructor(msg, status){
        super();
        this.msg = msg;
        this.status = status;
    }
}
module.exports = {ExpressError, expressErrorHandler, pageNotFound};