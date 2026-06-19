const roleMiddleware = (...roles)=>{
    return async (req, res, next)=>{
        if (!roles.includes(req.user.role)){
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    }
}

export default roleMiddleware;