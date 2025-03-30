//Function to set the webhook for the Telegram bot
import dotenv from "dotenv";

dotenv.config();

const setWebhook = async () => {
  const webhookUrl = process.env.webhookUrl;
  await fetch(`${TELEGRAM_API_URL}/setWebhook?url=${webhookUrl}`);
};
setWebhook();
