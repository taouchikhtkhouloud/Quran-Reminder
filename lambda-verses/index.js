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
            const email = event.queryStringParameters.email;
            response = await getVerses(email);
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

async function getVerses(email) {
    const params = {
        TableName: userTable
    }

    try {
        const scanResult = await dynamodb.scan(params).promise();

        // Check if there are items in the result
        if (scanResult.Items.length === 0) {
            return buildResponse(200, []); // Return an empty array if there are no items
        }

        // Filter out verses based on subscriber email
        const filteredVerses = scanResult.Items.filter(verse => {
            // Assuming "Subscribers" is a set column in your DynamoDB table
            return verse.Subscribers && verse.Subscribers.values.includes(email);
        });

        return buildResponse(200, filteredVerses);
    } catch (error) {
        console.error('There is an error getting verses: ', error);
        return buildResponse(500, 'Internal Server Error');
    }
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