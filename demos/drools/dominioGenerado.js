'use strict';

var Conceptos = {};
var Atributos = {};

String.prototype.capitalize = function() {
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); });
};

Conceptos.addValor = function(nombre){
    crearBloque(nombre);
}

function crearBloque(nombre){
  Blockly.Blocks['concepto_'+nombre] = {
    name: nombre.capitalize(),
    init: function() {
      this.appendValueInput("FACT_NAME")
          .appendField(new Blockly.FieldTextInput(""), "FACT_VAR")
          .appendField(nombre.capitalize());
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(240);
    }
  };

  Blockly.Drools['concepto_'+nombre] = function(block) {
    var text_fact_var = block.getFieldValue('FACT_VAR');
    var value_fact_name = Blockly.Drools.valueToCode(block, 'FACT_NAME', Blockly.Drools.ORDER_NONE)||'';
    var code = (text_fact_var != ''?text_fact_var+': ':'')+block.name+' ('+value_fact_name+')\n';
    block.codigo = code;
    return code;
  };

}

Atributos.crearBloque = function(nombre, esLista){
  var blockType = '';

  if(esLista){
    Blockly.Blocks['list_'+nombre] = {
      name: nombre,
      init: function() {
        this.appendDummyInput()
        .appendField(nombre);
        this.appendDummyInput()
        .appendField("contains")
        .appendField(new Blockly.FieldTextInput(""), "var");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(330);
        this.setTooltip('');
      }
    };

    Blockly.Drools['list_'+nombre] = function(block) {
      var text_var = block.getFieldValue('var');
      var code = block.name+' contains '+text_var;
      return [code, Blockly.Drools.ORDER_NONE];
    };

    blockType = '<block type="list_' + nombre + '"></block>'

  }else{
    Blockly.Blocks['att_'+nombre] = {
      name: nombre,
      init: function() {
        this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FIELD_VAR")
        .appendField(nombre);
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(270);
      }
    };

    Blockly.Drools['att_'+nombre] = function(block) {
      var text_field_var = block.getFieldValue('FIELD_VAR') || '';
      var code = (text_field_var !== ''?text_field_var+': ':'')+block.name;
      return [code, Blockly.Drools.ORDER_ATOMIC];
    };

    blockType =  '<block type="att_' + nombre + '"></block>';
  }
  return blockType;
}
