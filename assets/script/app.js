/*
 *
 *
 */

const nameSearch = document.querySelector('#name-search');
const dateSearch = document.querySelector('#date-search');

const handleError = e => {
	console.log(e);
};

const handleResult = res => {
	console.log('got result:', res);
};

nameSearch.addEventListener('submit', e => {
	e.preventDefault();
	const name = nameSearch.name.value.trim();

	searchByName(name)
		.then(handleResult)
		.catch(handleError);
});

dateSearch.addEventListener('submit', e => {
	e.preventDefault();
	const date = dateSearch.date.value.trim();
	const month = new Date(date).getMonth() + 1;
	const day = new Date(date).getDate();

	searchByDate(month, day)
		.then(handleResult)
		.catch(handleError);
});
