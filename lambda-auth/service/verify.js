const util = require('../utils/util');
const auth = require('../utils/auth');
function verify(requestBody){
    if(!requestBody.user || !requestBody.email || !requestBody.token){
        return util.buildResponse(400, {
            verified: false,
            message: 'User, email and token are required'
        });
    }

    const user = requestBody.user;
    const token = requestBody.token;
    const verified = auth.verifyToken(user.email , token);
    if(!verified.verified){
        return util.buildResponse(400, verified);
    }
    return util.buildResponse(200, {
        verified: true,
        message: 'Success',
        user: user,
        token: token

    });
}

module.exports.verify = verify;