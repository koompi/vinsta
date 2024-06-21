
const botToken = '7339995010:AAGKK95yHIzzqDXRgyPQwX0FwQf9iG6azo8'; // Replace with your Telegram bot token
const { Telegraf } = require('telegraf');

const bot = new Telegraf(botToken);

// Start command handler
bot.start((ctx) => {
  ctx.reply('Welcome! Send /get_chatid to get your chat ID.');
});

// Help command handler
bot.help((ctx) => {
  ctx.reply('Send /get_chatid to get your chat ID.');
});

// Command to get chat ID
bot.command('get_chatid', (ctx) => {
  const chatId = ctx.chat.id;
  ctx.reply(`Your Chat ID is: ${chatId}`);
});

// Start polling
bot.launch().then(() => {
  console.log('Bot is running');
}).catch((err) => {
  console.error('Bot launch error:', err);
});
