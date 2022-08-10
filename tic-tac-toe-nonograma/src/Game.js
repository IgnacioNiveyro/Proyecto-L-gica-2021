import React from 'react';
import PengineClient from './PengineClient';
import Board from './Board';
import { getColClue, getRowClue, esVictoria } from './store';
class Game extends React.Component {

  pengine;

  constructor(props) {
    super(props);
    this.state = {
      grid: null,
      rowClues: null,
      colClues: null,
      waiting: false,
      language: 'en',
      statusText: 'Keep playing',
      statusGame: 'Use X',
      statusButton: 'Cambiar idioma',
      statusSolution : 'Show solution',
      statusReveal : 'Reveal cell',
      mode: '#',
      gridRespuesta: null, /**La solución del nonograma */
      saveGrid: null,  /** Hasta donde jugó el user */
      modeResuelto: false,
      revelar: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handlePengineCreate = this.handlePengineCreate.bind(this);
    this.cambiarModoJuego = this.cambiarModoJuego.bind(this);
    this.chequearGrillaEstadoInicial = this.chequearGrillaEstadoInicial.bind(this);
    this.consultarGrilla = this.consultarGrilla.bind(this);
    this.cambiarModoJuegoResuelto = this.cambiarModoJuegoResuelto.bind(this);
    this.mostrarCelda = this.mostrarCelda.bind(this);
    this.pengine = new PengineClient(this.handlePengineCreate);
  }
  /** sobreescribir grid con lo que tengo en rta y en savegrid guardo el estado */
  changeLanguage = () => {
    if (this.state.language === 'es') {
      this.setState({
        language: 'en',
        statusButton: 'Cambiar idioma',
        statusText: esVictoria() ? 'Good work' : 'Keep playing',
        statusGame: 'Use X',
        statusSolution : 'Show solution',
        statusReveal : 'Reveal cell',
      })
    } else {
      this.setState({
        language: 'es',
        statusButton: 'Change language',
        statusText: esVictoria() ? 'Buen trabajo' : 'Siga jugando',
        statusGame: 'Usar X',
        statusSolution : 'Mostrar Solución',
        statusReveal : 'Revelar Celda' ,
      })
    }
  }

  handlePengineCreate() {
    const queryS = 'init(PistasFilas, PistasColumns, Grilla)';
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        this.setState({
          grid: response['Grilla'],
          rowClues: response['PistasFilas'],
          colClues: response['PistasColumns'],
        });
        this.chequearGrillaEstadoInicial();
      }
    });
  }

  handleClick(row, col) {
    // No action on click if we are waiting.
    if (this.state.waiting || this.state.modeResuelto) {
      return;
    }
    if(this.state.revelar === true){
      if(this.state.grid[row][col]!=="_"){
        return;
      }
      const squaresS = JSON.stringify(this.state.grid).replaceAll('"_"', "_"); // Remove quotes for variables.
      let PistasFilas = JSON.stringify(this.state.rowClues);
      let PistasColumnas = JSON.stringify(this.state.colClues);
      const valor = this.state.gridRespuesta[row][col];
      const queryS = 'put( "' + valor + '" , [' + row + ',' + col + ']' + ', ' + PistasFilas + ' , ' + PistasColumnas + ' ,' + squaresS + ', GrillaRes, FilaSat, ColSat)';
      this.setState({
        waiting: true
      });
      this.pengine.query(queryS, (success, response) => {
        if (success) {
          getColClue(col).setSatisfactory(Boolean(response.ColSat)); // Boolean castea valores a booleano
          getRowClue(row).setSatisfactory(Boolean(response.FilaSat));
          if (this.state.language === 'es') {
            this.setState({
              statusText: esVictoria() ? 'Buen trabajo' : 'Siga jugando',
              statusGame: 'Usar X',
            });
          } else {
            this.setState({
              statusText: esVictoria() ? 'Good work' : 'Keep playing',
              statusGame: 'Use X',
            });
          }

          this.setState({
            grid: response['GrillaRes'],
            waiting: false,
          });
        } else {
          this.setState({
            waiting: false
          });
        }
      });
    }
    else{
      const squaresS = JSON.stringify(this.state.grid).replaceAll('"_"', "_"); // Remove quotes for variables.
      let PistasFilas = JSON.stringify(this.state.rowClues);
      let PistasColumnas = JSON.stringify(this.state.colClues);
      const queryS = 'put( "' + this.state.mode + '" , [' + row + ',' + col + ']' + ', ' + PistasFilas + ' , ' + PistasColumnas + ' ,' + squaresS + ', GrillaRes, FilaSat, ColSat)';
      this.setState({
        waiting: true
      });
      this.pengine.query(queryS, (success, response) => {
        if (success) {
          getColClue(col).setSatisfactory(Boolean(response.ColSat)); // Boolean castea valores a booleano
          getRowClue(row).setSatisfactory(Boolean(response.FilaSat));
          if (this.state.language === 'es') {
            this.setState({
              statusText: esVictoria() ? 'Buen trabajo' : 'Siga jugando',
              statusGame: 'Usar X',
            });
          } else {
            this.setState({
              statusText: esVictoria() ? 'Good work' : 'Keep playing',
              statusGame: 'Use X',
            });
          }

          this.setState({
            grid: response['GrillaRes'],
            waiting: false,
          });
        } else {
          this.setState({
            waiting: false
          });
        }
      });
    }
    //debugger;
  }

  cambiarModoJuego() {
    if (document.getElementById("gamemode-checkbox").checked === true) {
      this.setState({
        mode: 'X',
      });
    } else {
      this.setState({
        mode: '#',
      });
    }
  }

  cambiarModoJuegoResuelto() {
    const modeResuelto = document.getElementById("gamemode-checkbox-resuelto").checked;
    this.setState({
      modeResuelto: modeResuelto,
    });
    if (modeResuelto) {
      this.setState({
        saveGrid: this.state.grid,
      });
      this.setState({
        grid: this.state.gridRespuesta,
      });
    } else {
      this.setState({
        grid: this.state.saveGrid,
      });
    }
  }

  render() {
    if (this.state.grid === null) {
      return null;
    }
    const { language } = this.state;
    return (
      <div className={`game ${this.state.modeResuelto ? 'resuelto' : ''}`}>
        <Board
          grid={this.state.grid}
          rowClues={this.state.rowClues}
          colClues={this.state.colClues}
          onClick={(i, j) => this.handleClick(i, j)

          }
        />
        <div className="gameInfo">
          <div style={{ color: 'white' }}>
            {this.state.statusText}
          </div>
          <div>
            <button onClick={this.changeLanguage}>{this.state.statusButton}</button>
          </div>
          <div className="Gamemode">
            <div>
              <span style={{ color: 'white' }}>{this.state.statusGame}</span>
              <label className="switch">
                <input type="checkbox" id="gamemode-checkbox" onClick={this.cambiarModoJuego} />
                <span className="slider round"></span>
              </label>
            </div>
            <div>
              <span style={{ color: 'white' }}>{this.state.statusSolution}</span>
              <label className="switch">
                <input type="checkbox" id="gamemode-checkbox-resuelto" onClick={this.cambiarModoJuegoResuelto} />
                <span className="slider round"></span>
              </label>
            </div>
            <div>
              <span style={{ color: 'white' }}>{this.state.statusReveal}</span>
              <label className="switch">
                <input type="checkbox" id="gamemode-checkbox-revelar" onClick={this.mostrarCelda} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  chequearGrillaEstadoInicial() {
    let PistasFilas = JSON.stringify(this.state.rowClues);
    let PistasColumnas = JSON.stringify(this.state.colClues);
    const squaresS = JSON.stringify(this.state.grid).replaceAll('""', "");
    let TamañoPistasFilas = (this.state.rowClues).length;
    let TamañoPistasColumnas = (this.state.colClues).length;
    for (let row = 0; row < TamañoPistasFilas; row++) {
      for (let col = 0; col < TamañoPistasColumnas; col++) {
        const queryS = 'chequeoInicial(' + squaresS + ',' + row + ',' + col + ',Fila,' + PistasFilas + ',Columna,' + PistasColumnas + ',SatisfaceFila,SatisfaceColumna)';
        this.setState({
          waiting: true
        });
        this.pengine.query(queryS, (success, response) => {
          if (success) {
            getColClue(col).setSatisfactory(Boolean(response.SatisfaceColumna)); // Boolean castea valores a booleano
            getRowClue(row).setSatisfactory(Boolean(response.SatisfaceFila));

            if (this.state.language === 'es') {
              this.setState({
                statusText: esVictoria() ? 'Buen trabajo' : 'Siga jugando',
                statusGame: 'Usar X',
              });
            } else {
              this.setState({
                statusText: esVictoria() ? 'Good work' : 'Keep playing',
                statusGame: 'Use X',
              });
            }
            this.setState({
              waiting: false,
            });
          } else {
            this.setState({
              waiting: false
            });
          }
        });
      }
    }

    this.consultarGrilla();

  }
  consultarGrilla() {
    let PistasFilas = JSON.stringify(this.state.rowClues);
    let PistasColumnas = JSON.stringify(this.state.colClues);
    let cantidadColumnas = (this.state.colClues).length; // 
    let tamañoFilas = (this.state.colClues).length; //
    const queryS = 'resolverNonograma(' + tamañoFilas + ',' + cantidadColumnas + ',' + PistasFilas + ',' + PistasColumnas + ',Resultado)';
    this.setState({
      waiting: true
    });
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        this.setState({
          gridRespuesta: response['Resultado'],
        });
      } else
        this.setState({
          waiting: false
        });
    });
  }

  mostrarCelda() {
    if (this.state.revelar === false) {
      this.setState({
        revelar: true,
      })
    }
    else {
      this.setState({
        revelar: false,
      })
    }
  }
}
export default Game;