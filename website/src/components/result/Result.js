import React from 'react';

import './Result.css';

class Result extends React.Component {
    
    render() {
        return (
            <div className="Result">
                <a className="title" href={this.props.data.href}>{this.props.data.title}</a>
                <p className="description">{this.props.data.description}</p>
                <a className="hyperlink" href={this.props.data.href}>{this.props.data.href}</a>
            </div>
        );
    }
}

export default Result;