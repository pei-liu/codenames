import React from "react";
import Card from "./Card";

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  onCardSelect(index) {
    this.props.onCardSelect(index);
  }

  render() {
    const cards = this.props.boardState.map((card, key) => {
      const { type, title, is_selected } = card
      return (
        <Card
          onCardSelect={this.props.onCardSelect}
          type={type}
          title={title}
          isSelected={is_selected}
          key={key}
          index={key}
          role={this.props.role}
          gameWinner={this.props.gameWinner}
        />
      )
    });
    return (
      <div id="board-container">
        {cards}
      </div>
    );
  }
}

export default Board;
