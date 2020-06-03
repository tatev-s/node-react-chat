module.exports = errorHandler;
import {ValidationError} from "sequelize";

function errorHandler(err, req, res, next) {
    console.log('error handler',err);
    if (typeof (err) === 'string') {
        return res.status(400).json({ err: {message:err }, success: null});
    }

    if (err instanceof ValidationError) {
        const customizedErrors = {};
        if(err.errors && err.errors.length){
            for (let error of err.errors) {
                if (customizedErrors[error.path] == null)
                    customizedErrors[error.path] = error.message;
            }
        }
        return res.status(400).json({err: {message:err.message, validationErrors : customizedErrors},success: null });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ err: {message:'Invalid Token'},message:err });
    }
    // default to 500 server error
    return res.status(500).json({ err: {message:err.message },success: null});
}