import React from 'react';
import {
  Row, Col,
  Input, Button
} from 'react-bootstrap';

import { EditTemplateBase } from './EditTemplateBase';

export class EditTemplateJson extends EditTemplateBase {
  tryParse(str){
    try {
      const fields = JSON.parse(str);
      const res = [];
      for (const k of Object.keys(fields)){
        res.push({
          name: k,
          value: fields[k],
        });
      }

      return res;
    } catch (e){
      console.log("Failed to parse xml:", e);
      return null;
    }
  }

  compileResult(){
    if (this.state.failedParse)
      return this.state.rawStr;

    const rootElm = {};

    for (let i = 0; i < this.state.fields.length; i++) {
      const field = this.state.fields[i];
      rootElm[field.name] = field.value;
    }
    
    return JSON.stringify(rootElm);
  }
}
