const BASE_URL = 'https://restcountries.com/v3.1/name';

export default class CountriesFilterApi {
  constructor() {
    this.searchQuery = '';
  }

  fetchCountries() {
    return fetch(`${BASE_URL}/${this.searchQuery}`).then(response =>
      response.json()
    );
    // .then(({ counries }) => {
    //   //
    //   return counries;
    // });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
//  ................... создать разметку
