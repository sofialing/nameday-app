/*
 * International Nameday API
 *
 */

const base_url = 'https://api.abalin.net';

// Fetch and return data
const getData = async url => {
	const response = await fetch(url);

	if (!response.status === 200) {
		throw new Error('Something went wrong. Try again later.');
	}

	return await response.json();
};

// Search for name day by name and country
const getDataByName = async (name, country) => {
	const query = `/getdate?name=${name}&country=${country}`;
	return await getData(base_url + query);
};

// Search for name day by specific date and country
const getDataByDate = async (month, day, country) => {
	const query = `/namedays?country=${country}&month=${month}&day=${day}`;
	return await getData(base_url + query);
};

// Search for name days today for specified country and timezone
const getDataByDay = async (day, country, timeZone) => {
	const query = `/${day}?timezone=${timeZone}&country=${country}`;
	return await getData(base_url + query);
};
