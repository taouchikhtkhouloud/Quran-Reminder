const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const userTable = 'QuranReminder-users';
const snsTopicArn = 'arn:aws:sns:us-east-1:721855292758:QuranEmails';

async function login(user) {
  const email = user.email;
  const password = user.password;

  if (!user || !email || !password) {
    return util.buildResponse(401, {
      message: 'username and password are required'
    });
  }

  const dynamoUser = await getUser(email.trim());
  if (!dynamoUser || !dynamoUser.email) {
    return util.buildResponse(403, { message: 'user does not exist' });
  }

  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, { message: 'password is incorrect' });
  }

  // Check if the email is confirmed in SNS
  const snsConfirmationStatus = await checkEmailSubscriptionStatus(email.trim());
  if (!snsConfirmationStatus) {
    return util.buildResponse(403, { message: 'Email must be confirmed to log in.' });
  }

  const userInfo = {
    email: dynamoUser.email
  };
  const token = auth.generateToken(userInfo);
  const response = {
    user: userInfo,
    token: token
  };
  return util.buildResponse(200, response);
}

async function getUser(email) {
  const params = {
    TableName: userTable,
    Key: {
      email: email
    }
  };

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There is an error getting user: ', error);
  });
}

async function checkEmailSubscriptionStatus(email) {
  const params = {
    // Replace with your topic ARN
    TopicArn: snsTopicArn
  };
  
  const subscriptions = await sns.listSubscriptionsByTopic(params).promise();
  const emailSubscription = subscriptions.Subscriptions.find(sub => sub.Endpoint === email && sub.Protocol === 'email');
  
  if (emailSubscription && emailSubscription.SubscriptionArn) {
    const subAttributes = await sns.getSubscriptionAttributes({
      SubscriptionArn: emailSubscription.SubscriptionArn
    }).promise();
    
    return subAttributes.Attributes.SubscriptionArn !== 'PendingConfirmation';
  }
  else if(!emailSubscription){
    await sns.subscribe({
      Protocol: 'email',
      TopicArn: snsTopicArn,
      Endpoint: email
    }).promise(); 
    return false;
  }
  
  return false;
}

module.exports.login = login;
