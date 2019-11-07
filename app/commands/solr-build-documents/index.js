'use strict';

const SolrBuildDocuments = class {

  get command () {
    return 'solr-build-documents';
  }

  get alias () {
    return false;
  }

  get description () {
    return 'Build Solr documents';
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
    const { resolve, parse } = require('path');
    const _ = require('underscore');
    const { appDir, appUrl, get, exists, exit, log, mkdir, read, write } = require('hephaestus');
    try {
      const datasource = resolve(appDir(), 'app/localsource/subjects.json');
      if (exists(datasource)) {
        const source = read.json(datasource);
        const documentsPath = resolve(appDir(), 'app/localsource/solr-index-documents');
        const transcriptsDir = resolve(appDir(), 'app/pages/interview/transcripts');
        if (exists(documentsPath)) {
          mkdir(documentsPath);
        }
        _.each(_.sortBy(source.response.docs, 'sort'), async (document) => {
          const id = `${document.name.replace(/ /g, '-').toLowerCase()}`;
          let content = document.bio;
          await document.interviews.map( async (interview) => {
            // transcript where converted to TXT using textutil
            // See: $ textutil -convert txt *.doc*
            const parseFilename = parse(interview.transcript.filename);
            content += read.text(`${transcriptsDir}/${parseFilename.name}.txt`);
          });

          let data = {
            id: id,
            label: document.name,
            identifier: id,
            hash: get('shortName'),
            url: `${appUrl()}/interviews/${id}/index.html`,
            name: document.name,
            description: document.bio,
            sort: document.sort,
            handle: document.handle,
            content: content
          };

          await write(`${documentsPath}/${id}.json`, JSON.stringify(data));

        });

      }
    } catch (error) {
      log(error, error);
      exit(error);
    }
  }
};

module.exports = exports = SolrBuildDocuments;
