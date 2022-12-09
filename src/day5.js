const fs = require('fs');

const CRATE_BUFFER = 4;

class CrateStack {
  constructor(label) {
    this.storage = [];
    this.label = label;
  }

  push(...data) {
    this.storage.push(...data);
  }

  pop(n = 1) {
    const end = this.storage.length;
    const response = this.storage.slice(end - n, end);
    this.storage = this.storage.slice(0, end - n);
    return response;
  }
}

function partOne(data) {
  const chunk = data.toString();
  const split = chunk.split('\n');

  const inventoryInstructionSplit = split.findIndex(e => e === '');

  const inventory = split.slice(0, inventoryInstructionSplit).reverse();
  const [labels, ...stackDefinitions] = inventory;

  const stacks = [...labels].filter(e => e !== ' ').map(() => []);

  for (const stackDefinition of stackDefinitions) {
    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i];
      const charIndex = 1 + i * CRATE_BUFFER;

      if (stackDefinition[charIndex] !== ' ') {
        stack.push(stackDefinition[charIndex]);
      }
    }
  }

  const instructions = split.slice(inventoryInstructionSplit + 1, split.length);

  for (const instruction of instructions) {
    const [, strippedMove] = instruction.split('move ');
    const [amount, strippedFrom] = strippedMove.split(' from ');
    const [start, end] = strippedFrom.split(' to ');

    for (let i = 0; i < Number(amount); i++) {
      const crate = stacks[Number(start) - 1].pop();

      if (!crate) {
        throw new Error('No crate available!', crate);
      }

      stacks[Number(end) - 1].push(crate);
    }
  }

  console.log(stacks.reduce((acc, e) => `${acc}${e.pop()}`, 'Stack Tops: '));
}

function partTwo(data) {
  const chunk = data.toString();
  const split = chunk.split('\n');

  const inventoryInstructionSplit = split.findIndex(e => e === '');

  const inventory = split.slice(0, inventoryInstructionSplit).reverse();
  const [labels, ...stackDefinitions] = inventory;

  const stacks = [...labels].filter(e => e !== ' ').map(e => new CrateStack(e));

  for (const stackDefinition of stackDefinitions) {
    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i];
      const charIndex = 1 + i * CRATE_BUFFER;

      if (stackDefinition[charIndex] !== ' ') {
        stack.push(stackDefinition[charIndex]);
      }
    }
  }

  const instructions = split.slice(inventoryInstructionSplit + 1, split.length);

  for (const instruction of instructions) {
    const [, strippedMove] = instruction.split('move ');
    const [amount, strippedFrom] = strippedMove.split(' from ');
    const [start, end] = strippedFrom.split(' to ');

    const crates = stacks[Number(start) - 1].pop(Number(amount));
    stacks[Number(end) - 1].push(...crates);
  }

  console.log(stacks.reduce((acc, e) => `${acc}${e.pop()}`, 'Stack Tops: '));
}

function main() {
  const stream = fs.createReadStream(process.env.INPUT);

  stream.on('data', partOne);
  stream.on('data', partTwo);
  return 0;
}

main();
