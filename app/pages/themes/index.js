const {
  appDir,
  Page,
  read
} = require('hephaestus');

class Themes extends Page {
  init() {
    const datasource = read.json(`${appDir()}/app/localsource/articles/theme-tags-slug.json`);
    const tags = [];
    for (const key of Object.keys(datasource)) {
      const tag = datasource[key][0];
      tags.push({
        slug: tag.slug,
        label: tag.label,
      });
    }    
    this.render({
      id: 'themes',
      route: `/themes/index.html`,
      title: 'Tags in Theme Tags',
      tags: tags,
    });
  }
}

module.exports = Themes;
