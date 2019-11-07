
const _ = require('underscore');

const { appDir, get, read } = require('hephaestus');

const documentsPath = `${appDir()}/app/localsource/articles/general-tags-slug.json`;

const data = read.json(documentsPath);

const x = [];

for (const keyword of Object.keys(data)) {
  x.push({
    count: data[keyword].length,
    label: data[keyword][0].label,
    path: `/keywords/${data[keyword][0].slug}`,
  });
}

const sorted = _.sortBy(x, 'count');

module.exports = {
  id: 'Keyword',
  title: 'Browse by Keyword',
  data: sorted.slice(sorted.length - 20, sorted.length),
};
