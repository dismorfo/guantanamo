const {
  appUrl,
  appBuildDir,
  appDir,
  exists,
  get,
  Page,
  read,
  readdirSync,
  mkdir,
} = require('hephaestus');

const { 
  ncp 
} = require('ncp');

class Article extends Page {
  init() {
    const articles = read.json(`${appDir()}/app/localsource/articles/articles.json`);
    for (const content of articles) {
      this.render({
        id: content.nid,
        route: `/node/${content.nid}/index.html`,
        content: content,
      });
    }
    mkdir(`${appBuildDir()}/articles`, () => {
      ncp(`${appDir()}/app/localsource/articles/documents/pdfa`, `${appBuildDir()}/articles/pdf`, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('done!');
      });    
      ncp(`${appDir()}/app/localsource/articles/documents/word`, `${appBuildDir()}/articles/word`, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('done!');
      });
    });
  }
}

module.exports = Article;
