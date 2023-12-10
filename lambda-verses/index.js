const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
    
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'QuranReminder-verses';
const versesPath = '/verses';
const versePath = '/verse';

exports.handler = async (event, context) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === versesPath:
            response = await getVerses();
            break;
        case event.httpMethod === 'GET' && event.path === versePath:
            const Name = event.queryStringParameters.Name;
            const Ayat = event.queryStringParameters.Ayat;
            response = await getVerse(Name, Ayat);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
};

async function getVerses() {
    const params = {
        TableName: userTable
    }
    return await dynamodb.scan(params).promise().then(response => {
        return buildResponse(200, response.Items);
    }, error => {
        console.error('There is an error getting verses: ', error);
    })
}

async function getVerse(Name, Ayat) {
    const params = {
        TableName: userTable,
        Key: {
            "Name": Name,
            "Ayat": parseInt(Ayat)
        }
    }
    return await dynamodb.get(params).promise().then(response => {
        return buildResponse(200, response.Item);
    }, error => {
        console.error('There is an error getting verse: ', error);
    })
}

function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }