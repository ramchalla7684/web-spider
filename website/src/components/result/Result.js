import React from 'react';

import './Result.css';

class Result extends React.Component {

  constructor(props)
  {
    super(props);

    this.redirect = this.redirect.bind(this);
  }

  redirect(href)
  {
    window.open(href, "_blank");
  }

    render() {
        return (
            <div className="Result">
                <p className="title" onClick={() => this.redirect(this.props.data.href)}>{this.props.data.title}</p>
                <p className="description">{this.props.data.description}</p>
                <cite className="hyperlink" onClick={() => this.redirect(this.props.data.href)}>{this.props.data.href}</cite>
            </div>
        );
    }
}

export default Result;
