import React from 'react';
import { setColClue, setRowClue } from './store';

class Clue extends React.Component {
  constructor(props) {
    super(props);
    if (props.type === 'col') {
      setColClue(props.index, this)
    } else if (props.type === 'row') {
      setRowClue(props.index, this)
    } else {
      throw new Error(`type debe ser 'col' o 'row' pero era ${props.type}`)
    }
  }
  setSatisfactory(satis) {
    this.satisfactory = satis
  }
  getSatisfactory(){
    return this.satisfactory; 
  }


  render() {
        const clue = this.props.clue;
        return (
            <div className={`clue ${this.satisfactory ? 'good' : 'bad'}`} >
                {clue.map((num, i) =>
                    <div key={i}>
                        {num}
                    </div>
                )}
            </div>
        );
    }
}

export default Clue;