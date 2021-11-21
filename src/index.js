import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCounties } from './fetchCountries'
import debounce from 'lodash.debounce'


const DEBOUNCE_DELAY = 300;
const formEl = document.querySelector('#search-box')
const countryListEl = document.querySelector('.country-list')
const countryInfoEl = document.querySelector('.country-info')

formEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY))



function searchCountry() {
    countryListEl.innerHTML = ''
    countryInfoEl.innerHTML = ''
    const valueOfSearch = formEl.value.trim()
    if (!valueOfSearch) {
        return
    }
    fetchCounties(valueOfSearch)
        .then(response => {
            if (!response.ok) {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            }
            return response.json()
        })
        .then(countries => {
            if (countries.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                return
            }
            if (countries.length === 1) {
                return markupCountry(countries)
                // console.log('zdelay razmetku stranu')
            } else {
                return markupCountriesList(countries)
                // console.log('zdelay razmetku mnogo stran')

            }
        }).catch(console.log)
}


function markupCountry(country) {
    const { flags, name, capital, languages, population } = country[0]
    const lang = Object.values(languages).join(', ')
    return countryInfoEl.innerHTML =
        `<h1><img class="country-info__img" src="${flags.svg}" alt="${name.common} width="30" height="30"">${name.common}<h1>
        <ul class="country-info__list">
        <li class="country-info__item">Capital:<span class="country-info__value">${capital}</span></li>
        <li class="country-info__item">Population:<span class="country-info__value">${population}</span></li>
        <li class="country-info__item">Languages:<span class="country-info__value">${lang}</span></li>
        </ul>`
}

function markupCountriesList(countries) {
    countryListEl.innerHTML = countries.map(({ name, flags }) => `<li class="country-list__item">
    <img src="${flags.svg}" alt="${name.common} width="60px" height="40px">
    <span class="country-list__name">${name.common}<span>
    </li>`).join('');
}