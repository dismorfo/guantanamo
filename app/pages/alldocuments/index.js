const {
  copyFile
} = require('fs');

const {
  appBuildDir, 
  appDir, 
  exists, 
  mkdir, 
  log
} = require('hephaestus');

if (!exists(`${appBuildDir()}/alldocuments`)) {
  mkdir(`${appBuildDir()}/alldocuments`, () => {
    copyFile(`${appDir()}/app/localsource/articles/articles.json`, `${appBuildDir()}/alldocuments/articles.json`, (err) => {
      if (err) throw err;
      log(`${appDir()}/app/localsource/articles/articles.json was copied to ${appBuildDir()}/alldocuments/articles.json`, 'ok');
    });
  });
}

module.exports = {
  id: 'alldocuments',
  title: 'Browse the archive',
  route: '/alldocuments/index.html',
  content: {
    main: {
      title: 'Full Document List'
    }
  },
  assets: {
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      'https://unpkg.com/bootstrap-vue@2.0.4/dist/bootstrap-vue.min.js',
      'https://polyfill.io/v3/polyfill.min.js?features=es2015%2CIntersectionObserver',
      'ui.js'
    ]
  }
};
