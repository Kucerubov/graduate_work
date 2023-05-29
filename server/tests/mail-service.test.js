const nodemailerMock = require('nodemailer-mock');
const MailService = require('../service/mail-service');
const nodemailer = require('nodemailer');

const to = 'user@example.com';
const link = 'http://example.com/activate';

beforeEach(() => {
    nodemailerMock.mock.reset(); // Сбросить состояние эмулированного nodemailer перед каждым тестом
});
it('should not send an activation email if "to" address is empty', async () => {

    const emptyTo = '';

    await MailService.sendActivationMail(emptyTo, link);

    expect(nodemailerMock.mock.sentMail.length).toBe(0); // Проверка, что письмо не было отправлено
});
