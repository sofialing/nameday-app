/*
 *
 *
 */

const BASE_URL = 'https://api.abalin.net';

// Fetch and return data
const getJSON = async query => {
	const response = await fetch(BASE_URL + query);
	return await response.json();
};

// Search for nameday by name
const searchByName = async (name, country = 'se') => {
	const query = `/getdate?name=${name}&country=${country}`;
	const data = await getJSON(query);

	return data.results;
};

// Search for nameday by date
const searchByDate = async (day, month, country = 'se') => {
	const query = `/namedays?country=${country}&month=${month}&day=${day}`;
	return await getJSON(query);
};
