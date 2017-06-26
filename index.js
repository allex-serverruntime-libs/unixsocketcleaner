var fs = require('fs'),
  os = require('os'); 

function removePipe(filename){
  if(fs.existsSync(filename)){
    fs.unlinkSync(filename);
  }
}

function checkForUnixSocketResidue(filename, exc){
  if (os.type() === 'Windows_NT') {
    return;
  }
  console.error(exc.stack);
  console.log(process.pid, 'cleaning pipes because of',exc);
  if(typeof filename === 'object' && filename instanceof Array){
    filename.forEach(removePipe);
  }else{
    removePipe(filename);
  }
}

function enableUnixSocketResidueCleaning(filename){
  var cfusr = checkForUnixSocketResidue.bind(null, filename);

  process.on('exit',cfusr);
  process.on('SIGINT',process.exit.bind(process, 0));
  process.on('uncaughtException',cfusr);

}

module.exports = enableUnixSocketResidueCleaning;
