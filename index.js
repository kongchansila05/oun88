const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const API_KEY =
    process.env.API_KEY || "7851643460:AAFz11J57KVLIIBvPyGfYfOtZo6ZEF6PUWk";
const bot = new TelegramBot(API_KEY, { polling: true });

const REGISTER_API = "https://p-api.sbc369.club/api/cash/registration/";
const LOGIN_API = "https://p-api.sbc369.club/api/cash/login/";
const CAPTION ="សំរាប់ចម្ងល់ឬបញ្ហាផ្សេងៗ នឹង ដាក់/ដក ប្រាក់ ចុចទីនេះ 👉🏻 @OUN88  បញ្ជាក់៖ នេះជាម៉ាសុីនសម្រាប់តែបង្កើតអាខោន មិនចេះឆ្លើយតបទេ។ សូមអរគុណ!";
const CERT = "aeR7xc6PTGXPWDZe4YmAP9";
const IMAGE_welcome = "https://oun88.me/photos/banner_kh/1723705280banner-24-2.jpg";
const IMAGE_88 = "https://oun88.me/photos/article/1637389470_0_promotion-1.1.jpg";
const IMAGE_10 = "https://oun88.me/photos/article/1637389513_0_promotion-2_(2).jpg";
const IMAGE_5 = "https://oun88.me/photos/article/1637389609_0_promotion-3.1.jpg";
const Authorization = "Token 5868453c13eb70f804b279c97ca4e84a7ef1d14f";
function generateNineDigitNumber() {
    return Math.floor(100000000 + Math.random() * 900000000);
}

function handleContactCommand(chatId) {
    bot.sendPhoto(chatId, IMAGE_welcome, {
        caption: CAPTION,
        parse_mode: "HTML", // Use HTML formatting for the caption
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/oun88" }
                ]
            ]
        }
    });
}

bot.onText(/\/(myaccount|start)/, async (msg) => {
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
    axios.post(LOGIN_API,data_l,{
        headers: headers
      }).then((response)=>{
        if(response.status == '200'){
            const { domain, sessionid, userid } = response.data;
            const rehref = `${domain}/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
            bot.sendMessage(
                chatId,
                `👤ឈ្មោះ​គណនី: <code>${FullName}</code>\n🔐 លេខសម្ងាត់: <code>${Password}</code>\n🌐 ចូលលេង: <a href="${rehref}">OUN88</a>`,
                { parse_mode: "HTML" }
            ).then(() => {
                handleContactCommand(chatId);
            });
        }
    }).catch(error => {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Username or password is not valid!") {
            axios.post(REGISTER_API, data_r, { headers })
            .then((response) => {
                if (response.status === 201) {
                    axios.post(LOGIN_API, data_l, { headers })
                    .then((responseLogin) => {
                        if (responseLogin.status === 200) {
                            const { domain, sessionid, userid } = responseLogin.data;
                            const rehref = `${domain}/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
                            bot.sendMessage(
                                chatId,
                                `👤ឈ្មោះ​គណនី: <code>${FullName}</code>\n🔐 លេខសម្ងាត់: <code>${Password}</code>\n🌐 ចូលលេង: <a href="${rehref}">OUN88</a>`,
                                { parse_mode: "HTML" }
                            ).then(() => {
                                handleContactCommand(chatId);
                            });
                        }
                    });
                }
            })
            .catch((errorr) => {
                if (errorr.response && errorr.response.data) {
                    const errorMessage = errorr.response.data.message;
                if (errorMessage === "The account is already exists!") {
                    bot.sendMessage(
                        chatId,
                        `ឈ្មោះរបស់អ្នកមានរួចហេីយសូមធ្វេីការដូរឈ្មោះតេឡេក្រាមលោកអ្នក!`
                    );
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
                }else {
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
            });
        }
    });
});
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    handleContactCommand(chatId);
});
bot.onText(/\/promotion/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
        `🌟<b>ការផ្តល់ជូនពិសេស OUN88</b> 🌟\n\n 🎁ស្វាគមន៏សមាជិថ្មី 88%\n 🎁ប្រាក់បន្ថែមរៀងរាល់ថ្ងៃ 10%\n 🎁ប្រាក់បង្វិលប្រចាំខែ 5%`, 
        {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "ស្វាគមន៏សមាជិថ្មី 88%", callback_data: "promo_80" }],
                    [{ text: "ប្រាក់បន្ថែមរៀងរាល់ថ្ងៃ 10%", callback_data: "promo_10" }],
                    [{ text: "ប្រាក់បង្វិលប្រចាំខែ 5%", callback_data: "promo_5" }],
                ]
            }
        }
    );
    
});

bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    if (data === "promo_80") {
        bot.sendPhoto(message.chat.id, IMAGE_88, {
            caption: `🎁ស្វាគមន៏សមាជិថ្មី 80%🧧\n\n - វិលជុំ x7 (ហ្គេមស្លុត)\n - វិលជុំ x13 (ហ្គេមឡាយផ្ទាល់, បាញ់ត្រី)\n - ដាក់ប្រាក់តិចបំផុត $10\n - ដកប្រាក់ធំបំផុត $288`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/oun88" }
                    ]
                ]
            }
        });
    } else if (data === "promo_10") {
        bot.sendPhoto(message.chat.id, IMAGE_10, {
            caption: `🧧ប្រាក់បន្ថែមរៀងរាល់ថ្ងៃ 20%🧧\n\n - វិលជុំ x4 (ហ្គេមស្លុត)\n - វិលជុំ x8 (ហ្គេមឡាយផ្ទាល់, បាញ់ត្រី)\n - ដាក់ប្រាក់តិចបំផុត $10\n - ដកប្រាក់ធំបំផុត $188`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/oun88" }
                    ]
                ]
            }
        });
    } else if (data === "promo_5") {
        bot.sendPhoto(message.chat.id, IMAGE_5, {
            caption: `🧧 ប្រាក់បង្វិលប្រចាំខែ 5%🧧\n\n - វិលជុំ x4 (ហ្គេមស្លុត)\n - វិលជុំ x8 (ហ្គេមឡាយផ្ទាល់, បាញ់ត្រី)\n - ដាក់ប្រាក់តិចបំផុត $10\n - ដកប្រាក់ធំបំផុត $188`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "👩‍💻ផ្នែកសេវាកម្ម 24/7", url: "https://t.me/oun88" }
                    ]
                ]
            }
        });
    } else if (data === "register") {
        bot.sendMessage(message.chat.id, "You clicked on Register Now!");
    } 
});


const express = require("express");
const { log } = require("console");
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
);
