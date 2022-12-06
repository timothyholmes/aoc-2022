const fs = require('fs');

const stream = fs.createReadStream('./input/day3.txt');

const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const bumpFrequencyFactory =
  (frequency = new Map()) =>
  key => {
    if (frequency.has(key)) {
      frequency.set(key, frequency.get(key) + 1);
    } else {
      frequency.set(key, 1);
    }
  };

function getPriority(searchChar) {
  return priorities.indexOf(searchChar) + 1;
}

function sumFrequency(frequency = new Map()) {
  let total = 0;

  for (const [item, count] of frequency) {
    const priority = getPriority(item);
    total = total + priority * count;
  }

  return total;
}

function findIntersection(...incomingSets) {
  const [head, ...tail] = incomingSets.map(e => new Set([...e]));

  return [...head].filter(e => tail.every(x => x.has(e)));
}

function partOne(data) {
  const chunk = data.toString();
  const split = chunk.split('\n');

  const frequency = new Map();

  const bumpFrequencyFx = bumpFrequencyFactory(frequency);

  for (const e of split) {
    const compartmentOffset = Math.ceil(e.length) / 2;
    const [double] = findIntersection(
      e.slice(0, compartmentOffset),
      e.slice(compartmentOffset)
    );
    bumpFrequencyFx(double);
  }

  const total = sumFrequency(frequency);

  console.log('duplicate sum', total);

  return total;
}

function partTwo(data) {
  const dataChunk = data.toString();
  const split = dataChunk.split('\n');

  const frequency = new Map();

  const bumpFrequencyFx = bumpFrequencyFactory(frequency);

  const chunkSize = 3;
  for (let i = 0; i < split.length; i += chunkSize) {
    const [badge] = findIntersection(...split.slice(i, i + chunkSize));

    bumpFrequencyFx(badge);
  }

  const total = sumFrequency(frequency);

  console.log('badge sum', total);

  return total;
}

function main() {
  stream.on('data', partOne);
  stream.on('data', partTwo);
  return 0;
}

main();
