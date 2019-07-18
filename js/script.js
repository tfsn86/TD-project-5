const employees = 'https://randomuser.me/api/?results=12';
const searchContainer = document.querySelector('.search-container');
const gallery = document.querySelector('#gallery');
const body = document.querySelector('body');

// Creates the markup for the searchbar and appends it to the search container.
const searchBar = document.createElement('form');
searchBar.innerHTML = `
  <form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
  </form
`;

searchContainer.appendChild(searchBar);

async function getJSON(url) {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error) {
		throw error;
	}
}

function reformat_birthdate(date) {
	let month = date.substring(5, 7);
	let day = date.substring(8, 10);
	let year = date.substring(2, 4);
	// Example output: 14/09/86
	let new_date = month + '/' + day + '/' + year;
	return new_date;
}

async function getEmployees(url) {
	const peopleJSON = await getJSON(url);

	const profiles = peopleJSON.results.map(async person => {
		const name = `${person.name.first} ${person.name.last}`;
		const email = person.email;
		const location = `${person.location.city}, ${person.location.state}`;
		const address = `${person.location.street}, ${person.location.postcode}`;
		const large = person.picture.large;
		const phoneNumber = person.phone;
		const birthday = person.dob.date;

		return { name, email, location, address, large, phoneNumber, birthday };
	});

	return Promise.all(profiles);
}

// Gallery HTML
function cardHTML(data) {
	data.map(person => {
		const cardDiv = document.createElement('div');
		gallery.appendChild(cardDiv);
		cardDiv.className = 'card';
		cardDiv.innerHTML = `
    <div class="card-img-container">
      <img class="card-img" src="${person.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${person.name}</h3>
      <p class="card-text">${person.email}</p>
      <p class="card-text cap">${person.location}</p>
    </div>
    `;

		cardDiv.addEventListener('click', () => {
			const modalDiv = document.createElement('modal');
			body.insertBefore(modalDiv, body.childNodes[6]);
			modalDiv.className = 'modal-container';
			modalDiv.innerHTML = `
      <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
        <img class="modal-img" src="${person.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${person.name}</h3>
        <p class="modal-text">${person.email}</p>
        <p class="modal-text cap">${person.location}</p>
        <hr>
        <p class="modal-text">Phone: ${person.phoneNumber}</p>
        <p class="modal-text">Address: ${person.address}</p>
        <p class="modal-text">Birthday: ${reformat_birthdate(
					person.birthday
				)}</p>
      </div>
      </div>`;

			const modalCloseBtn = document.querySelector('.modal-close-btn');

			modalCloseBtn.addEventListener('click', () => {
				document.querySelector('.modal-container').style.display = 'none';
			});
		});
	});
}

getEmployees(employees).then(cardHTML);
