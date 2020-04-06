import React from "react";
import { Link } from "react-router-dom";
import actionCable from 'actioncable';


class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: {
        turn_order: '', // red or blue
        board: [],
      },
    }
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

  setGameState() {
    // gameState available (when redirecting from the lobby)
    const { gameState } = this.props.location
    if (gameState !== undefined) { 
      this.setState({ gameState });
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

  render() {
    return (
      <div>
        <h1>Game</h1>
        <p>{this.state.gameState.turn_order}</p>
      </div>
    );
  }
}

export default Lobby;
