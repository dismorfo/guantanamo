const _ = require('underscore');

const { appDir, get, read } = require('hephaestus');

const documentsPath = `${appDir()}/app/localsource/articles/theme-tags-slug.json`;

const data = read.json(documentsPath);

const x = [];

for (const keyword of Object.keys(data)) {
  x.push({
    count: data[keyword].length,
    label: data[keyword][0].label,
    path: `/themes/${data[keyword][0].slug}`,
  });
}

const sorted = _.sortBy(x, 'count');

module.exports = {
  id: 'BrowseByTheme',
  title: 'Browse by Theme',
  data: sorted.slice(sorted.length - 20, sorted.length),
};
