/*
 *
 *
 */

const nameSearch = document.querySelector('#name-search');
const dateSearch = document.querySelector('#date-search');

// Render a list of availabe countries
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

	// Append countries as options to select element
	countryList.forEach(country => {
		document.querySelector(
			'#country'
		).innerHTML += `<option value="${country.code}-${country.name}">${country.name}</option>`;
	});
};

// Handle error messages and render to page
const handleError = message => {
	const html = `<div class="alert alert-warning" role="alert">${message}</div>`
	document.querySelector('#nameday').innerHTML = html;
};

// Handle search results for name search, set variables
const handleNameResult = (res, search) => {
	if (!res.results.length) {
		handleError('No name day found.');
		return;
	}

	const name = res.results[0].name.split(', ').filter(name => name.toLowerCase() === search.toLowerCase());
	const nameList = res.results[0].name.split(', ').filter(name => name.toLowerCase() !== search.toLowerCase());
	const date = moment().month(res.results[0].month - 1).date(res.results[0].day).format('dddd, MMMM Do');
	const country = res['country name'];

	renderNameSearch({ name, nameList, date, country });
};

// Render results of search by specific name
const renderNameSearch = ({ name, nameList, date, country }) => {
	nameList = nameList.length ? nameList.join(', ') : 'no other names.'

	const html = `
		<div class="card">
			<div class="card-body text-center">
				<h2 class="font-weight-bold">${name}</h2>
				<p>${date} (${country})</p>
				<p class="text-muted">More on this day: ${nameList}</p>
			</div>
		</div>`
	document.querySelector('#nameday').innerHTML = html;
}

// Render results of search by specific date
const renderDateSearch = (res, country) => {
	const date = moment().month(res.data[0].dates.month - 1).date(res.data[0].dates.day).format('dddd, MMMM Do');
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<h2 class="font-weight-bold">${date}</h2>
				<p>${res.data[0].namedays[country.slice(0, 2)]}</p>
				<p>(${country.slice(3)})</p>
			</div>
		</div>`
	document.querySelector('#nameday').innerHTML = html;
}

// Search by specific name when form is being submitted
nameSearch.addEventListener('submit', e => {
	e.preventDefault();
	const name = nameSearch.name.value.trim();
	const country = document.querySelector('#country').value.slice(0, 2);

	searchByName(name, country)
		.then(res => handleNameResult(res, name))
		.catch(handleError);
});

// Search by specific date when form is being submitted
dateSearch.addEventListener('submit', e => {
	e.preventDefault();
	const inputDate = dateSearch.date.value.trim();
	const month = moment(inputDate).month() + 1;
	const day = moment(inputDate).date();
	const country = document.querySelector('#country').value;
	const countryCode = country.slice(0, 2);

	searchByDate(month, day, countryCode)
		.then(res => renderDateSearch(res, country))
		.catch(handleError);
});

// Render country list when page is being loaded
renderCountryList();
