import './css/styles.css';
import CountriesFilterApi from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const countriesFilterApi = new CountriesFilterApi();
const refs = {
  searchInput: document.querySelector('#search-box'),
  listBox: document.querySelector('.country-list'),
};

refs.searchInput.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(e) {
  const inputValue = e.target.value.trim();
  clearInputField(inputValue);

  countriesFilterApi.query = inputValue;
  countriesFilterApi
    .fetchCountries()
    .then(byConditionMarkup)
    .catch(onFetchError);
}

function onFetchError() {
  const message = 'Oops, there is no country with that name';
  Notiflix.Notify.failure(message);
}

function clearInputField(value) {
  if (value === '') {
    refs.listBox.innerHTML = '';
    return;
  }
}

function byConditionMarkup(data) {
  if (data.length > 10) {
    return tooManyMatchesFound();
  }

  if (data.length > 1) {
    return createCountriesListMarkup(data);
  }

  return data.map(createCountriMarkup);
}

function tooManyMatchesFound() {
  const message = 'Too many matches found. Please enter a more specific name.';
  Notiflix.Notify.info(message);
}

function createCountriesListMarkup(countries) {
  let counriesMarkup = ``;
  countries.map(countri => {
    const markup = `
           <li>
              <p>
                <img src='${countri.flags.svg}' alt='' width='25' />
                ${countri.name.official}
              </p>
           </li>`;

    counriesMarkup += markup;
  });

  refs.listBox.innerHTML = counriesMarkup;
}

function createCountriMarkup(countri) {
  let languagesMarkup = ``;
  let comma = '';
  const numberOfLanguages = Object.values(countri.languages).length;

  if (numberOfLanguages > 1) {
    comma += ', ';
  }

  for (const language in countri.languages) {
    const murkup = `<span> ${countri.languages[language]}${comma}</span>`;
    languagesMarkup += murkup;
  }

  if (numberOfLanguages > 1) {
    const startMarkup = languagesMarkup.slice(0, languagesMarkup.length - 9);
    const endMarkup = languagesMarkup.slice(
      languagesMarkup.length - 7,
      languagesMarkup.length
    );

    languagesMarkup = startMarkup + endMarkup;
  }

  const murkup = `
      <li>
        <h2>
         <img src='${countri.flags.svg}' alt='' width='45' />
         ${countri.name.official}
        </h2>
        <p><span class='text_key'>Capital:</span> ${countri.capital}</p>
        <p><span class='text_key'>Population:</span> ${countri.population}</p>
        <p><span class='text_key'>Languages:</span> ${languagesMarkup}</p>
       </li>
      `;

  refs.listBox.innerHTML = murkup;
}
