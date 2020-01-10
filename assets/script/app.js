/*
 *
 *
 */

const nameSearch = document.querySelector('#name-search');
const dateSearch = document.querySelector('#date-search');

const renderCountryList = () => {
	const countryList = [
		{
			name: 'Austria',
			code: 'at'
		},
		{
			name: 'Czechia',
			code: 'cz'
		},
		{
			name: 'Germany',
			code: 'de'
		},
		{
			name: 'Denmark',
			code: 'dk'
		},
		{
			name: 'Spain',
			code: 'es'
		},
		{
			name: 'Finland',
			code: 'fi'
		},
		{
			name: 'France',
			code: 'fr'
		},
		{
			name: 'Croatia',
			code: 'hr'
		},
		{
			name: 'Hungary',
			code: 'hu'
		},
		{
			name: 'Italy',
			code: 'it'
		},
		{
			name: 'Poland',
			code: 'pl'
		},
		{
			name: 'Sweden',
			code: 'se'
		},
		{
			name: 'Slovakia',
			code: 'sk'
		},
		{
			name: 'United States of America',
			code: 'us'
		}
	];

	countryList.forEach(country => {
		nameSearch.country.innerHTML += `<option value="${country.code}">${country.name}</option>`;
	});
};

const handleError = e => {
	console.log(e);
};

const handleResult = res => {
	console.log('got result:', res);
};

nameSearch.addEventListener('submit', e => {
	e.preventDefault();
	const name = nameSearch.name.value.trim();
	const country = nameSearch.country.value;

	searchByName(name, country)
		.then(handleResult)
		.catch(handleError);
});

dateSearch.addEventListener('submit', e => {
	e.preventDefault();
	const date = dateSearch.date.value.trim();
	const month = new Date(date).getMonth() + 1;
	const day = new Date(date).getDate();

	searchByDate(month, day)
		.then(handleResult)
		.catch(handleError);
});

renderCountryList();
