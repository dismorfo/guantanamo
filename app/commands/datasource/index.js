'use strict';

const BuildDocuments = class {

  get command () {
    return 'build-documents';
  }

  get alias () {
    return 'bd';
  }

  get description () {
    return 'Build documents';
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

    const mysqlx = require('@mysql/xdevapi');

    const { resolve, parse, basename } = require('path');

    const { appDir, appUrl, get, exists, exit, log, mkdir, read, write } = require('hephaestus');

    try {

      const appUrl = get('appUrl');
      
      const docs = [];

      const documentsPath = `${appDir()}/app/localsource/articles`;

      if (!exists(documentsPath)) {
        mkdir(documentsPath);
      }

      // types: article, book, feed, page, story

      mysqlx.getSession({
        password: get('MYSQL_PASSWORD'),
        user: get('MYSQL_USER'),
        host: get('MYSQL_HOST'),
        port: get('MYSQL_PORT'),
        schema: get('MYSQL_DB')
      })
      .then(session => {
          // article
          session.sql(`
            SELECT 
              r.vid, 
              r.title,
              a.field_last_name_value,
              a.field_first_name_value,
              a.field_middle_initial_value,
              a.field_narrative_name_value,
              a.field_word_file_value,
              a.field_pdfa_file_value,
              a.field_theme_tags_value,
              a.field_general_tags_value,
              a.field_date_value,
              a.field_author_bio_value
            FROM node n 
            LEFT JOIN node_revisions r 
            ON n.nid = r.vid
            LEFT JOIN content_type_article a
            ON n.nid = a.vid
            WHERE n.type = ? 
            AND n.status = ?
        `).bind('article', 1)
          .execute(result => {
            let themeTags = [];
            let generalTags = [];
            let wordFile = '';
            let pdfa = '';
            if (result[8]) {
              themeTags = result[8].split(', ');
            }
            if (result[9]) {
              generalTags = result[9].split(', ');
            }
            if (result[6]) {
              wordFile = `/articles/word/${basename(result[6])}`;
            }
            if (result[7]) {
              pdfa = `/articles/pdf/${basename(result[7])}`;
            }
            const doc = {
              nid: result[0],
              title: result[1],
              lastName: result[2],
              firstName: result[3],
              middleInitial: result[4],
              narrativeName: result[5],
              wordFile: wordFile,
              pdfa: pdfa,
              themeTags: themeTags,
              generalTags: generalTags,
              tags: [...themeTags, ...generalTags],
              date: result[10],
              bio: result[11],
            };
            docs.push(doc);
          }).then(() => {
            write(`${documentsPath}/articles.json`, JSON.stringify(docs));
            session.close();
          })
        })
    } catch (error) {
      log(error, error);
      exit(error);
    }
  }
};

module.exports = exports = BuildDocuments;
