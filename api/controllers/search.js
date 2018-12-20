const retriever = require('../../scripts/retriever');

module.exports.getSearchResults = (request, response, next) => {

    let query = request.query.q.split(" ");
    console.log(query);

    response.status(200).json({
        results: []
    });

}