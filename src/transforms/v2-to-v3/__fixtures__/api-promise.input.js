import AWS from "aws-sdk";

const client = new AWS.DynamoDB();

// Promise without params
{
  // async/await
  try {
    await client.listTables().promise();
    console.log(data);
  } catch (err) {
    console.log(err, err.stack);
  }

  // .then() and .catch()
  client
    .listTables()
    .promise()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));

  // Client as class member
  class ClientClassMember {
    constructor(client = new AWS.DynamoDB()) {
      this.client = client;
    }
  
    async listTables() {
      return await this.client.listTables().promise();
    }
  }

  // Variable declarator
  const listTablesPromise = client.listTables().promise();
}

// Promise with params
{
  // async/await
  try {
    await client.listTagsOfResource({ ResourceArn: "STRING_VALUE" }).promise();
    console.log(data);
  } catch (err) {
    console.log(err, err.stack);
  }

  // .then() and .catch()
  client
    .listTagsOfResource({ ResourceArn: "STRING_VALUE" })
    .promise()
    .then((data) => console.log(data))
    .catch((err) => console.log(err, err.stack));
}