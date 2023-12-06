const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/util');
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify"


export const handler = async (event) => {
  // TODO implement
  console.log("Event :", event);
  let response;
  switch(true){
    case event.httpMethod === 'POST' && event.path === registerPath:
      // code
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;
    case event.httpMethod === 'POST' && event.path === loginPath:
      // code
      const loginBody = JSON.parse(event.body);
      response = await loginService.login(loginBody);
      break;
    case event.httpMethod === 'POST' && event.path === verifyPath:
      // code
      const verifyBody = JSON.parse(event.body);
        response = await verifyService.verify(verifyBody);
      break;
    default:
      response = util.buildResponse(4004 , '404 not found');
    
  }
  return response;
};

