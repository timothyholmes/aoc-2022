const fs = require('fs');

function partOne(data) {
  const chunk = data.toString();
  const split = chunk.split('\n');

  let total = 0;

  for (const e of split) {
    let containedTaskList = false;

    const cache = new Map();
    if (cache.has(e)) {
      containedTaskList = cache.get(e);
    } else {
      const pairs = e.split(',').map(e => e.split('-').map(Number));

      const uniqueSortedMembers = [...new Set(pairs.flat())].sort(
        (a, b) => a - b
      );

      const lowest = uniqueSortedMembers[0];
      const highest =
        uniqueSortedMembers[uniqueSortedMembers.length - 1] || lowest;

      for (const pair of pairs) {
        if (pair.includes(highest) && pair.includes(lowest)) {
          containedTaskList = true;
        }
      }

      cache.set(e, containedTaskList);
    }

    if (containedTaskList) {
      total += 1;
    }
  }

  console.log('total', total);
}

function partTwo(data) {
  const chunk = data.toString();
  const split = chunk.split('\n');

  let total = 0;
  const cache = new Map();

  for (const e of split) {
    let containedTaskList = false;

    if (cache.has(e)) {
      containedTaskList = cache.get(e);
    } else {
      const pairs = e
        .split(',')
        .map(e => e.split('-').map(Number))
        .flat();

      if (
        (pairs[0] <= pairs[2] && pairs[2] <= pairs[1]) ||
        (pairs[2] <= pairs[0] && pairs[0] <= pairs[3])
      ) {
        containedTaskList = true;
      }

      cache.set(e, containedTaskList);
    }

    if (containedTaskList) {
      total += 1;
    }
  }

  console.log('total', total);
}

function main() {
  const stream = fs.createReadStream(process.env.INPUT);

  stream.on('data', partOne);
  stream.on('data', partTwo);
  return 0;
}

main();
