//---------------------------------------------------------------------------//

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const User = require('./models/user'); 

// This is for mongodb connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// This is for creating bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

//starting with the bot
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  //here checking for existing user if not an existing user then goes in if condition
  let existingUser = await User.findOne({ chatId });

  if (!existingUser) {
    // sending new user message 
    bot.sendMessage(chatId, 'Welcome! Please tell me your name.');

    bot.once('message', async (msg) => {
      const name = msg.text;
      bot.sendMessage(chatId, `${name}, which city do you live in?`);

      bot.once('message', async (msg) => {
        const city = msg.text;
        bot.sendMessage(chatId, `And what country is ${city} in?`);

        bot.once('message', async (msg) => {
          const country = msg.text;
          try {
            //saving user details
            const newUser = new User({ chatId, name, city, country });
            await newUser.save();

            // sending weather update after saving user details
            await sendWeatherUpdate(chatId, city, country);

            bot.sendMessage(chatId, `Thank you! I have sent you the current weather update for ${city}, ${country}.`);
          } catch (error) {
            //error handing 
            console.error('Error saving user or sending weather update:', error.message);
            bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again later.');
          }
        });
      });
    });
  } else {
    // for existing user
    // sending the latest weather update
    await sendLatestWeatherUpdate(existingUser.chatId, existingUser.city, existingUser.country);

    // asking if the user wants to change the city
    bot.sendMessage(chatId, `Welcome back! Do you want to receive weather updates for a different city? (Yes/No)`);

    bot.once('message', async (msg) => {
      const response = msg.text.toLowerCase();

      if (response === 'yes') {
        // asking for the new city and country
        bot.sendMessage(chatId, 'Sure! Please tell me the new city.');

        bot.once('message', async (msg) => {
          const newCity = msg.text;
          bot.sendMessage(chatId, `And what country is ${newCity} in?`);

          bot.once('message', async (msg) => {
            const newCountry = msg.text;

            // update user details with the new city and country
            existingUser.city = newCity;
            existingUser.country = newCountry;
            await existingUser.save();

            // send weather update for the new city
            await sendWeatherUpdate(chatId, newCity, newCountry);

            bot.sendMessage(chatId, `Thank you! I have updated your preferences and sent you the current weather update for ${newCity}, ${newCountry}.`);
          });
        });
      } else {
        bot.sendMessage(chatId, `Okay! I will continue to send you daily weather updates for ${existingUser.city}, ${existingUser.country}.`);
      }
    });
  }
});

// function to send a weather update
async function sendWeatherUpdate(chatId, city, country) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
    const { weather, main } = response.data;
    const description = weather[0].description;
    const temp = main.temp;
    bot.sendMessage(chatId, `Today's weather in ${city}: ${description} with a temperature of ${temp}°C.`);
  } catch (error) {
    console.error(`Failed to fetch weather data for ${city}, ${country}:`, error.message);
    bot.sendMessage(chatId, `Sorry, I couldn't fetch the weather data. Please try again later.`);
  }
}

// function to send the latest weather update
async function sendLatestWeatherUpdate(chatId, city, country) {
  await sendWeatherUpdate(chatId, city, country);
}

// below function to handle admin-related actions
let isAdminAuthenticated = false;
let passwordAttempts = 0;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_KEY;

// handling admin commands
bot.onText(/\/start-admin/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAdminAuthenticated) {
    authenticateAdmin(chatId);
  } else {
    sendAdminMenu(chatId);
  }
});

// authenticate admin with 3 password attempts
function authenticateAdmin(chatId) {
  bot.sendMessage(chatId, 'Please enter the admin password:');
  bot.once('message', (msg) => {
    if (msg.text === ADMIN_PASSWORD) {
      isAdminAuthenticated = true;
      passwordAttempts = 0;
      sendAdminMenu(chatId);
    } else {
      passwordAttempts++;
      if (passwordAttempts < 3) {
        bot.sendMessage(chatId, `Incorrect password. You have ${3 - passwordAttempts} attempts left.`);
        authenticateAdmin(chatId);
      } else {
        bot.sendMessage(chatId, 'Access denied. Maximum password attempts exceeded.');
        passwordAttempts = 0;
      }
    }
  });
}

// handling the admin menu
function sendAdminMenu(chatId) {
  bot.sendMessage(chatId, ' What would you like to do?\n1. Manage Keys\n2. Change Message Frequency\n3. Block or Delete User\n4. Logout');
  bot.once('message', (msg) => {
    const text = msg.text;
    switch (text) {
      case '1':
        manageKeys(chatId);
        break;
      case '2':
        changeMessageFrequency(chatId);
        break;
      case '3':
        blockOrDeleteUser(chatId);
        break;
      case '4':
        isAdminAuthenticated = false;
        bot.sendMessage(chatId, 'Logged out successfully.');
        break;
      default:
        bot.sendMessage(chatId, 'Invalid option. Logging out for security.');
        isAdminAuthenticated = false;
        break;
    }
  });
}

// function to handle manage keys action
function manageKeys(chatId) {
  bot.sendMessage(chatId, 'These are the important keys:\n1. Weather API Key\n2. Admin Password\n3. Go Back to Main Menu');
  bot.once('message', (msg) => {
    const choice = msg.text;
    switch (choice) {
      case '1':
        handleWeatherAPIKey(chatId);
        break;
      case '2':
        handleAdminPassword(chatId);
        break;
      case '3':
        sendAdminMenu(chatId);
        break;
      default:
        bot.sendMessage(chatId, 'Invalid option. Please choose a valid option.');
        manageKeys(chatId);
        break;
    }
  });
}

// handling weather API key change attempt
function handleWeatherAPIKey(chatId) {
  bot.sendMessage(chatId, 'You are not allowed to change the Weather API Key.');
  sendAdminMenu(chatId);
}

// handling admin password change attempt
function handleAdminPassword(chatId) {
  bot.sendMessage(chatId, 'You are not allowed to change the Admin Password.');
  sendAdminMenu(chatId);
}

// function to handle message frequency change for admin
function changeMessageFrequency(chatId) {
  bot.sendMessage(chatId, 'Choose the message frequency:\n1. Once\n2. Twice\n3. Thrice');
  bot.once('message', (msg) => {
    try {
      const frequency = parseInt(msg.text);
      if (Number.isInteger(frequency) && frequency >= 1 && frequency <= 3) {
        // scheduling the weather updates based on the chosen frequency
        scheduleWeatherUpdates(chatId, frequency);
        bot.sendMessage(chatId, `Frequency changed. Weather updates will be sent ${frequency} times a day.`);
        sendAdminMenu(chatId); 
      } else {
        bot.sendMessage(chatId, 'Invalid frequency. Please choose a valid option.');
        changeMessageFrequency(chatId);
      }
    } catch (error) {
      console.error('Error in changeMessageFrequency:', error.message);
      bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again later.');
    }
  });
}
//variable for cron job scheduling for setting different message frquency
let weatherUpdateJob; 

function scheduleWeatherUpdates(chatId, frequency) {
  // clear any existing schedules
  if (weatherUpdateJob) {
    weatherUpdateJob.stop();
  }

  // schedule weather updates based on the chosen frequency
  switch (frequency) {
    case 1:
      // once a day at 8 AM
      weatherUpdateJob = cron.schedule('0 8 * * *', () => sendWeatherUpdate(chatId));
      break;
    case 2:
      // twice a day at 8 AM and 8 PM
      weatherUpdateJob = cron.schedule('0 8,20 * * *', () => sendWeatherUpdate(chatId));
      break;
    case 3:
      // thrice a day at 8 AM, 2 PM, and 8 PM
      weatherUpdateJob = cron.schedule('0 8,14,20 * * *', () => sendWeatherUpdate(chatId));
      break;
  }
}

// function to delete user and list users by admin 
function blockOrDeleteUser(chatId) {
  bot.sendMessage(chatId, 'Choose an option:\n1. List Users\n2. Delete User by Name\n3. Go Back to Main Menu');

  bot.once('message', async (msg) => {
    const choice = msg.text;

    switch (choice) {
      case '1':
        // list users
        const users = await User.find({});
        if (users.length > 0) {
          const userList = users.map((user) => `${user.name} (${user.city}, ${user.country})`);
          bot.sendMessage(chatId, `List of Users:\n${userList.join('\n')}`);
        } else {
          bot.sendMessage(chatId, 'No users found.');
        }
        sendAdminMenu(chatId); 
        break;

      case '2':
        // deleting user by name
        bot.sendMessage(chatId, 'Enter the name of the user you want to delete:');

        bot.once('message', async (msg) => {
          const userName = msg.text;
          const userToDelete = await User.deleteOne({ name: userName });

          if (userToDelete.deletedCount > 0) {
            bot.sendMessage(chatId, `User ${userName} has been deleted.`);
          } else {
            bot.sendMessage(chatId, `User ${userName} not found.`);
          }

          sendAdminMenu(chatId); 
        });
        break;

      case '3':
        // go to main menu
        sendAdminMenu(chatId);
        break;

      default:
        bot.sendMessage(chatId, 'Invalid option. Please choose a valid option.');
        sendAdminMenu(chatId); 
        break;
    }
  });
}

// console that the bot has started
console.log('Bot has been started...');

