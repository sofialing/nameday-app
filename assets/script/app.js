/*
 * Name day search
 */
const searchForm = document.querySelector('#search-form');
const searchCountry = document.querySelector('#search-country');
const searchInput = document.querySelector('#search-input');
const searchType = document.querySelector('#search-type');
const searchResult = document.querySelector('#search-result');

// Render alert message to page
const renderAlert = message => {
	searchResult.innerHTML = `<div class="alert alert-warning" role="alert">${message}</div>`;
};

// Render list of supported countries to page
const renderCountryList = async () => {
	// Get data from json
	const countries = await getData('assets/script/countrylist.json');

	// Append countries as options to select element
	const html = countries
		.map(c => `<option value="${c.code}-${c.time}">${c.name}</option>`)
		.join('');

	searchCountry.innerHTML = html;
};

// Render search results for specific date / day to page
const renderDateSearch = (date, namelist, country) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<img src="/assets/img/${country}.svg" class="flag-icon">
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
	const html = namedays.map(
		day =>
			`<div class="card mb-3">
				<div class="card-body text-center">
					<img src="/assets/img/${country}.svg" class="flag-icon">
					<h2 class="h3 font-weight-bold">${name}</h2>
					<p class="date">${day.date}</p>
					<p class="text-muted mb-0">
						Other names on this day:
						<span class="name-list">${day.names.length ? day.names : 'no one'}</span>
					</p>
				</div>
			</div>`
	);
	searchResult.innerHTML = html.join('');
};

// Format search results for specific date / day
const formatDateOutput = (res, country) => {
	// Format the date of the the name day
	const date = moment()
		.month(res[0].dates.month - 1)
		.date(res[0].dates.day)
		.format('MMMM Do');

	// Get list of names
	const namelist = res[0].namedays[country];

	renderDateSearch(date, namelist, country);
};

// Format search results for specific name
const formatNameOutput = (res, search, country) => {
	// RegExp to match searched name with results
	const pattern = new RegExp('\\b' + search + '\\b');

	// Filter out all results that match exactly
	const namedays = res
		.filter(day => pattern.exec(day.name))
		.map(day => ({
			date: moment()
				.month(day.month - 1)
				.date(day.day)
				.format('MMMM Do'),
			// Remove searched name from string
			names: day.name
				.split(',')
				.map(name => name.trim())
				.filter(name => name !== search)
				.join(', ')
		}));

	// Render alert message if there was no match
	if (!namedays.length) {
		renderAlert(`No results for the name "${search}" in selected country.`);
		return;
	}

	renderNameSearch(search, namedays, country);
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
		formatDateOutput(res.data, country);
	} catch (err) {
		renderAlert(err);
	}
};

// Get search results for today / tomorrow / yesterday
const searchByDay = async (type, country, timeZone) => {
	// Get data and handle results
	try {
		const res = await getDataByDay(type, country, timeZone);
		if (!res.data.length) {
			renderAlert(`No results for selected day.`);
			return;
		}
		formatDateOutput(res.data, country);
	} catch (err) {
		renderAlert(err);
	}
};

// Get search results for specific name
const searchByName = async (name, country) => {
	// Trim input and convert first letter to uppercase
	name = name.trim();
	name = name[0].toUpperCase() + name.substr(1);

	// Get data and handle results
	try {
		const res = await getDataByName(name, country);
		if (!res.results.length) {
			renderAlert(
				`No results for the name "${name}" in selected country (${country}).`
			);
			return;
		}
		formatNameOutput(res.results, name, country);
	} catch (err) {
		renderAlert(err);
	}
};

// Update input field based on selected search type
const updateForm = (type, placeholder, disabled = false) => {
	searchInput.type = type;
	searchInput.placeholder = placeholder;
	searchInput.disabled = disabled;
	searchInput.value = '';
};

// Handle when user interacts with the search type element
searchType.addEventListener('change', () => {
	// Get search type
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
	const country = searchCountry.value.slice(0, 2);
	const timeZone = searchCountry.value.slice(3);
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
			searchByDay(type, country, timeZone);
			break;
	}
});

// Render country list when page is being loaded
renderCountryList();
