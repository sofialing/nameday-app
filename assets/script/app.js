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
		const html = `<option value="${country.code}-${country.name}">${country.name}</option>`;
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
	const country = res['country name'];

	renderNameSearch({ name, nameList, date, country });
};

// Render results of search by specific name
const renderNameSearch = ({ name, nameList, date, country }) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<h2 class="font-weight-bold">${name}</h2>
				<p>${date} (${country})</p>
				<p class="text-muted">
					More on this day: 
					${nameList.length ? nameList : 'no more this day.'}
				</p>
			</div>
		</div>`;
	resultEl.innerHTML = html;
};

// Render results of search by specific date
const renderDateSearch = (res, country) => {
	// Format date of the name day
	const date = moment()
		.month(res.data[0].dates.month - 1)
		.date(res.data[0].dates.day)
		.format('dddd, MMMM Do');

	const html = `
		<div class="card">
			<div class="card-body text-center">
				<h2 class="font-weight-bold">${date}</h2>
				<p>${res.data[0].namedays[country.slice(0, 2)]}</p>
				<p>(${country.slice(3)})</p>
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

	//Get data and handle results
	searchByName(name, country)
		.then(res => handleNameResult(res, name))
		.catch(renderError);
});

// Search by specific date when form is being submitted
dateSearch.addEventListener('submit', e => {
	e.preventDefault();

	// Get date from input field and extract month and day
	const inputDate = dateSearch.date.value;
	const month = moment(inputDate).month() + 1;
	const day = moment(inputDate).date();

	// Get selected country and country code
	const country = document.querySelector('#country').value;
	const countryCode = country.slice(0, 2);

	// Get data and handle results
	searchByDate(month, day, countryCode)
		.then(res => renderDateSearch(res, country))
		.catch(renderError);
});

// Render country list when page is being loaded
renderCountryList();
