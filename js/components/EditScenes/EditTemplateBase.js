import React from 'react';
import {
  Row, Col,
  Input, Button
} from 'react-bootstrap';

export class EditTemplateBase extends React.Component {
  constructor(props) {
    super(props);

    const fields = this.tryParse(props.value) || [];

    this.state = {
      failedParse: fields == null,
      fields: fields,
      rawStr: props.value,
    };

    setTimeout(() => this.ensureHasEmpty(), 10);
  }

  tryParse(str){
  	throw "Not Implemented: tryParse"
  }

  compileResult(){
  	throw "Not Implemented: compileResult"
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
      this.props.onChange(this.compileResult());
  }


  renderField(d, i){
    return <div key={i + " " + d._id}>
      <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
        <Row>
          <Col xs={3}>
            <Input type="text" onChange={e => this.handleFieldNameChange(e, i)} data-id={i} value={d.name} placeholder="eg f0" />
          </Col>
          <Col xs={8}>
            <Input type="textarea" onChange={e => this.handleFieldValueChange(e, i)} data-id={i} value={d.value} placeholder="eg Person Name" rows={1} />
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
