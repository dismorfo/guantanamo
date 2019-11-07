const {
  get,
  Components
} = require('hephaestus');

const components = new Components();

module.exports = exports = {
  appName: 'Guantánamo: Stories From the Prison Outside the Law',
  branding: `Guantánamo: Stories From the Prison Outside the Law`,
  description: `This site collects the narratives of lawyers who represented detainees at the Guantanamo Bay Detention Center.
                The documents were collected by Mark Denbeaux of Seton Hall Law School and Jonathan Hafetz of the ACLU as sources
                for their book, The Guantanamo Lawyers, published by NYU Press.`,
  shortName: 'guantanamo',
  appUrl: get('APP_URL'),
  components: components.use([
    'Archive',
    'BrowseByTheme',
    'keyword',
    'TheBlog',
    'TheBook'
  ]),
  author: 'New York University',
  keywords: [
    'guantanamo',
    'lawyers', 
    'detainees', 
    'Jonathan Hafetz', 
    'Mark Denbeaux', 
    'habeas corpus'
  ],
  version: '0.0.1',
  hephaestus: '2.0.0'
};
