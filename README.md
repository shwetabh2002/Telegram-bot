# Telegram Bot

A simple Telegram bot for providing weather updates and admin functionalities.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Admin Commands](#admin-commands)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

This Telegram bot provides real-time weather updates based on user preferences. Additionally, it includes admin functionalities for managing keys, changing message frequency, and user management.

## Features

- User registration and personalized weather updates.
- Admin functionalities for managing keys, changing message frequency, and user management.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB database
- Telegram Bot Token
- OpenWeatherMap API Key

### Installation

1. Clone the repository:

   bash
   git clone https://github.com/your-username/your-repository.git

   Install dependencies:
      cd Telegram-bot
      npm install
   
3. Create a .env file in the root directory with the following contents:

    File name - .env
    MONGODB_URI=your-mongodb-uri
    TELEGRAM_BOT_TOKEN=your-telegram-bot-token
    WEATHER_API_KEY=your-openweathermap-api-key

   
Run the bot using:
npm start


Certainly! Here is the template with placeholders that you can copy and paste into your README file on GitHub:

# Telegram Bot

A simple Telegram bot for providing weather updates and admin functionalities.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Admin Commands](#admin-commands)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

This Telegram bot provides real-time weather updates based on user preferences. Additionally, it includes admin functionalities for managing keys, changing message frequency, and user management.

## Features

- User registration and personalized weather updates.
- Admin functionalities for managing keys, changing message frequency, and user management.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB database
- Telegram Bot Token
- OpenWeatherMap API Key

### Installation

1. Clone the repository:

   bash
   git clone https://github.com/your-username/your-repository.git
   
Install dependencies:
cd Telegram-bot
npm install

Create a .env file in the root directory with the following contents:

env:
MONGODB_URI=your-mongodb-uri
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
WEATHER_API_KEY=your-openweathermap-api-key
Replace your-mongodb-uri, your-telegram-bot-token, and your-openweathermap-api-key with your MongoDB connection URI, Telegram bot token, and OpenWeatherMap API key, respectively.

Usage
Run the bot using:

npm start
Configuration
The bot's behavior can be configured through the .env file. Refer to the Installation section for details.

Admin Commands:
To access admin functionalities, use the /start-admin command and enter the admin password.

Manage Keys
Change Message Frequency
Block or Delete User
Logout

User Commands:
To access admin functionalities, use the /start command

Contributing:
Contributions are welcome! Feel free to open issues or pull requests.

Acknowledgements:
Node.js
MongoDB
Telegram Bot API
OpenWeatherMap API
Node-cron


Remember to replace placeholders like `your-username`, `your-repository`, `your-mongodb-uri`, `your-telegram-bot-token`, and `your-openweathermap-api-key` with your actual information.

