/*
* External Dependancies
*/

import React from 'react';
import update from 'react-addons-update'
import Socket from 'react-socket';
import uuid from 'node-uuid';

import { Input, ButtonInput, Button } from 'react-bootstrap';

/*
* Variables
*/

const SaveSceneKey = "updateScene";

const ValuePlaceholderText = "<templateData><componentData id=\"data\"><![CDATA[{\"json\":\"data here\"}]]></componentData></templateData>\n\n"
                           + "OR\n\n"
                           + "<templateData><componentData id=\"f0\"><data id=\"text\" value=\"NAME HERE\" /></componentData></templateData>";

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
      data: [{
        id: uuid.v4(),
        name: "",
        value: ""
      }], 
      order: 9
    };
  }


  LoadForm(data){
    if(data === null || data === undefined){
      this.setState({
        id: undefined,
        name: '', 
        template: '', 
        data: [{
          id: uuid.v4(),
          name: "",
          value: ""
        }], 
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

    let {name, template, id, data, order} = this.state;

    if (!name || !template) {
      //todo error handling
      alert("Missing input data");
      return;
    }

    let compiledData = {
      id,
      name,
      template,
      data,
      order
    }

    this.refs.sock.socket.emit(SaveSceneKey, compiledData)

    this.LoadForm();
  }

  AddData(e){
    var data = this.state.data;
    data.push({
      id: uuid.v4(),
      name: "",
      value: ""
    })
    this.setState({ data });
  }

  handleFieldNameChange(e){
    const id = e.target.getAttribute('data-id');
    const val = e.target.value;
    var data = this.state.data;
    
    for(let i=0; i<data.length; i++){
      if(data[i].id == id)
        data[i].name = val;
    }

    this.setState({ data });
  }

  handleFieldValueChange(e){
    const id = e.target.getAttribute('data-id');
    const val = e.target.value;
    var data = this.state.data;
    
    for(let i=0; i<data.length; i++){
      if(data[i].id == id)
        data[i].value = val;
    }

    this.setState({ data });
  }

  render() {
    var dataFields = this.state.data.map(d => (<div key={d.id}>
        <hr />
        <Input type="text" label="Field Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
          onChange={this.handleFieldNameChange.bind(this)} data-id={d.id} value={d.name} placeholder="Name used in cviz" />
        <Input type="textarea" label="Value" labelClassName="col-xs-2" wrapperClassName="col-xs-10" rows={5} 
          onChange={this.handleFieldValueChange.bind(this)} data-id={d.id} value={d.value} placeholder={ValuePlaceholderText} />
      </div>));

    return (
      <div>
        <Socket.Event name={ SaveSceneKey } callback={() => {}} ref="sock"/>

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

            { dataFields }
           
            <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
              <Button type="submit" bsStyle="primary">Save</Button>&nbsp;
              <Button bsStyle="info" onClick={() => this.AddData()}>Add field</Button>&nbsp;
              <Button bsStyle="warning" onClick={() => this.LoadForm()}>Clear</Button>
            </Input>
          </fieldset>
        </form>
      </div>
    );
  }
}
