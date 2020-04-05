import React from "react";
import { Link } from "react-router-dom";

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: ''
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({identifier: event.target.value});
  }

  onSubmit(event) {
    alert(this.state.identifier);
    event.preventDefault();
  }

  render() {
    return (
      <div className="primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">
            <p className="lead">
              Enter Game ID to join or create game!
            </p>
            <form onSubmit={this.onSubmit} className="text-center">
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  id="identifierFormInput" 
                  placeholder="Enter identifer" 
                  value={this.state.value}
                  onChange={this.onInputChange} 
                />
              </div>
              <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
