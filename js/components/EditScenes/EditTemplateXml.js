import React from 'react';
import {
  Row, Col,
  Input, Button
} from 'react-bootstrap';
import xmlBuilder from 'xmlbuilder';

import { EditTemplateBase } from './EditTemplateBase';

export class EditTemplateXml extends EditTemplateBase {
  tryParse(str){
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

  compileResult(){
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
}
