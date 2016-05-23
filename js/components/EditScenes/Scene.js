/*
* External Dependancies
*/

import React from 'react';
import update from 'react-addons-update'
import Socket from 'react-socket';

import { Input, ButtonInput, Button } from 'react-bootstrap';

/*
* Variables
*/

const SaveSceneKey = "updateScene";

/*
* React
*/
export default class Scene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: undefined,
      name: '', 
      template: '', 
      data: {}, 
      order: 9
    };
  }


  LoadForm(data){
    console.log(data);
    if(data === null || data === undefined){
      this.setState({
        id: undefined,
        name: '', 
        template: '', 
        data: {}, 
        order: 9
      });
    } else {
      this.setState(data);
    }
  }

  handleNameChange(e) {
    this.setState({name: e.target.value});
  }
  handleTemplateChange(e) {
    this.setState({template: e.target.value});
  }

  handleOrderChange(e) {
    this.setState({ order: parseInt(e.target.value) });
  }

  handleSubmit(e) {
    console.log(this.state);

    e.preventDefault();

    let {name, template, id, order} = this.state;

    if (!name || !template) {
      //todo error handling
      alert("Missing input data");
      return;
    }

    let data = {
      id,
      name,
      template,
      order
    }

    this.refs.sock.socket.emit(SaveSceneKey, data)

    this.LoadForm();
  }

  render() {
    return (
      <div>
        <Socket.Event name={ SaveSceneKey } ref="sock"/>

        <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            <legend>Edit scene</legend>

            <Input type="text" label="ID" labelClassName="col-xs-2" wrapperClassName="col-xs-10" disabled value={this.state.id} />
            <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
              onChange={this.handleNameChange.bind(this)} value={this.state.name} />
            <Input type="text" label="Template" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
              onChange={this.handleTemplateChange.bind(this)} value={this.state.template} />

            <Input type="number" label="Order" min="0" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
              onChange={this.handleOrderChange.bind(this)} value={this.state.order} />
           
            <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
              <Button type="submit" bsStyle="primary">Save</Button>&nbsp;
              <Button bsStyle="warning" onClick={() => this.LoadForm()}>Clear</Button>
            </Input>
          </fieldset>
        </form>
      </div>
    );
  }
}
