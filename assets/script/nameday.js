/*
 * International Nameday API
 *
 */

// Fetch and return data
const fetchData = async query => {
	const response = await fetch('https://api.abalin.net' + query);
	return await response.json();
};

// Search for name day by name and country
const searchByName = async (name, country = 'se') => {
	const query = `/getdate?name=${name}&country=${country}`;
	return await fetchData(query);
};

// Search for name day by specific date and country
const searchByDate = async (month, day, country = 'se') => {
	const query = `/namedays?country=${country}&month=${month}&day=${day}`;
	return await fetchData(query);
};

// Search for name days today for specified country and timezone
const searchToday = async (country = 'at', timeZone = 'Europe/Vienna') => {
	const query = `/today?timezone=${timeZone}&country=${country}`;
	return await fetchData(query);
};
