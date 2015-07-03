/**
 * Initialize Blockly and layout.  Called on page load.
 */
function init() {
  var expandList = [
    document.getElementById('blockly'),
  ];
  var onresize = function(e) {
    for (var i = 0, expand; expand = expandList[i]; i++) {
      expand.style.width = (expand.parentNode.offsetWidth - 2) + 'px';
      expand.style.height = (expand.parentNode.offsetHeight - 2) + 'px';
    }
  };
  onresize();
  window.addEventListener('resize', onresize);

  function crearGenericos() {
    var genericos = '';
    genericos += '<category name="Utilitarios">';
    genericos += '<category name="valores">';
    genericos += '<block type="math_number_politica"></block>';
    genericos += '<block type="null"></block>';
    genericos += '<block type="text_politica"></block>';
    genericos += '<block type="var_rule"></block>';
    genericos += '<block type="logic_boolean_politica"></block>';
    genericos += '</category>';
    genericos += '<category name="comparadores">';
    genericos += '<block type="math_arithmetic_politica"></block>';
    genericos += '<block type="logic_concepts_compare"></block>';
    genericos += '<block type="compare_sura"></block>';
    genericos += '</category>';
    genericos += '<category name="funciones">';
    genericos += '<block type="accumulate"></block>';
    genericos += '<block type="length"></block>';
    genericos += '</category>';
    genericos += '</category>';
    return genericos;
  }

  function crearInterna() {
    var politicaInterna = '';
    politicaInterna += '<category name="Rule Base">';
    politicaInterna += '<block type="rule_base"></block>';
    politicaInterna += '<block type="print_RHS"></block>';
    politicaInterna += '</category>';
    return politicaInterna;
  }

  function categoryClass(){
    var categoryClass = '';
    categoryClass += '<category name="Objects">';
    categoryClass += '<category name="Persona">';
    categoryClass += '<block type="fact"></block>';
    categoryClass += '<block type="fact_att_edad"></block>';
    categoryClass += '<block type="fact_att_sexo"></block>';
    categoryClass += '</category>';
    categoryClass += '</category>';
    return categoryClass;
  }

  function categoryLogical(){
    var category = '';
    category += '<category name="Logical">';
    category += '<block type="logical_compare_att"></block>';
    category += '<block type="logical_operation_att"></block>';
    category += '</category>';
    return category;
  }

  var categories = '';
  categories += crearInterna();
  categories += crearGenericos();
  categories += categoryClass();
  categories += categoryLogical();
  var toolbox = '<xml>';
  toolbox += categories;
  toolbox += '</xml>';
  Blockly.inject(document.getElementById('blockly'),
                 {path: '../../', toolbox: toolbox});
}
window.addEventListener('load', init);

function toCode(){
  var code = Blockly.Drools.workspaceToCode();
  window.alert(code);
}
