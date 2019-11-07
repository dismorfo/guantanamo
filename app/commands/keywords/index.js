'use strict';

const mysqlx = require('@mysql/xdevapi');

const Keywords = class {

  get command () {
    return 'keywords-tags';
  }

  get alias () {
    return false;
  }

  get description () {
    return 'Build Keywords JSON';
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

    const slug = require('slug');

    const { appDir, get, exists, exit, log, mkdir, write } = require('hephaestus');

    try {

      const appUrl = get('appUrl');
      
      let docs = [];
      
      const x = {};

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
          session.sql(`
            SELECT 
              r.vid, 
              a.field_general_tags_value
            FROM node n 
            LEFT JOIN node_revisions r 
            ON n.nid = r.vid
            LEFT JOIN content_type_article a
            ON n.nid = a.vid
            WHERE n.type = ? 
            AND n.status = ?
        `).bind('article', 1)
          .execute(result => {
            
            let generalTags = [];
            
            if (result[1]) {
              generalTags = result[1].split(', ');
            }

            for (const tag of generalTags) {
              if (tag) {
                const tagSlug = slug(tag).toLowerCase();
                if (!x[tagSlug]) {
                  x[tagSlug] = [];
                }
                x[tagSlug].push({
                  slug: tagSlug,
                  nid: result[0],
                  label: tag,
                });
              }
            }

            docs = [...docs, ...generalTags];

          })
          .then(() => {
            write(`${documentsPath}/general-tags.json`, JSON.stringify(docs.filter(n => n)));
            write(`${documentsPath}/general-tags-slug.json`, JSON.stringify(x));
            session.close();
          })
        })
    } catch (error) {
      log(error, error);
      exit(error);
    }
  }
};

module.exports = exports = Keywords;
