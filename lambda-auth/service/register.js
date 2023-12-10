const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const userTable = 'QuranReminder-users';
const snsTopicArn = 'arn:aws:sns:us-east-1:721855292758:QuranEmails';  // Replace with your SNS topic ARN

async function register(userInfo) {
  const email = userInfo.email;
  const password = userInfo.password;
  if (!email || !password) {
    return util.buildResponse(401, {
      message: 'All fields are required'
    })
  }

  const dynamoUser = await getUser(email.trim());
  if (dynamoUser && dynamoUser.email) {
    return util.buildResponse(401, {
      message: 'Username already exists in our database. Please choose a different username'
    })
  }

  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
    email: email.trim(),
    password: encryptedPW
  }

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, { message: 'Server Error. Please try again later.'});
  }

  // Add the following code to publish the email to the SNS topic
  try {
    await subscribeToSNS(email);
  } catch (error) {
    console.error('Error publishing email to SNS:', error);
  }

  return util.buildResponse(200, { email: email });
}

async function getUser(email) {
  const params = {
    TableName: userTable,
    Key: {
      email: email
    }
  }

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There is an error getting user: ', error);
  })
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user
  }
  return await dynamodb.put(params).promise().then(() => {
    return true;
  }, error => {
    console.error('There is an error saving user: ', error)
  });
}

async function subscribeToSNS(email) {
    const subscribeParams = {
      Protocol: 'email',
      TopicArn: snsTopicArn,
      Endpoint: email
    };
  
    await sns.subscribe(subscribeParams).promise();
  }

module.exports.register = register;
