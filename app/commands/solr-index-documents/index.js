'use strict';

const SolrIndexdDocuments = class {
  get command () {
    return 'solr-index-documents';
  }
  get alias () {
    return false;
  }
  get description () {
    return 'Index Solr documents';
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
    const { appDir, get, readdirSync, exists, exit, log, read } = require('hephaestus');
    const { join } = require('path');
    const { URL } = require('url');
    const _ = require('underscore');
    const SolrNode = require('solr-node');
    try {
      const discoveryUrl = new URL(get('BEARD_DISCOVERY'));
      const discoveryHost = discoveryUrl.hostname;
      let discoveryPort = discoveryUrl.port;
      const discoveryProtocol = discoveryUrl.protocol.replace(':', '');
      const discoveryCore = 'beard';
      const discoveryRootPath = 'solr';
      const documentsPathEnv = get('BEARD_SOLR_DOCUMENTS_PATH');
      const documentsPath = (documentsPathEnv) ? documentsPathEnv : join(appDir(), 'app/localsource/solr-index-documents');
      if (discoveryProtocol === 'https') {
        discoveryPort = '443';
      }
      else {
        discoveryPort = '8983';
      }
      if (exists(documentsPath)) {
        const documents = readdirSync(documentsPath);

        const client = new SolrNode({
          host: (discoveryHost) ? discoveryHost : 'solr.local',
          port: '8983',
          core: (discoveryCore) ? discoveryCore : 'solr/beard',
          protocol: (discoveryProtocol) ? discoveryProtocol : 'http',
        });

        console.log(client)

        _.each(documents, document => {
          const doc = read.json(join(documentsPath, document));
          if (doc) {
            client.update({
              id: doc.id,
              url: doc.url,
              label: doc.label,
              hash: doc.hash,
              content: doc.content,
              ts_bio: doc.description,
              sort_name:
              doc.label
            }, (error, result) => {
              if (error) {
                log(error, 'error');
              }
              else {
                //log('Response:', result.responseHeader, 'error');
                console.log(result);
              }
            });
          }
        });
      }
    }
    catch (e) {
      log(e, 'error');
      exit(e);
    }
  }
};

module.exports = exports = SolrIndexdDocuments;