import React from "react";

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const selectedClass = this.props.isSelected ? 'selected' : ''
    const roleClass = this.props.role;
    return (
      <div className='card-container'>
        <div className={`${selectedClass} ${roleClass}`}>
          <div className={this.props.type}>
            <span>{this.props.title}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
