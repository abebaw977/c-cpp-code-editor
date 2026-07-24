/**
 * Weather Dashboard App
 * Main application logic
*/

class WeatherApp {
    constructor() {
        this.currentCity = 'London';
        this.units = 'metric'; // metric for Celsius, imperial for Fahrenheit
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCurrentWeather(this.currentCity);
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });
        
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        document.getElementById('cityInput').addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
    }

    handleSearch() {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            this.loadCurrentWeather(city);
            this.loadForecast(city);
            document.getElementById('cityInput').value = '';
            document.getElementById('searchSuggestions').classList.remove('active');
        }
    }

    handleSearchInput(query) {
        if (query.length < 2) {
            document.getElementById('searchSuggestions').classList.remove('active');
            return;
        }

        fetch(`/api/weather/search?q=${encodeURIComponent(query)}&limit=5`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.displaySearchSuggestions(data.cities);
                }
            })
            .catch(error => console.error('Search error:', error));
    }

    displaySearchSuggestions(cities) {
        const suggestionsDiv = document.getElementById('searchSuggestions');
        suggestionsDiv.innerHTML = '';
        
        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = `${city.name}, ${city.country}`;
            item.addEventListener('click', () => {
                document.getElementById('cityInput').value = city.name;
                this.loadCurrentWeather(city.name);
                this.loadForecast(city.name);
                suggestionsDiv.classList.remove('active');
            });
            suggestionsDiv.appendChild(item);
        });
        
        if (cities.length > 0) {
            suggestionsDiv.classList.add('active');
        }
    }

    loadCurrentWeather(city) {
        const loading = document.getElementById('loadingCurrent');
        const container = document.getElementById('currentWeather');
        const error = document.getElementById('errorCurrent');

        loading.classList.remove('hidden');
        container.classList.add('hidden');
        error.classList.add('hidden');

        fetch(`/api/weather/current?city=${encodeURIComponent(city)}&units=${this.units}`)
            .then(response => response.json())
            .then(data => {
                loading.classList.add('hidden');
                if (data.success) {
                    this.currentCity = city;
                    this.displayCurrentWeather(data.data);
                    container.classList.remove('hidden');
                } else {
                    error.textContent = '❌ ' + data.error;
                    error.classList.remove('hidden');
                }
            })
            .catch(err => {
                loading.classList.add('hidden');
                error.textContent = '❌ Error: ' + err.message;
                error.classList.remove('hidden');
            });
    }

    loadForecast(city) {
        const loading = document.getElementById('loadingForecast');
        const container = document.getElementById('forecastWeather');
        const error = document.getElementById('errorForecast');

        loading.classList.remove('hidden');
        container.classList.add('hidden');
        error.classList.add('hidden');

        fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}&units=${this.units}`)
            .then(response => response.json())
            .then(data => {
                loading.classList.add('hidden');
                if (data.success) {
                    this.displayForecast(data.forecast);
                    container.classList.remove('hidden');
                } else {
                    error.textContent = '❌ ' + data.error;
                    error.classList.remove('hidden');
                }
            })
            .catch(err => {
                loading.classList.add('hidden');
                error.textContent = '❌ Error: ' + err.message;
                error.classList.remove('hidden');
            });
    }

    displayCurrentWeather(data) {
        const container = document.getElementById('currentWeather');
        const unit = this.units === 'metric' ? '°C' : '°F';
        const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

        container.innerHTML = `
            <div class="weather-card current-weather">
                <div class="weather-header">
                    <div>
                        <div class="weather-title">${data.city}, ${data.country}</div>
                        <div class="weather-description">${data.description}</div>
                    </div>
                    <img src="${iconUrl}" alt="${data.description}" class="weather-icon">
                </div>
                <div class="weather-main">
                    <div class="temperature">${Math.round(data.temperature)}${unit}</div>
                </div>
                <div class="weather-details">
                    <div class="detail-item">
                        <div class="detail-label">Feels Like</div>
                        <div class="detail-value">${Math.round(data.feels_like)}${unit}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Humidity</div>
                        <div class="detail-value">${data.humidity}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Wind Speed</div>
                        <div class="detail-value">${data.wind_speed} m/s</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Pressure</div>
                        <div class="detail-value">${data.pressure} hPa</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Min Temp</div>
                        <div class="detail-value">${Math.round(data.temp_min)}${unit}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Max Temp</div>
                        <div class="detail-value">${Math.round(data.temp_max)}${unit}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Cloudiness</div>
                        <div class="detail-value">${data.clouds}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Visibility</div>
                        <div class="detail-value">${(data.visibility / 1000).toFixed(1)} km</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="app.addFavorite('${data.city}')" class="search-btn" style="background-color: var(--success-color);">⭐ Add to Favorites</button>
                </div>
            </div>
        `;
    }

    displayForecast(forecast) {
        const container = document.getElementById('forecastWeather');
        const unit = this.units === 'metric' ? '°C' : '°F';
        
        // Group forecast by day
        const dailyForecasts = {};
        
        forecast.forEach(item => {
            const date = new Date(item.timestamp * 1000);
            const day = date.toLocaleDateString();
            
            if (!dailyForecasts[day]) {
                dailyForecasts[day] = item;
            }
        });

        container.innerHTML = Object.entries(dailyForecasts).slice(0, 5).map(([date, item]) => {
            const dateObj = new Date(item.timestamp * 1000);
            const iconUrl = `https://openweathermap.org/img/wn/${item.icon}@2x.png`;
            
            return `
                <div class="forecast-card">
                    <div class="forecast-time">${dateObj.toLocaleDateString()}</div>
                    <img src="${iconUrl}" alt="${item.description}" class="forecast-icon">
                    <div class="forecast-temp">${Math.round(item.temperature)}${unit}</div>
                    <div class="forecast-desc">${item.description}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 8px;">
                        💧 ${item.humidity}% | 💨 ${item.wind_speed} m/s
                    </div>
                </div>
            `;
        }).join('');
    }

    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(view => {
            view.classList.remove('active');
        });
        
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected view
        document.getElementById(viewName + 'View').classList.add('active');
        
        // Mark button as active
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        // Load favorites if viewing favorites
        if (viewName === 'favorites') {
            this.displayFavorites();
        }
    }

    addFavorite(city) {
        if (!this.favorites.includes(city)) {
            this.favorites.push(city);
            this.saveFavorites();
            alert(`✅ ${city} added to favorites!`);
        } else {
            alert(`⚠️ ${city} is already in favorites!`);
        }
    }

    removeFavorite(city) {
        this.favorites = this.favorites.filter(fav => fav !== city);
        this.saveFavorites();
        this.displayFavorites();
    }

    displayFavorites() {
        const container = document.getElementById('favoritesList');
        
        if (this.favorites.length === 0) {
            container.innerHTML = '<p class="empty-state">No favorites yet. Add cities from the search!</p>';
            return;
        }
        
        container.innerHTML = this.favorites.map(city => `
            <div class="favorite-card">
                <div class="favorite-city">${city}</div>
                <div class="favorite-actions">
                    <button class="action-btn" onclick="app.switchView('current'); app.loadCurrentWeather('${city}'); app.loadForecast('${city}');">📍 View</button>
                    <button class="action-btn remove" onclick="app.removeFavorite('${city}')">🗑️ Remove</button>
                </div>
            </div>
        `).join('');
    }

    saveFavorites() {
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const saved = localStorage.getItem('weatherFavorites');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize app
const app = new WeatherApp();
