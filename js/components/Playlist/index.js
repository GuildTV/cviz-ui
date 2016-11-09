/*
* External Dependancies
*/

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Grid, Row, Col
} from 'react-bootstrap';
import Socket from 'react-socket';

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
    };
  }

  componentDidMount() {
    this.updateData();

    window.testme = () => this.firedApiKill();
  }

  updateData(){
    this.sock.socket.emit(GetQueuedKey);
  }

  loadedQueued(queued){
    this.setState({ queued });
    console.log("Queued:", queued);
  }

  firedApiGo(){
    console.log("Api go");

    const elm = ReactDOM.findDOMNode(this.elm);
    elm.classList.add('api-go');

    setTimeout(() => {
      elm.classList.remove('api-go');
    }, 1100);
  }

  firedApiRun(data){
    console.log("Api run", data);

    if(!this.state.runState)
      this.setState({ runId: data.id });

    const elm = ReactDOM.findDOMNode(this.elm);
    elm.classList.add('api-run');

    setTimeout(() => {
      elm.classList.remove('api-run');
    }, 1100);
  }

  firedApiKill(){
    console.log("Api kill");

    const elm = ReactDOM.findDOMNode(this.elm);
    elm.classList.add('api-kill');

    setTimeout(() => {
      elm.classList.remove('api-kill');
    }, 1100);
  }

  ChangeTemplateState(data){
    console.log("Template state", data);

    // TODO


  }

  renderHelper() {
    if(!this.state.queued)
      return <h1>Loading...</h1>;

    const { queued } = this.state;

    return <div>
      <h1>{ queued.order }) { queued.name }</h1>
      <h2>{ queued.template }</h2>
    </div>;
  }

  render() {
    return (
      <div id="playlistPage" ref={e => this.elm = e}>
        <Socket.Event name={ GetQueuedKey } callback={e => this.loadedQueued(e)} ref={e => this.sock = e} />
        <Socket.Event name={ ApiGoSceneKey } callback={e => this.firedApiGo(e)} />
        <Socket.Event name={ ApiRunSceneKey } callback={e => this.firedApiRun(e)} />
        <Socket.Event name={ ApiKillSceneKey } callback={e => this.firedApiKill(e)} />
        <Socket.Event name={ ChangeTemplateStateKey } callback={e => this.ChangeTemplateState(e)} />
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
