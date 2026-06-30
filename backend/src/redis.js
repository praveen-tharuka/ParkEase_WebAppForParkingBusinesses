const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const memoryStore = new Map();
let isUsingMemoryStore = false;

const realClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 2) {
        isUsingMemoryStore = true;
        return false; // Stop trying to reconnect
      }
      return 500; // retry delay in ms
    }
  }
});

realClient.on('error', (err) => {
  if (!isUsingMemoryStore) {
    isUsingMemoryStore = true;
    console.log('⚠️  Redis connection refused. Falling back to InMemory Session Store (Docker Redis bypassed).');
  }
});

realClient.connect().then(() => {
  console.log('🔌 Connected to Redis successfully');
}).catch(() => {
  isUsingMemoryStore = true;
});

// Proxy client wrapper to seamlessly delegate between Redis and InMemory Map
const clientWrapper = {
  get: async (key) => {
    if (isUsingMemoryStore) {
      return memoryStore.get(key) || null;
    }
    try {
      return await realClient.get(key);
    } catch (err) {
      return memoryStore.get(key) || null;
    }
  },
  set: async (key, value, options) => {
    if (isUsingMemoryStore) {
      memoryStore.set(key, value);
      if (options && options.EX) {
        setTimeout(() => memoryStore.delete(key), options.EX * 1000);
      }
      return 'OK';
    }
    try {
      return await realClient.set(key, value, options);
    } catch (err) {
      memoryStore.set(key, value);
      return 'OK';
    }
  },
  del: async (key) => {
    if (isUsingMemoryStore) {
      memoryStore.delete(key);
      return 1;
    }
    try {
      return await realClient.del(key);
    } catch (err) {
      memoryStore.delete(key);
      return 1;
    }
  }
};

module.exports = clientWrapper;
