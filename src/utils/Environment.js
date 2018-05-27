function readConfig(filename) {
  console.log('Reading config from ' + filename);
  try {
    let lines = require('fs').readFileSync(filename, 'utf-8').split('\n');
    lines.forEach(function (line) {
      line = line.trim();
      if (line !== '' && line[0] !== '#') {
        let key = line.split('=')[0].trim();
        let value = line.split('=')[1].trim();
        // console.log(key);
        // console.log(value);
        process.env[key] = value
      }
    });
  } catch (err) {
    throw err
  }
}

function getProperty(key, _defValue) {
  let value = process.env[key];
  if (typeof value === 'undefined') {
    return _defValue;
  }
  return value
}

module.exports.getProperty = getProperty;
module.exports.readConfig = readConfig;