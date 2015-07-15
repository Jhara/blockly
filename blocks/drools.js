'use strict';

goog.provide('Blockly.Blocks.drools');

goog.require('Blockly.Blocks');



Blockly.Blocks['logic_operation_drools_constraints'] = {
  /**
   * Block for logical operations: 'and', 'or'.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
         [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']];
    this.setHelpUrl(Blockly.Msg.LOGIC_OPERATION_HELPURL);
    this.setColour(330);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A')
        .setCheck('Boolean');
    this.appendValueInput('B')
        .setCheck('Boolean')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'AND': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND,
        'OR': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR
      };
      return TOOLTIPS[op];
    });
  }
};

Blockly.Blocks['logic_operation_drools_facts'] = {
    category: 'logic_connect',
    init: function() {
      var OPERATORS =
          [[Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
           [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']];
        this.setColour(330);
        this.appendStatementInput("A")
            .appendField("")
            .setCheck(null);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(OPERATORS), "OP");
        this.appendStatementInput("B")
            .appendField("")
            .setCheck(null);
        this.setPreviousStatement(true, ['logic_operation_drools_facts', 'rule_base']);
        this.setTooltip('');
    }
};
