import React from "react";
import ReactModal from 'react-modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import _ from "lodash";
import actionCable from 'actioncable';

import Board from "./Board";
import ScoreTracker from "./ScoreTracker";

// TODO: Refactor template code to use react-bootstrap classes (<Button/>, <Form/>)
// TODO: See about using react-bootstrap modal instead of react-modal
class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      role: 'player', // valid: [player, spymaster],
      customDecks: [],
      selectedCustomDeckId: '',
      customDeck: null,
      gameState: {
        turn_order: '', // valid: [red, blue]
        board: [],
      },
      showModal: false
    }

    this.onRoleToggleChange = this.onRoleToggleChange.bind(this);
    this.onEndTurnBtnClick = this.onEndTurnBtnClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onCustomDeckSelect = this.onCustomDeckSelect.bind(this);
    this.onNewGameBtnClick = this.onNewGameBtnClick.bind(this);
    this.onCardSelect = this.onCardSelect.bind(this);
  }

  componentDidMount() {
    this.getCustomDecks();
    const webSocketUrl = $('#web-socket-url').textContent
    this.cable = actionCable.createConsumer(webSocketUrl);
    this.gameChannel = this.cable.subscriptions.create(
      { channel: "GameChannel", id: this.props.match.params.gameId },
      {
        connected: () => {
          console.log('CONNECTED');
          this.setGameState();
        },
        disconnected: () => { console.log('DISCONNECTED') },
        received: (data) => {
          let newState = { gameState: data['game_state'] };
          if(data['is_new_game']) { newState['role'] = 'player'; }
          this.setState(newState);
        },
      }
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.gameState.turn_order !== prevState.gameState.turn_order) {
      this.setTurnOrderBgColor();
    }

    this.setWinnerBgColor();
  }

  getCustomDecks() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    fetch(`/api/decks?game_identifier=${this.props.match.params.gameId}`, requestOptions)
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

  setGameState() {
    // gameState available (when redirecting from the lobby)
    const { gameState, customDeck } = this.props.location
    if (gameState !== undefined) {
      this.setState({ gameState, customDeck });
      return
    }

    // gameState NOT available (when visiting link directly)
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(`/api/${this.props.match.params.gameId}`, requestOptions)
      .then(
        (res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 404) {
            return Promise.reject('error 404');
          } else {
            return Promise.reject('some other error: ' + response.status)
          }
        }
      )
      .then(
        (result) => {
          this.setState({ gameState: result.state, customDeck: result.custom_deck });
        },
        (error) => {
          if (error === 'error 404') {
            this.props.history.push({
              pathname: '/',
              errorMsg: `Game "${this.props.match.params.gameId}" doesn't exist. Please check spelling or create new game.`
            });
          }
        }
      )
  }

  onCardSelect(index) {
    if(this.gameWinner()) { return; }

    const selectedCard = this.state.gameState.board[index];
    let newGameState = _.cloneDeep(this.state.gameState);

    if(selectedCard.type !== 'assassin' && (selectedCard.type !== this.currentTurnOrder() || selectedCard.type === 'neutral')) {
      newGameState.turn_order = this.notCurrentTurnOrder();
    }

    newGameState.board[index].is_selected = true

    this.broadcastNewState(newGameState);
  }

  broadcastNewState(newState) {
    this.setState({
      gameState: newState
    });

    this.gameChannel.send({
      new_state: newState
    });
  }

  currentTurnOrder() {
    return this.state.gameState.turn_order;
  }

  notCurrentTurnOrder() {
    return this.state.gameState.turn_order === 'red' ? 'blue' : 'red';
  }

  onEndTurnBtnClick() {
    if (this.gameWinner()) { return; }

    let newGameState = _.cloneDeep(this.state.gameState);
    newGameState.turn_order = this.notCurrentTurnOrder();
    this.broadcastNewState(newGameState);
  }

  onChangeDeckBtnClick() {
    this.openModal();
  }

  onNewGameBtnClick() {
    this.gameChannel.send({ msg: 'newGame' });
  }

  onRoleToggleChange(event) {
    event.preventDefault();
    this.setState({ role: event.target.value })
  }

  setTurnOrderBgColor() {
    // TO DO: Update className instead of css colors
    const redColor = '#DBAFAF';
    const blueColor = '#B7C9E5';
    if (this.state.gameState.turn_order == 'red') {
      $('body').css({ backgroundColor: redColor });
    } else {
      $('body').css({ backgroundColor: blueColor });
    }
  }

  setWinnerBgColor() {
    const redColor = '#DBAFAF';
    const blueColor = '#B7C9E5';

    if (this.gameWinner() === 'red') {
      $('body').css({ backgroundColor: redColor });
    } else if(this.gameWinner() === 'blue') {
      $('body').css({ backgroundColor: blueColor });
    } else {
      // do nothing
    }
  }

  remainingCards(teamColor) {
    let remaining = 0;
    this.state.gameState.board.forEach((card) => {
      if(card.type === teamColor && !card.is_selected) { ++remaining; }
    });

    return remaining;
  }

  assassinIsSelected() {
    return this.state.gameState.board.find((card) => card.type === 'assassin').is_selected;
  }

  gameWinner() {
    if(this.state.gameState.board.length === 0) { return false; }

    if((this.assassinIsSelected() && this.currentTurnOrder() === 'blue') || this.remainingCards('red') === 0) {
      return 'red';
    } else if((this.assassinIsSelected() && this.currentTurnOrder() === 'red') || this.remainingCards('blue') === 0) {
      return 'blue';
    } else {
      return false;
    }
  }

  goingFirst() {
    if(!this.isNewGame()) { return; }

    const maxCards = 9;
    if(this.remainingCards('red') === maxCards) {
      return 'red';
    } else if(this.remainingCards('blue') === maxCards) {
      return 'blue';
    }
  }

  isNewGame() {
    const selectedCard = this.state.gameState.board.find((card) => {
      return card.is_selected;
    });

    return selectedCard === undefined ? true : false;
  }

  openModal() {
    this.setState({ showModal: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal(){
    this.setState({ showModal: false });
  }

  onCustomDeckSelect(event) {
    event.preventDefault();
    this.setState({ selectedCustomDeckId: event.target.value });
  }

  renderChangeDeckModal() {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    let deckPickerDropdownOptions = [<option key='-1' value='-1'>Choose Deck</option>];

    this.state.customDecks.forEach((deck) => {
      deckPickerDropdownOptions.push(
        <option key={deck.id} value={deck.id}>{deck.name}</option>
      );
    })

    return (
      <ReactModal
        isOpen={this.state.showModal}
        contentLabel="Example Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <h3>Hello</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label>Include special cards (optional)</Form.Label>
            <Form.Control value={this.state.selectedCustomDeckId} onChange={this.onCustomDeckSelect} as="select">
              {deckPickerDropdownOptions}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <button
          onClick={this.closeModal}
          type="button"
          id="new-game-btn"
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </ReactModal>
    )
  }

  render() {
    let roleTogglePlayerClass = this.state.role === 'player' ? 'active' : '';
    let roleToggleSpymasterClass = this.state.role === 'spymaster' ? 'active' : '';

    const endTurnBtnText = this.state.gameState.turn_order === 'red' ? "End Red's Turn" : "End Blue's Turn";

    let middleMsg = '';
    if(this.gameWinner() === 'red') {
      middleMsg = 'Red Wins!';
    } else if(this.gameWinner() === 'blue') {
      middleMsg = 'Blue Wins!';
    } else if(this.goingFirst() === 'red') {
      middleMsg = 'Red goes first!';
    } else if(this.goingFirst() === 'blue') {
      middleMsg = 'Blue goes first!';
    }

    let leftMsg = '';
    if(this.state.customDeck) { leftMsg = `Playing with custom deck: ${this.state.customDeck}` }

    return (
      <div id='game-page-container'>
        { this.renderChangeDeckModal() }
        <div id='top-controls'>
          <ScoreTracker redScore={this.remainingCards('red')} blueScore={this.remainingCards('blue')} />
          <div id='middle-msg'>
            {middleMsg}
          </div>
          <button
            onClick={this.onEndTurnBtnClick}
            type="button"
            id="next-turn-btn"
            className="btn btn-dark"
          >
            {endTurnBtnText}
          </button>
        </div>
        <Board
          boardState={this.state.gameState.board}
          role={this.state.role}
          onCardSelect={this.onCardSelect}
          gameWinner={this.gameWinner()}
        />
        <div id='bottom-controls'>
          <div id='left-content'>
            {leftMsg}
          </div>
          <div id='right-content'>
            <div id='role-toggle-group' className="btn-group btn-group-toggle">
              <label className={`btn btn-secondary ${roleTogglePlayerClass}`}>
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={this.state.role === 'player'}
                  onChange={this.onRoleToggleChange}
                  className="form-check-input"
                /> Player
              </label>
              <label className={`btn btn-secondary ${roleToggleSpymasterClass}`}>
                <input
                  type="radio"
                  name="role"
                  value="spymaster"
                  checked={this.state.role === 'spymaster'}
                  onChange={this.onRoleToggleChange}
                  className="form-check-input"
                /> Spymaster
              </label>
            </div>
            <button
              onClick={this.openModal}
              type="button"
              id="change-deck-btn"
              className="btn btn-primary"
            >
              Game Options
            </button>
            <button
              onClick={this.onNewGameBtnClick}
              type="button"
              id="new-game-btn"
              className="btn btn-danger"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
