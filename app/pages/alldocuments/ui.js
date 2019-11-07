new Vue({
  el: '#app',
  data: function () {
    return {
      currentPage: 1,
      perPage: 10,
      totalRows: 1,
      filter: null,
      isBusy: true,
      sortBy: 'title',
      fields: [
        { 
          key: 'title',
          label: 'Article',
          sortable: true,
        },
        { 
          key: 'lastName',
          label: 'Author (Last)',
          sortable: true,
        },        
        { 
          key: 'firstName',
          label: 'Author (First)',
          sortable: true,
        },
        { 
          key: 'pdfa',
          label: 'PDF',
        },
      ],
      items: []
    }
  },
  mounted: function () {
    this.fetchDocuments();
  },
  computed: {
    hasDocuments: function() {
      return this.items.length > 0;
    }
  },
  methods: {
    fetchDocuments: function () {
      const vm = this;
      fetch(`/alldocuments/articles.json`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        vm.items = data;
        vm.totalRows = vm.items.length;
      })
      .finally(() => {
        this.isBusy = false;
      })
      .catch((error) => {
        console.log('Looks like there was a problem: \n', error);
      });
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
});
