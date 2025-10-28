const jwt = require('jsonwebtoken');

const jwtMiddleWare = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Token missing" });

    const token = authHeader.split(' ')[1]; // Bearer <token>

    try {
        const jwtResponse = jwt.verify(token, 'secretkey');
        console.log("JWT decoded:", jwtResponse);
        req.payload = jwtResponse.userMail; // attach email to req
        next();
    } catch (err) {
        console.error("JWT error:", err.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = jwtMiddleWare;
