import React from "react";
import Card from "./Card";

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cards = this.props.boardState.map((card, key) => {
      const { type, title, is_selected } = card
      return (
        <Card
          type={type}
          title={title}
          isSelected={is_selected}
          key={key}
          role={this.props.role}
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
