import React from 'react';

class Square extends React.Component {
    render() {
        return (
            <button className={`square ${(this.props.value === '#' ? 'black' : '' )}`} onClick={this.props.onClick}>
                {this.props.value === 'X' ? this.props.value : null}
            </button>
        );
    }
}

export default Square; 