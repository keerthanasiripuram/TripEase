const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, "KEERTHANA", (err, decoded) =>
        {
            if (err) {
                return res.status(401).send({ message: "Auth failed", success: false })
            }
            else {
                req.body.userId = decoded.id
                console.log("userid", decoded.id)
                next()
            }
        })
    }
    catch (error) {
        return res.status(401).send({ message: "Auth failed", success: false })
    }
}