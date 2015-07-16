'use strict';

Blockly.Blocks['fact_negocio'] = {
  name: 'Negocio',
  init: function() {
    this.appendValueInput("FACT_NAME")
        .appendField(new Blockly.FieldTextInput(""), "FACT_VAR")
        .appendField("Negocio");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(240);
  }
};

Blockly.Blocks['att_negocio_riesgos'] = {
  name: 'riesgos',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField("riesgos");
    this.setInputsInline(true);
    this.setOutput(true, ['List']);
    this.setColour(270);
  }
};

Blockly.Drools['att_negocio_riesgos'] = function(block) {
  var text_field_var = block.getFieldValue('FIELD_VAR') || '';
  var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Drools['fact_negocio'] = function(block) {
  var text_fact_var = block.getFieldValue('FACT_VAR');
  var value_fact_name = Blockly.Drools.valueToCode(block, 'FACT_NAME', Blockly.Drools.ORDER_NONE)||'';
  var code = (text_fact_var != ''?text_fact_var+': ':'')+block.name+' ('+value_fact_name+')\n';
  return code;
};


Blockly.Blocks['fact_persona'] = {
  name: 'Persona',
  init: function() {
    this.appendValueInput("FACT_NAME")
        .setCheck(["persona.this", "persona.fumador", "persona.edad", "persona.sexo", "Boolean"])
        .appendField(new Blockly.FieldTextInput(""), "FACT_VAR")
        .appendField("Persona");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(240);
  }
};

Blockly.Drools['fact_persona'] = function(block) {
  var text_fact_var = block.getFieldValue('FACT_VAR');
  var value_fact_name = Blockly.Drools.valueToCode(block, 'FACT_NAME', Blockly.Drools.ORDER_NONE)||'';
  var code = (text_fact_var != ''?text_fact_var+': ':'')+block.name+' ('+value_fact_name+')\n';
  return code;
};

Blockly.Blocks['att_persona_this'] = {
  name: 'this',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField("this");
    this.setInputsInline(true);
    this.setOutput(true, ["persona.this", "String"]);
    this.setColour(270);
  }
};

Blockly.Drools['att_persona_this'] = function(block) {
  var text_field_var = block.getFieldValue('FIELD_VAR') || '';
  var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Blocks['att_persona_edad'] = {
  name: 'edad',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField("edad");
    this.setInputsInline(true);
    this.setOutput(true, ["persona.edad", "Number"]);
    this.setColour(270);
  }
};

Blockly.Drools['att_persona_edad'] = function(block) {
  var text_field_var = block.getFieldValue('FIELD_VAR') || '';
  var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Blocks['att_persona_sexo'] = {
  name: 'sexo',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField("sexo");
    this.setInputsInline(true);
    this.setOutput(true, ["persona.sexo", "String"]);
    this.setColour(270);
  }
};


Blockly.Drools['att_persona_sexo'] = function(block) {
  var text_field_var = block.getFieldValue('FIELD_VAR') || '';
  var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Blocks['att_persona_fumador'] = {
  name: 'fumador',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField("fumador");
    this.setInputsInline(true);
    this.setOutput(true, ["persona.fumador", "Boolean"]);
    this.setColour(270);
  }
};


Blockly.Drools['att_persona_fumador'] = function(block) {
  var text_field_var = block.getFieldValue('FIELD_VAR') || '';
  var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};


Blockly.Blocks['fact_direccion'] = {
  name: 'Direccion',
  init: function() {
    this.appendValueInput("FACT_NAME")
        .setCheck(['direccion.this', 'direccion.calle', "Boolean"])
        .appendField(new Blockly.FieldTextInput(""), "FACT_VAR")
        .appendField("Direccion");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(240);
  }
};

Blockly.Drools['fact_direccion'] = function(block) {
  var text_fact_var = block.getFieldValue('FACT_VAR');
  var value_fact_name = Blockly.Drools.valueToCode(block, 'FACT_NAME', Blockly.Drools.ORDER_NONE)||'';
  var code = (text_fact_var != ''?text_fact_var+': ':'')+block.name+' ('+value_fact_name+')\n';
  return code;
};

Blockly.Blocks['att_direccion_this'] = {
  name: 'this',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField("this");
    this.setInputsInline(true);
    this.setOutput(true, ["direccion.this", "String"]);
    this.setColour(270);
  }
};

Blockly.Drools['att_direccion_this'] = function(block) {
  var text_field_var = block.getFieldValue('FIELD_VAR') || '';
  var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Blocks['att_direccion_calle'] = {
  name: 'calle',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField("calle");
    this.setInputsInline(true);
    this.setOutput(true, ["direccion.calle", "String"]);
    this.setColour(270);
  }
};

Blockly.Drools['att_direccion_calle'] = function(block) {
  var text_field_var = block.getFieldValue('FIELD_VAR') || '';
  var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};


/////////////////////////////////
