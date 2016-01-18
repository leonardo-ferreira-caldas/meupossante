Vue.filter('filter_km', function (value) {
    return value.toString().length > 6 ? value.toString().substring(0, 6) : value;
});

Vue.filter('filter_descricao', function (value) {
    return value.toString().length > 55 ? (value.toString().substring(0, 55) + "...") : value;
});

Vue.directive('easyloading', {
    bind: function () {
        this.el.onload = function() {
            this.parentNode.className = this.parentNode.className + " loaded";
        };
    }
});

new Vue({
    el: '#app',
    data: {
        search: {
            query: '',
            autocomplete: [],
            autocompleteSelected: 0,
            loading: false,
            hasSearchedAtLeastOnce: false,
            results: {
                vehicles: [],
                totalVehiclesLength: 0,
                currentPage: 1,
                totalPages: 1,
            },
            params: {
                page: 1
            }
        },
        filters: {
            cambio: [],
            carroceria: [],
            cor: [],
            opcional: [],
            documentacao: []
        },
        algolia: null
    },
    ready: function() {
        var client = algoliasearch("7BIVCWV1UN", "7d0b4b697a90cc3f7a1e2b9ae5fa13e8"); // public credentials
        this.algolia = client.initIndex('carros');
        this.$els.searchInput.focus();
        $(".use-select2").select2();
        this.loadFilters();
    },
    methods: {
        cleanSearch: function() {
            this.search.query = '';
            this.search.autocomplete = [];
            this.search.autocompleteSelected = 0;
        },
        autocompleteSelect: function(value) {
            this.search.query = value;
            this.search.autocomplete = [];
            this.search.autocompleteSelected = 0;
        },
        searchEnter: function() {
          if (this.search.autocomplete.length) {

              this.search.query = this.search.autocomplete[this.search.autocompleteSelected].descricao;
              this.search.hasSearchedAtLeastOnce = true;
              this.search.autocomplete = [];
              this.search.autocompleteSelected = 0;

              setTimeout(function() {
                  this.$els.searchTop.focus();
              }.bind(this), 50);

              this.buscar();

          }
        },
        buscar: function() {
            this.search.loading = true;

            this.$http.get('/buscar', {'page': this.search.params.page}).then(function (response) {
                this.search.loading = false;
                this.search.results.vehicles = response.data.vehicles;
                this.search.results.currentPage = response.data.current_page;
                this.search.results.totalPages = response.data.total_pages;
                this.search.results.totalVehiclesLength = response.data.total_vehicles_length;
                $("body, html").animate({scrollTop: 0}, 500);
            });
        },
        changePage: function(page) {
            if (page == this.search.results.currentPage) {
                return;
            }
            this.search.params.page = page;
            this.buscar();
        },
        nextPage: function() {
            var nextpage = this.search.results.currentPage + 1;
            if (nextpage <= this.search.results.totalPages) {
                this.changePage(nextpage);
            }
        },
        prevPage: function() {
            if (this.search.results.currentPage > 1) {
                this.changePage(this.search.results.currentPage - 1);
            }
        },
        searchSelectNext: function() {
            if (this.search.autocompleteSelected < (this.search.autocomplete.length - 1)) {
                this.search.autocompleteSelected++;
            }
        },
        searchSelectPrev: function() {
            if (this.search.autocompleteSelected > 0) {
                this.search.autocompleteSelected--;
            }
        },
        searchRequest: function(event) {

            if ([40, 38, 13].indexOf(event.keyCode) !== -1) {
                return;
            } else if (!this.search.query) {
                this.search.autocomplete = [];
                this.search.autocompleteSelected = 0;
                return;
            }

            this.algolia.search(this.search.query, {hitsPerPage: 5}, function(err, content) {
                if (err) {
                    return err;
                }

                this.search.autocomplete = content.hits;
            }.bind(this));

        },
        loadFilters: function() {
            this.$http.get('/filtros', function(response) {
                this.filters = response;
            });
        }
    }
});