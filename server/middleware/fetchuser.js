const jwt = require('jsonwebtoken')
const JWT_SECRET = "BOOKING"

const fetchuser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
        let data=''
        try {
            data = jwt.verify(JSON.parse(token), JWT_SECRET)
        } catch (error) {
            data = jwt.verify(token, JWT_SECRET)
        }
        req.user = data.user;   
        next()
    } catch (error) {
        res.status(401).send(error)

    }
}

module.exports = fetchuser