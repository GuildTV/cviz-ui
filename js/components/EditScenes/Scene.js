/*
* External Dependancies
*/

import React from 'react';
import Socket from 'react-socket';

import { Input, Button } from 'react-bootstrap';

/*
* Variables
*/

const SaveSceneKey = "updateScene";
const DeleteSceneKey = "deleteScene";

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
      SceneData: [],
      order: 9
    };
  }


  LoadForm(data){
    if(data === null || data === undefined){
      this.setState({
        id: undefined,
        name: '', 
        template: '',
        SceneData: [],
        order: 9
      });
    } else {
      this.setState(data);
    }
  }

  DoDelete(){
    const { id } = this.state;

    if (!id)
      return;

    this.LoadForm();

    this.sock.socket.emit(DeleteSceneKey, { id });
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

    let {name, template, id, SceneData, order} = this.state;

    if (!name || !template) {
      //todo error handling
      alert("Missing input data");
      return;
    }

    let compiledData = {
      id,
      name,
      template,
      SceneData,
      order
    };

    this.sock.socket.emit(SaveSceneKey, compiledData);

    this.LoadForm();
  }

  AddData(){
    const SceneData = this.state.SceneData || [];
    SceneData.push({
      id: undefined,
      name: "",
      value: ""
    });
    this.setState({ SceneData });
  }

  handleDatasetNameChange(e){
    const id = e.target.getAttribute('data-id');
    const SceneData = this.state.SceneData;
    
    for(let i=0; i<SceneData.length; i++){
      if(SceneData[i].id == id)
        SceneData[i].name = e.target.value;
    }

    this.setState({ SceneData });
  }

  handleDatasetValueChange(e){
    const id = e.target.getAttribute('data-id');
    const SceneData = this.state.SceneData;
    
    for(let i=0; i<SceneData.length; i++){
      if(SceneData[i].id == id)
        SceneData[i].value = e.target.value;
    }

    this.setState({ SceneData });
  }

  render() {
    const dataFields = (this.state.SceneData || []).map((d, i) => (<div key={i}>
        <hr />
        <Input type="text" label="Dataset Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
          onChange={e => this.handleDatasetNameChange(e)} data-id={d.id} value={d.name} placeholder="Name used in cviz" />
        <Input type="textarea" label="Value" labelClassName="col-xs-2" wrapperClassName="col-xs-10" rows={5} 
          onChange={e => this.handleDatasetValueChange(e)} data-id={d.id} value={d.value} placeholder={ValuePlaceholderText} />
      </div>));

    return (
      <div>
        <Socket.Event name={ SaveSceneKey } callback={() => {}} ref={e => this.sock = e} />

        <form className="form-horizontal" onSubmit={e => this.handleSubmit(e)}>
          <fieldset>
            <legend>Edit scene</legend>

            <Input type="text" label="ID" labelClassName="col-xs-2" wrapperClassName="col-xs-10" disabled value={this.state.id} />
            <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
              onChange={e => this.handleNameChange(e)} value={this.state.name} />
            <Input type="text" label="Template" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
              onChange={e => this.handleTemplateChange(e)} value={this.state.template} />

            <Input type="number" label="Order" min="0" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
              onChange={e => this.handleOrderChange(e)} value={this.state.order} />

            { dataFields }
           
            <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
              <Button type="submit" bsStyle="primary">Save</Button>&nbsp;
              <Button bsStyle="info" onClick={() => this.AddData()}>Add dataset</Button>&nbsp;
              <Button bsStyle="warning" onClick={() => this.LoadForm()}>Clear</Button>&nbsp;
              { this.state.id ? <Button bsStyle="danger" onClick={() => this.DoDelete()}>Delete</Button> : "" }
            </Input>
          </fieldset>
        </form>
      </div>
    );
  }
}
