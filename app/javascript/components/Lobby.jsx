import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      identifier: '',
      customDecks: [], // arr of strings
      selectedCustomDeck: 'Select Custom Deck',
    }

    this.gameIdInputChange = this.gameIdInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCustomDeckSelect = this.onCustomDeckSelect.bind(this);
  }

  componentDidMount() {
    if(this.inSecretLobby()) { this.getCustomDecks(); }
  }

  getCustomDecks() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    fetch(`/api/custom_decks`, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ customDecks: result.deck_names });
        },
        (error) => {
          console.log(error);
          // TO DO handle error
        }
      );
  }

  inSecretLobby() {
    return this.props.location.pathname === '/secretlobby';
  }

  gameIdInputChange(event) {
    this.setState({identifier: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();
    debugger
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    };

    fetch(`/api/${this.state.identifier}`, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.history.push({
            pathname: `/${this.state.identifier}`,
            gameState: result.state
          });
        },
        (error) => {
          console.log(error);
          // TO DO handle error
        }
      )
  }

  onCustomDeckSelect(event) {
    event.preventDefault();
    this.setState({ selectedCustomDeck: event.target.value });
  }

  renderDeckPickerDropdownOptions() {
    return this.state.customDecks.map((deckName) => {
      return(
        <option key={deckName}>{deckName}</option>
      );
    })
  }

  render() {
    let adminMsg;
    let customDeckDropdown;
    if (this.inSecretLobby()) {
      adminMsg = (<p>Welcome back, boss.</p>)

      customDeckDropdown = (
        <Form.Group>
          <Form.Label>Custom Deck</Form.Label>
          <Form.Control onChange={this.onCustomDeckSelect} as="select">
            {this.renderDeckPickerDropdownOptions()}
          </Form.Control>
        </Form.Group>
      );
    }

    return (
      <div id='lobby-page-container' className="primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">
            {adminMsg}
            <p className="lead">
              Enter Game ID to join or create game!
            </p>
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Control onChange={this.gameIdInputChange} type="text" placeholder="Game ID" />
              </Form.Group>
              {customDeckDropdown}
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
