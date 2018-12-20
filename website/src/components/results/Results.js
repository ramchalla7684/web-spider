import React from 'react';

import Result from '../result/Result';

import './Results.css';

class Results extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: new URLSearchParams(props.location.search).get("q"),
            results: [{ href: "https://www.sciencedaily.com/terms/flower.htm", description: "A flower, also known as a bloom or blossom, is the reproductive structure found in flowering plants.", title: "Flower" }, { href: "https://www.sciencedaily.com/releases/2018/12/181218115205.htm", description: "The discovery in China of fossil specimens of a flower called Nanjinganthus from the Early Jurassic shakes up widely accepted theories of plant evolution.", title: "Fossils suggest flowers originated 50 million years earlier than thought -- ScienceDaily" }]
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
    }

    onInputChange(event) {

        this.setState({
            query: event.target.value
        });
    }

    getSearchResults() {
        fetch('http://localhost:2000/api/search'.concat('?q=', this.state.query))
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            })
            .then(response => this.setState({
                results: response.results
            }))
            .catch(error => console.error(error))
    }

    render() {

        let results = this.state.results.map((result) => <Result key={result.href} data={result} />);

        return (
            <div className="Results">
                <div className="search-container">
                    <input className="query-field" name="query" value={this.state.query} onChange={this.onInputChange} />
                    <i className="fa fa-search" onClick={this.getSearchResults}></i>
                    <li className="fa fa-microphone"></li>
                </div>

                <div className="results-container">
                    {results}
                </div>
            </div>
        );
    }
}

export default Results;