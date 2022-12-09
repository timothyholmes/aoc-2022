const fs = require('fs');

class Queue {
  constructor(limit) {
    this.storage = [];
    this.limit = limit;
  }

  push(data) {
    this.storage.push(data);
    if (this.storage.length > this.limit) {
      this.pop();
    }
    return this.storage;
  }

  pop() {
    const item = this.storage.slice(0, 1);
    this.storage = this.storage.slice(1);
    return item;
  }

  isFull() {
    return this.storage.length === this.limit;
  }

  isUnique() {
    const storageAsSet = new Set(this.storage);
    return this.storage.length === storageAsSet.size;
  }
}

const markerDetectionFactory = n => data => {
  const chunk = data.toString();
  const split = chunk.split('');

  const queue = new Queue(n);

  let index = 1;

  for (const char of split) {
    queue.push(char);

    if (queue.isFull() && queue.isUnique()) {
      console.log(`Marker detected! marker: ${char}, index: ${index}`);
      break;
    }

    index += 1;
  }
};

function main() {
  const stream = fs.createReadStream(process.env.INPUT);

  stream.on('data', markerDetectionFactory(4));
  stream.on('data', markerDetectionFactory(14));
  return 0;
}

main();
