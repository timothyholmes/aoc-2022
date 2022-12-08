const fs = require('fs');

const cache = new Map();

function partOne(data) {
  const chunk = data.toString();
  const split = chunk.split('\n');

  let total = 0;

  for (const e of split) {
    const pairs = e.split(',').map(e => e.split('-').map(Number));

    const [lowest, ...tail] = [...new Set(pairs.flat())].sort();
    const highest = tail[tail.length - 1] || lowest;

    console.log(pairs);
    console.log(new Set(pairs.flat().sort()));
    console.log('highest', highest);
    console.log('lowest', lowest);

    let containedTaskList = false;

    if (cache.has(pairs)) {
      containedTaskList = cache.get(pairs);
    } else {
      for (const pair of pairs) {
        console.log('pair', pair);
        if (pair.includes(highest) && pair.includes(lowest)) {
          containedTaskList = true;
        }
      }
    }

    if (containedTaskList) {
      total += 1;
      console.log('total bump!', total);
    }

    console.log('\n');
  }

  console.log('total', total);
}

function partTwo() {}

function main() {
  const stream = fs.createReadStream(process.env.INPUT);

  stream.on('data', partOne);
  stream.on('data', partTwo);
  return 0;
}

main();
