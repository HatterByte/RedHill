import User from "../models/User.js";
import { sendMessage } from "../utils/sendMessage.js";
import logger from "../utils/logger.js";

// Telegram Webhook Handler
export const telegramWebhook = async (req, res) => {
  logger.info(`Webhook received: ${JSON.stringify(req.body)}`);

  const message = req.body.message;
  if (!message) return res.sendStatus(200); // Ignore empty requests

  const chatId = message.chat.id;
  const text = message.text;
  const contact = message.contact; // If user shares contact

  if (text === "/start") {
    logger.info(`Action: /start command received. Prompting user to send phone number. [chatId: ${chatId}]`);
    await sendMessage(
      chatId,
      "👋 Welcome! Please send your 10-digit phone number to register for OTP services.",
      {
        keyboard: [
          [{ text: "📞 Send My Phone Number", request_contact: true }],
          [{ text: "❌ Close" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    );
  } else if (contact) {
    logger.info(`Action: Contact shared. Phone: ${contact.phone_number}, chatId: ${chatId}`);
    const phoneNumber = contact.phone_number.slice(2);
    if (phoneNumber.length === 10) {
      let user = await User.findOneAndUpdate(
        { phone: phoneNumber },
        { chatId },
        { upsert: true }
      );
      if (!user) {
        user = await User.create({ phone: phoneNumber, chatId });
      }
      await sendMessage(
        chatId,
        `✅ Registered! Your phone (${phoneNumber}) is linked for OTP.`,
        {remove_keyboard: true,}
      );
      logger.info(`Action: Phone number valid. Registered/updated user for OTP. [phone: ${phoneNumber}, chatId: ${chatId}]`);
    } else {
      await sendMessage(
        chatId,
        "⚠️ Invalid phone number format. Please enter 10 digits manually.",
        {remove_keyboard: true,}
      );
      logger.info(`Action: Invalid phone number format received. [phone: ${contact.phone_number}, chatId: ${chatId}]`);
    }
  } else if (/^\d{10}$/.test(text)) {
    logger.info(`Action: 10-digit phone number received as text. Registering/updating user. [phone: ${text}, chatId: ${chatId}]`);
    let user = await User.findOneAndUpdate(
      { phone: text },
      { chatId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!user) {
      user = await User.create({ phone: text, chatId });
    }

    await sendMessage(
      chatId,
      `✅ Registered! Your phone (${text}) is linked for OTP.`,
      {remove_keyboard: true,}
    );
  } else if (text === "❌ Close") {
    logger.info(`Action: Close command received. Removing keyboard. [chatId: ${chatId}]`);
    await sendMessage(chatId, "", {
      remove_keyboard: true,
    });
  } else {
    logger.info(`Action: Unrecognized input. Prompting user to send phone number. [chatId: ${chatId}]`);
    await sendMessage(
      chatId,
      "Please send your mobile number to register either manually or by clicking the button below if you haven't done so yet.",
      {
        keyboard: [
          [{ text: "📞 Send My Phone Number", request_contact: true }],
          [{ text: "❌ Close" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    );
  }

  res.sendStatus(200);
};

//  Send OTP API
export const sendOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user || !user.chatId)
      return res.status(400).json({ message: "Phone not registered!" });

    await sendMessage(user.chatId, `🔢 Your OTP is : ${otp}`);

    res.json({ message: "OTP sent via Telegram!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
