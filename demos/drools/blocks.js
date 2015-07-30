'use strict';

var listaConceptos = [];
var Atributos = {
    valores : []
}
var Conceptos = {
    valores : []
}
Atributos.getValores = function(){
    return Atributos.valores;
}

Atributos.addValor = function(nombre, valor){
    Atributos.valores.push([new String(nombre), new String(valor)]);
    crearBloqueAtributo(nombre);

}

Atributos.limpiarValores = function(){
    Atributos.valores = [];
}

Atributos.limpiarBloqueRaiz= function(){
    bloqueRaiz = undefined;
}

Conceptos.getValores = function(){
    return Conceptos.valores;
}

Conceptos.addValor = function(nombre,idBloque, hijos, relaciones, esLista, atributo){
    crearBloque(nombre,idBloque, relaciones, esLista,atributo);
}

Conceptos.limpiarValores = function(){
    Conceptos.valores = [];
}

Conceptos.crearBloqueCumulo = function(coberturas, canales, producto){
    crearBloqueCumulo(coberturas, canales, producto);
}


var productoG = null;// utilizado por rc y cumulo
Conceptos.setProducto = function(producto){
    productoG = producto;
}

var bloqueRaiz = undefined;

function setBloqueRaiz(nombre){
    var arrValores = [nombre, 'bloque_raiz'];
    bloqueRaiz= arrValores;
}

function crearBloque(nombre,idBloque, relaciones, esLista, atributo){
    if(!bloqueRaiz){
        setBloqueRaiz(nombre);
    }
    Blockly.Blocks[idBloque] = {
        category: 'Concepto',
        nombreConcepto: nombre,
        isList: esLista === undefined? false: esLista,
        tipoClase: atributo.concepto.clase,
        init: function() {
            var atributos_acepto = [];
            angular.forEach(atributo.atributos, function (atributo_simple) {
                atributos_acepto.push(atributo_simple.concepto.id);
            });
            if(esLista)
                this.setColour(260);
            else
                this.setColour(200);

            if(relaciones.length > 0){
                var duplasRelaciones = relaciones.map(function(r){ return [r,r]; });
                this.appendDummyInput()
                    .appendField("Rel: ")
                    .appendField(new Blockly.FieldDropdown(duplasRelaciones), "RELACIONES");
            }
            if(atributo.concepto.clase!='ejecucion')
            {
                this.appendDummyInput()
                    .appendField("Tipo:")
                    .appendField(nombre);
            }
            var bloquesAceptados = atributos_acepto;
            bloquesAceptados.push('logic_concepts_compare');
            this.appendStatementInput("concepto")
                .setCheck(bloquesAceptados)
            var previousStatement = (nombre == bloqueRaiz[0])? bloqueRaiz : nombre;
            this.setPreviousStatement(true, previousStatement);
            this.setInputsInline(false)
            this.setTooltip('Concepto complejo de tipo: ' + nombre + ', es lista:' + esLista);
        }
    };



    listaConceptos.push(nombre);

    Blockly.Drools[idBloque] = function(block) {
        var statements_name = Blockly.Drools.statementToCode(block, 'concepto');
        var relacion = block.getFieldValue('RELACIONES');
        var nombreRelacion = relacion == null ? "" : '"relacion": "'+ relacion+'",'
        var nombreCon = block.tipoClase == 'ejecucion' ? "" : '"nombre": "'+ nombre+'",'
        var code = '"atributo": {'+nombreCon+ nombreRelacion + ' "esLista": "'+block.isList+'",'+statements_name+'}';
        return code;
    };
}


function crearBloqueAtributo(nombreAtributo){
    Blockly.Blocks[nombreAtributo] = {
        category: 'Atributo',
        nombreConcepto: nombreAtributo,
        init: function() {
            this.setColour(315);
            this.appendDummyInput()
                .appendField(nombreAtributo)
            //this.setInputsInline(true);
            this.setPreviousStatement(true, [nombreAtributo,'atributo']);
            // this.setOutput(true, nombreAtributo);
            this.setTooltip('Concepto simple de tipo: ' + nombreAtributo);
        }
    };


    Blockly.Drools[nombreAtributo] = function(block) {
        var code = '"atributo": {"nombre": "' +nombreAtributo +'"}';
        return code.trim();
    };

}

///////// Blocks //////////////////////

Blockly.Blocks['rule_base'] = {
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendField("Name")
            .appendField(new Blockly.FieldTextInput("rule_name"), "rule_name");
        this.appendStatementInput("LHS")
            .appendField('When')
            .setCheck(null);
        this.appendValueInput("RHS")
            .setCheck("then_rule")
            .appendField("Then");
    }
};


Blockly.Drools['rule_base'] = function(block) {
    var rule_name = block.getFieldValue('rule_name');
    var text_LHS = Blockly.Drools.statementToCode(block, 'LHS');
    var text_RHS = Blockly.Drools.valueToCode(block, 'RHS', Blockly.Drools.ORDER_ATOMIC);
    var code = 'rule "'+rule_name+'"\n';
    code += 'when\n';
    code += ''+text_LHS+'';
    code += 'then\n';
    code += text_RHS;
    code += 'end\n';
    return code;
};

////////////////////// RHS ////////////////////////////////////
Blockly.Blocks['inconsistency_RHS'] = {
    init: function() {
        this.setColour(15);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("var"), "VAR_TEXT")
            .appendField("Inconsistency")
            .appendField(new Blockly.FieldTextInput("message"), "MSG_TEXT");
        this.setOutput(true);
    }
};

Blockly.Drools['inconsistency_RHS'] = function(block) {
    var var_txt = block.getFieldValue('VAR_TEXT');
    var text_RHS = block.getFieldValue('MSG_TEXT');
    var code = var_txt;
    code += '.getInconsistencias().add(';
    code += 'new Inconsistencia("'+text_RHS+'")';
    code += ');';
    code += '\n';
    return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Blocks['warning_RHS'] = {
    init: function() {
        this.setColour(60);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("var"), "VAR_TEXT")
            .appendField("Warning")
            .appendField(new Blockly.FieldTextInput("message"), "MSG_TEXT");
        this.setOutput(true);
    }
};

Blockly.Drools['warning_RHS'] = function(block) {
    var var_txt = block.getFieldValue('VAR_TEXT');
    var text_RHS = block.getFieldValue('MSG_TEXT');
    var code = var_txt;
    code += '.getAdvertencias().add(';
    code += 'new Advertencia("'+text_RHS+'")';
    code += ');';
    code += '\n';
    return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Blocks['var_rule'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("var")
        .appendField(new Blockly.FieldTextInput(""), "VAR_TEXT");
    this.setOutput(true);
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Drools['var_rule'] = function(block) {
  var text_var_text = block.getFieldValue('VAR_TEXT');
  var code = text_var_text.trim();
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

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

Blockly.Drools['logic_operation_drools_facts'] = function(block) {
    var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
    var statements_atributo = Blockly.Drools.statementToCode(block, 'A');
    var statements_condicion = Blockly.Drools.statementToCode(block, 'B');
    var code = '(' +statements_atributo+' '+operator+' '+statements_condicion+ ')\n';
    return code;
};

////////////////////// UTILITARIOS ////////////////////////////////////
Blockly.Blocks['math_number_politica'] = {
    /**
     * Block for numeric value.
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
        this.setColour(230);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('0',
                Blockly.FieldTextInput.numberValidator), 'NUM');
        this.setPreviousStatement(true, 'math_number_politica');
        this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
    }
};


Blockly.Drools['math_number_politica'] = function(block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code, Blockly.Drools.ORDER_NONE];
};

Blockly.Blocks['math_arithmetic_politica'] = {
    /**
     * Block for basic arithmetic operator.
     * @this Blockly.Block
     */
    init: function() {
        var OPERATORS =
            [[Blockly.Msg.MATH_ADDITION_SYMBOL, '+'],
                [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, '-'],
                [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, '*'],
                [Blockly.Msg.MATH_DIVISION_SYMBOL, '/'],
                [Blockly.Msg.MATH_POWER_SYMBOL, 'POWER']];
        this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
        this.setColour(230);
        this.setPreviousStatement(true, 'Number');
        this.appendStatementInput('A');
        this.appendStatementInput('B')
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        //this.setInputsInline(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                '+': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
                '-': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
                '*': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
                '/': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
                'POWER': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER
            };
            return TOOLTIPS[mode];
        });
    }
};

Blockly.Drools['math_arithmetic_politica'] = function(block) {

    var operator = block.getFieldValue('OP');
    var argument0 = Blockly.Drools.statementToCode(block, 'A');
    var argument1 = Blockly.Drools.statementToCode(block, 'B');


    var code = '{"operacion_arit": { "operando1": ' +argument0+', "operador": "'+ operator +'", "operando2" : '+  argument1 + '}}';

    return code;
};



////////////////////// POLITICAS RC ////////////////////////////////////

Blockly.Blocks['politicas_rc'] = {
    category: 'pol_externas',
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendField("Riesgos consultables")
            .appendField(new Blockly.FieldTextInput("nombre regla"), "rc-nombre");
        this.appendDummyInput()
            .appendField("Rol")
            .appendField(new Blockly.FieldDropdown([["BENEFICIARIO", "beneficiario"], ["TOMADOR", "tomador"], ["ASEGURADO", "asegurado"]]), 'ROL');
        this.appendStatementInput("TIPODOC")
            .appendField("Tipo Doc")
            .setCheck('bloque_raiz');
        this.appendStatementInput("NUMDOC")
            .appendField("Num Doc")
            .setCheck('bloque_raiz');

        this.setTooltip('Llamar política de riesgos consultables');

    }
};


Blockly.Drools['politicas_rc'] = function(block) {
    var text_politica_nombre = block.getFieldValue('rc-nombre');
    var tipoDoc = this.getInput('TIPODOC')? Blockly.Drools.statementToCode(block, 'TIPODOC'): null;
    var numDoc = this.getInput('NUMDOC')? Blockly.Drools.statementToCode(block, 'NUMDOC'): null;
    var rol = block.getFieldValue('ROL');
    var code = '{"politica_externa": {"nombre": "riesgos_consultables_'+text_politica_nombre+
        '", "atributos": { ' +
        '"tipodoc": {'+tipoDoc+'},'+
        '"numdoc": {'+numDoc+'},'+
        '"producto": "'+productoG+'"'+
        '}, "rol": "'+rol+'"}}';
    return [code, Blockly.Drools.ORDER_NONE];
};




////////////////////// ACUMULATE ////////////////////////////////////

Blockly.Blocks['accumulate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["sumar", "sumar"]]), "drop_func_acc");
    this.appendStatementInput("facts");
    this.appendValueInput("A");
    this.appendValueInput("B")
        .appendField(new Blockly.FieldDropdown([["!=", "!="], ["==", "=="]]), "drop_compare");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Drools['accumulate'] = function(block) {
  var dropdown_drop_func_acc = block.getFieldValue('drop_func_acc');
  var statements_atributo = Blockly.Drools.statementToCode(block, 'facts');
  var factsAccumulate = codeFactsAccumulate(block, 'facts');
  var value_a = Blockly.Drools.valueToCode(block, 'A', Blockly.Drools.ORDER_NONE);
  var dropdown_drop_compare = block.getFieldValue('drop_compare');
  var value_b = Blockly.Drools.valueToCode(block, 'B', Blockly.Drools.ORDER_NONE);
  var code = '';
  code += 'accumulate('+factsAccumulate+', $suma: sum('+value_a+'); $suma '+dropdown_drop_compare+''+value_b+')\n';
  return code;
};

function codeFactsAccumulate(block, name){
  var targetBlock = block.getInputTargetBlock(name);
  var blocks = targetBlock.getDescendants();
  var codigoFacts = [];
  console.log('---> '+blocks.length);
  for (var b = 0; b < blocks.length; b++) {
    var block = blocks[b];
    console.log(block);
    if(block.codigo){
      codigoFacts.push(block.codigo);
    }
  }
  var code = codigoFacts.join(" and ");
  return code;
}

/*Blockly.Blocks['accumulate'] = {
    category: 'Accumulate',
    init: function() {
        this.setColour(65);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField(new Blockly.FieldDropdown([["Sumar", "sum"], ["Contar", "count"], ["Promedio", "average"]]), "OP");
        this.appendStatementInput("atributo")
            .appendField("Atributo");
        this.appendDummyInput()
            .appendField("con condicion")
            .appendField(new Blockly.FieldCheckbox("FALSE", function (option){
                this.sourceBlock_.updateShape_(option);
            }),"CONCONDICION");

        this.setPreviousStatement(true,'accumulate');
        this.setTooltip('');
    },
    updateShape_: function (option) {
        if(option){
            this.appendStatementInput("condicion")
                .appendField("Condición")
                .setCheck(null);
        }else{
            if(this.getInput('condicion') != null) {
                this.removeInput('condicion');
            }
        }
    },
    mutationToDom: function() {
        var container = document.createElement('mutation');
        var condicion = (this.getFieldValue('CONCONDICION') == 'TRUE');
        container.setAttribute('condicion_input', condicion);
        return container;
    },
    domToMutation: function(xmlElment){
        var condicionInput = (xmlElment.getAttribute('condicion_input') == 'true');
        this.updateShape_(condicionInput)
    }
};



Blockly.Drools['accumulate'] = function(block) {
    var dropdown_op = block.getFieldValue('OP');
    var statements_atributo = Blockly.Drools.statementToCode(block, 'atributo');
    var targetBlock = block.getInputTargetBlock('atributo');
    var blocks = targetBlock.getDescendants();
    var codigoFacts = [];
    for (var b = 0; b < blocks.length; b++) {
      var block = blocks[b];
      if(block.codigo){
        codigoFacts.push(block.codigo);
      }
    }

    console.log(codigoFacts.join(" and "));
    var statements_condicion = Blockly.Drools.statementToCode(block, 'condicion');
    var condicionFinal = (statements_condicion == "") ? "" :  '"condicion_acc" : {'+ statements_condicion +'},';
    var code = '{"accumulate": { "operador": "' +dropdown_op+'", '+ condicionFinal+' "atributoAcc" : {'+  statements_atributo + '}}}';
    return code;
};*/





if ( typeof String.prototype.startsWith != 'function' ) {
    String.prototype.startsWith = function( str ) {
        return this.substring( 0, str.length ) === str;
    }
};



////////////////////// CUMULO ////////////////////////////////////



var duplasCoberturas = [];
var duplasCanales = [];


function crearBloqueCumulo(coberturas, canales, producto){

    Blockly.Blocks['cumulo'] = {
        category: 'Cumulo',
        init: function() {
            productoG = producto;
            duplasCoberturas = coberturas.map(function(c){ return [c,c]; });
            duplasCanales = canales.map(function(c){ return [c,c]; });
            this.setColour(120);
            this.appendDummyInput()
                .appendField("Cumulo")
                .appendField(new Blockly.FieldDropdown([["Canal", "2"], ["Cobertura", "3"], ["Producto", "1"]],function (option,duplasCoberturas){
                    this.sourceBlock_.updateShape_(option);
                }),"OP");
            this.appendStatementInput("TIPODOC")
                .appendField("Tipo Doc")
                .setCheck('bloque_raiz');
            this.appendStatementInput("NUMDOC")
                .appendField("Num Doc")
                .setCheck('bloque_raiz');
            this.updateShape_("2");
            this.setTooltip('');
            this.setPreviousStatement(true, 'cumulo');
        },
        updateShape_: function (option) {
            switch(option){
                case "1":
                    mutar("COBERTURA",false,this, duplasCoberturas);
                    mutar("CANAL",false,this, duplasCanales);
                    break;
                case "2":
                    mutar("COBERTURA",true,this, duplasCoberturas);
                    mutar("CANAL",true,this, duplasCanales);
                    break;
                case "3":
                    mutar("COBERTURA",true,this, duplasCoberturas);
                    mutar("CANAL",false,this, duplasCanales);
                    break;
            }
        },
        mutationToDom: function() {
            var container = document.createElement('mutation');
            var columnChose = this.getFieldValue('OP');
            container.setAttribute('cumulo_input', columnChose);
            return container;
        },
        domToMutation: function(xmlElement) {
            var cumuloInput = xmlElement.getAttribute('cumulo_input');
            this.updateShape_(cumuloInput);
        }
    };

    Blockly.Drools['cumulo'] = function(block) {
        var tipoCumulo = block.getFieldValue('OP');
        var tipoDoc = this.getInput('TIPODOC')? Blockly.Drools.statementToCode(block, 'TIPODOC'): null;
        var numDoc = this.getInput('NUMDOC')? Blockly.Drools.statementToCode(block, 'NUMDOC'): null;
        var canal = block.getFieldValue('CANAL');
        var cobertura = block.getFieldValue('COBERTURA');


        var code  = '{"cumulo": {"nombre": "cumulo", "atributos": {'+
            '"tipodoc": {'+tipoDoc+'},'+
            '"numdoc": {'+numDoc+'},'+
            '"canal": "'+canal+'",'+
            '"cobertura": "'+cobertura+'",'+
            '"producto": "'+productoG+'"'+
            '}, "tipo": '+tipoCumulo+'}}';

        return [code, Blockly.Drools.ORDER_NONE];
    };

    function mutar(nombre, crear, element, datas){
        var exists = element.getInput(nombre)
        if( !exists && crear ){
            element.appendDummyInput(nombre)
                .appendField(camelCase(nombre))
                .setAlign(Blockly.ALIGN_LEFT)
                .appendField(new Blockly.FieldDropdown(datas), nombre)
                .setAlign(Blockly.ALIGN_RIGHT);
        }
        if( exists && !crear){
            element.removeInput(nombre);
        }
    };

}

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

//////////////////////////////////// length ////////////


Blockly.Blocks['length'] = {
    category: 'Atributo',
    init: function() {
        this.appendStatementInput('NAME')
            .appendField("length");
        this.setPreviousStatement(true, 'length');
        this.setTooltip('');
    }
};

Blockly.Drools['length'] = function(block) {
    var statements_name = Blockly.Drools.statementToCode(block, 'NAME');
    var obj = JSON.parse('{'+statements_name+'}');
    var length = obj.atributo.nombre + '.length';
    obj.nombre = length;
    return '"atributo": {"nombre" : "'+obj.nombre+'"}'.trim();
};
