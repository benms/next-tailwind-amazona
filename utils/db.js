import mongoose from 'mongoose';

const connection = {};

const { MONGODB_URI, NODE_ENV } = process.env;

async function connect() {
  if (connection.isConnected) {
    console.warn('Is already connected to mongodb');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.warn('Use the previous connection to mongodb');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(MONGODB_URI);
  console.log('New connection to mongodb');
  connection.isConnected = db.connections[0].readyState
}

async function disconnect() {
  if (connection.isConnected) {
    if (NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
      console.log('Successfully disconnected connection to mongodb');
    } else {
      console.error('Can\'t disconnect connection to mongodb');
    }
  }
}

function convertDocsToObj(doc) {
  if (!doc) {
    return doc;
  }
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();

  return doc;
}

const db = {connect, disconnect, convertDocsToObj};

export default db;
