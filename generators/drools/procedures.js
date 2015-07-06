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
 * @fileoverview Generating Drools for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Drools.procedures');

goog.require('Blockly.Drools');


Blockly.Drools['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.Drools.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Drools.statementToCode(block, 'STACK');
  if (Blockly.Drools.STATEMENT_PREFIX) {
    branch = Blockly.Drools.prefixLines(
        Blockly.Drools.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.Drools.INDENT) + branch;
  }
  if (Blockly.Drools.INFINITE_LOOP_TRAP) {
    branch = Blockly.Drools.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.Drools.valueToCode(block, 'RETURN',
      Blockly.Drools.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Drools.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.Drools.scrub_(block, code);
  Blockly.Drools.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Drools['procedures_defnoreturn'] =
    Blockly.Drools['procedures_defreturn'];

Blockly.Drools['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Drools.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Drools.valueToCode(block, 'ARG' + x,
        Blockly.Drools.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Drools.ORDER_FUNCTION_CALL];
};

Blockly.Drools['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.Drools.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Drools.valueToCode(block, 'ARG' + x,
        Blockly.Drools.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.Drools['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Drools.valueToCode(block, 'CONDITION',
      Blockly.Drools.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.Drools.valueToCode(block, 'VALUE',
        Blockly.Drools.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
