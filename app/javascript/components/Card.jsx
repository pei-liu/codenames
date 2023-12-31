import React from "react";

const Card = function(props) {
  const selectedClass = props.isSelected ? 'selected' : ''
  const roleClass = props.role;
  const gameOverClass = props.gameWinner ? 'game-over' : ''

  function onCardSelect() {
    if (!props.isSelected && props.role === 'player') {
      props.onCardSelect(props.index);
    }
  }

  return (
    <div className='card-container' onClick={onCardSelect}>
      <div className={`card-sub-container ${selectedClass} ${roleClass}`}>
        <div className={`card-text-container ${props.type}`}>
          <span className={`card-text ${gameOverClass}`}>{props.title}</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Card)
