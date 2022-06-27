var fs = require('fs'),
  os = require('os'); 

function removePipe(filename){
  if(fs.existsSync(filename)){
    console.log('pipe cleaner unlinking', filename);
    fs.unlinkSync(filename);
  }
}

function checkForUnixSocketResidue(filename, exc){
  if (os.type() === 'Windows_NT') {
    return;
  }
  if (exc.code === 'ECONNRESET') { //nodejs cannot handle this properly, even with all the handlers in place
    var stack = new Error().stack;
    var stackarr = stack.split('\n');
    if (stackarr.length<5) {
      console.log("pipe cleaner will ignore ECONNRESET in nodejs 14 because it doesn't handle this error properly, even with all the handlers in place");
      return;
    }
    console.log('pipe cleaner will NOT ignore ECONNRESET in nodejs 14 because the stack trace was deeper than 4', stack);
  }
  if (exc) {
    //console.log(process.pid, 'pipe cleaner got', exc);
  }
  if(typeof filename === 'object' && filename instanceof Array){
    filename.forEach(removePipe);
  }else{
    removePipe(filename);
  }
}

function createLib (lib) {
  'use strict';

  function enableUnixSocketResidueCleaning(filename){
    lib.shouldClose.attachForSingleShot(checkForUnixSocketResidue.bind(null, filename));
    filename = null;
  }

  return enableUnixSocketResidueCleaning;
}
module.exports = createLib;
