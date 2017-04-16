import fs from 'fs';
import express from 'express';
import { MongoClient } from 'mongodb';
import Schema from './data/schema';
import GraphQLHTTP from 'express-graphql';
import { graphql } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';
import cors from 'cors';

let app = express();

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static('public'));

try {
  (async () => {
    let db = await MongoClient.connect(process.env.MONGO_URL);
    let schema = Schema(db);
    app.use('/graphql', cors(), GraphQLHTTP({
      schema,
      graphiql: true
    }));

    app.listen(4000, () => console.log('listening on port 4000'));

    //generate schema.json
    let json = await graphql(schema, introspectionQuery);
    fs.writeFile('./data/schema.json', JSON.stringify(json, null, 2), err => {
      if (err) throw err;

      console.log("JSON schema created");
    });
  })();
} catch (e) {
  console.log("error: ", e);
};
