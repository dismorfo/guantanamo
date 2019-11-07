'use strict';

const DownloadPDFA = class {

  get command () {
    return 'download-pdfa';
  }

  get alias () {
    return false;
  }

  get description () {
    return 'Download pdfa';
  }

  get options () {
    return [];
  }

  get onInit () {
    return false;
  }

  get onDone () {
    return false;
  }

  get list () {
    return true;
  }

  action () {
    const fetch = require('node-fetch');
    const http = require('http');
    const { 
      createWriteStream
    } = require('fs');
    const { 
      resolve,
      parse,
      basename,
    } = require('path');
    const {
      appDir,
      appUrl,
      get,
      exists,
      exit,
      log,
      mkdir,
      read,
      write,
    } = require('hephaestus');
    try {
      const worldDocumentsPath = `${appDir()}/app/localsource/articles/pdfa`;
      const documentsPath = `${appDir()}/app/localsource/articles/articles.json`;
      const listPath = `${appDir()}/app/localsource/articles/pdfa.json`;
      const documents = read.json(documentsPath);
      if (!exists(worldDocumentsPath)) {
        mkdir(worldDocumentsPath);
      }
      
      const out = [];

      for (const document of documents) {
        out.push(encodeURI(document.pdfa));
        // ECONNREFUSED: not sure why
        // fetch(encodeURI(document.wordFile))
        //   .then(res => {
        //     const dest = createWriteStream(`${worldDocumentsPath}/${basename(document.wordFile)}`);
        //     res.body.pipe(dest);
        //   }).catch(err => console.error(err));
      }
      write(listPath, JSON.stringify(out));
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = exports = DownloadPDFA;
