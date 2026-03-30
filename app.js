/*------------------DOM Elements------------------*/
const elements = {
   dog: {
      container: document.getElementById("dog-api"),
      output: document.getElementById("dog-output"),
      codeSelect: document.getElementById("code-select"),
      getDogStatusImage: document.getElementById("get-dog-status-image")
   },
   dictionary: {
      container: document.getElementById("dictionary-api"),
      output: document.getElementById("dictionary-output"),
      getWord: document.getElementById("get-word"),
      getDefinition: document.getElementById("get-definition")
   },
   weather: {
      container: document.getElementById("weather-api"),
      output: document.getElementById("weather-output"),
      getCity: document.getElementById("get-city"),
      getWeather: document.getElementById("get-weather")
   },
   currency: {
      container: document.getElementById("currency-api"),
      output: document.getElementById("currency-output"),
      baseCurrency: document.getElementById("base-currency"),
      targetCurrency: document.getElementById("target-currency"),
      getRates: document.getElementById("get-rates")
   },
   fact: {
      container: document.getElementById("fact-api"),
      output: document.getElementById("fact-output"),
      getFact: document.getElementById("get-quote")
   },
   trivia: {
      container: document.getElementById("trivia-api"),
      output: document.getElementById("trivia-output"),
      getTrivia: document.getElementById("get-trivia")
   },
   pokemon: {
      container: document.getElementById("pokemon-api"),
      output: document.getElementById("pokemon-output"),
      getPokemonName: document.getElementById("get-pokemon-name"),
      getPokemonInfo: document.getElementById("get-pokemon-info")
   },
   inspirational: {
      container: document.getElementById("inspirational-quote-api"),
      output: document.getElementById("inspirational-output"),
      getInspirationalQuote: document.getElementById("get-inspirational-quote")
   }
};

/*------------------Helper functions------------------*/

// Function to decode HTML entities ('&'s, '<'s, etc.) in API responses
function decodeHTML(html) {
   const txt = document.createElement("textarea");
   txt.innerHTML = html;
   return txt.value;
}

// Fisher-Yates shuffle algorithm to randomize order of an array
function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
}

// Input validation for Dictionary API
function getWord() {
   try{
      const word = elements.dictionary.getWord.value;

      if (!word || word.trim() === '') {
         elements.dictionary.output.innerHTML = `<p>Please enter a word</p>`;
         return;
      }

      if (word.includes(' ')) {
         elements.dictionary.output.innerHTML = `<p>Please enter only one word</p>`;
         return;
      }

      if (!/^[a-zA-Z]+$/.test(word)) {
         elements.dictionary.output.innerHTML = `<p>Please enter letters only</p>`;
         return;
      }
      return word;

   } catch (err) {
      console.error('Error validating word input:', err);
   }
}

// Getting city coordinates for Weather API
async function getCoordinates(city) {
   const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
   const data = await response.json();

   if (!data.results) return null;

   return data.results[0];
}

// Convert wind direction in degrees to cardinal direction (N, NE, E, etc.)
function getWindDirection(degrees) {
   const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
   const index = Math.round(degrees / 45) % 8;
   return directions[index];
}

/*------------------API functions------------------*/

// HTTP Status Dog API
function getDogStatusImage() {
   try {
      const code = elements.dog.codeSelect.value;

      if (!code) {
         elements.dog.output.innerHTML = `<p>Please select a status code</p>`;
         return;
      }

      const img = document.createElement('img');
      img.classList.add('dog-image');
      img.src=`https://http.dog/${code}.jpg`;
      img.alt=`${code} Status Image`;

      elements.dog.output.innerHTML = '';
      elements.dog.output.appendChild(img);

   } catch (err) {
      console.error('Error fetching dog status image:', err);
   }
}

// Dictionary API
async function getDictionaryDefinition() {
   try {
      const word = getWord();
      if (!word) return;

      elements.dictionary.output.innerHTML = '';

      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      console.log(data);

      if (data.title === "No Definitions Found") {
         elements.dictionary.output.innerHTML = `<p>No definition found for "${word}". Please try another word.</p>`;
         return;
      }

      const info = data[0];

      const headerDiv = document.createElement("div");
      headerDiv.classList.add("header-div");
      elements.dictionary.output.append(headerDiv);

      const wordEl = document.createElement("h3");
      wordEl.textContent = info.word;
      headerDiv.appendChild(wordEl);

      if (info.phonetic) {
         const phoneticEl = document.createElement("p");
         phoneticEl.textContent = info.phonetic;
         headerDiv.appendChild(phoneticEl);
      }

      const wordDefinition = document.createElement("p");
      wordDefinition.textContent = info.meanings[0].definitions[0].definition;
      elements.dictionary.output.appendChild(wordDefinition);

      const phoneticAudio = info.phonetics.find((item) => item.audio);

      if (phoneticAudio) {
         const wordPhonetic = document.createElement("audio");
         wordPhonetic.src = phoneticAudio.audio;
         wordPhonetic.controls = true;
         elements.dictionary.output.appendChild(wordPhonetic);
      }

   } catch (err) {
      console.error('Error fetching dictionary definition:', err);
   }
}

// Weather API
async function getWeather() {
   try {
      elements.weather.getWeather.disabled = true;

      const city = elements.weather.getCity.value;
      if (!city) {
         elements.weather.output.innerHTML = `<p>Please enter a city</p>`;
         return;
      }

      const location = await getCoordinates(city);
      if (!location) {
         elements.weather.output.innerHTML = `<p>City "${city}" not found. Please try another city.</p>`;
         return;
      }

      const {latitude, longitude} = location;

      const windUnit = document.querySelector('input[name="wind-unit"]:checked').value;
      const tempUnit = document.querySelector('input[name="temp-unit"]:checked').value;
      const precipUnit = document.querySelector('input[name="precip-unit"]:checked').value;

      let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,wind_direction_10m_dominant&current=temperature_2m,cloud_cover,is_day,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=1`;

      if (windUnit === 'mph') {
         url += `&wind_speed_unit=mph`;
      }
      if (tempUnit === 'fahrenheit') {
         url += `&temperature_unit=fahrenheit`;
      }
      if (precipUnit === 'inch') {
         url += `&precipitation_unit=inch`;
      }

      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`Weather API error`);
      }

      const data = await response.json();
      console.log(data);

      const cityEl = document.createElement("h3");
      cityEl.textContent = location.name;

      const currentTemp = document.createElement("h2");
      currentTemp.textContent = `${Math.round(data.current.temperature_2m)}${data.current_units.temperature_2m}`;

      const highLowTemp = document.createElement("p");
      highLowTemp.textContent = `High: ${Math.round(data.daily.temperature_2m_max[0])}${data.daily_units.temperature_2m_max} / Low: ${Math.round(data.daily.temperature_2m_min[0])}${data.daily_units.temperature_2m_min}`;

      const dayNight = document.createElement("p");
      dayNight.textContent = data.current.is_day ? "DAY ☀️" : "NIGHT 🌙";

      const cloudCover = document.createElement("p");
      cloudCover.textContent = `Cloud Cover: ${data.current.cloud_cover}%`;
      
      const humidity = document.createElement("p");
      humidity.textContent = `Humidity: ${data.current.relative_humidity_2m}%`;

      const windDeg = data.current.wind_direction_10m;
      const windCardinal = getWindDirection(windDeg);
      const wind = document.createElement("p");
      wind.textContent = `Wind: ${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m} (${windCardinal})`;

      const sunrise = document.createElement("p");
      sunrise.textContent = `Sunrise: ${new Date(data.daily.sunrise[0]).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
      })}`;

      const sunset = document.createElement("p");
      sunset.textContent = `Sunset: ${new Date(data.daily.sunset[0]).toLocaleTimeString([], {
         hour: "numeric",
         minute: "2-digit"
      })}`;

      elements.weather.output.innerHTML = '';
      
      const headerDiv = document.createElement("div");
      headerDiv.classList.add("header-div");

      const tempDiv = document.createElement("div");
      tempDiv.classList.add("temp-div");

      const cloudWindHumDiv = document.createElement("div");
      cloudWindHumDiv.classList.add("cloud-wind-hum-div");

      const sunriseSunsetDiv = document.createElement("div");
      sunriseSunsetDiv.classList.add("sunrise-sunset-div");

      elements.weather.output.append(headerDiv, tempDiv, cloudWindHumDiv, sunriseSunsetDiv);

      headerDiv.append(cityEl);
      tempDiv.append(dayNight, currentTemp, highLowTemp);
      cloudWindHumDiv.append(cloudCover, humidity, wind);
      sunriseSunsetDiv.append(sunrise, sunset);

   } catch (err) {
      console.error('Error validating city input:', err);
   } finally {
      elements.weather.getWeather.disabled = false;
   }
}

// Currency Exchange API
async function getCurrencyRates() {
   try {
      const baseCurrency = elements.currency.baseCurrency.value.trim().toUpperCase();
      const targetCurrency = elements.currency.targetCurrency.value.trim().toUpperCase();

      if (!baseCurrency || !targetCurrency) {
         elements.currency.output.innerHTML = `<p>Please select both base and target currencies</p>`;
         return;
      }

      elements.currency.getRates.disabled = true;

      const response = await fetch(`https://api.frankfurter.dev/v2/rate/${baseCurrency}/${targetCurrency}`);

      if (!response.ok) {
         throw new Error('Currency API error');
      }

      const data = await response.json();
      console.log(data);

      const rate = data.rate;

      const rateEl = document.createElement("p");
      rateEl.innerHTML = `1 ${baseCurrency} = <span class="rate-value">${rate} ${targetCurrency}</span>`;

      elements.currency.output.innerHTML = '';
      elements.currency.output.appendChild(rateEl);

   } catch (err) {
      console.error('Error fetching currency rates:', err);
   } finally {
      elements.currency.getRates.disabled = false;
   }
}

// Fact API
async function getFact() {
   try {
      elements.fact.getFact.disabled = true;

      const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
      
      if (!response.ok) {
         throw new Error('Fact API error');
      }

      const data = await response.json();
      console.log(data);

      const factEl = document.createElement("p");
      factEl.textContent = data.text;

      elements.fact.output.innerHTML = '';
      elements.fact.output.appendChild(factEl);

   } catch (err) {
      console.error('Error fetching fact:', err);
   } finally {
      elements.fact.getFact.disabled = false;
   }
}

// Trivia API
async function getTrivia() {
   try {
      elements.trivia.getTrivia.disabled = true;

      elements.trivia.output.innerHTML = '';

      const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
      const answerType = document.querySelector('input[name="answer-type"]:checked').value;

      const response = await fetch(`https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=${answerType}`);

      if (!response.ok) {
         throw new Error('Trivia API error');
      }

      const data = await response.json();
      console.log(data);

      const question = decodeHTML(data.results[0].question);
      const correctAnswer = data.results[0].correct_answer;

      const questionEl = document.createElement("p");
      questionEl.innerHTML = `<span class="trivia-q">Q</span>: ${question}`;
      elements.trivia.output.appendChild(questionEl);

      const answerDiv = document.createElement("div");
      answerDiv.classList.add("answer-div");
      elements.trivia.output.append(answerDiv);

      const answers = [...data.results[0].incorrect_answers, correctAnswer];
      const shuffledAnswers = shuffleArray(answers);
      shuffledAnswers.forEach((answer) => {
         const answerBtn = document.createElement("button");
         answerBtn.textContent = decodeHTML(answer);
         answerBtn.classList.add("trivia-answer-btn");
         answerDiv.appendChild(answerBtn);
      });

      // Need to add event listeners to the answer buttons after they are created
      const answerButtons = elements.trivia.output.querySelectorAll(".trivia-answer-btn");
      answerButtons.forEach((btn) => {
         btn.addEventListener('click', () => {
            answerButtons.forEach((button) => {
               button.disabled = true;

               if (button.textContent === correctAnswer) {
                  button.style.backgroundColor = 'green';
               } else if (button === btn) {
                  button.style.backgroundColor = 'red';
               }
            });
         });
      });

   } catch (err) {
      console.error('Error fetching trivia:', err);
   } finally {
      elements.trivia.getTrivia.disabled = false;
   }
}

// Pokemon API
async function getPokemonInfo() {
   try{
      elements.pokemon.getPokemonInfo.disabled = true;

      elements.pokemon.output.innerHTML = '';

      const pokemonName = elements.pokemon.getPokemonName.value.trim().toLowerCase();

      if (!pokemonName) {
         elements.pokemon.output.innerHTML = `<p>Please enter a valid Pokemon name</p>`;
         return;
      }

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      console.log(data);

      const nameEl = document.createElement("h3");
      nameEl.textContent = data.name;
      
      const pokemonImg = document.createElement("img");
      pokemonImg.src = data.sprites.versions['generation-i']['red-blue']['front_transparent'];
      pokemonImg.alt = data.name;
      pokemonImg.classList.add("pokemon-image");

      const pokemonNumber = document.createElement("p");
      if (data.id < 100) {
         pokemonNumber.textContent = `Pokedex #0${data.id}`;
      } else {
         pokemonNumber.textContent = `Pokedex #${data.id}`;
      }

      const pokemonType = document.createElement("p");
      pokemonType.textContent = `Type: ${data.types[0].type.name}`;
      
      const pokemonCry = document.createElement("audio");
      pokemonCry.src = data.cries.legacy;
      pokemonCry.controls = true;

      const pokemonInfoDiv = document.createElement("div");
      pokemonInfoDiv.classList.add("pokemon-info-div");
      pokemonInfoDiv.append(nameEl, pokemonNumber, pokemonType, pokemonCry);

      elements.pokemon.output.appendChild(pokemonImg);
      elements.pokemon.output.appendChild(pokemonInfoDiv);

   } catch (err) {
      console.error('Error fetching pokemon data:', err);
   } finally {
      elements.pokemon.getPokemonInfo.disabled = false;
   }
}

async function getInspirationalQuote() {
   try {
      elements.inspirational.getInspirationalQuote.disabled = true;

      elements.inspirational.output.innerHTML = '';

      const response = await fetch("https://quoteslate.vercel.app/api/quotes/random");
      const data = await response.json();
      console.log(data);

      const quoteEl = document.createElement("p");
      quoteEl.classList.add("quote-text");
      quoteEl.innerHTML = `<span class="quote-mark">“ </span>${data.quote}<span class="quote-mark"> ”</span>`;

      const authorEl = document.createElement("p");
      authorEl.classList.add("quote-author");
      authorEl.textContent = `- ${data.author}`;

      elements.inspirational.output.append(quoteEl, authorEl);

   } catch (err) {
      console.error('Error fetching inspirational quote:', err);
   } finally {
      elements.inspirational.getInspirationalQuote.disabled = false;
   }
}

/*------------------Event Listeners------------------*/

// HTTP Status Dog API
elements.dog.getDogStatusImage.addEventListener('click', getDogStatusImage);

// Dictionary API
elements.dictionary.getDefinition.addEventListener('click', getDictionaryDefinition);

// Weather API
elements.weather.getWeather.addEventListener('click', getWeather);

// Currency Exchange API
elements.currency.getRates.addEventListener('click', getCurrencyRates);

// Fact API
elements.fact.getFact.addEventListener('click', getFact);

// Trivia API
elements.trivia.getTrivia.addEventListener('click', getTrivia);

// Pokemon API
elements.pokemon.getPokemonInfo.addEventListener('click', getPokemonInfo);

// Inspirational Quote API
elements.inspirational.getInspirationalQuote.addEventListener('click', getInspirationalQuote);