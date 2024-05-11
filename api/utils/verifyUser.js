import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    // Getting token from cookie
    const token = req.cookies.access_token;
    // returning error is no cookie found
    if(!token){
        return next(errorHandler(401, 'Unauthorized'))
    }
    // verify the token with JWT_SECRET value
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        // returing error in case token is not verified
        if(err) return next(errorHandler(403,'Forbidden'));
        //attaching the user object in the req ( which will become accessible to all the next middlewares)
        req.user = user;
        //passing control to the next function
        next();
    }) 
};
