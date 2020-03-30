import React, { Component } from 'react';
import { Grid, Button, Container, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import './App.css';
import Food from './Food';
import Snake from './Snake';
import Trap from './Trap';
import Piano from './media/piano.mp3';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y]
}
const initialState = {
  food: getRandomCoordinates(),
  speed: 100,
  direction: 'RIGHT',
  snakeDots: [
    [0, 0],
    [2, 0]
  ],
  play: false,
  trap: getRandomCoordinates(),
  easy: true,
  medium: true,
}

class App extends Component {
  state = initialState;
  componentDidMount() {
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
    this.checkIfTraped();
  }


  onKeyDown = (e) => {
    e = e || window.event;
    if (this.state.direction === 'UP') {
      switch (e.keyCode) {
        case 37:
          this.setState({ direction: 'LEFT' });
          break;
        case 39:
          this.setState({ direction: 'RIGHT' });
          break;
        default:
          break;
      }
    }
    if (this.state.direction === 'DOWN') {
      switch (e.keyCode) {
        case 37:
          this.setState({ direction: 'LEFT' });
          break;
        case 39:
          this.setState({ direction: 'RIGHT' });
          break;
        default:
          break;
      }
    }
    if (this.state.direction === 'LEFT') {
      switch (e.keyCode) {
        case 38:
          this.setState({ direction: 'UP' });
          break;
        case 40:
          this.setState({ direction: 'DOWN' });
          break;
        default:
          break;
      }
    }
    if (this.state.direction === 'RIGHT') {
      switch (e.keyCode) {
        case 38:
          this.setState({ direction: 'UP' });
          break;
        case 40:
          this.setState({ direction: 'DOWN' });
          break;
        default:
          break;
      }
    }
  }
  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        dots.shift();
        dots.push(head);
        this.setState({
          snakeDots: dots
        })
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        dots.shift();
        dots.push(head);
        this.setState({
          snakeDots: dots
        })
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        dots.shift();
        dots.push(head);
        this.setState({
          snakeDots: dots
        })
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        dots.shift();
        dots.push(head);
        this.setState({
          snakeDots: dots
        })
        break;
      default:
        break;
    }

  }
  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] === 100 || head[1] === 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }
  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1])
        this.onGameOver();
    })
  }
  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      var f = getRandomCoordinates();
      var t = getRandomCoordinates();
      if (f === t)
        this.setState({
          food: f,
          trap: [f[0] + 1, f[1]]
        })
      else
        this.setState({
          food: f,
          trap: t
        })
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }
  checkIfTraped() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let trap = this.state.trap;
    if (head[0] === trap[0] && head[1] === trap[1])
      this.onGameOver();
  }
  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }
  increaseSpeed() {
    if (this.state.speed > 20) {
      this.setState({
        speed: this.state.speed - 20
      })
    }
    else {
      this.setState({
        speed: this.state.speed - 2
      })
    }
  }


  onGameOver() {
    if (localStorage.getItem('highscore') === null) {
      localStorage.setItem('highscore', this.state.snakeDots.length - 2)
    }
    else {
      if (localStorage.getItem('highscore') < this.state.snakeDots.length - 2)
        localStorage.setItem('highscore', this.state.snakeDots.length - 2)
    }
    window.location.reload(false);
  }

  ToggleChangeMode() {
    this.setState({ play: true })
    setInterval(this.moveSnake, this.state.speed)
  }

  ButtonPlay() {
    if (!this.state.play && this.state.easy && this.state.medium) {
      return (
        <div>
          <Button onClick={this.ToggleChangeMode.bind(this)} variant="contained" disabled > Play </Button>
        </div>
      )
    }
    else {
      return (
        <div>
          <Button onClick={this.ToggleChangeMode.bind(this)} variant="contained"  > Play </Button>
        </div>
      );
    }

  }
  TrapStart = () => {
    if (this.state.snakeDots.length >= 4) {
      return (
        <div>
          <Trap trap={this.state.trap} />
        </div>
      );
    }
  };

  changeModeEz = () => {
    this.setState({
      easy: !this.state.easy,
      speed: 100,
    })
  };

  changeModeMedium = () => {
    this.setState({
      medium: !this.state.medium,
      speed: 50,
    })
  }

  GotoGame = () => {
    if (!this.state.play) {
      return (
        (this.state.easy && this.state.medium) ? this.ShowPreSwitch() : (this.state.easy && !this.state.medium) ? this.ShowSwitchMedium() : this.ShowSwitchEz()
      )
    }
    else {
      return (
        this.ShowSwitchPlay()
      )
    }
  }




  ShowPreSwitch = () => {
    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedEasy}
              value="checkedEasy"
              onChange={this.changeModeEz}
            />
          }
          label="Easy Game"
        />
        <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedMedium}
              value="checkedMedium"
              onChange={this.changeModeMedium}
              color="primary"
            />
          }
          label="Medium"
        />
      </FormGroup>
    )
  }

  ShowSwitchEz = () => {
    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedEasy}
              value="checkedEasy"
              onChange={this.changeModeEz}
            />
          }
          label="Easy Game"
        />
        <FormControlLabel disabled control={<Switch value="Medium" />} label="Medium" />
      </FormGroup>
    )
  }

  ShowSwitchMedium = () => {
    return (
      <FormGroup row>
        <FormControlLabel disabled control={<Switch value="Easy" />} label="Easy Game" />
        <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedMedium}
              value="checkedMedium"
              onChange={this.changeModeMedium}
              color="primary"
            />
          }
          label="Medium"
        />
      </FormGroup>
    )
  }
  ShowSwitchPlay = () => {
    return (
      <FormGroup row>
        <FormControlLabel disabled control={<Switch value="Easy" />} label="Easy Game" />
        <FormControlLabel disabled control={<Switch value="Medium" />} label="Medium" />
      </FormGroup>
    )
  }
  MusicPlayNormal = () => {
    if (this.state.play)
      return (
        <audio autoPlay>
          <source src={Piano} type="audio/mp3" />
        </audio>
      )
  }


  render() {
    const changeBackground1 = {
      backgroundColor: '#fff',
      border: '3px solid black',

    };
    const changeBackground2 = {
      backgroundColor: 'gray',
      border: '3px solid black',

    };
    return (
      <Container className='container' style={((this.state.snakeDots.length) % 5 === 0) ? changeBackground2 : changeBackground1}>
        <div>
          <Button variant="contained" disabled >
            Max score : {localStorage.getItem('highscore')}
          </Button>
        </div>
        <Grid container>
          <div className='score'>

            <Button variant="contained" disabled >
              Score : {this.state.snakeDots.length - 2}
            </Button>

            <div className='button'>
              {(!this.state.play) && this.ButtonPlay()}
            </div>
          </div>
          <div className="game-area">
            <Snake snakeDots={this.state.snakeDots} />
            <Food dot={this.state.food} />
            {this.TrapStart()}
          </div>
          <div className="switch">
            {this.GotoGame()}
          </div>
        </Grid>
        {this.MusicPlayNormal()}
      </Container>

    );
  }
}

export default App;
