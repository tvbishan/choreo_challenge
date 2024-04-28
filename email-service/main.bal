import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/email;

configurable string expenseApiUrl = ?;
configurable string smtpHost = ?;
configurable string emailAddress = ?;
configurable string emailAppPassword = ?;

type Expense record {
    string createdAt;
    string email;
    string expenseData;
};

email:SmtpClient smtpClient = check new (smtpHost, emailAddress , emailAppPassword);

public function main() returns error? {
    io:println("expenseApiUrl: " + expenseApiUrl);
    http:Client expensesApiEndpoint = check new (expenseApiUrl);

    // Fetching the expenses
    Expense[] expenses = check expensesApiEndpoint->/todayRecordedExpenses;
    io:println("Processing Expenses...");

    foreach Expense expense in expenses {
        // Sending an email
        check sendEmailHtmlBody(expense);

        //io:println(expense.createdAt.toString());
        //io:println(expense.email.toString());
        //io:println(expense.expenseData.toString());
    }
}

function sendEmailHtmlBody(Expense expense) returns error? {    

    // Generating the email content
    string htmlEmailBody = "<p>Dear User,</p><h3>Expenses submited on " + expense.createdAt + "</h3>" + expense.expenseData;
    string htmlEmailBodyFooter = "<p>&nbsp;</p><hr><p>Expense Manager - Effortlessly Organize and Monitor Your Finances.</p>";    

    // Defines the email that is required to be sent.
    email:Message email = {
        to: expense.email,
        subject: "[Expense Manager] Daily Expenses Summary - " + expense.createdAt,
        htmlBody: htmlEmailBody + htmlEmailBodyFooter
    };    

    check smtpClient->sendMessage(email);
    //todo: error handling
    log:printInfo("Email sent successfully to: " + expense.email + "");   
}