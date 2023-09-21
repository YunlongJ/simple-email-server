import {SMTPServer} from "smtp-server";
import {MailParser, simpleParser} from "mailparser";

const PORT = 25;
let startEmailServer = function () {

    let options = {
        name: "Postfix (Ubuntu)", //helps to avoid tempmail detection
        secure: false,
        authOptional: true,
        sessionTimeout: 20,
        size: 1048576, //1MB
        disabledCommands: ["AUTH", "STARTTLS"],
        onData: function (stream, session, callback) {
            emailDataStorage(stream, session);
        }
    };
    let server = new SMTPServer(options);
    server.on("error", (e) => {
        console.error("Error in EmailServer" + e);
    })
    //listen
    server.listen(PORT, () => {
        console.log(`Email server listening on port ${PORT}`);
    });
}

let emailDataStorage = function (stream, session) {
    simpleParser(stream)
        .then(parsed => {
            const sender = session.envelope.mailFrom ? session.envelope.mailFrom.address : undefined;
            const rcpt   = session.envelope.rcptTo.map(rcpt => rcpt.address)[0];
            let email = {
                from: sender,
                rcpt: rcpt,
                subject: parsed.subject,
                html: parsed.html,
                body: parsed.text,
                date: Date.now(),
                ip: session.remoteAddress
            }
            console.log("receive email is " + JSON.stringify(email));
        })
        .catch(err => {
            console.error(err);
        });
};
startEmailServer();