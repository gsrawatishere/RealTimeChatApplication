import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) return res.status(401).json({ msg: 'No Access Token!' });

    try {
        const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = data.userId; 
        next();
    } catch (err) {
        return res.status(403).json({ msg: 'Invalid or Expired Access Token!' });
    }
};