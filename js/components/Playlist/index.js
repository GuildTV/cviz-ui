/*
* External Dependancies
*/

import React from 'react';
import {
  Col
} from 'react-bootstrap';
import Socket from 'react-socket';
import axios from 'axios';
import keydown from 'react-keydown';

/*
* Variables
*/
const ChangeTemplateStateKey = "templateState";
const GoTemplateKey = "templateGo";
const KillTemplateKey = "templateKill";
const RunTemplateKey = "runTemplate";

/*
* React
*/
export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      data: null,

      state: {
        state: "CLEAR",
        stateMessage: null,
        filename: "",
        instanceName: ""
      }
    };
  }

  componentDidMount() {
    this.updateData();

    this.interval = window.setInterval(() => this.updateData(), 5000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  updateData(){
    axios.get('/api/channel/' + this.state.id)
    .then(res => {
      this.setState({ data: res.data || null });
      console.log("Loaded playlist data");
    })
    .catch(err => {
      this.setState({ data: null });
      alert("Load playlist error:", err);
    });
  }

  @keydown( 'enter', 96, 110 ) // numpad0, numpad.
  runTemplate( event ) {
    event.preventDefault();
    if (this.state.state.state == "CLEAR" || this.state.state.state == "" || !this.state.state.state) {
      console.log("Starting template");

      if (!this.state.data || !this.state.data.nextScene)
        return console.log("Nothing to run!");

      const data = this.state.data.nextScene; 
      this.sock.socket.emit(RunTemplateKey, {
        template: data.template,
        data: data,
        dataId: data.name
      });
      this.nextTemplate();
      return;
    }
    console.log("Sending GO");

    this.sock.socket.emit(GoTemplateKey);
  }

  @keydown( 'space', 111, 106, 9, 8 ) // numpad/, numpad*, numpadtab, numpadback
  killTemplate( event ) {
    event.preventDefault();
    console.log("Sending KILL");

    this.sock.socket.emit(KillTemplateKey);
  }

  @keydown( 188, 97, 100, 103 ) // <, nump/ad1, numpad4, numpad7
  prevTemplate( event ) {
    event.preventDefault();
    axios.post('/api/channel/' + this.state.id + '/previous')
    .then(res => {
      this.setState({ data: res.data || null });
      console.log("Previous playlist entry");
    })
    .catch(err => {
      this.setState({ data: null });
      alert("Previous entry error:", err);
    });
  }

  @keydown( 190, 99, 102, 105 ) // >, numpad2, numpad6, numpad8
  nextTemplate( event ) {
    if (event)
      event.preventDefault();
    
    axios.post('/api/channel/' + this.state.id + '/next')
    .then(res => {
      this.setState({ data: res.data || null });
      console.log("Next playlist entry");
    })
    .catch(err => {
      this.setState({ data: null });
      alert("Next entry error:", err);
    });
  }

  // firedApiGo(){
  //   console.log("Api go");

  //   const elm = ReactDOM.findDOMNode(this.elm);
  //   elm.classList.add('api-go');

  //   setTimeout(() => {
  //     elm.classList.remove('api-go');
  //   }, 1100);
  // }

  // firedApiRun(data){
  //   console.log("Api run", data);

  //   if(!this.state.runState)
  //     this.setState({ runId: data.id });

  //   const elm = ReactDOM.findDOMNode(this.elm);
  //   elm.classList.add('api-run');

  //   setTimeout(() => {
  //     elm.classList.remove('api-run');
  //   }, 1100);
  // }

  // firedApiKill(){
  //   console.log("Api kill");

  //   const elm = ReactDOM.findDOMNode(this.elm);
  //   elm.classList.add('api-kill');

  //   setTimeout(() => {
  //     elm.classList.remove('api-kill');
  //   }, 1100);
  // }

  ChangeTemplateState(data){
    this.updateData();

    console.log(data);
    if (data.state == "CLEAR"){
      this.setState({
        state: {
          state: "CLEAR",
          stateMessage: null,
          filename: "",
          instanceName: ""
        }
      });
    } else {
      this.setState({ state: data });
    }
  }

  renderHelper() {
    if(!this.state.data)
      return <h1>Loading...</h1>;

    const { nextScene, nextPos, length } = this.state.data;
    const { instanceName, timelineFile, state, stateMessage } = this.state.state;

    return <div>
      <h1>{ instanceName ? instanceName : "Slot empty" }</h1>
      <h2>{ timelineFile ? "("+timelineFile+")" : "" }</h2>
      <h3>State: { state }{ stateMessage ? " - " + stateMessage : "" }</h3>

      <h4>Next: ({ nextPos+1 }/{ length }) { nextScene ? nextScene.name + "(" + nextScene.template + ")" : " - " }</h4>
    </div>;
  }

  render() {
    return (
      <div id="playlistPage" ref={e => this.elm = e}>
        <Socket.Event name={ ChangeTemplateStateKey } callback={e => this.ChangeTemplateState(e)} ref={e => this.sock = e} />
        <div>
          <Col xs={12}>
            { this.renderHelper() }
          </Col>
        </div>
      </div>
    );
  }
}
