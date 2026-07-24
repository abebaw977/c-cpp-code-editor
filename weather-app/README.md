# 🌤️ Weather Dashboard

A beautiful, responsive weather dashboard that fetches real-time weather data from OpenWeatherMap API.

## Features

✅ **Real-time Weather Data** - Current weather with detailed information
✅ **5-Day Forecast** - View upcoming weather predictions
✅ **City Search** - Search with autocomplete suggestions
✅ **Favorites** - Save favorite cities for quick access
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile (Samsung A04)
✅ **Units Toggle** - Switch between Celsius and Fahrenheit
✅ **Beautiful UI** - Modern gradient design with smooth animations
✅ **Local Storage** - Persist favorites locally

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **API**: OpenWeatherMap
- **Styling**: Custom CSS with gradients and animations

## Installation

### Prerequisites
- Python 3.7+
- pip package manager

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abebaw977/weather-dashboard.git
cd weather-app
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Get API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

5. **Configure API Key**
```bash
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key
```

6. **Run the application**
```bash
python app.py
```

7. **Open in browser**
```
http://localhost:5001
```

## Usage

1. **Search for a city** - Type city name and select from suggestions
2. **View current weather** - See detailed weather information
3. **Check forecast** - Switch to 5-day forecast view
4. **Add favorites** - Save cities for quick access
5. **View favorites** - Quick access to saved cities

## API Endpoints

### Current Weather
```
GET /api/weather/current?city=London&units=metric
```

### 5-Day Forecast
```
GET /api/weather/forecast?city=London&units=metric
```

### City Search
```
GET /api/weather/search?q=Lon&limit=10
```

## Responsive Design

- **Desktop**: Full layout with multiple columns
- **Tablet (768px-1024px)**: Adjusted grid layout
- **Mobile (480px-768px)**: Single column, optimized touch targets
- **Small phones (<480px)**: Compact layout for Samsung A04

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Pull requests welcome!

## License

MIT License
