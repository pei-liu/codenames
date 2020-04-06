import React from "react";
import { Link } from "react-router-dom";
import actionCable from 'actioncable';


class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: {
        turnOrder: '', // red or blue
        boardState: [],
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

  render() {
    return (
      <div>
        <h1>Game</h1>
      </div>
    );
  }
}

export default Lobby;
