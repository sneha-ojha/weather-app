const apiKey = 'UCRB825JV88KUW48YEJZTMRX8'; // Visual Crossing API key
const giphyApiKey = 'FC9a7hkjQb0qMIAhGiuYiRfAEdEzVLKR'; // Giphy API key

const infoDiv = document.getElementById('info');
const loadingDiv = document.getElementById('loading');
const cityEl = document.getElementById('city');
const tempEl = document.getElementById('temp');
const descriptionEl = document.getElementById('description');
const iconEl = document.getElementById('icon');

// Form submit event listener
document.getElementById('location-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = document.getElementById('location').value;
    const units = document.querySelector('input[name="units"]:checked').value;

    // Show loading, hide info
    loadingDiv.classList.remove('hidden');
    infoDiv.classList.add('hidden');

    try {
        const weatherData = await getWeatherData(location, units);
        displayWeatherInfo(weatherData);
    } catch (error) {
        console.error('Error fetching data: ', error);
        alert('Failed to retrieve weather info. Please try again.');
    } finally {
        // Hide the loading after the data is fetched (or an error occurs)
        loadingDiv.classList.add('hidden');
    }
});

// Fetch weather data from API
async function getWeatherData(location, units = 'metric') {
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${units === 'metric' ? 'metric' : 'us'}&key=${apiKey}&contentType=json`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Data not found');
    }
    const data = await response.json();
    return processWeatherData(data);
}

// Process the weather data to get the required fields
function processWeatherData(data) {
    const info = {
        city: data.resolvedAddress,
        temperature: data.days[0].temp,
        description: data.days[0].description,
        icon: data.days[0].icon
    };
    return info;
}

// Fetch a GIF from Giphy based on the weather description
async function getWeatherGif(description) {
    const giphyUrl = `https://api.giphy.com/v1/gifs/translate?api_key=${giphyApiKey}&s=${description}`;
    const response = await fetch(giphyUrl);
    const gifData = await response.json();
    return gifData.data.images.original.url;
}

// Display the fetched weather information
async function displayWeatherInfo(data) {
    cityEl.textContent = data.city;
    tempEl.textContent = `Temperature: ${data.temperature}°`;
    descriptionEl.textContent = data.description;
    iconEl.src = `https://www.visualcrossing.com/images/icons/${data.icon}.png`;

    try {
        const gifUrl = await getWeatherGif(data.description);
        document.body.style.backgroundImage = `url(${gifUrl})`;
    } catch (error) {
        console.error('Error fetching GIF:', error);
        document.body.style.backgroundImage = ''; // fallback to no background if GIF fails
    }

    // Show the weather info div and hide loading
    infoDiv.classList.remove('hidden');
}
