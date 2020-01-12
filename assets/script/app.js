/*
 * Name day search
 */
const nameSearch = document.querySelector('#name-search');
const dateSearch = document.querySelector('#date-search');
const resultEl = document.querySelector('#nameday');

// Render a list of availabe countries
const renderCountryList = () => {
	const countryList = [
		{
			name: 'Austria',
			code: 'at',
			timeZone: 'Europe/Vienna'
		},
		{
			name: 'Czechia',
			code: 'cz',
			timeZone: 'Europe/Prague'
		},
		{
			name: 'Germany',
			code: 'de',
			timeZone: 'Europe/Berlin'
		},
		{
			name: 'Denmark',
			code: 'dk',
			timeZone: 'Europe/Copenhagen'
		},
		{
			name: 'Spain',
			code: 'es',
			timeZone: 'Europe/Madrid'
		},
		{
			name: 'Finland',
			code: 'fi',
			timeZone: 'Europe/Helsinki'
		},
		{
			name: 'France',
			code: 'fr',
			timeZone: 'Europe/Paris'
		},
		{
			name: 'Croatia',
			code: 'hr',
			timeZone: 'Europe/Zagreb'
		},
		{
			name: 'Hungary',
			code: 'hu',
			timeZone: 'Europe/Budapest'
		},
		{
			name: 'Italy',
			code: 'it',
			timeZone: 'Europe/Rome'
		},
		{
			name: 'Poland',
			code: 'pl',
			timeZone: 'Europe/Warsaw'
		},
		{
			name: 'Sweden',
			code: 'se',
			timeZone: 'Europe/Stockholm'
		},
		{
			name: 'Slovakia',
			code: 'sk',
			timeZone: 'Europe/Bratislava'
		},
		{
			name: 'United States of America',
			code: 'us',
			timeZone: 'America/Toronto'
		}
	];

	// Append countries as options to select element
	countryList.forEach(country => {
		const html = `<option value="${country.code}-${country.timeZone}">${country.name}</option>`;
		document.querySelector('#country').innerHTML += html;
	});
};

// Handle error messages and render to page
const renderError = message => {
	resultEl.innerHTML = `<div class="alert alert-warning" role="alert">${message}</div>`;
};

// Handle search results for name search, format and set variables
const handleNameResult = (res, search) => {
	// Check if search got no results & render message
	if (!res.results.length) {
		renderError('No name day found.');
		return;
	}

	// Remove searched name from string of names (if multiple names)
	const nameList = res.results[0].name
		.split(', ')
		.filter(name => name.toLowerCase() !== search.toLowerCase())
		.join(', ');
	const name = res.results[0].name
		.split(', ')
		.filter(name => name.toLowerCase() === search.toLowerCase());

	// Format date of the name day
	const date = moment()
		.month(res.results[0].month - 1)
		.date(res.results[0].day)
		.format('dddd, MMMM Do');

	// Get country name
	const country = res['country code'];

	renderNameSearch(name, nameList, date, country);
};

const handleDateSearch = (res, country) => {
	// Check if search got no results & render message
	if (!res.data.length) {
		renderError('No name day found on this day.');
		return;
	}
	// Format date of the name day
	const date = moment()
		.month(res.data[0].dates.month - 1)
		.date(res.data[0].dates.day)
		.format('dddd, MMMM Do');

	// Format names as a list
	const nameList = res.data[0].namedays[country]
		.split(', ')
		.map(name => `<li>${name}</li>`)
		.join('');

	renderDateSearch(date, nameList, country);
};

// Render results of search by specific name
const renderNameSearch = (name, nameList, date, country) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<img src="/assets/img/${country}.svg" class="flag-icon">
				<h2 class="font-weight-bold">${name}</h2>
				<p class="date">${date}</p>
				<p class="text-muted mb-0">
					More on this day: 
					<span class="name-list">${nameList.length ? nameList : 'no one'}</span>
				</p>
			</div>
		</div>`;
	resultEl.innerHTML = html;
};

// Render results of search by specific date
const renderDateSearch = (date, nameList, country) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<img src="/assets/img/${country}.svg" class="flag-icon">
				<h2 class="font-weight-bold">${date}</h2>
				<ul class="name-list">${nameList}</ul>
			</div>
		</div>`;
	resultEl.innerHTML = html;
};

// Search by specific name when form is being submitted
nameSearch.addEventListener('submit', async e => {
	e.preventDefault();

	// Get name from input field
	const name = nameSearch.name.value.trim();

	// Get country code of selected country
	const country = document.querySelector('#country').value.slice(0, 2);

	// Get data and handle results
	searchByName(name, country)
		.then(res => handleNameResult(res, name))
		.catch(renderError);

	// Reset input field
	nameSearch.reset();
});

// Search by specific date when form is being submitted
dateSearch.addEventListener('submit', e => {
	e.preventDefault();

	// Get date from input field and extract month and day
	const inputDate = dateSearch.date.value;
	const month = moment(inputDate).month() + 1;
	const day = moment(inputDate).date();

	// Get selected country and country code
	const country = document.querySelector('#country').value.slice(0, 2);

	// Get data and handle results
	searchByDate(month, day, country)
		.then(res => handleDateSearch(res, country))
		.catch(renderError);

	// Reset input field
	dateSearch.reset();
});

// Render country list when page is being loaded
renderCountryList();
