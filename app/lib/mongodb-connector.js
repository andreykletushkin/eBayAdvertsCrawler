import 'dotenv/config'
import { MongoClient } from 'mongodb'
const client = new MongoClient(process.env.MONGO_DB_URL);

 function insert(advert) {
	client.connect().then(db => {
		var dbo = db.db("mydb")
		dbo.collection("adverts").insertOne(advert);
	});
}

async function find(title) {
	await client.connect();
	const dbo = client.db("mydb");
	return dbo.collection("adverts").findOne({ title: title })
}

async function findAll() {
	await client.connect();
	const dbo = client.db("mydb");
	return dbo.collection("adverts").find().toArray();
}

export { insert, findAll, find }







