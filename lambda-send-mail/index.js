const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sns = new AWS.SNS();
const csv = require('csv-parser');
const dynamodb = new AWS.DynamoDB();

const TOPIC_ARN = 'arn:aws:sns:us-east-1:721855292758:QuranEmails';
const DYNAMODB_TABLE_NAME = 'QuranReminder-verses';

exports.handler = async (event, context) => {
    const params = {
        Bucket: 'quran-reminder-dataset',
        Key: 'main_df.csv',
    };

    try {
        
        const s3Object = await s3.getObject(params).promise();
        const csvContent = s3Object.Body.toString('utf-8');

        // Parse CSV content
        const rows = csvContent.split('\n');
        const header = rows[0].split(',');

        // Choose a random line
        const randomLineIndex = Math.floor(Math.random() * (rows.length - 1)) + 1; // Exclude the header
        const randomLine = rows[randomLineIndex].split(',');

        const records = await parseCSV(csvContent);
        const randomLineObject = pickRandomRecord(records);

        // Convert randomLineObject to an HTML page
        const htmlContent = `<html><body><pre>${JSON.stringify(randomLineObject, null, 2)}</pre></body></html>`;

        // Publish HTML content to SNS topic
        const snsParams = {
            MessageStructure: 'json',
            Message: JSON.stringify({
                default: JSON.stringify(randomLineObject, null , 2 ), // For clients that don't support HTML
                html: htmlContent, // Your HTML content
            }),
            Subject: 'Your Daily Quran Reminder',
            TopicArn: TOPIC_ARN,
        };
        const subscribers = await getSNSSubscribers(TOPIC_ARN);
        

        await sns.publish(snsParams).promise();
        try {
            await dynamodb.putItem({
                TableName: DYNAMODB_TABLE_NAME,
                Item: {
                    
                        Name : { S: randomLineObject.Name || '---' },
                        Surah: { N: randomLineObject.Surah || '0' },
                        Ayat: { N: randomLineObject.Ayat || '0' },
                        Arabic: { S: randomLineObject.Arabic || '---' },
                        Translation1: { S: randomLineObject.Translation1 || '---' },
                        Translation2: { S: randomLineObject.Translation2 || '---' },
                        Translation3: { S: randomLineObject.Translation3 || '---' },
                        Tafaseer1: { S: randomLineObject.Tafaseer1 || '---' },
                        Tafaseer2: { S: randomLineObject.Tafaseer2 || '---' },
                        Subscribers: { SS: subscribers || '---' }
                    
                },
            }).promise();
        } catch (dynamoDbError) {
            console.error('Error putting item into DynamoDB:', dynamoDbError);
            // Handle the error or implement retry logic
            throw dynamoDbError;
        }
        

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'HTML content published to SNS topic' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
async function getSNSSubscribers(topicArn) {
    const params = {
      TopicArn: topicArn
    };
  
    const response = await sns.listSubscriptionsByTopic(params).promise();
    const confirmedSubscribers = response.Subscriptions
      .filter(sub => sub.SubscriptionArn !== 'PendingConfirmation') // Filters out unconfirmed subscriptions
      .map(sub => sub.Endpoint); // Assuming you want to store the endpoint (e.g., email address)
  
    return confirmedSubscribers;
  }

  function parseCSV(csvContent) {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = require('stream');
        const csvStream = stream.Readable.from(csvContent);
        csvStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => reject(error));
    });
}

function pickRandomRecord(records) {
    const randomIndex = Math.floor(Math.random() * records.length);
    return records[randomIndex];
}
  