const fs = require('fs');

const stream = fs.createReadStream('./input/day1.txt');

const elves = new Map();

function main() {
  stream.on('data', data => {
    const chunk = data.toString();
    const split = chunk.split('\n');
    let current = 0;
    for (const e of split) {
      let value = 0;
      if (!elves.has(current)) {
        elves.set(current, value);
      } else {
        value = elves.get(current);
      }

      if (e !== '') {
        elves.set(current, value + Number(e));
      } else {
        current = current + 1;
      }
    }

    const [head, two, three] = [...elves].sort(([, a], [, b]) => b - a);

    console.log(head[1] + two[1] + three[1]);

    return;
  });
  return 0;
}

main();
