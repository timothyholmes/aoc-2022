const fs = require('fs');
const util = require('util');
const CD = 'cd';
const OUTER_DIR = '/';
const PARENT_DIR = '..';
const TOTAL_DISK_SPACE = 70000000;
const UPDATE_SPACE_REQUIREMENT = 30000000;

class FileSystem {
  constructor() {
    this.global = new Map([[OUTER_DIR, new Map()]]);
    this.current = this.global.get(OUTER_DIR);
  }

  cd(dir = OUTER_DIR) {
    if (this.global.has(dir)) {
      this.current = this.global.get(dir);
    } else {
      if (!this.current.has(dir)) {
        this.current.set(dir, new Map([[PARENT_DIR, this.current]]));
      }

      this.current = this.current.get(dir);
    }

    return this.current;
  }

  writeFile(fileName, size = 0) {
    this.current.set(fileName, Number(size));

    return this.current;
  }

  load(commandList) {
    for (const line of commandList) {
      const lineComponents = line.split(' ');

      if (lineComponents[1] === CD) {
        this.cd(lineComponents[2]);
      } else if (Number.isInteger(Number(lineComponents[0]))) {
        this.writeFile(lineComponents[1], lineComponents[0]);
      }
    }
  }

  search(
    condition = e => e,
    directory = this.cd(OUTER_DIR),
    directoryLabel = OUTER_DIR,
    response = []
  ) {
    if (directoryLabel !== PARENT_DIR) {
      directory.forEach((value, key) => {
        // if it is not a number then it's a directory
        if (!Number.isInteger(value) && directoryLabel !== PARENT_DIR) {
          this.search(condition, value, key, response);
        }
      });

      if (condition(directory)) {
        response.push(directory);
      }

      return response;
    }
  }

  static determineSizeOfDirectory(directory) {
    return [...directory.entries()].reduce((acc, [label, value]) => {
      if (Number.isInteger(value)) {
        return acc + value;
      } else if (label !== '..') {
        return acc + FileSystem.determineSizeOfDirectory(value);
      }
      return acc;
    }, 0);
  }
}

function partOne(data) {
  const fileSystem = new FileSystem();
  fileSystem.load(data.toString().split('\n'));

  const upperBound = 100000;

  const answer = fileSystem
    .search(e => FileSystem.determineSizeOfDirectory(e) <= upperBound)
    .reduce((acc, e) => acc + FileSystem.determineSizeOfDirectory(e), 0);

  console.log(`Directories less than ${upperBound}: ${answer}`);
}

function partTwo(data) {
  const fileSystem = new FileSystem();
  fileSystem.load(data.toString().split('\n'));

  fileSystem.cd();
  const usedMemory = FileSystem.determineSizeOfDirectory(fileSystem.current);
  const unusedMemory = TOTAL_DISK_SPACE - usedMemory;
  const neededSpace = UPDATE_SPACE_REQUIREMENT - unusedMemory;

  if (neededSpace <= 0) {
    console.log('Adequate free space for update is available.');
  } else {
    const answer = fileSystem
      .search(e => FileSystem.determineSizeOfDirectory(e) >= neededSpace)
      .sort(
        (a, b) =>
          FileSystem.determineSizeOfDirectory(a) -
          FileSystem.determineSizeOfDirectory(b)
      );

    console.log(
      `Directories greater than ${neededSpace}: ${util.inspect(
        FileSystem.determineSizeOfDirectory(answer[0]),
        {
          showHidden: false,
          depth: null,
          colors: true,
        }
      )}`
    );
  }
}

function main() {
  const stream = fs.createReadStream(process.env.INPUT);

  stream.on('data', partOne);
  stream.on('data', partTwo);
  return 0;
}

main();
