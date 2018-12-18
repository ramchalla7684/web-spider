import React from 'react';
import './Home.css';
import speechRecognition from '../../util/speech';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBoxState: "collapsed",
            voiceBoxState: "inactive",
            query: ""
        };

        this.onMouseEnterSearchBox = this.onMouseEnterSearchBox.bind(this);
        this.onMouseLeaveSearchBox = this.onMouseLeaveSearchBox.bind(this);

        this.onMouseEnterMicroPhone = this.onMouseEnterMicroPhone.bind(this);
        this.onMouseLeaveMicroPhone = this.onMouseLeaveMicroPhone.bind(this);

        this.onClickMicroPhone = this.onClickMicroPhone.bind(this);

        this.onInputChange = this.onInputChange.bind(this);
    }

    componentDidMount() {

        document.addEventListener('keydown', (event) => {

            if (this.state.searchBoxState === "collapsed") {
                let keyCharCode = event.key.length === 1 ? event.key.charCodeAt(0) : -1;
                if ((keyCharCode >= 97 && keyCharCode < 97 + 26) || (keyCharCode >= 65 && keyCharCode < 65 + 26)) {
                    this.setState({
                        searchBoxState: "expanded"
                    }, () => {
                        document.querySelector(".Home #input-query").focus();
                    });
                }
                else if (event.key === " ") {
                    this.setState({
                        searchBoxState: "expanded"
                    }, () => {
                        document.querySelector(".Home #input-query").focus();
                    });
                }
            }
        });
    }

    onMouseEnterSearchBox() {
        this.setState({
            searchBoxState: "expanded"
        });
    }

    onMouseLeaveSearchBox() {
        if (!this.state.query || this.state.query.length === 0) {
            this.setState({
                searchBoxState: "collapsed"
            }, () => {
                document.querySelector(".Home #input-query").blur();
            });
        }
    }

    onMouseEnterMicroPhone() {

        if (this.state.voiceBoxState === "active") {
            return;
        }

        this.setState({
            voiceBoxState: "hover"
        });
    }

    onMouseLeaveMicroPhone() {

        if (this.state.voiceBoxState === "active") {
            return;
        }

        this.setState({
            voiceBoxState: "inactive"
        });
    }


    onClickMicroPhone() {

        if (this.state.voiceBoxState !== "active") {

            let query = '';
            speechRecognition.onresult = (event) => {
                var current = event.resultIndex;
                var transcript = event.results[current][0].transcript;
                var mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);

                if (!mobileRepeatBug) {
                    query += transcript;
                }
                this.setState({
                    query,
                    searchBoxState: "expanded"
                });
            };

            speechRecognition.start();
        }
        else {
            speechRecognition.stop();
            console.log('Voice recognition paused.');
        }

        this.setState({
            voiceBoxState: "active"
        });
    }

    onInputChange(event) {
        let searchBoxState = "expanded";
        if (event.target.value.length === 0) {
            searchBoxState = "collapsed";
        }
        this.setState({
            query: event.target.value,
            searchBoxState
        });
    }

    render() {

        let instructions = () => {

            if (this.state.voiceBoxState === "inactive") {
                return "......";
            }
            else if (this.state.voiceBoxState === "active") {
                return "Listening...";
            }
            else if (this.state.voiceBoxState === "hover") {
                return "Click & Speak";
            }

            return "......";
        }

        return (
            <div className="Home">
                <div className={"search-box".concat(" ", this.state.searchBoxState)} onMouseEnter={this.onMouseEnterSearchBox} onMouseLeave={this.onMouseLeaveSearchBox}>
                    <input id="input-query" className="search-txt" type="text" name="query" placeholder="Enter text to search" value={this.state.query} onChange={this.onInputChange} />
                    <i className="icon-search fa fa-search"></i>
                </div>
                <div className={"voice-box".concat(" ", this.state.voiceBoxState)}>
                    <i className="icon-microphone fa fa-microphone" onMouseEnter={this.onMouseEnterMicroPhone} onMouseLeave={this.onMouseLeaveMicroPhone} onClick={this.onClickMicroPhone}></i>
                    <p className="instructions">{instructions()}</p>
                </div>
            </div>
        );
    }
}

export default Home;