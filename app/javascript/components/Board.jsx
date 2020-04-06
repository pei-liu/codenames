import React from "react";

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Board Component</p>
        <p>{this.props.turn_order}</p>
      </div>
    );
  }
}

export default Board;
