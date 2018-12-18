import React from 'react';

class Result extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <a href={this.props.href}>{this.props.title}</a>
                <p>{this.props.description}</p>
                <a href={this.props.href}>{this.props.href}</a>
            </div>
        );
    }
}

export default Result;