"use strict";
const btn = document.querySelector("#btn");
const searchInput = document.querySelector("#search");
const currentEl = document.querySelector(".current");
const outputDiv = document.querySelector(".output-div");
const forecastEl = document.querySelector(".forecast-container");
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

				// loop through array of forecasts and create DOM elements
				filteredByDate.forEach((el) => {
					const dtg = el.dt_txt.split(" ")[0];
					const rain = `${Math.trunc(el.pop * 100)}%`;
					const clouds = `${el.clouds.all}%`;
					const low = Math.trunc(el.main.temp_min);
					const high = Math.trunc(el.main.temp_max);
					console.log(dtg);
					console.log(rain);
					console.log(clouds);
					console.log(low);
					console.log(high);

					const html = `
				        <div class="forecast">
				          <div class="flex justify-between items-center">
				            <p class="forecast-date">${dtg}</p>
				            <p class="rain-percent">${rain}</p>
				            <img class="forecast-icon" src="img/cloud.svg" />
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

function createCurrent(data) {
	{
		// console.log(data);
		currentEl.innerHTML = "";
		const temp = Math.trunc(data.main.temp);
		const html = `
              <div class="temp-box">
                <p class="temp">${temp}°F</p>
                <p class="place-name">${data.name}</p>
              </div>
              <div>
                <img
                  src="img/cloud.svg"
                  alt="weather icon"
                  class="main-icon"
                  width="50px"
                />
              </div>
            </div>
      `;
		currentEl.innerHTML = html;
	}
}

function displayMatches(e) {
	e.preventDefault();
	const val = searchInput.value;

	$.get(`https://geocode.maps.co/search?q=${val}`, function (data) {
		// console.log(data);
		const { lat, lon } = data[0];
		const displayName = data.display_name;
		$.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6e4f8f4955f9d245433db19f65e18153&units=imperial`,
			function (data) {
				createCurrent(data);
				createForecast(data);
			}
		);
	});
}

btn.addEventListener("click", displayMatches);
