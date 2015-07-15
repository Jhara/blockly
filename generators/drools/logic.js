/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Drools for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Drools.logic');

goog.require('Blockly.Drools');


Blockly.Drools['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Drools.valueToCode(block, 'IF' + n,
      Blockly.Drools.ORDER_NONE) || 'false';
  var branch = Blockly.Drools.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Drools.valueToCode(block, 'IF' + n,
        Blockly.Drools.ORDER_NONE) || 'false';
    branch = Blockly.Drools.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.Drools.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

Blockly.Drools['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Drools.ORDER_EQUALITY : Blockly.Drools.ORDER_RELATIONAL;
  var argument0 = Blockly.Drools.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Drools.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Drools['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Drools.ORDER_LOGICAL_AND :
      Blockly.Drools.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Drools.valueToCode(block, 'A', order);
  var argument1 = Blockly.Drools.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Drools['logic_operation_drools_constraints'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? ',' : '||';
  var order = (operator == ',') ? Blockly.Drools.ORDER_LOGICAL_AND :
      Blockly.Drools.ORDER_LOGICAL_OR;
  var argument0 = logicalOperationConstraintDrools(block, 'A', order);
  var argument1 = logicalOperationConstraintDrools(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == ',') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }

  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};


function logicalOperationConstraintDrools(block, name, order){
  if (isNaN(order)) {
    throw 'Expecting valid order from block "' + block.type + '".';
  }
  var targetBlock = block.getInputTargetBlock(name);
  if (!targetBlock) {
    return '';
  }
  var tuple = Blockly.Drools.blockToCode(targetBlock);
  if (tuple === '') {
    return '';
  }
  if (!goog.isArray(tuple)) {
    throw 'Expecting tuple from value block "' + targetBlock.type + '".';
  }
  var code = tuple[0];
  var innerOrder = tuple[1];
  if (isNaN(innerOrder)) {
    throw 'Expecting valid order from value block "' + targetBlock.type + '".';
  }

  if(order == Blockly.Drools.ORDER_LOGICAL_AND && innerOrder == Blockly.Drools.ORDER_LOGICAL_OR){
    code = '(' + code.replace(/,/g, '&&') + ')';
  } else if(order == Blockly.Drools.ORDER_LOGICAL_OR && innerOrder == Blockly.Drools.ORDER_LOGICAL_AND){
    code = '(' + code.replace(/,/g, '&&') + ')';
  }
  return code;
};

Blockly.Drools['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.Drools.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.Drools.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Drools['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Drools['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Drools['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Drools.valueToCode(block, 'IF',
      Blockly.Drools.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Drools.valueToCode(block, 'THEN',
      Blockly.Drools.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.Drools.valueToCode(block, 'ELSE',
      Blockly.Drools.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.Drools.ORDER_CONDITIONAL];
};
