/*
 * Name day search
 */
const searchName = document.querySelector('#search-name');
const searchDate = document.querySelector('#search-date');
const searchToday = document.querySelector('#search-today');
const searchResult = document.querySelector('#search-result');

// Render a list of availabe countries
const renderCountryList = async () => {
	// Get list of supported countries
	const countryList = await fetchData('../assets/script/countrylist.json');

	// Append countries as options to select element
	const html = countryList
		.map(country => {
			return `<option value="${country.code}-${country.time}">${country.name}</option>`;
		})
		.join('');

	document.querySelectorAll('select').forEach(el => (el.innerHTML = html));
};

// Handle error messages and render to page
const renderError = message => {
	searchResult.innerHTML = `<div class="alert alert-warning" role="alert">${message}</div>`;
};

// Handle results for name search: format and set variables
const handleNameResult = (res, search) => {
	// Check if search got no results & render message
	if (!res.results.length) {
		renderError(`No results for the name "${search}" in selected country.`);
		return;
	}

	// Check if searched name has an exact match in results
	const name = res.results[0].name
		.split(/[ ,]+/) // Reg ex to fix issue with .split(', ') not working on some countires
		.filter(name => name.toLowerCase() === search.toLowerCase())
		.toString();

	// Render error message if searched name don't have an match
	if (!name.length) {
		renderError(`No results for the name "${search}" in selected country.`);
		return;
	}

	// Remove searched name from string of names
	const namelist = res.results[0].name
		.split(/[ ,]+/) // Reg ex to fix issue with .split(', ') not working on some countires
		.filter(name => name.toLowerCase() !== search.toLowerCase())
		.join(', ');

	// Format date of the name day
	const date = moment()
		.month(res.results[0].month - 1)
		.date(res.results[0].day)
		.format('dddd, MMMM Do');

	// Get country name
	const country = res['country code'];

	renderNameSearch(name, namelist, date, country);
};

// Handle results for date search: format and set variables
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

	// Format names as a list item
	const namelist = res.data[0].namedays[country]
		.split(', ')
		.map(name => `<li>${name}</li>`)
		.join('');

	renderDateSearch(date, namelist, country);
};

// Render results of search by specific name
const renderNameSearch = (name, namelist, date, country) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<img src="/assets/img/${country}.svg" class="flag-icon">
				<h2 class="font-weight-bold">${name}</h2>
				<p class="date">${date}</p>
				<p class="text-muted mb-0">
					More on this day: 
					<span class="name-list">${namelist.length ? namelist : 'no one'}</span>
				</p>
			</div>
		</div>`;
	searchResult.innerHTML = html;
};

// Render results of search by specific date
const renderDateSearch = (date, namelist, country) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<img src="/assets/img/${country}.svg" class="flag-icon">
				<h2 class="font-weight-bold">${date}</h2>
				<ul class="name-list">${namelist}</ul>
			</div>
		</div>`;
	searchResult.innerHTML = html;
};

// Search by specific name when form is being submitted
searchName.addEventListener('submit', async e => {
	e.preventDefault();

	// Get name from input field
	const name = searchName.name.value.trim();

	// Get country code of selected country
	const country = document.querySelector('#search-country').value.slice(0, 2);

	// Get data and handle results
	searchByName(name, country)
		.then(res => handleNameResult(res, name))
		.catch(renderError);
});

// Search by specific date when form is being submitted
searchDate.addEventListener('submit', e => {
	e.preventDefault();

	// Get date from input field and extract month and day
	const inputDate = searchDate.date.value;
	const month = moment(inputDate).month() + 1;
	const day = moment(inputDate).date();

	// Get selected country and country code
	const country = document.querySelector('#search-country').value.slice(0, 2);

	// Get data and handle results
	searchByDate(month, day, country)
		.then(res => handleDateSearch(res, country))
		.catch(renderError);
});

// Search for today's naming day when a country is selected
searchToday.addEventListener('change', () => {
	const country = searchToday.value.slice(0, 2);
	const timeZone = searchToday.value.slice(3);

	// Get data and handle results
	searchByToday(country, timeZone)
		.then(res => handleDateSearch(res, country))
		.catch(renderError);
});

// Render country list when page is being loaded
renderCountryList();

// Render todays name day when page is being loaded
searchByToday()
	.then(res => handleDateSearch(res, 'at'))
	.catch(renderError);
