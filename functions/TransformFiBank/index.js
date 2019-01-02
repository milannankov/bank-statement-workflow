const transformStatement = require('./bank-statement-transform');

module.exports = function (context, req) {

    if (req.body) {
        let statement = req.body.toString();
        let transformedStatement = transformStatement(statement);

        context.res = {
            body: transformedStatement,
            headers: {
                'Content-Type': 'text/csv'
            }
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a file for processing"
        };
    }

    context.done();
};