const moment = require('moment');

const columnIndices = {
    "reference": 0,
    "datetime": 1,
    "valuedate": 2,
    "debit": 3,
    "credit": 4,
    "trname": 5,
    "contragent": 6,
    "rem_i": 7,
    "rem_ii": 8,
    "rem_iii": 9,
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
    let debit = columns[columnIndices.debit] ? parseFloat(columns[columnIndices.debit].replace(",", "")) : null;
    let credit = columns[columnIndices.credit] ? parseFloat(columns[columnIndices.credit].replace(",", "")) : null;
    let transactionName = columns[columnIndices.trname];
    let reference = columns[columnIndices.reference];
    let contragent = columns[columnIndices.contragent];
    let rem1 = columns[columnIndices.rem_i];
    let rem2 = columns[columnIndices.rem_ii];
    let rem3 = columns[columnIndices.rem_iii];
    let combined = transactionName + " " + contragent + " " + rem1 + " " + rem2 + " " + rem3;

    let newLine = [
        dateTime.format("YYYY-MM-DD"),
        debit,
        credit,
        reference,
        combined
    ].join(";");

    return newLine;
}

function parseDateTime(dateTime) {
    var datePart = dateTime.split(" ")[0];
    return moment(datePart, "DD/MM/YYYY");
}

function createHeader() {
    return "date;debit;credit;reference;combined\n";
}

module.exports = transformStatement;