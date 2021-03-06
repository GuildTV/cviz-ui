/*
* External Dependancies
*/

import React from 'react';
import ColorPicker from 'react-color';
import axios from 'axios';
import {
  Grid, Row, Col,
  Input, Button
} from 'react-bootstrap';
import { EditTemplateXml } from './EditTemplateXml';
import { EditTemplateJson } from './EditTemplateJson';

/*
* Variables
*/

const newScene = {
        id: undefined,
        name: '', 
        template: '', 
        SceneData: [],
        order: 9
      };

/*
* React
*/
export class EditScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      _mode: props.params.mode || "create"
    }, newScene);
  }

  componentWillMount(){
    this.loadData();
  }

  componentWillUnmount(){
    this.setState(Object.assign({
      _mode: this.state._mode
    }, newScene));
  }

  loadData(){
    const id = this.props.params.id;

    if (!id) {
      console.log("Update no id");
      return this.setState(Object.assign({
        _mode: this.state._mode
      }, newScene));
    }

    axios.get(`/api/scenes/${id}`)
    .then(res => {
      const data = Object.assign({
        _mode: this.state._mode
      }, res.data || {});

      if (this.state._mode == "clone"){
        delete data.id;
        data.id2 = Math.random();
        for (let param of data.SceneData){
          param.id2 = Math.random();
          delete param.id;
        }
      }

      this.setState(data);
      console.log("Loaded scene data:" + res.data.id);
    })
    .catch(err => {
      this.setState(Object.assign({
        _mode: this.state._mode
      }, newScene));
      alert("Get scenes error: " + err);
    });
  }

  DoDelete(){
    const { id } = this.state;

    if (!id)
      return;

    axios.delete(`/api/scenes/${id}`)
      .catch(err => alert("Delete error: " + err));

    this.props.history.pushState(null, "/edit/scenes");
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

  // validateScene(dataset){
  //   const { name, value } = dataset;

  //   if (!name || !value || name.length < 2 || value.length < 5)
  //     return "Missing data for dataset '" + name + "'";

  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(value, "text/xml");
  //   if (!xmlDoc || this.hasAnyParserErrors(xmlDoc.documentElement))
  //     return "Failed to parse dataset xml for '" + name + "'";

  //   return true;
  // }

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
    e.preventDefault();

    const {name, template, id, SceneData, order} = this.state;
    const colour = this.colourPicker.state.hex;

    if (!name || !template) {
      //todo error handling
      alert("Missing input data");
      return;
    }

    // for(let dataset of SceneData){
    //   const err = this.validateScene(dataset);
    //   if (err === true)
    //     continue;

    //   alert(err);
    //   return;
    // }

    const compiledData = {
      id,
      name,
      template,
      SceneData,
      order,
      colour
    };

    const method = id ? axios.post : axios.put;
    const url = id ? "/api/scenes/" + id : "/api/scenes";

    method(url, compiledData)
      .then(() => this.props.history.pushState(null, "/edit/scenes"))
      .catch(err => alert("Save error: " + err));
  }

  AddData(type){
    const SceneData = this.state.SceneData || [];
    SceneData.push({
      id: undefined,
      id2: Math.random(),
      type: type,
      name: "",
      value: ""
    });
    this.setState({ SceneData });
  }

  handleDatasetNameChange(e){
    const id = e.target.getAttribute('data-id');
    const id2 = e.target.getAttribute('data-id2');
    const SceneData = this.state.SceneData;
    
    for(let i=0; i<SceneData.length; i++){
      if(SceneData[i].id == id && SceneData[i].id2 == id2)
        SceneData[i].name = e.target.value;
    }

    this.setState({ SceneData });
  }

  handleDatasetValueChange(e){
    const id = e.target.getAttribute('data-id');
    const id2 = e.target.getAttribute('data-id2');
    const SceneData = this.state.SceneData;
    
    for(let i=0; i<SceneData.length; i++){
      if(SceneData[i].id == id && SceneData[i].id2 == id2)
        SceneData[i].value = e.target.value;
    }

    this.setState({ SceneData });
  }

  handleXmlValueChange(dataset, xml){
    const id = dataset.id;
    const id2 = dataset.id2;
    const SceneData = this.state.SceneData;
    
    for(let i=0; i<SceneData.length; i++){
      if(SceneData[i].id == id && SceneData[i].id2 == id2)
        SceneData[i].value = xml;
    }

    this.setState({ SceneData });
  }

  handleDatasetRemove(id, id2){
    const SceneData = this.state.SceneData.slice();
    for(let i=0; i<SceneData.length; i++){
      if(SceneData[i].id == id && SceneData[i].id2 == id2){
        SceneData.splice(i,1);
        break;
      }
    }

    this.setState({ SceneData });
  }

  renderFieldContents(d){
    switch(d.type){
      case "xml":
        return <EditTemplateXml value={d.value} onChange={x => this.handleXmlValueChange(d, x)} />;
      case "json":
        return <EditTemplateJson value={d.value} onChange={x => this.handleXmlValueChange(d, x)} />;
      default:
        return <Input type={d.type == "text" ? "text" : "textarea"} label="Value" labelClassName="col-xs-2" wrapperClassName="col-xs-10" rows={5} 
          onChange={e => this.handleDatasetValueChange(e)} data-id={d.id} data-id2={d.id2} value={d.value} />;
    }
  }

  render() {
    const dataFields = (this.state.SceneData || []).map((d) => {
      return <div key={d.id+" "+d.id2}>
        <hr />
        <Input label="Dataset Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
          <Row>
            <Col xs={10}>
              <Input type="text" onChange={e => this.handleDatasetNameChange(e)} data-id={d.id} data-id2={d.id2} value={d.name} placeholder="Name used in cviz" />
            </Col>
            <Col xs={2}>
              <Button bsStyle="warning" onClick={() => this.handleDatasetRemove(d.id, d.id2)}>Remove</Button>
            </Col>
          </Row>
        </Input>

        { this.renderFieldContents(d) }
      </div>;
    });

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <form className="form-horizontal" onSubmit={e => this.handleSubmit(e)}>
                <fieldset>
                  <legend>
                    Edit scene&nbsp;&nbsp;
                    <a className="btn btn-warning" href="#/edit/scenes">Back to List</a>
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
                    <Button bsStyle="info" onClick={() => this.AddData("text")}>Add text</Button>&nbsp;
                    <Button bsStyle="info" onClick={() => this.AddData("xml")}>Add xml dataset</Button>&nbsp;
                    <Button bsStyle="info" onClick={() => this.AddData("json")}>Add json dataset</Button>&nbsp;
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
