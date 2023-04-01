import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const BASE_URL = 'https://restcountries.com/v2/name/';
const searchBox = document.getElementById('search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function fetchCountries(name) {
  return fetch(
    `${BASE_URL}${name}?fields=name; capital; population; flags.svg; languages`
  ).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status);
    }
    return responce.json();
  });
}

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const searchQuery = event.target.value.trim();
  if (searchQuery === '') {
    clearResults();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      clearResults();
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length >= 2 && countries <= 10) {
        renderCauntryList(countries);
        return;
      }

      if (countries.length === 1) {
        renderCauntryInfo(countries[0]);
        return;
      }

      Notiflix.Notify.failure('Oops, something went wrong.');
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Country not found.');
        clearResults();
      } else {
        Notiflix.Notify.failure('Oops, something went wrong.');
        clearResults();
      }
    });
}

function renderCauntryList(countries) {
  const markup = countries
    .map(
      country => `
    <li class="country-list__item">
        <img class="country-list__flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}">
        <p class="country-list__name">${country.name.official}</p>
    </li>    
    `
    )
    .join('');
  countriesList.insertAdjacentElement('beforeend', markup);
}
