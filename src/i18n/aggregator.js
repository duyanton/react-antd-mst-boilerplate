/* eslint-disable */
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const FILE_PATTERN = './src/i18n/build/messages/**/*.json';
const OUTPUT_DIR = './src/i18n/build/';

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be logged if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
let defaultMessages = globSync(FILE_PATTERN)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (collection.hasOwnProperty(id)) {
        console.error(`Duplicated message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

// Create a new directory that we want to write the aggregate messages to
mkdirpSync(OUTPUT_DIR);

const masterDataPath = `${OUTPUT_DIR}/data.json`;
const currentData = fs.existsSync(masterDataPath)
  ? JSON.parse(fs.readFileSync(masterDataPath, 'utf8'))
  : {};

const messages = {};

currentData.en = Object.assign({}, defaultMessages, messages);

// Write the messages to this directory
fs.writeFileSync(OUTPUT_DIR + 'data.json', JSON.stringify(currentData, null, 2));
