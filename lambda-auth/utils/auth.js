const jwt = require('jsonwebtoken');

function generateToken(userInfo){
    if(!userInfo){
        return null;
    }
 
    
  const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: '1h' // expires in 24 hours
  });
  return token;
}

function verifyToken(email ,token){
    return jwt.verify(token, process.env.JWT_SECRET, function(err, response) {
        if(err){
            return {
                verified: false,
                message: 'Invalid token'
            };
            
        }
        if(response.email !== email){
            return {
                verified: false,
                message: 'Invalid user'
            };
            
        }
        return {
            verified: true,
            message: 'Valid '};
      });
}

modules.exports.generateToken = generateToken;
modules.exports.verifyToken = verifyToken;