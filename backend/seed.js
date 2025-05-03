import mongoose from 'mongoose';

async function connectToDatabase(uri) {
  const conn = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return new Promise((resolve, reject) => {
    conn.once('open', () => resolve(conn));
    conn.on('error', (err) => reject(err));
  });
}

async function seedAllCollections() {
  try {
    console.log('Connecting to source database...');
    const sourceConnection = await connectToDatabase('mongodb+srv://indianshahishere:Ae6QfKZUJo27fH7I@cluster0.2kwig.mongodb.net/ecom?retryWrites=true&w=majority');

    console.log('Connecting to destination database...');
    const destConnection = await connectToDatabase('mongodb+srv://shrinanugems111:F3QeNaTtr78izLFT@cluster0.w9rdg5u.mongodb.net/ecomNew?retryWrites=true&w=majority&appName=Cluster0');

    // List all collections
    const collections = await sourceConnection.db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\nMigrating collection: ${collectionName}`);

      const SourceModel = sourceConnection.model(collectionName, new mongoose.Schema({}, { strict: false }));
      const DestModel = destConnection.model(collectionName, new mongoose.Schema({}, { strict: false }));

      const documents = await SourceModel.find({});
      console.log(`Found ${documents.length} documents in ${collectionName}`);

      if (documents.length > 0) {
        // Optional: Clear destination collection first
        await DestModel.deleteMany({}); // CAREFUL: Deletes existing documents!

        await DestModel.insertMany(documents);
        console.log(`Inserted ${documents.length} documents into ${collectionName}`);
      } else {
        console.log(`No documents to migrate in ${collectionName}`);
      }
    }

    console.log('\n✅ All collections migrated successfully!');

    await sourceConnection.close();
    await destConnection.close();
    console.log('Connections closed.');

  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

seedAllCollections();
