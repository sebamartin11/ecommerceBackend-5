const path = require("path");
const { transporter, twilioClient } = require("../utils/messenger.utils");
const {
  GMAIL_AUTHOR,
  TWILIO_PHONE_NUMBER,
  TWILIO_VERIFIED_CALLER, API_URL
} = require("../config/env.config");
const { tokenResetPassword } = require("../utils/jwt.utils");

class MessagesService {
  // Send an email to confirm a new ticket order.
  async ticketCreatedEmail(createNewTicket) {
    const mailParams = {
      from: GMAIL_AUTHOR,
      to: createNewTicket.purchaser,
      subject: "CheckOut Confirmation",
      html: `
        <h1>Order confirm ${createNewTicket.code}</h1>
        <h3>Thank you!</h3>
        `,
      attachments: [
        {
          filename: "invoicePlaceholder.jpg",
          path: path.resolve(
            __dirname,
            "../public/assets/invoices/invoicePlaceholder.jpg"
          ),
          cid: "PurchaseConfirm",
        },
      ],
    };

    await transporter.sendMail(mailParams);
  }

  // Send an SMS to confirm a new ticket order.
  async ticketCreatedSMS(createNewTicket) {
    await twilioClient.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: TWILIO_VERIFIED_CALLER,
      body: `Your order: ${createNewTicket.code} has been confirmed. Delivery will be made within the next 2 weeks.`,
    });
  }

  // Send an email with a password reset link.
  async resetPasswordEmail(req) {
    const { email } = req.body;
    const token = tokenResetPassword(email);
    const link = `http://${API_URL}/newPassword?token=${token}`;
    const mailParams = {
      from: GMAIL_AUTHOR,
      to: email,
      subject: "Reset Password",
      html: `
      <h3>Click <a href="${link}">here</a> to reset your password. This link will expire in 1 hour.</h3>
      <h5>Ignore this email if you don't want to change your password</h5>
      `,
      attachments: [],
    };

    await transporter.sendMail(mailParams);
  }

  // Send an email with the notification for User deletion.

  async deletionNotificationEmail(user) {
    const mailParams = {
      from: GMAIL_AUTHOR,
      to: user.email,
      subject: "Notification for User deletion",
      html: `
      This is a notification that your user account is scheduled for deletion. This is due to your inactivity for more than 2 days. If you want to prevent this, you have 1 hour to log in.
        `,
      attachments: [],
    };

    await transporter.sendMail(mailParams);
  }

  // Send an email notification to a user with the 'Premium' role about the deletion of a product.

  async deletePremiumProduct(user, productById) {
    const mailParams = {
      from: GMAIL_AUTHOR,
      to: user.email,
      subject: "Notification: Product deleted",
      html: `
      <p>Dear ${user.first_name},</p>
      <p>This is to notify you that your product with ID ${productById._id} has been deleted.</p>
      <p>If you have any questions or concerns, please feel free to contact us.</p>
      <p>Thank you for your understanding.</p>
        `,
      attachments: [],
    };

    await transporter.sendMail(mailParams);
  }
}

module.exports = { MessagesService };
