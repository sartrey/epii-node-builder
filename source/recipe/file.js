const path = require('path');
const shell = require('shelljs');
const logger = require('../kernel/logger.js');

/**
 * get entries
 *
 * @param  {Object} config
 * @param  {Object} context
 * @return {Object} webpack entries
 */
function getEntries(config, context) {
  const entries = {};
  context.entries
    .filter(file =>
      !file.startsWith(config.$render.source.assets)
      && file.endsWith('index.html'))
    .forEach(file => {
      const name = path.relative(config.$render.source.root, file);
      entries[name] = file;
    });
  // todo - not special assets
  entries.assets = {
    source: config.$render.source.assets,
    target: config.$render.target.root
  };
  return entries;
}

module.exports = (config, context) => {
  // copy entries
  const entries = getEntries(config, context);
  Object.keys(entries).forEach(name => {
    const entry = entries[name];
    if (typeof entry === 'string') {
      const source = entry;
      const target = path.join(config.$render.target.root, name);
      shell.mkdir('-p', path.dirname(target));
      shell.cp('-r', source, target);
    } else {
      const source = entry.source;
      const target = entry.target;
      shell.cp('-r', source, target);
    }
    logger.info('file ::', `[${name}] copied`);
  });
};