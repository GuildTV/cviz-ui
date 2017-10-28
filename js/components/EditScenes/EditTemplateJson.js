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
          value: replaceAll(fields[k], "\\\\n", "\n"),
        });
      }

      return res;
    } catch (e){
      console.log("Failed to parse json:", e);
      return null;
    }
  }

  compileResult(){
    if (this.state.failedParse)
      return this.state.rawStr;

    const rootElm = {};
    for (let i = 0; i < this.state.fields.length; i++) {
      const field = this.state.fields[i];
      rootElm[field.name] = replaceAll(field.value, "\n", "\\n");
    }
    
    return JSON.stringify(rootElm);
  }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}