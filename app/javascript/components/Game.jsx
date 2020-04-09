import React from "react";
import $ from "jquery";
import _ from "lodash";
import actionCable from 'actioncable';
import Board from "./Board";
import ScoreTracker from "./ScoreTracker";


class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      role: 'player', // valid: [player, spymaster]
      gameState: {
        turn_order: '', // valid: [red, blue]
        board: [],
      },
    }

    this.onRoleToggleChange = this.onRoleToggleChange.bind(this);
    this.onEndTurnBtnClick = this.onEndTurnBtnClick.bind(this);
    this.onNewGameBtnClick = this.onNewGameBtnClick.bind(this);
    this.onCardSelect = this.onCardSelect.bind(this);
  }

  componentDidMount() {
    this.setGameState();
    const webSocketUrl = $('#web-socket-url').textContent
    this.cable = actionCable.createConsumer(webSocketUrl);
    this.gameChannel = this.cable.subscriptions.create(
      { channel: "GameChannel", id: this.props.match.params.gameId },
      {
        connected: () => { console.log('CONNECTED') },
        disconnected: () => { console.log('DISCONNECTED') },
        received: newGameState => { this.setState({ gameState: newGameState }); },
      }
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.gameState.turn_order !== prevState.gameState.turn_order) {
      this.setTurnOrderBgColor();
    }

    this.setWinnerBgColor();
  }

  setGameState() {
    // gameState available (when redirecting from the lobby)
    const { gameState } = this.props.location
    if (gameState !== undefined) {
      this.setState({ gameState });
      return
    }

    // gameState NOT available (when visiting link directly)
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(`/api/${this.props.match.params.gameId}`, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ gameState: result.state });
        },
        (error) => {
          console.log(error);
          // TO DO handle error (esp. 404)
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

  onNewGameBtnClick() {
    this.gameChannel.send({ msg: 'newGame' });
  }

  onRoleToggleChange(event) {
    event.preventDefault();
    console.log('onRoleToggleChange: ', event.target.value)
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

  render() {
    let roleTogglePlayerClass = this.state.role === 'player' ? 'active' : '';
    let roleToggleSpymasterClass = this.state.role === 'spymaster' ? 'active' : '';

    const endTurnBtnText = this.state.gameState.turn_order === 'red' ? "End Red's Turn" : "End Blue's Turn";

    let middleMsg = '';
    if(this.gameWinner() === 'red') {
      middleMsg = 'Red Wins!';
    } else if(this.gameWinner() === 'blue') {
      middleMsg = 'Blue Wins!';
    }

    return (
      <div id='game-page-container'>
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
        />
        <div id='bottom-controls'>
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
            onClick={this.onNewGameBtnClick}
            type="button"
            id="new-game-btn"
            className="btn btn-danger"
          >
            New Game
          </button>
        </div>
      </div>
    );
  }
}

export default Game;
