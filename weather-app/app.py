#!/usr/bin/env python3
"""
Weather Dashboard - Flask Backend
Fetches data from OpenWeatherMap API
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenWeatherMap API
API_KEY = os.getenv('OPENWEATHER_API_KEY', 'demo_key_use_your_own')
BASE_URL = 'https://api.openweathermap.org/data/2.5'


@app.route('/')
def index():
    """Serve main dashboard"""
    return render_template('index.html')


@app.route('/api/weather/current', methods=['GET'])
def get_current_weather():
    """Get current weather for a city"""
    try:
        city = request.args.get('city', 'London')
        units = request.args.get('units', 'metric')
        
        url = f'{BASE_URL}/weather'
        params = {
            'q': city,
            'units': units,
            'appid': API_KEY
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify({
                'success': True,
                'data': {
                    'city': data['name'],
                    'country': data['sys']['country'],
                    'temperature': data['main']['temp'],
                    'feels_like': data['main']['feels_like'],
                    'temp_min': data['main']['temp_min'],
                    'temp_max': data['main']['temp_max'],
                    'pressure': data['main']['pressure'],
                    'humidity': data['main']['humidity'],
                    'description': data['weather'][0]['description'],
                    'icon': data['weather'][0]['icon'],
                    'wind_speed': data['wind']['speed'],
                    'wind_deg': data['wind'].get('deg', 0),
                    'clouds': data['clouds']['all'],
                    'visibility': data.get('visibility', 'N/A'),
                    'sunrise': data['sys']['sunrise'],
                    'sunset': data['sys']['sunset'],
                    'timezone': data['timezone'],
                    'timestamp': data['dt']
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': f'City not found: {city}'
            }), 404
    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'Request timeout'}), 408
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/weather/forecast', methods=['GET'])
def get_forecast():
    """Get 5-day forecast"""
    try:
        city = request.args.get('city', 'London')
        units = request.args.get('units', 'metric')
        
        url = f'{BASE_URL}/forecast'
        params = {
            'q': city,
            'units': units,
            'appid': API_KEY
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            forecast_list = []
            
            for item in data['list']:
                forecast_list.append({
                    'timestamp': item['dt'],
                    'temperature': item['main']['temp'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed'],
                    'pressure': item['main']['pressure']
                })
            
            return jsonify({
                'success': True,
                'city': data['city']['name'],
                'country': data['city']['country'],
                'forecast': forecast_list
            })
        else:
            return jsonify({'success': False, 'error': 'City not found'}), 404
    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'Request timeout'}), 408
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/weather/search', methods=['GET'])
def search_cities():
    """Search for cities"""
    try:
        query = request.args.get('q', '')
        limit = request.args.get('limit', 10)
        
        if len(query) < 2:
            return jsonify({
                'success': False,
                'error': 'Query too short'
            }), 400
        
        url = f'{BASE_URL}/find'
        params = {
            'q': query,
            'type': 'like',
            'sort': 'population',
            'cnt': limit,
            'appid': API_KEY
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            cities = []
            
            for city in data['list']:
                cities.append({
                    'name': city['name'],
                    'country': city['sys']['country'],
                    'lat': city['coord']['lat'],
                    'lon': city['coord']['lon']
                })
            
            return jsonify({
                'success': True,
                'cities': cities
            })
        else:
            return jsonify({'success': False, 'error': 'Search failed'}), 400
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
