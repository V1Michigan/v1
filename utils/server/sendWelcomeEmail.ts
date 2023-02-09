import AWS from "aws-sdk";

AWS.config.update({ region: 'us-east-1' });
const SES = new AWS.SES({ apiVersion: '2010-12-01' });

if (
  process.env.NODE_ENV !== "development" &&
  (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
) {
  throw new Error('Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY');
}

const HTML_BODY = (firstName) => (`
  <html>
  <body>
  <img src="https://raw.githubusercontent.com/V1Michigan/images/master/platform_welcome_header.jpg" alt="V1 Platform" style="width: 100%;"/>
  <p>Hey ${firstName},</p>
  <p>Thank you for signing up for V1 Platform! We're so glad you're here. 🙂</p>
  <p>Platform is your home for engaging with the V1 community — connect with other members and get exclusive access to upcoming events.</p>
  <p><b>To make sure you get the most out of V1:</b></p>
  <ul>
    <li>
      <a href="https://v1michigan.com/welcome" target="_blank" rel="noopener noreferrer">
        Complete your profile
      </a>
    </li>
    <li>
      <a href="https://v1michigan.com/dashboard#events" target="_blank" rel="noopener noreferrer">
        RSVP for one of our upcoming events
      </a>
    </li>
  </ul>
  <p>Questions? Feel free to reply to this email — we'd love to answer any questions or hop on a quick introductory call to make sure you know how to get the most out of V1.</p>
  <p>Thank you for being a part of the V1 community! We can't wait for you to see what's next.</p>
  <p>Best,</p>
  <p>The V1 Team</p>
  </body>
  </html>
`);

const TEXT_BODY = (firstName) => (`
  Hey ${firstName},
  Thank you for signing up for V1 Platform! We're so glad you're here. 🙂
  Platform is your home for engaging with the V1 community — connect with other members and get exclusive access to upcoming events.
  To make sure you get the most out of V1:
  - Complete your profile: https://v1michigan.com/welcome
  - RSVP for one of our upcoming events: https://v1michigan.com/dashboard#events
  Questions? Feel free to reply to this email — we'd love to answer any questions or hop on a quick introductory call to make sure you know how to get the most out of V1.
  Thank you for being a part of the V1 community! We can't wait for you to see what's next.
  Best,
  The V1 Team
`);

const CONFIRMATION_EMAIL = (recipient, firstName) => ({
  Source: 'V1 Team <team@v1michigan.com>',
  Destination: {
    ToAddresses: [recipient],
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: HTML_BODY(firstName),
      },
      Text: {
        Charset: 'UTF-8',
        Data: TEXT_BODY(firstName),
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Welcome to V1! 🚀',
    },
  },
});

module.exports = async (recipient, name) => {
  if (!recipient) {
    throw new Error('Missing recipient');
  }
  if (!name) {
    throw new Error('Missing name');
  }

  const firstName = name.split(' ')[0];
  const params = CONFIRMATION_EMAIL(recipient, firstName);

  const data = await SES.sendEmail(params).promise();
  return data.MessageId;
};