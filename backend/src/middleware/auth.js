import jwt from 'jsonwebtoken';

const handleAuthorization = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
    }
}