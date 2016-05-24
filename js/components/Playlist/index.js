/*
* External Dependancies
*/

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
  Grid, Row, Col,
  Tabs, Tab
} from 'react-bootstrap';
import Socket from 'react-socket';

import Footer from '../Dashboard/Footer';

/*
* Variables
*/
const GetQueuedKey = "getQueued";
const ApiGoSceneKey = "apiGoScene";
const ApiRunSceneKey = "apiRunScene";
const ApiKillSceneKey = "apiKillScene";
const ChangeTemplateStateKey = "templateState";

/*
* React
*/
export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queued: null,
      runId: null,
      runctive: false
    }
  }

  componentDidMount() {
    this.updateData();

    window.testme = this.firedApiKill.bind(this);
  }

  updateData(){
    this.refs.sock.socket.emit(GetQueuedKey);
  }

  loadedQueued(queued){
    this.setState({ queued });
    console.log("Queued:", queued);
  }

  firedApiGo(){
    console.log("Api go");

    const elm = ReactDOM.findDOMNode(this.refs.elm);
    elm.classList.add('api-go');

    setTimeout(() => {
      elm.classList.remove('api-go');
    }, 1100)
  }

  firedApiRun(data){
    console.log("Api run", data);

    if(!this.state.runState)
      this.setState({ runId: data.id });

    const elm = ReactDOM.findDOMNode(this.refs.elm);
    elm.classList.add('api-run');

    setTimeout(() => {
      elm.classList.remove('api-run');
    }, 1100)
  }

  firedApiKill(){
    console.log("Api kill");

    const elm = ReactDOM.findDOMNode(this.refs.elm);
    elm.classList.add('api-kill');

    setTimeout(() => {
      elm.classList.remove('api-kill');
    }, 1100)
  }

  ChangeTemplateState(data){
    console.log("Template state");

    // TODO


  }

  renderHelper() {
    if(!this.state.queued)
      return <h1>Loading...</h1>;

    const { queued } = this.state;

    return <div>
      <h1>{ queued.order }) { queued.name }</h1>
      <h2>{ queued.template }</h2>
    </div>
  }

  render() {
    return (
      <div id="playlistPage" ref="elm">
        <Socket.Event name={ GetQueuedKey } callback={ this.loadedQueued.bind(this) } ref="sock"/>
        <Socket.Event name={ ApiGoSceneKey } callback={ this.firedApiGo.bind(this) } />
        <Socket.Event name={ ApiRunSceneKey } callback={ this.firedApiRun.bind(this) } />
        <Socket.Event name={ ApiKillSceneKey } callback={ this.firedApiKill.bind(this) } />
        <Socket.Event name={ ChangeTemplateStateKey } callback={ this.ChangeTemplateState.bind(this) } />
        <div>
          <Grid>
            <Row>
              <Col xs={12}>
                { this.renderHelper() }
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}
