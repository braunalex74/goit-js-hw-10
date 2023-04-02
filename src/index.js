import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchBox = document.querySelector('#search-box');

countriesList.style.visibility = 'hidden';
countryInfo.style.visibility = 'hidden';

searchBox.addEventListener('input', debounce(onSearchBoxInput, DEBOUNCE_DELAY));

function onSearchBoxInput(event) {
  event.preventDefault();

  const searchCountries = event.target.value.trim();

  if (!searchCountries) {
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'hidden';
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchCountries)
    .then(result => {
      if (result.length > 10) {
        Notify.info(
          'Too many matches found. Please, enter a more specific name.'
        );
        return;
      }
      renderedCountries(result);
    })
    .catch(error => {
      countriesList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderedCountries(result) {
  const inputLetters = result.length;

  if (inputLetters === 1) {
    countriesList.innerHTML = '';
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'visible';
    renderCountryInfo(result);
  }

  if (inputLetters > 1 && inputLetters <= 10) {
    countryInfo.innerHTML = '';
    countryInfo.style.visibility = 'hidden';
    countriesList.style.visibility = 'visible';
    renderCountryList(result);
  }
}

function renderCountryList(result) {
  const listMarkup = result
    .map(({ name, flags }) => {
      return /*html*/ `<li>
                        <img src="${flags.svg}" alt="${name}" width="60" height="auto">
                        <span>${name.official}</span>
                </li>`;
    })
    .join('');
  countriesList.innerHTML = listMarkup;
  return listMarkup;
}

function renderCountryInfo(result) {
  const cardMarkup = result
    .map(({ flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return /*html*/ `
            <img src="${flags.svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`;
    })
    .join('');
  countryInfo.innerHTML = cardMarkup;
  return cardMarkup;
}

// const renderCountryList = countries => {
//   countryList.innerHTML = '';
//   if (!countries || countries.length === 0) {
//     countryList.style.display = 'none';
//     return;
//   }
//   const countryElements = countries.map(country => {
//     const countryElement = document.createElement('li');
//     const flagElement = document.createElement('img');
//     const nameElement = document.createElement('span');
//     countryElement.classList.add('country-item');
//     flagElement.classList.add('flag');
//     if (country.flags && country.flags.svg) {
//       flagElement.src = country.flags.svg;
//     } else {
//       flagElement.src = 'path/to/default/image';
//     }
//     flagElement.alt = `${country.name.official} flag`;
//     nameElement.textContent = country.name.official;
//     countryElement.appendChild(flagElement);
//     countryElement.appendChild(nameElement);
//     return countryElement;
//   });
//   const validCountryElements = countryElements.filter(el => el !== null);
//   if (validCountryElements.length === 0) {
//     countryList.style.display = 'none';
//     return;
//   }
//   countryList.append(...validCountryElements);
//   countryList.style.display = 'block';
// };

// const renderCountryInfo = country => {
//   countryInfo.innerHTML = '';
//   if (!country) {
//     countryInfo.style.display = 'none';
//     return;
//   }
//   const flagElement = document.createElement('img');
//   const nameElement = document.createElement('h2');
//   const capitalElement = document.createElement('p');
//   const populationElement = document.createElement('p');
//   const languagesElement = document.createElement('ul');
//   flagElement.classList.add('flag');
//   flagElement.addEventListener('error', () => {
//     console.log(`Failed to load flag for ${country.name.common}`);
//   });
//   if (country.flags && country.flags.svg) {
//     flagElement.src = country.flags.svg;
//   } else {
//     flagElement.src = 'path/to/default/image';
//   }
//   flagElement.alt = `${country.name.official} flag`;
//   nameElement.textContent = country.name.official;
//   capitalElement.textContent = `Capital: ${country.capital || '-'}`;
//   populationElement.textContent = `Population: ${country.population || '-'}`;
//   const languages = country.languages
//     ? country.languages
//         .map(language => {
//           return `<li>${lang.name}</li>`;
//         })
//         .join('')
//     : '';
//   languagesElement.innerHTML = `Languages: ${languages}`;
//   countryInfo.appendChild(flagElement);
//   countryInfo.appendChild(nameElement);
//   countryInfo.appendChild(capitalElement);
//   countryInfo.appendChild(populationElement);
//   countryInfo.appendChild(languagesElement);
//   countryInfo.style.display = 'block';
// };

// const onSearchBoxInput = debounce(async event => {
//   const query = event.target.value.trim();
//   if (!query) {
//     countryList.style.display = 'none';
//     countryInfo.style.display = 'none';
//     return;
//   }
//   try {
//     const countries = await fetchCountries(query);
//     if (countries.length > 10) {
//       Notiflix.Notify.warning(
//         'Too many matches found. Please enter a more specific name.'
//       );
//       return;
//     }
//     renderCountryList(countries);
//     if (countries.length === 1) {
//       renderCountryInfo(countries[0]);
//     } else {
//       renderCountryInfo(null);
//     }
//   } catch (error) {
//     console.log(error);
//     Notiflix.Notify.failure(
//       'Oops, something went wrong. Please try again later.'
//     );
//   }
// }, DEBOUNCE_DELAY);

// searchBox.addEventListener('input', onSearchBoxInput);
