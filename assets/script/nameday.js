/*
 * International Nameday API
 *
 */

const base_url = 'https://api.abalin.net';

// Fetch and return data
const fetchData = async url => {
	const response = await fetch(url);
	return await response.json();
};

// Search for name day by name and country
const searchByName = async (name, country = 'se') => {
	const query = `/getdate?name=${name}&country=${country}`;
	return await fetchData(base_url + query);
};

// Search for name day by specific date and country
const searchByDate = async (month, day, country = 'se') => {
	const query = `/namedays?country=${country}&month=${month}&day=${day}`;
	return await fetchData(base_url + query);
};

// Search for name days today for specified country and timezone
const searchByToday = async (country = 'at', timeZone = 'Europe/Vienna') => {
	const query = `/today?timezone=${timeZone}&country=${country}`;
	return await fetchData(base_url + query);
};
