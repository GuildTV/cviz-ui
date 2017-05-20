/*
* External Dependancies
*/

import React from 'react';
import axios from 'axios';
import {
  Modal, Button
} from 'react-bootstrap';
import Select from 'react-select';

/*
* React
*/
export default class AddScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      value: null,
    };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  onChange(e) {
    this.setState({ value: e });
  }

  saveAndClose() {
    this.close();

    const { value } = this.state;
    if (value)
      this.props.save(value.data);
  }

  render() {
    const { value, showModal } = this.state;

    return (
      <div>
        <Modal show={showModal} onHide={() => this.close()}>
          <Modal.Header closeButton>
            <Modal.Title>Add scene</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SceneSelect value={value ? value.value : null} onChange={e => this.onChange(e)} ref={e => this.selectElm = e} />

          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={() => this.saveAndClose()}>Add</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

class SceneSelect extends React.Component {
  loadValues(){
    return axios.get('/api/scenes').then(res => {
      console.log("Loaded scenes list:", res.data.length, "entries");

      const options = res.data.map(u => ({ 
        value: u.id, 
        label: u.name + " (" + u.template + ")", 
        data: u,
      }));

      return {
        complete: true,
        options
      };
    }).catch(err => {
      console.log("Failed loading scenes list:", err);

      return {
        options: []
      };
    });
  }

  render(){
    const { onChange, value } = this.props;

    return <Select.Async
              onChange={onChange}
              value={value}
              loadOptions={() => this.loadValues()} />;
  }
}
