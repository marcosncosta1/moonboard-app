// functions
function update_images(){
    d = new Date();
//    $('#board-img').attr("src","/static/img/current_problem.png?"+d.getTime());
    $('#board-modal-img').attr("src","/static/img/current_problem.png?"+d.getTime());
    }

//function toggle_fullscreen(e){
//    console.log('toggle fullscreen');
//    //
//    if (!document.webkitFullscreenElement){
//        document.documentElement.webkitRequestFullscreen();
//    }else{
//        document.webkitExitFullscreen();
//    }
//};

//=============================
$(document).ready(function() {
//document.body.style.zoom = "95%";
console.log("doc ready")
//
update_images();
//
var problems = $('#problemstable').dataTable( {
        sDom: "t<'row'<'col-sm-2 text-left' i>><'row'<'col-sm-12 text-center'p>>",
        ajax:"_get_problems",
        //ajax:Flask.url_for("_get_problems"),
        "columns": [
        { "data": "name" },
        { "data": "grade" },
        { "data": "author" }],
        select:{"style":"single"},
        pagingType: "simple_numbers",
        iDisplayLength: 5
    });

problems.on('select.dt', function ( e, dt, type, indexes ) {
    var problem = dt.row(indexes).data();
    console.log("Selected problem:"+ problem.id)
    document.getElementById("info-button").classList.remove("disabled");
    document.getElementById("info-button").style.visibility = 'visible';
    $('#hold-setup').html(problem.holds_setup_short.join(' + ') );
    $('#SH').html( problem.holds.SH.join(', ') );
    $('#IH').html( problem.holds.IH.join(', ') );
    $('#FH').html( problem.holds.FH.join(', ') );
//    $('#board-modal-title').html( problem.name );
    $('#problem-name').html( "<b>"+problem.name+"</b>");
    $.post( "/_select_problem", {problem_id: problem.id }, update_images());
 });

problems.on('deselect.dt', function ( e, dt, type, indexes ) {
    console.log("Deselected problem.")
    document.getElementById("info-button").classList.add("disabled");
    document.getElementById("info-button").style.visibility = 'hidden';
    $('#hold-setup').html("" );
    $('#SH').html("");
    $('#IH').html("");
    $('#FH').html("");
    $('#board-modal-title').html("");
    $('#problem-name').html("");
    $.post( "/_select_problem", {problem_id: null}, update_images());
 });

$("#select-grades").on('changed.bs.select',
    function( event ){
        var grades = $(this).val();
        if(grades == null){grades=[];}
        console.log("grades",grades);
        $('#problemstable').DataTable().column(1).search('^('+grades.join('$)|(^')+'$)',regex=true).draw();
});

$("#search").on('keyup',//'hide.bs.select',
    function( event ){
        console.log("text",$(this).val());
        $('#problemstable').DataTable().search($(this).val()).draw();
});

//document.getElementById("fullscreen-btn").addEventListener("click",toggle_fullscreen);

//end document ready
});


