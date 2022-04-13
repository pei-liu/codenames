import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      identifier: '',
      customDecks: [], // arr of strings
      selectedCustomDeckId: '',
      errorMsg: '',
    }

    this.gameIdInputChange = this.gameIdInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCustomDeckSelect = this.onCustomDeckSelect.bind(this);
  }

  componentDidMount() {
    this.getCustomDecks();
    const { errorMsg } = this.props.location;
    this.setState({
      errorMsg
    })
  }

  getCustomDecks() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    fetch(`/api/decks?include_private_decks=${this.inSecretLobby()}`, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            customDecks: JSON.parse(result.decks),
            selectedCustomDeckId: -1,
          });
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
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const selectedCustomDeckId = this.state.selectedCustomDeckId === -1 ? '' : this.state.selectedCustomDeckId;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
      body: JSON.stringify({custom_deck_id: selectedCustomDeckId}),
    };

    // TO DO: Instead of fetching the game state here, find a way to just have Game.jsx do it.
    fetch(`/api/${this.state.identifier}`, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.props.history.push({
            pathname: `/${this.state.identifier}`,
            gameState: result.state,
            customDeck: result.custom_deck
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
    this.setState({ selectedCustomDeckId: event.target.value });
  }

  renderDeckPickerDropdownOptions() {
    let options = [<option key='-1' value='-1'>Choose Deck</option>];

    this.state.customDecks.forEach((deck) => {
      options.push(
        <option key={deck.id} value={deck.id}>{deck.name}</option>
      );
    })

    return options;
  }

  render() {
    let adminMsg;
    let customDeckDropdown;
    let errorMsg;
    if (this.inSecretLobby()) {
      adminMsg = (<p>Welcome back, boss.</p>);
    }

    if (this.state.errorMsg) {
      errorMsg = (
        <div class="alert alert-danger" role="alert">
          {this.state.errorMsg}
        </div>
      )
    }
    customDeckDropdown = (
      <Form.Group>
        <Form.Label>Include special cards (optional) </Form.Label>
        <Form.Control value={this.state.selectedCustomDeckId} onChange={this.onCustomDeckSelect} as="select">
          {this.renderDeckPickerDropdownOptions()}
        </Form.Control>
      </Form.Group>
    );

    return (
      <div id='lobby-page-container' className="primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">
            {adminMsg}
            {errorMsg}
            <p className="lead">
              Enter Game ID to join or create game!
            </p>
            <Form onSubmit={this.onSubmit} className="lobby-form">
              <Form.Group>
                <Form.Control onChange={this.gameIdInputChange} type="text" placeholder="Game ID" />
              </Form.Group>
              {customDeckDropdown}
              <div className="flexed-buttons">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                {this.inSecretLobby() ?
                  <Link to='/newdeck'>
                    <Button type="button" variant="secondary">
                        Create New Deck
                    </Button>
                  </Link>
                  : null
                }
              </div>
              
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Lobby;
