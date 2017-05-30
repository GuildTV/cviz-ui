/*
* External Dependancies
*/

import React from 'react';
import {
  Row, Col,
  Input, Button
} from 'react-bootstrap';
import xmlBuilder from 'xmlbuilder';


export class EditTemplateXml extends React.Component {
  constructor(props) {
    super(props);

    const fields = this.tryParseXml(props.value) || [];

    this.state = {
      failedParse: fields == null,
      fields: fields,
      rawStr: props.value,
    };

    setTimeout(() => this.ensureHasEmpty(), 10);
  }

  tryParseXml(str){
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(str, "text/xml");
    if (!xmlDoc || this.hasAnyParserErrors(xmlDoc.documentElement))
      return null;

    try {
      const res = [];
      const fields = xmlDoc.querySelectorAll('componentData');
      for (let f of fields){
        const name = f.getAttribute('id');
        const value = f.querySelector('data').getAttribute('value');

        if (name === null)
          continue;

        res.push({ name: name, value: value, _id: Math.random() });
      }
      return res;
    } catch (e){
      console.log("Failed to parse xml:", e);
      return null;
    }
  }

  compileXml(){
    if (this.state.failedParse)
      return this.state.rawStr;

    const rootElm = xmlBuilder.create('templateData', { headless: true });

    for (let i = 0; i < this.state.fields.length; i++) {
      const field = this.state.fields[i];
      const comp = rootElm.ele('componentData', { id: field.name });  
      comp.ele('data', { id: "text", value: field.value});
    }
    
    return rootElm.end();
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

  handleFieldNameChange(e, i) {
    const fields = this.state.fields.slice();
    if (fields.length <= i)
      fields.push({ name: e.target.value, value: "", _id: Math.random() });
    else
      fields[i].name = e.target.value;

    this.setState({ fields: fields }, () => this.handleDataChange());
  }

  handleFieldValueChange(e, i) {
    const fields = this.state.fields.slice();
    if (fields.length <= i)
      fields.push({ name: "", value: e.target.value, _id: Math.random() });
    else
      fields[i].value = e.target.value;

    this.setState({ fields: fields }, () => this.handleDataChange());
  }

  handleFieldRemove(i) {
    const fields = this.state.fields.slice();
    if (fields.length > i)
      fields.splice(i, 1);

    this.setState({ fields: fields }, () => this.handleDataChange());
  }

  ensureHasEmpty(){
    let hasBlankName = false;
    for (let i = 0; i < this.state.fields.length; i++) {
      const field = this.state.fields[i];
      hasBlankName = hasBlankName || field.name == "" || field.name === null;
    }
    if (!hasBlankName){
      const fields = this.state.fields.slice();
      fields.push({ name: "", value: "", _id: Math.random() });
      this.setState({ fields: fields });
    }
  }

  handleDataChange(){
    this.ensureHasEmpty();

    if (typeof this.props.onChange == "function")
      this.props.onChange(this.compileXml());
  }


  renderField(d, i){
    return <div key={i + " " + d._id}>
      <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
        <Row>
          <Col xs={3}>
            <Input type="text" onChange={e => this.handleFieldNameChange(e, i)} data-id={i} value={d.name} placeholder="eg f0" />
          </Col>
          <Col xs={8}>
            <Input type="text" onChange={e => this.handleFieldValueChange(e, i)} data-id={i} value={d.value} placeholder="eg Person Name" />
          </Col>
          <Col xs={1}>
            <Button bsStyle="danger" onClick={() => this.handleFieldRemove(i)}>X</Button>
          </Col>
        </Row>
      </Input>
    </div>;
  }

  render() {
    let hasEmptyName = false;
    const dataFields = (this.state.fields || []).map((d, i) => {
      hasEmptyName = hasEmptyName || d.name == "";
      return this.renderField(d, i);
    });

    // if (!hasEmptyName)
    //   dataFields.push(this.renderField({ name: "", value: "" }, dataFields.length));

    return (
      <div>
        { dataFields }
      </div>
    );
  }
}
