/*
 * Name day search
 */
const searchForm = document.querySelector('#search-form');
const searchCountry = document.querySelector('#search-country');
const searchInput = document.querySelector('#search-input');
const searchType = document.querySelector('#search-type');
const searchResult = document.querySelector('#search-result');

// Get list of supported countries and render to page
const renderCountryList = async () => {
	const countries = await getData('../assets/script/countrylist.json');

	// Append countries as options to select element
	const html = countries
		.map(country => {
			return `<option value="${country.code}-${country.time}">${country.name}</option>`;
		})
		.join('');

	document.querySelector('#search-country').innerHTML = html;
};

const renderAlert = message => {
	searchResult.innerHTML = `<div class="alert alert-warning" role="alert">${message}</div>`;
};

// Render results of search by specific date/day
const renderDateSearch = (date, namelist, country) => {
	const html = `
		<div class="card">
			<div class="card-body text-center">
				<img src="/assets/img/${country}.svg" class="flag-icon">
				<h2 class="h3 font-weight-bold">${date}</h2>
				<ul class="name-list">${namelist}</ul>
			</div>
		</div>`;
	searchResult.innerHTML = html;
};

// Format results of search by specific date/day
const formatDateResults = (res, country) => {
	console.log(res[0]);

	// Format date of the name day
	const date = moment()
		.month(res[0].dates.month - 1)
		.date(res[0].dates.day)
		.format('dddd, MMMM Do');

	// Format names as a list item
	const namelist = res[0].namedays[country]
		.split(', ')
		.map(name => `<li>${name}</li>`)
		.join('');

	renderDateSearch(date, namelist, country);
};

// Get search results by specific date
const searchByDate = async (date, country) => {
	const month = moment(date).month() + 1;
	const day = moment(date).date();

	// Get data and handle results
	try {
		const res = await getDataByDate(month, day, country);
		if (!res.data.length) {
			renderAlert(`No results for selected day.`);
			return;
		}
		formatDateResults(res.data, country);
	} catch (err) {
		renderAlert(err);
	}
};

// Get search results by today/tomorrow/yesterday
const searchByDay = async (type, country, timeZone) => {
	// Get data and handle results
	try {
		const res = await getDataByDay(type, country, timeZone);
		if (!res.data.length) {
			renderAlert(`No results for selected day.`);
			return;
		}
		formatDateResults(res.data, country);
	} catch (err) {
		renderAlert(err);
	}
};

// Get search results by specific name
const searchByName = async (name, country) => {
	name = name.trim();

	// Get data and handle results
	try {
		const res = await getDataByName(name, country);
		if (!res.results.length) {
			renderAlert(
				`No results for the name "${name}" in selected country (${country}).`
			);
			return;
		}
		formatNameResults(res.results, name, country);
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

// Listen for changes in select element for search type
searchType.addEventListener('change', () => {
	const type = searchType.value;

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
