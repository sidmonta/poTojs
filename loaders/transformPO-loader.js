const po2json = require('po2json');
const path = require('path');
const fs = require('fs');
const loaderUtils = require("loader-utils");


module.exports.raw = true;

function* entries (obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]];
    }
 }

function forMat (po) {
    let newpo = {};
    for (let [key, value] of entries(po)) {
        if (key !== '') {
            if (value instanceof Array) {
                let newval = value.filter(e => e)[0];
                if (typeof newval !== 'undefined') {
                    newpo[key] = newval;
                }
            }
        }
    }
    return newpo;
}

module.exports = function (content) {
  const options = loaderUtils.getOptions(this);

  const callback = this.async();
  let messages = {};
  if (options.alldir) {
    let dir = path.dirname(this.resource);
    fs.readdir(dir, (err1, files) => {
      let promises = [];
      if (err1) { console.error(err1); callback(null, content); }
      files.forEach(file => {
        if (file.endsWith('.po')) {
          promises.push(new Promise((resolve, reject) => {

            fs.readFile(`${dir}/${file}`, function (err2, buffer) {
              if (err2) { reject(); }
              let jsonData = po2json.parse(buffer);
              let lang = file.substring(0, 2);

              messages[lang] = forMat(jsonData);
              resolve();
            });
          }));
        }
      });
      Promise.all(promises).then(function () {
        messages = JSON.stringify(messages);
        callback(null, `
        window.__ = function(s,l,d){
          var m=${messages};
          return (m.length > 1) ? m[l][s] || d || s : m[Object.keys(m)[0]][s] || d || s;};
        `);
      });

    });
  } else {
    let fileName = path.basename(this.resource);

    fs.readFile(this.resource, function (err2, buffer) {
      if (err2) { console.error(err2); return; }
      let jsonData = po2json.parse(buffer);
      let lang = fileName.substring(0, 2).toLocaleLowerCase();

      messages[lang] = forMat(jsonData);

      messages = JSON.stringify(messages);
      callback(null, `
      window.__${lang} = function (s,d){
        var m=${messages};
        return m[${lang}][s] || d || s;};
      `);
    });
  }
};
