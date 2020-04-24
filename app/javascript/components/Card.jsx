import React from "react";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.onCardSelect = this.onCardSelect.bind(this);
  }

  onCardSelect() {
    if(!this.props.isSelected && this.props.role === 'player') {
      this.props.onCardSelect(this.props.index);
    }
  }

  render() {
    const selectedClass = this.props.isSelected ? 'selected' : ''
    const roleClass = this.props.role;
    const gameOverClass = this.props.gameWinner ? 'game-over' : ''
    return (
      <div className='card-container' onClick={this.onCardSelect}>
        <div className={`card-sub-container ${selectedClass} ${roleClass}`}>
          <div className={`card-text-container ${this.props.type}`}>
            <span className={`card-text ${gameOverClass}`}>{this.props.title}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
