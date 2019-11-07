const {
  appDir,
  Page,
  read
} = require('hephaestus');

class Keywords extends Page {
  init() {
    const datasource = read.json(`${appDir()}/app/localsource/articles/general-tags-slug.json`);
    const tags = [];
    for (const key of Object.keys(datasource)) {
      const tag = datasource[key][0];
      tags.push({
        slug: tag.slug,
        label: tag.label,
      });
    }
    this.render({
      id: 'keywords',
      route: `/keywords/index.html`,
      title: 'Keywords',
      tags: tags,
    });
  }
}

module.exports = Keywords;
