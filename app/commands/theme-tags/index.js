'use strict';

const ThemeTags = class {

  get command () {
    return 'theme-tags';
  }

  get alias () {
    return false;
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
    
    const slug = require('slug');

    const { resolve, parse, basename } = require('path');

    const { appDir, appUrl, get, exists, exit, log, mkdir, read, write } = require('hephaestus');

    try {

      const appUrl = get('appUrl');

      const x = {};

      const documentsPath = `${appDir()}/app/localsource/articles`;

      let docs = [];

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
              a.field_theme_tags_value
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
            
            if (result[1]) {
              themeTags = result[1].split(', ');
            }

            for (const tag of themeTags) {
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

            docs = [...docs, ...themeTags];

          })
          .then(() => {
            write(`${documentsPath}/theme-tags.json`, JSON.stringify(docs.filter(n => n)));
            write(`${documentsPath}/theme-tags-slug.json`, JSON.stringify(x));
            session.close();
          })
        })
    } catch (error) {
      log(error, error);
      exit(error);
    }
  }
};

module.exports = exports = ThemeTags;
