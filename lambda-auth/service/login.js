const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const userTable = 'QuranReminder-users';
const util = require('../utils/util'); 
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

async function login(loginBody){
  const email = loginBody.email;
  const password = loginBody.password;
  if(!email || !password){
    return util.buildResponse(400 , 'Email and password are required');
  }
  const dynamoUser = await getUser(email);
  if(!dynamoUser || !dynamoUser.email){
    return util.buildResponse(400 , 'User does not exist');
  }
  const isPasswordCorrect = await bcrypt.compare(password.trim() , dynamoUser.password);
  if(!isPasswordCorrect){
    return util.buildResponse(400 , 'Password is incorrect');
  }
  const userInfo = {
    email: dynamoUser.email
  };
  const token = auth.generateToken(userInfo);
  const response = {
    user:userInfo,
    token: token
  };
  
  return util.buildResponse(200 , response);
}


async function getUser(email){
    const params = {
        TableName: userTable,
        Key: {
        email: email
        }
    };
    return await dynamoDb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error("Error getting user :", error);
    });
    }

module.exports.login = login;