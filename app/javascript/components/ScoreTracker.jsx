import React from "react";

class ScoreTracker extends React.Component {
  renderTallies(count) {
    const redTallies = [];

    for (let i = 0; i < count; ++i) {
      redTallies.push(
        <div key={i} className='tally'></div>
      );
    }

    return redTallies;
  }

  render() {
    return (
      <div id='score-tracker-container'>
        <div className='red-tally-container'>
          {this.renderTallies(this.props.redScore)}
        </div>
        <div className='blue-tally-container'>
          {this.renderTallies(this.props.blueScore)}
        </div>
      </div>
    );
  }
}

export default ScoreTracker;
