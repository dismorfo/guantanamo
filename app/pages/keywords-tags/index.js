const {
  appDir,
  Page,
  read
} = require('hephaestus');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

class KeywordsTags extends Page {
  init() {
    const tagsDatasource = read.json(`${appDir()}/app/localsource/articles/general-tags-slug.json`);
    const articlesDatasource = new FileSync(`${appDir()}/app/localsource/articles/articles.json`);
    const dbArticles = low(articlesDatasource);
    for (const key of Object.keys(tagsDatasource)) {
      const tag = tagsDatasource[key];
      const slug = tag[0].slug.trim();
      const label = tag[0].label;
      const nodes = [];
      for (const node of tag) {
        nodes.push(dbArticles.find({ nid: node.nid }).value());
      }
      this.render({
        id: `keywords-${slug}`,
        route: `/keywords/${slug}/index.html`,
        title: `Articles tagged with keyword "${label}"`,
        nodes: nodes,
      });
    }
  }
}

module.exports = KeywordsTags;
