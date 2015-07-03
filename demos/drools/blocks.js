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
            .setCheck(['fact']);
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
Blockly.Blocks['print_RHS'] = {
    init: function() {
        this.setColour(210);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("print some text"), "text_RHS");
        this.setOutput(true);
    }
};

Blockly.Drools['print_RHS'] = function(block) {
    var text_RHS = block.getFieldValue('text_RHS');
    var code = 'System.out.println("'+text_RHS+'"));\n'
    return [code, Blockly.Drools.ORDER_ATOMIC];
};
///////////////////////////////////////


///////////// Facts //////////////

Blockly.Blocks['fact'] = {
  name: 'Persona',
  init: function() {
    this.appendValueInput("FACT_NAME")
        .appendField(new Blockly.FieldTextInput(""), "FACT_VAR")
        .appendField("Persona");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "fact");
    this.setNextStatement(true, "fact");
    this.setColour(230);
  }
};

Blockly.Drools['fact'] = function(block) {
  var text_fact_var = block.getFieldValue('FACT_VAR');
  var value_fact_name = Blockly.Drools.valueToCode(block, 'FACT_NAME', Blockly.Drools.ORDER_ATOMIC);
  var code = (text_fact_var != ''?text_fact_var+': ':'')+block.name+' ('+value_fact_name+') \n';
  return code;
};

Blockly.Blocks['fact_att_edad'] = {
  category: 'att',
  name: 'edad',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FACT_ATT_VAR")
        .appendField("edad");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(270);
  }
};


Blockly.Drools['fact_att_edad'] = function(block) {
  var att_var = block.getFieldValue('FACT_ATT_VAR');
  var code = (att_var !== ''?att_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

Blockly.Blocks['fact_att_sexo'] = {
  category: 'att',
  name: 'sexo',
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldTextInput(""), "FACT_ATT_VAR")
        .appendField("sexo");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(270);
  }
};


Blockly.Drools['fact_att_sexo'] = function(block) {
  var att_var = block.getFieldValue('FACT_ATT_VAR');
  var code = (att_var !== ''?att_var+': ':'')+block.name;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};

/////////////////////////////////


////////////////////LOGICAL ////////////

Blockly.Blocks['logical_compare_att'] = {
  init: function() {
    var OPERATORS = [["==", "=="], ["!=", "!="], [">", ">"], [">=", ">="], ["<", "<"], ["<=", "<="] ];
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
  }
};

Blockly.Drools['logical_compare_att'] = function(block) {
  var value_A = Blockly.Drools.valueToCode(block, 'A', Blockly.Drools.ORDER_ATOMIC);
  var dropdown_op = block.getFieldValue('OP');
  var value_B = Blockly.Drools.valueToCode(block, 'B', Blockly.Drools.ORDER_ATOMIC);
  var code = value_A+' '+dropdown_op+' '+value_B;
  return [code, Blockly.Drools.ORDER_ATOMIC];
};


Blockly.Blocks['logical_operation_att'] = {
  category: 'logical_operation_att',
  init: function() {
    var OPERATORS = [["and", "and"], ["or", "or"] ];
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
  }
};

Blockly.Drools['logical_operation_att'] = function(block) {
  var dropdown_op = block.getFieldValue('OP');
  var value_A = Blockly.Drools.valueToCode(block, 'A', Blockly.Drools.ORDER_ATOMIC);
  var value_B = Blockly.Drools.valueToCode(block, 'B', Blockly.Drools.ORDER_ATOMIC);
  var block_A = block.childBlocks_[0];
  var block_B = block.childBlocks_[1];
  var code = '';
  //console.log('block ',block.childBlocks_);
  //console.log('dropdown_op '+dropdown_op);



  /*if(block_A.category === 'att' && block_B.category === 'logical_operation_att'){
    if(dropdown_op === 'and'){
      code += value_A+' && ('+value_B+')';
    }else{
      code += value_A+' || '+value_B;
    }
  }else if(block_A.category === 'logical_operation_att' && block_B.category === 'logical_operation_att'){
    if(dropdown_op === 'and'){
      code += value_A+' , '+value_B+'';
    }else{
      code += value_A+' || '+value_B;
    }
  }else{
    if(dropdown_op === 'and'){
      code += value_A+' , '+value_B;
    }else{
      code += value_A+' || '+value_B;
    }
  }*/

  return [code, Blockly.Drools.ORDER_ATOMIC];

};




////////////////////// COMPARE ////////////////////////////////////


Blockly.Blocks['compare_sura'] = {
    category: 'logic_connect',
    init: function() {
        var OPERATORS = Blockly.LTR ? [
            ['=', '=='],
            ['\u2260', '!='],
            ['>', '>'],
            ['\u2265', '>='],
            ['<', '<'],
            ['\u2264', '<=']
        ] : [
            ['=', '=='],
            ['\u2260', '!='],
            ['<', '<'],
            ['\u2264', '<='],
            ['>', '>'],
            ['\u2265', '>=']
        ];
        this.setColour(140);
        this.appendStatementInput("atributo1")
            .setCheck(['bloque_raiz', 'accumulate', 'cumulo', 'atributo', 'length', 'var_rule']);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(OPERATORS), "OP");
        this.appendStatementInput("atributo2")
            .setCheck(['logic_boolean_politica','text_politica','null', 'math_number_politica', 'var_rule']);
        //this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        //this.setPreviousStatement('logic_connect');
        this.setTooltip('');
    }
};




Blockly.Drools['compare_sura'] = function(block) {
    var dropdown_op = block.getFieldValue('OP');
    var atributo1 = '';
    var atributo2 = '';
    var code = '';
    try {
        atributo1 = Blockly.Drools.statementToCode(block, 'atributo1');
    }catch(err) {
        atributo1 = Blockly.Drools.valueToCode(block, 'atributo1', Blockly.Drools.ORDER_NONE);
    }

    try {
        atributo2 = Blockly.Drools.statementToCode(block, 'atributo2');
    }catch(err) {
        atributo2 = Blockly.Drools.valueToCode(block, 'atributo2', Blockly.Drools.ORDER_NONE);
    }

    code = atributo1.trim()+''+dropdown_op.trim()+''+atributo2.trim();
    if(block.nextConnection.targetConnection !== null){
      code += ',';
    }
    //var code = '"condicion" : {'+atributo1 + ', "con": "' +dropdown_op+'", '+atributo2+'} ';
    return code;
};

Blockly.Blocks['var_rule'] = {
    init: function() {
        this.setColour(210);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(""), "VAR_TEXT")
        this.setPreviousStatement(true);
        this.setTooltip('');
    }
};

Blockly.Drools['var_rule'] = function(block) {
    var code = block.getFieldValue('VAR_TEXT');
    return code.trim();
};

Blockly.Blocks['logic_concepts_compare'] = {
    category: 'logic_connect',
    init: function() {
        this.setColour(330);
        this.appendStatementInput("OP1")
            .appendField("Condición")
            .setCheck(['logic_connect', 'bloque_raiz']);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["and", "and"], ["or", "or"]]), "OP");
        this.appendStatementInput("OP2")
            .appendField("Condición")
            .setCheck(['logic_connect','bloque_raiz']);
        this.setPreviousStatement(true, 'logic_concepts_compare');
        this.setTooltip('Operaciones lógicas');
    }
};



Blockly.Drools['logic_concepts_compare'] = function(block) {
    var dropdown_op = block.getFieldValue('OP');
    var statements_atributo = Blockly.Drools.statementToCode(block, 'OP1');
    var statements_condicion = Blockly.Drools.statementToCode(block, 'OP2');
    var op1Categoria = block.getInputTargetBlock('OP1').category;
    var op2Categoria = block.getInputTargetBlock('OP2').category;

    var code = '';

    if(op1Categoria === 'Concepto' && op2Categoria === 'Concepto'){
      if(dropdown_op === 'or'){
        code = '('+statements_atributo+' or '+statements_condicion+')';
      }else{
        code = '('+statements_atributo+' and '+statements_condicion+')';
      }
    }

    if((op1Categoria === 'Atributo' && op2Categoria === 'Atributo') ||
       (op1Categoria === 'logic_connect' && op2Categoria === 'logic_connect') ){
      if(dropdown_op === 'or'){
        code = statements_atributo+' || '+statements_condicion;
      }else{
        code = statements_atributo+' , '+statements_condicion;
      }
    }
    //var code = '"composicion": { "condicion1": ' + statements_atributo + ', "op":"' + dropdown_op + '","condicion2":' + statements_condicion + '}';

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
                .setCheck(['logic_connect']);
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
    var statements_condicion = Blockly.Drools.statementToCode(block, 'condicion');
    var condicionFinal = (statements_condicion == "") ? "" :  '"condicion_acc" : {'+ statements_condicion +'},';
    var code = '{"accumulate": { "operador": "' +dropdown_op+'", '+ condicionFinal+' "atributoAcc" : {'+  statements_atributo + '}}}';
    return code;
};





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

////////////////////////////////////// null /////////////

Blockly.Blocks['null'] = {
    init: function() {
        this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
        this.setColour(230);
        this.appendDummyInput()
            .appendField("null");
        this.setPreviousStatement(true, ['Number', 'null']);
        this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
    }
};


Blockly.Drools['null'] = function(block) {
    // Numeric value.
    //var code = parseFloat(block.getFieldValue('NUM'));
    return [null, Blockly.Drools.ORDER_NONE];
};

/////////////////////////////////////text/////////////////
Blockly.Blocks['text_politica'] = {
    init: function() {
        this.setColour(210);
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("../../media/quote0.png", 12, 12, ""))
            .appendField(new Blockly.FieldTextInput(""), "TEXT")
            .appendField(new Blockly.FieldImage("../../media/quote1.png", 12, 12, ""));
        this.setPreviousStatement(true, 'text_politica');
        this.setTooltip('');
    }
};

Blockly.Drools['text_politica'] = function(block) {
    var code = block.getFieldValue('TEXT');
    return '"'+code.trim()+'"';
};

/////////////////////////////boolean/////////////////////
Blockly.Blocks['logic_boolean_politica'] = {
    init: function() {
        this.setColour(210);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["true", "TRUE"], ["false", "FALSE"]]),"BOOL");
        this.setPreviousStatement(true,'logic_boolean_politica');
        this.setTooltip('');
    }
};



Blockly.Drools['logic_boolean_politica'] = function(block) {
    var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    return code;
};
