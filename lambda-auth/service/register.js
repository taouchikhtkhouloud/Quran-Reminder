const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const userTable = 'QuranReminder-users';
const util = require('../utils/util'); 
const bcrypt = require('bcryptjs');

async function register(registerBody){
  const email = registerBody.email;
  const password = registerBody.password;
  if(!email || !password){
    return util.buildResponse(400 , 'Email and password are required');
  }
  const dynamoUser = await getUser(email);
  if(dynamoUser && dynamoUser.email){
    return util.buildResponse(400 , 'User already exists');
  }
  const hashedPassword = await bcrypt.hash(password.trim() , 10);
  const user = {
    email: email,
    password: hashedPassword
  };
  const saveUserResponse = await saveUser(user);
  if(!saveUserResponse){
    return util.buildResponse(503 , 'Server Error. Please try again');
  }
    return util.buildResponse(200 , 'User saved successfully');
  
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

async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    };
    return await dynamoDb.put(params).promise().then(() => {
        return true;
    }, error => {console.error("Error saving user :", error)
    });
}

module.exports.register = register;