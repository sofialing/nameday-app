/*
 * Name day search
 */
const searchCountry = document.querySelector('#search-country');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
const searchTimezone = document.querySelector('#search-timezone');
const searchType = document.querySelector('#search-type');

// Render alert message to page
const renderAlert = message => {
	searchResult.innerHTML = `<div class="alert alert-warning" role="alert">${message}</div>`;
};

// Render list of supported countries to page
const renderCountryList = async () => {
	// Get list of countries from json and sort array by name
	const countries = await getData('assets/script/countrylist.json');
	countries.sort((a, b) => a.name > b.name);

	// Append countries as options to select element
	const html = countries
		.map(country => `<option value="${country.code}">${country.name}</option>`)
		.join('');

	searchCountry.innerHTML = html;
};

// Render list of supported timezones to page
const renderTimezoneList = async () => {
	// Get list of countries from json and sort array by timezone
	const timezones = await getData('assets/script/countrylist.json');
	timezones.sort((a, b) => a.time > b.time);

	// Append timezones as options to select element
	const html = timezones
		.map(timezone => `<option value="${timezone.time}">${timezone.time}</option>`)
		.join('');

	searchTimezone.innerHTML = html;
};

// Render search results for specific date / day to page
const renderDateSearch = (date, namelist, country) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<img src="assets/img/${country}.svg" class="flag-icon">
				<h2 class="h3 font-weight-bold">${date}</h2>
				<p class="text-muted mb-0">
					Names on this day:
					<span class="name-list">${namelist}</span>
				</p>
			</div>
		</div>`;

	searchResult.innerHTML = html;
};

// Render search results for specific name to page
const renderNameSearch = (name, namedays, country) => {
	const html = namedays.map(day =>
		`<div class="card mb-3">
			<div class="card-body text-center">
				<img src="assets/img/${country}.svg" class="flag-icon">
				<h2 class="h3 font-weight-bold">${name}</h2>
				<p class="date">${day.date}</p>
				<p class="text-muted mb-0">
					Other names on this day:
					<span class="name-list">${day.names.length ? day.names : 'no one'}</span>
				</p>
			</div>
		</div>`);

	searchResult.innerHTML = html.join('');
};

// Format search results for specific date / day
const formatDateOutput = (res, country) => {
	// Format the date of the the name day
	const date = moment()
		.month(res.dates.month - 1)
		.date(res.dates.day)
		.format('MMMM Do');

	// Get list of names
	const namelist = res.namedays[country];

	// Render results to page
	renderDateSearch(date, namelist, country);
};

// Format search results for specific name
const formatNameOutput = (res, searchedName, country) => {
	// Regex to match searched name with results
	const pattern = new RegExp('\\b' + searchedName + '\\b');

	// Filter out all results that match exactly
	const namedays = res
		.filter(day => pattern.exec(day.name))
		.map(day => ({
			date: moment()
				.month(day.month - 1)
				.date(day.day)
				.format('MMMM Do'),
			// Remove searched name from string of names
			names: day.name
				.split(',')
				.map(name => name.trim())
				.filter(name => !pattern.test(name))
				.join(', ')
		}));

	// Render alert message if there was no exact match
	if (!namedays.length) {
		renderAlert(`No results for the name "${searchedName}" in selected country.`);
		return;
	}

	// Render results to page
	renderNameSearch(searchedName, namedays, country);
};

// Get search results for specific date
const searchByDate = async (date, country) => {
	// Format date of the name day
	const month = moment(date).month() + 1;
	const day = moment(date).date();

	// Get data and handle results
	try {
		const res = await getDataByDate(month, day, country);
		if (!res.data.length) {
			renderAlert(`No results for selected day.`);
			return;
		}
		formatDateOutput(res.data[0], country);
	} catch (err) {
		renderAlert(err);
	}
};

// Get search results for today / tomorrow / yesterday
const searchByDay = async (type, country, timezone) => {
	// Get data and handle results
	try {
		const res = await getDataByDay(type, country, timezone);
		if (!res.data.length) {
			renderAlert(`No results for selected day.`);
			return;
		}
		formatDateOutput(res.data[0], country);
	} catch (err) {
		renderAlert(err);
	}
};

// Get search results for specific name
const searchByName = async (name, country) => {
	// Trim input
	name = name.trim();

	// Check if searched name has an valid length
	if (name.length < 3) {
		renderAlert('Name must be at least 3 characters long.')
		return;
	}

	// Convert first letter to uppercase
	name = name[0].toUpperCase() + name.substr(1);

	// Get data and handle results
	try {
		const res = await getDataByName(name, country);
		if (!res.results.length) {
			renderAlert(`No results for the name "${name}" in selected country.`);
			return;
		}
		formatNameOutput(res.results, name, country);
	} catch (err) {
		renderAlert(err);
	}
};

// Update search form based on selected search type
const updateForm = (type, placeholder, disabled = false) => {
	searchInput.type = type;
	searchInput.placeholder = placeholder;
	searchInput.disabled = disabled;
	searchInput.value = '';

	// Show/hide list of timezones
	if (disabled) {
		document.querySelector('#timezones').className = 'col-12';
	} else {
		document.querySelector('#timezones').className = 'col-12 d-none';
	}
};

// Handle when user interacts with the search type element
searchType.addEventListener('change', () => {
	// Get search type (name, date or day)
	const type = searchType.value;

	// Update input field based on type
	switch (type) {
		case 'date':
			updateForm('date', 'Enter a date...');
			break;
		case 'name':
			updateForm('text', 'Enter a name...');
			break;
		default:
			updateForm('text', `Search for name day ${type}`, true);
			break;
	}
});

// Handle when user submits the search form
searchForm.addEventListener('submit', e => {
	e.preventDefault();

	// Get search input
	const country = searchCountry.value;
	const timezone = searchTimezone.value;
	const input = searchInput.value;
	const type = searchType.value;

	// Search based on input
	switch (type) {
		case 'date':
			searchByDate(input, country);
			break;
		case 'name':
			searchByName(input, country);
			break;
		default:
			searchByDay(type, country, timezone);
			break;
	}
});

// Render countries & timezones when page is being loaded
renderCountryList();
renderTimezoneList();
searchForm.reset();