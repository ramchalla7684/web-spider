const { Retriever } = require('../../scripts/retriever');

let retriever = new Retriever();

module.exports.getSearchResults = (request, response, next) => {

    let query = request.query.q;
    let results = retriever.retrieve(query);

    response.status(200).json({ results });

}