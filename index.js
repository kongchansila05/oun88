// Import required libraries
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

// Environment variables and constants
const API_KEY =
    process.env.API_KEY || "7851643460:AAFz11J57KVLIIBvPyGfYfOtZo6ZEF6PUWk";
const bot = new TelegramBot(API_KEY, { polling: true });

const REGISTER_API = "https://p-api.sbc369.club/api/cash/registration/";
const LOGIN_API = "https://p-api.sbc369.club/api/cash/login/";
const CAPTION =
    "សំរាប់ចម្ងល់ឬបញ្ហាផ្សេងៗ នឹង ដាក់/ដក ប្រាក់ ចុចទីនេះ 👉🏻 @OUN88  បញ្ជាក់៖ នេះជាម៉ាសុីនសម្រាប់តែបង្កើតអាខោន មិនចេះឆ្លើយតបទេ។ សូមអរគុណ!";
const CERT = "aeR7xc6PTGXPWDZe4YmAP9";
const IMAGE_URL = "https://i.ibb.co/ZS0XCdd/1637389470-0-promotion-1-1.jpg";
const Authorization = "Token 5868453c13eb70f804b279c97ca4e84a7ef1d14f";

// Function to get public IP
function generateNineDigitNumber() {
    return Math.floor(100000000 + Math.random() * 900000000);
}

function handleContactCommand(chatId) {
    bot.sendPhoto(chatId, IMAGE_URL, { caption: CAPTION });
}


// Handle /register and /start commands
bot.onText(/\/(register|start)/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";
    const lastName = msg.from.last_name || "";
    const UserName = msg.from.username || "";
    const FullName = `${firstName}${lastName}`.trim();
    const Password = msg.from.id;
    const Phone = generateNineDigitNumber();
    let data_l = {
        username: FullName,
        password: Password,
        cert: CERT,
    };
    let data_r = {
        account: FullName,
        name: UserName,
        password: Password,
        contact: Phone,
        affiliate: "",
        cert: CERT,
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: Authorization,
    };
    axios.post(REGISTER_API, data_r, { headers })
    .then((response) => {
        if (response.status === 201) {
            axios.post(LOGIN_API, data_l, { headers })
                .then((responseLogin) => {
                    if (responseLogin.status === 200) {
                        bot.sendMessage(chatId, `អ្នកបង្កើត អាខោន ជោគជ័យ!`);
                        const { domain, sessionid, userid } = responseLogin.data;
                        bot.sendMessage(
                            chatId,
                            `Your account: \`${FullName}\`\nYour password: \`${Password}\``,
                            { parse_mode: "Markdown" }
                        );
                        const rehref = `${domain}/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
                        bot.sendMessage(chatId, `Login:\n${rehref}`);
                        handleContactCommand(chatId);
                    }
                })
                .catch((error) => {
                    handleError(error, chatId, FullName, Password, data_l, headers);
                });
        }
    })
    .catch((error) => {
        handleError(error, chatId, FullName, Password, data_l, headers);
    });
});
function handleError(error, chatId, FullName, Password, data_l, headers) {
    if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "The account is already exists!") {
            handleLogin(chatId, FullName, Password, data_l, headers);
        } else if (errorMessage === "The phone number is already exists!") {
            bot.sendMessage(chatId, `លេខទូរស័ព្ទមានហើយ!`);
        } else if (errorMessage === "Minimum username 6 digits and maxiumm 10 digits!") {
            bot.sendMessage(
                chatId,
                `ឈ្មោះអ្នកប្រើអប្បបរមា 6 ខ្ទង់ និងអតិបរមា 10 ខ្ទង់!`
            );
        } else if (errorMessage === "Username contains space!") {
            bot.sendMessage(
                chatId,
                `ឈ្មោះអ្នកប្រើប្រាស់មានកន្លែងទំនេរ!`
            );
        } else if (errorMessage === "Username or password is not valid!") {
            bot.sendMessage(
                chatId,
                `ឈ្មោះរបស់អ្នកមានរួចហេីយសូមធ្វេីការដូរឈ្មោះតេឡេក្រាមលោកអ្នក!`
            );
        } else {
            bot.sendMessage(
                chatId,
                `Unexpected error: ${errorMessage}`
            );
        }
    } else {
        bot.sendMessage(
            chatId,
            `Bot is temporarily down. Please try again later.`
        );
    }
}
function handleLogin(chatId, FullName, Password, data_l, headers) {
    axios.post(LOGIN_API, data_l, { headers })
        .then((responseLogin) => {
            if (responseLogin.status === 200) {
                bot.sendMessage(chatId, `អ្នកមាន អាខោន រួចហើយ!`);

                const {domain, sessionid, userid } = responseLogin.data;
                bot.sendMessage(
                    chatId,
                    `Your account: \`${FullName}\`\nYour password: \`${Password}\``,
                    { parse_mode: "Markdown" },
                );
               const rehref = `${domain}/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
                bot.sendMessage(chatId, `Login:\n${rehref}`);
                handleContactCommand(chatId);
            } else {
                console.log("Unexpected response:", responseLogin.data);
            }
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.message;
            if (errorMessage === "Username or password is not valid!") {
                bot.sendMessage(
                    chatId,
                    `ឈ្មោះរបស់អ្នកមានរួចហេីយសូមធ្វេីការដូរឈ្មោះតេឡេក្រាមលោកអ្នក!`,
                );
            }
        });
}
// Handle /contact command
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    handleContactCommand(chatId);
});

const express = require("express");
const { log } = require("console");
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
);
