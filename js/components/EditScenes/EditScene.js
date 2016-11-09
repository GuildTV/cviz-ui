/*
* External Dependancies
*/

import React from 'react';
import Socket from 'react-socket';
import ColorPicker from 'react-color';
import base64 from 'base-64';
import {
  Grid, Row, Col,
  Input, Button
} from 'react-bootstrap';

/*
* Variables
*/

const SaveSceneKey = "updateScene";
const DeleteSceneKey = "deleteScene";
const UpdateSceneKey = "updateScene";

const ValuePlaceholderText = "<templateData><componentData id=\"data\"><![CDATA[{\"json\":\"data here\"}]]></componentData></templateData>\n\n"
                           + "OR\n\n"
                           + "<templateData><componentData id=\"f0\"><data id=\"text\" value=\"NAME HERE\" /></componentData></templateData>";

/*
* React
*/
export class EditScene extends React.Component {
  constructor(props) {
    super(props);

    const parsed = this.parseProps(props);
    console.log(parsed);
    if (parsed === false)
      this.state = {
        id: undefined,
        name: '', 
        template: '', 
        SceneData: [],
        order: 9
      };
    else
      this.state = parsed;
  }

  componentDidMount(){
    console.log(this.props)
  }

  componentWillUnmount(){
    this.setState({});
  }

  componentWillReceiveProps(newProps){
    const parsed = this.parseProps(newProps);
    console.log(parsed);
    if (parsed !== false)
      this.setState(parsed);
  }

  parseProps(props){
    const { data } = props.params;
    if (!data)
      return false;

    try {
      const decoded = base64.decode(data);
      return JSON.parse(decoded);

    } catch (e) {
      return false;
    }
  }

  DoDelete(){
    const { id } = this.state;

    if (!id)
      return;

    this.sock.socket.emit(DeleteSceneKey, { id });

    this.props.history.pushState(null, "/scenes")
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

  validateScene(dataset){
    const { name, value } = dataset;

    if (!name || !value || name.length < 2 || value.length < 5)
      return "Missing data for dataset '" + name + "'";

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(value, "text/xml");
    if (!xmlDoc || this.hasAnyParserErrors(xmlDoc.documentElement))
      return "Failed to parse dataset xml for '" + name + "'";

    return true;
  }

  hasAnyParserErrors(elm){
    if (!elm)
      return false;

    if (elm.nodeName == "parsererror")
      return true;

    for (let e of elm.childNodes){
      if (this.hasAnyParserErrors(e))
        return true;
    }

    return false;
  }

  handleSubmit(e) {
    console.log(this.state);

    e.preventDefault();

    const {name, template, id, SceneData, order} = this.state;
    const colour = this.colourPicker.state.hex;

    if (!name || !template) {
      //todo error handling
      alert("Missing input data");
      return;
    }

    for(let dataset of SceneData){
      const err = this.validateScene(dataset);
      if (err === true)
        continue;

      alert(err);
      return;
    }

    const compiledData = {
      id,
      name,
      template,
      SceneData,
      order,
      colour
    };

    this.sock.socket.emit(SaveSceneKey, compiledData);

    this.props.history.pushState(null, "/scenes")
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

  handleSceneDelete(e){
    if (e.id !== this.state.id)
      return;

    this.props.history.pushState(null, "/scenes")
  }

  handleSceneChange(e){
    if (e.id !== this.state.id)
      return;

    // const data = base64.encode(JSON.stringify(e));
    // this.props.history.pushState(null, "/scenes/edit/" + data)
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
        <Grid>
          <Row>
            <Col xs={12}>
              <Socket.Event name={ SaveSceneKey } callback={() => {}} ref={e => this.sock = e} />
              <Socket.Event name={ UpdateSceneKey } callback={e => this.handleSceneChange(e)} />
              <Socket.Event name={ DeleteSceneKey } callback={e => this.handleSceneDelete(e)} />

              <form className="form-horizontal" onSubmit={e => this.handleSubmit(e)}>
                <fieldset>
                  <legend>
                    Edit scene&nbsp;&nbsp;
                    <a className="btn btn-warning" href="#/scenes">Back to List</a>
                  </legend>

                  <Input type="text" label="ID" labelClassName="col-xs-2" wrapperClassName="col-xs-10" disabled value={this.state.id} />
                  <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
                    onChange={e => this.handleNameChange(e)} value={this.state.name} />
                  <Input type="text" label="Template" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
                    onChange={e => this.handleTemplateChange(e)} value={this.state.template} />

                  <Input type="number" label="Order" min="0" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                    onChange={e => this.handleOrderChange(e)} value={this.state.order} />

                  <Input label="Button Colour" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <ColorPicker ref={e => this.colourPicker = e} type="chrome" color={this.state.colour || "#ffffff"} />
                  </Input>

                  { dataFields }
                 
                  <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <Button type="submit" bsStyle="primary">Save</Button>&nbsp;
                    <Button bsStyle="info" onClick={() => this.AddData()}>Add dataset</Button>&nbsp;
                    { this.state.id ? <Button bsStyle="danger" onClick={() => this.DoDelete()}>Delete</Button> : "" }
                  </Input>
                </fieldset>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
