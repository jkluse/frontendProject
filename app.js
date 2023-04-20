"use strict";
const btn = document.querySelector("#btn");
const searchInput = document.querySelector("#search");
const currentEl = document.querySelector(".current");
const outputDiv = document.querySelector(".output-div");
const forecastEl = document.querySelector(".forecast-container");
const forecastOuter = document.querySelector(".forecast-outer");
console.log(forecastEl);

function createForecast(data) {
	const { lat, lon } = data.coord;

	$.get(
		`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6e4f8f4955f9d245433db19f65e18153&units=imperial`,
		function (data) {
			console.log(data);
			let today = new Date();
			let addDays = 1;
			today.setDate(today.getDate() + addDays);

			// creates date string in YYYY-MM-DD
			// let dateString = today.toISOString().split("T")[0];
			// console.log(dateString + "  12:00:00");

			const filteredByDate = data.list.filter((el) => {
				return el.dt_txt.includes(" 12:00:00");
			});
			console.log(filteredByDate);

			if (filteredByDate.length > 0) {
				forecastEl.innerHTML = "";

				// create header and append
				let htmlHeader = `
				<div class="forecast">
					<div class="flex justify-between items-center">
						<p class="forecast-header">5-Day Forecast: </p>
					</div>
				</div>
			`;
				forecastEl.insertAdjacentHTML("beforeend", htmlHeader);

				forecastEl.insertAdjacentHTML;
				// loop through array of forecasts and create DOM elements
				filteredByDate.forEach((el) => {
					const dtg = el.dt_txt.split(" ")[0];
					const rain = `${Math.trunc(el.pop * 100)}%`;
					const clouds = `${el.clouds.all}`;
					const low = Math.trunc(el.main.temp_min);
					const high = Math.trunc(el.main.temp_max);
					let cloudIcon;

					// cloud icon logic
					if (clouds < 25) {
						cloudIcon = "img/sun.svg";
					} else if (clouds < 50) {
						cloudIcon = "img/cloud-sun.svg";
					} else {
						cloudIcon = "img/cloud.svg";
					}
					// console.log(dtg);
					// console.log(rain);
					// console.log(clouds);
					// console.log(low);
					// console.log(high);

					const html = `
				        <div class="forecast">
				          <div class="flex justify-between items-center">
				            <p class="forecast-date">${dtg}</p>
				            <p class="rain-percent">${rain}<img src="img/drop.svg"></p>
				            <img class="forecast-icon" src="${cloudIcon}" />
				            <p class="low-high">${low}° / ${high}°</p>
				          </div>
				        </div>
				`;
					forecastEl.insertAdjacentHTML("beforeend", html);
				});
			}
		}
	);
}

function setCurrentWeatherIcon(code) {}

function createCurrent(data) {
	{
		console.log(data.name);
		const humid = data.main.humidity;
		const wind = Math.trunc(data.wind.speed);
		const feels = Math.trunc(data.main.feels_like);

		currentEl.innerHTML = "";

		///// current weather header
		let currentHeader = `
		<p class="current-header">Results for: <strong>${data.name}</strong></p>
		<img class="star" src="${
			favArr.includes(data.name) ? "img/star-fill-blue.svg" : "img/star.svg"
		}" />
		`;
		currentEl.insertAdjacentHTML("beforeend", currentHeader);

		//////// current weather info
		const temp = Math.trunc(data.main.temp);
		const html = `
								<img
									src="img/lg/sun-lg.svg"
									alt="weather icon"
									class="main-icon"
								/>
                <p class="temp">${temp}°F</p>
								<div class="current-info">
								<p>Humidity: ${humid}%</p>
								<p>Wind: ${wind}mph</p>
								<p>Feels Like: ${feels}°F</p>
								</div>
      `;
		currentEl.insertAdjacentHTML("beforeend", html);

		//event listeners for favorite list
		const starEl = document.querySelector(".star");
		starEl.addEventListener("click", addRemoveFavorite);
	}
}
function displayMatches(e) {
	e.preventDefault();
	const val = searchInput.value;
	searchInput.value = "";

	$.get(`https://geocode.maps.co/search?q=${val}`, function (data) {
		// console.log(data);
		const { lat, lon } = data[0];
		const displayName = data.display_name;
		$.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6e4f8f4955f9d245433db19f65e18153&units=imperial`,
			function (data) {
				createCurrent(data);
				createForecast(data);
				currentEl.classList.add("show-grid");
				forecastEl.classList.add("show");
			}
		);
	});
}

btn.addEventListener("click", displayMatches);

// FAVORITES FUNCTIONALITY

const favList = document.querySelector(".fav-list");
const dropdownEl = document.querySelector(".dropdown");
const listItemEl = document.querySelector("#list-items");

favList.addEventListener("click", handleDropDown);

function handleDropDown() {
	if (favArr.length < 1) {
		alert("No favorites...yet! :)");
		return;
	}
	dropdownEl.classList.toggle("show");
}

// Storage for Favorite lists
const favArr = [];

function addRemoveFavorite(e) {
	const location = document.querySelector(".current-header strong").textContent;

	if ($(this).attr("src") === "img/star.svg") {
		// Push to favorites arr
		favArr.push(location);
		$(this).attr("src", "img/star-fill-blue.svg");

		// Add element to drop down
		const html = `<a class="addedFav" href="#">${location}</a>`;
		listItemEl.insertAdjacentHTML("beforeend", html);
	} else {
		// Remove from favorites arr
		favArr.splice(favArr.indexOf(location), 1);
		$(this).attr("src", "img/star.svg");
		console.log(Array.from(listItemEl.children));
		Array.from(listItemEl.children).forEach((el) => {
			console.log(el.textContent);
			if (el.textContent === location) {
				console.log(el);
				el.remove();
			}
		});
	}
	console.log("Fav arr", favArr);
}
/*
<a href="#"> About Us </a>
<a href="#"> Contact Us</a>
<a href="#"> career </a>
*/
