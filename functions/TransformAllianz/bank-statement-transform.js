const moment = require('moment');

const columnIndices = {
    "datetime": 0,
    "amount": 2,
    "dtkt": 3,
    "reference": 1,
    "transactionName": 4,
    "contragent": 5,
    "rem_i": 6,
    "rem_ii": 7,
    "rem_iii": 8,
}

function transformStatement(bankStatement) {
    let newLines = bankStatement
        .split("\n")
        .slice(1)
        .filter(line => line != "")
        .map(line => transformStatementLine(line));

    let transformedStatement = createHeader() + newLines.join("\n");

    return transformedStatement;
}

function transformStatementLine(line) {
    let columns = line.split("|");
    let dateTime = parseDateTime(columns[columnIndices.datetime]);
    let debitCredit = columns[columnIndices.dtkt];
    let amount = parseFloat(columns[columnIndices.amount].replace(",", ""));
    let debit = debitCredit.toLowerCase() == "d" ? amount : null;
    let credit = debitCredit.toLowerCase() == "k" ? amount : null;
    let transactionName = columns[columnIndices.transactionName];
    let reference = columns[columnIndices.reference];
    let contragent = columns[columnIndices.contragent];
    let rem1 = columns[columnIndices.rem_i];
    let rem2 = columns[columnIndices.rem_ii];
    let rem3 = columns[columnIndices.rem_iii];
    let combined = transactionName + "" + contragent + " " + rem1 + " " + rem2 + " " + rem3;

    let newLine = [
        dateTime.format("YYYY-MM-DD"),
        debit,
        credit,
        reference,
        transactionName,
        combined
    ].join(";");

    return newLine;
}

function parseDateTime(dateTime) {
    var datePart = dateTime.split(" ")[0];
    return moment(datePart, "DD/MM/YYYY");
}

function createHeader() {
    return "date;debit;credit;reference;transactionName;combined\n";
}

module.exports = transformStatement;