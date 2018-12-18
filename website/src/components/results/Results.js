import React from 'react';

import Result from '../result/Result';

import './Results.css';

class Results extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: "",
            results: [{ href: "Htjdcbjdcb", description: "dhcvhevuie", title: "title" }, { href: "Htjdcbjdcb", description: "dhcvhevuie", title: "title" }]
        };

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(event) {

        this.setState({
            query: event.target.value
        });
    }

    render() {

        let results = this.state.results.map((result) => <Result key={result.href} data={result} />);

        return (
            <div className="Results">
                <div className="search-container">
                    <input className="query-field" name="query" value={this.state.query} onChange={this.onInputChange} />
                    <i className="fa fa-search"></i>
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