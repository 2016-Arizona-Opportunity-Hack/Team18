'use strict';

let validator_tool = {};

validator_tool.checkInput = function(input, type, regex) {
  if (input) {
    if (type === 'string') {
      if (typeof(input) === 'string' && regex.test(input)) {
        return true;
      }
    }
    else if (type === 'number') {
      if (typeof(input) === 'number' || !(isNaN(input))) {
        return true;
      }
    }
  }
  console.log('failed to pass: '+input)
  return false;
}

module.exports = validator_tool;
