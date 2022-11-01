import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const refs = {
  searchBox: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

const url = 'https://restcountries.com/v3.1/';

function fetchCountries(serch)  {
    return fetch(`${url}/name/${serch}`)
        .then(response => {
            console.log(response.ok)
            if (response.ok) {
                return response.json() 
            }
            throw new Error(response.statusText)
        })
};


function appendCountry({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) {
  const markup = `
        <div class = div>
        <img src="${svg}" alt="flags" width="35" height = "100%">
        <p>${official}</p>
        <p>capital:  ${capital}</p>
        <p>population:  ${population}</p>
        <p>languages:  ${Object.values(languages)}</p>
        </div>
        `;
  refs.info.insertAdjacentHTML('beforeend', markup);
};


function appendCountries(countries) {
    const markup = countries
      .map(
        ({ name: { official }, flags: { svg } }) =>
          `
        <li class = item>
        <img src="${svg}" alt="flags" width="35" height = "100%">
        <p>${official}</p>
        </li>
        `
      )
      .join('');
    refs.list.insertAdjacentHTML('beforeend', markup);
};


refs.searchBox.addEventListener('input', debounce(e => {
    refs.info.innerHTML = '';
    refs.list.innerHTML = '';
  const query = e.target.value.trim();
  if (!query) {
    return
  }
    fetchCountries(query)
      .then(data => {
        if (data.length === 1) appendCountry(data[0]);
        else if (data.length <= 10) appendCountries(data);
        else
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
      })
      .catch(error =>
        Notify.failure('Oops, there is no country with that name')
      );

}, DEBOUNCE_DELAY));




