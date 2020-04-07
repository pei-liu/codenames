import React from "react";
import $ from "jquery";
import _ from "lodash";
import actionCable from 'actioncable';
import Board from "./Board";


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
    this.onNextTurnBtnClick = this.onNextTurnBtnClick.bind(this);
    this.onCardSelect = this.onCardSelect.bind(this);
  }

  // getGameData = (id) => {
  //   fetch(`http://localhost:3000/games/${id}`)
  //   .then(response => response.json())
  //   .then(result => {
  //     debugger
  //   })
  // }

  componentDidMount() {
    this.setGameState();
    this.cable = actionCable.createConsumer('ws://localhost:3000/cable');
    this.gameChannels = this.cable.subscriptions.create(
      { channel: "GameChannel", id: this.props.match.params.gameId },
      {
        connected: () => { console.log('CONNECTED') },
        disconnected: () => { console.log('DISCONNECTED') },
        received: data => { console.log(`RECIEVED`)}
      }
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.gameState.turn_order !== prevState.gameState.turn_order) {
      this.setBackgroundColor();
    }
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
    console.log(this.state.gameState.board[index].title)
  }

  onNextTurnBtnClick() {
    console.log('Next Turn Btn Clicked!');
  }

  onNewGameBtnClick() {
    console.log('New Game Btn Clicked');
  }

  onRoleToggleChange(event) {
    event.preventDefault();
    console.log('onRoleToggleChange: ', event.target.value)
    this.setState({ role: event.target.value })
  }

  setBackgroundColor() {
    const redColor = '#fab1a0';
    const blueColor = '#74b9ff';
    if (this.state.gameState.turn_order == 'red') {
      $('body').css({ backgroundColor: redColor })
    } else {
      $('body').css({ backgroundColor: blueColor })
    }
  }

  render() {
    let roleTogglePlayerClass = this.state.role === 'player' ? 'active' : '';
    let roleToggleSpymasterClass = this.state.role === 'spymaster' ? 'active' : '';

    return (
      <div id='game-page-container'>
        <div id ='top-controls'>
          <span id='score-tracker'>9-5</span>
          <button
            onClick={this.onNextTurnBtnClick}
            type="button"
            id="next-turn-btn"
            className="btn btn-primary"
          >
            End Red's Turn
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
            className="btn btn-primary"
          >
            New Game
          </button>
        </div>
      </div>
    );
  }
}

export default Game;
