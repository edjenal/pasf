
function errorFunc(data, data2){
	console.log(data);
}

$(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
  	$.mobile.defaultPageTransition = 'none';
  	$.mobile.useFastClick  = false;
  	$("#loginAdm").val('admin');
  	$("#senhaAdm").val('admin');
});

function onDeviceReady() {
    //so para ANDROID
    document.addEventListener("backbutton", onBackKeyDown, false); 
}

//so para ANDROID
function onBackKeyDown() {
	//navigator.app.exitApp();
	navigator.notification.alert(
	     'Para retornar utilize o botão \nVoltar/Sair na tela',  // message
	     null,         // callback
	     'Informação',            // title
	     'Ok'                  // buttonName
     );
}

function validaInternet(){
    if(navigator.connection.type != Connection.NONE){
    	return true;
    } else {
    	navigator.notification.alert(
		     'Sem acesso a Internet.\nFavor conectar-se!',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
    	return false;
    }
} 

function menuAdmin2(){
	navigator.notification.alert(
	     'Usuário e/ou Senha\nInválidos',  // message
	     null,         // callback
	     'Falha',            // title
	     'Ok'                  // buttonName
     );
}

function menuAdmin(){
	if($("#loginAdm").val() != "" && $("#senhaAdm").val() != ""){
		if(validaInternet()){
			$.ajax({              
			    type: "POST",  
			    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/login",  
			    data: {login: $("#loginAdm").val(), senha: $("#senhaAdm").val()},
			    contentType:"application/json; charset=utf-8",  
			    dataType: "json",  
			    success: successFuncLogin,  
			    error: errorFunc  
			});
		}
	} else {
		navigator.notification.alert(
		     'Login e senha são campos obrigatórios!',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	}	
}

function successFuncLogin(data){
	if(data == null){
		navigator.notification.alert(
		     'usuario ou senha inválidos!',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	} else {
		//console.log(data);
		$("#idUsuario").val(data.id);
		$("#nome").val(data.nome);
		$.mobile.changePage('#menu');
	}
}

function logoff(){
	navigator.notification.confirm(
        'Deseja realmente sair?',  // message
        sair,              // callback to invoke with index of button pressed
        'Logoff',            // title
        'Sim,Não'          // buttonLabels
    );
}

function sair(id){
	if(id == 1){
		$("#loginAdm").val("");
		$("#senhaAdm").val("");
		$("#idUsuario").val("");
		$.mobile.changePage('#login');
	}
}

function salvarLinkNew(){
	console.log("salvarLinkNew");
	if($("#descricaoCad").val() != "" && $("#linkCad").val() != ""){
		if(validaInternet()){
			$.ajax({              
			    type: "POST",  
			    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/createLink",  
			    data: {link: objetoLinkInJson(null, $("#idUsuario").val(), $("#descricaoCad").val(), $("#linkCad").val())},
			    contentType:"application/json; charset=utf-8",  
			    dataType: "json",  
			    success: successSalvarLink,  
			    error: errorFunc  
			});
		}
	} else {
		navigator.notification.alert(
		     'Descrição e link são campos obrigatórios!',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	}
}

function successSalvarLink(data){
	if(data){
		$("#descricaoCad").val("");
		$("#linkCad").val("");
		alert("Link cadastrado!");
	} else {
		navigator.notification.alert(
		     'Falha ao inserir link',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	}
}

function ListarPag(){
	if(validaInternet()){
		$.ajax({              
		    type: "POST",  
		    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/getLinks",  
		    data: {desc: $("#descricaoFind").val()},
		    contentType:"application/json; charset=utf-8",  
		    dataType: "json",  
		    success: successListarPag,  
		    error: errorFunc  
		});
	}
}
function successListarPag(data){
	$("#lista").html('');
	if (data.length){
		for (var i = 0; i < data.length; i++) {
			var row = data[i];
			var descricao = row.descricao;
			var detalhe = "detalhe("+row.id+")";
			$('#lista').append($('<li/>', {    //here appending `<li>`
			    'data-role': "listview",
			    'data-theme' : "e"
			}).append($('<a/>', {    //here appending `<a>` into `<li>`
			    'onclick': detalhe,
			    'text': descricao
			})));
		}
	} else {
		$('#lista').append($('<li/>', {    //here appending `<li>`
			    'data-role': "listview"
			}).append($('<p/>', {    //here appending `<a>` into `<li>`
			    'text': 'Nenhum item cadastrado'
			})));
	}
	$('ul').listview('refresh');
	$.mobile.changePage('#listar');
}

function detalhe(id){
	if(validaInternet()){
		$.ajax({              
		    type: "POST",  
		    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/getLink",  
		    data: {id: id},
		    contentType:"application/json; charset=utf-8",  
		    dataType: "json",  
		    success: successDetalhe,  
		    error: errorFunc  
		});
	}
}

function successDetalhe(data){
	var row = data;
	var str = row.link;
	if(str.substring(0,7) != "http://" && str.substring(0,8) != "https://" ){
		str = "http://"+str;
	}
	$("#detalheDiv").html(
		"<input type='hidden' value='"+row.id+"' id='idDeletar'>"+
		"<h4>Descrição </h4><p>"+row.descricao+"</p>"+
		"<h4>Link</h4>"+
		"<a href='#' id='link' rel='"+str+"' onClick='chamaLink()'>"+str+"</a>"+
		"<table><tr><td>"+
		"<input type='button' value='Editar' onClick='editar("+row.id+")'>"+
		"</td><td>"+
		"<input type='button' value='Deletar' onClick='deletar()'>"+
		"</td></tr></table>"
	).trigger("create");
	$.mobile.changePage('#detalhe');
}

function chamaLink(){
	url = $("#link").attr("rel");   
	loadURL(url);
}

function loadURL(url){
	if(validaInternet()){
		navigator.app.loadUrl(url, { openExternal:true });
	}
} 

function editar(id){
	if(validaInternet()){
		$.ajax({              
		    type: "POST",  
		    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/getLink",  
		    data: {id: id},
		    contentType:"application/json; charset=utf-8",  
		    dataType: "json",  
		    success: successEditar,  
		    error: errorFunc  
		});
	}
}

function successEditar(data){
	$("#idLink").val(data.id);
	$("#descricaoEditarLink").val(data.descricao);
	$("#linkEditarLink").val(data.link);
	$.mobile.changePage('#editarLink');
}

function updateLink(){
	if(validaInternet()){
		$.ajax({              
		    type: "POST",  
		    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/updateLinks",  
		    data: {link: objetoLinkInJson($("#idLink").val(), $("#idUsuario").val(), $("#descricaoEditarLink").val(), $("#linkEditarLink").val())},
		    contentType:"application/json; charset=utf-8",  
		    dataType: "json",  
		    success: successUpdateLink,  
		    error: errorFunc  
		});
	}
}

function successUpdateLink(data){
	if(data){
		detalhe($("#idLink").val());
	} else {
		navigator.notification.alert(
		     'Falha ao editar link',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	}
}

function deletar(){
	if(validaInternet()){
		$.ajax({              
		    type: "POST",  
		    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/deleteLink",  
		    data: {id: $("#idDeletar").val()},
		    contentType:"application/json; charset=utf-8",  
		    dataType: "json",  
		    success: successDeletarLink,  
		    error: errorFunc  
		});
	}
}

function successDeletarLink(data){
	if(data){
		ListarPag();
	} else {
		navigator.notification.alert(
		     'Falha ao deletar link',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	}
}

function alterarUsuario(){
	$("#loginUser").val($("#loginAdm").val());
	$("#senhaUser").val($("#senhaAdm").val());
	$.mobile.changePage('#usuario');
}

function salarModificacaoUser(){
	var loginUser =	$("#loginUser").val();
	var senhaUser = $("#senhaUser").val();
	if(loginUser != "" && senhaUser != ""){
		if(validaInternet()){
			$.ajax({              
			    type: "POST",  
			    url: "http://10.0.2.2:8080/WSPasf/webresources/generic/updateUsuario",  
			    data: {usuario: objetoUsuarioInJson($("#idUsuario").val(), $("#nome").val(), loginUser, senhaUser)},
			    contentType:"application/json; charset=utf-8",  
			    dataType: "json",  
			    success: successsalarModificacaoUser,  
			    error: errorFunc  
			});
		}
	} else {
		navigator.notification.alert(
		     'Login e senha são câmpos Obrigatórios',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	}
}

function successsalarModificacaoUser(data){
	if(data){
		$("#senhaAdm").val($("#loginUser").val());
		$("#loginAdm").val($("#senhaUser").val());
		$.mobile.changePage('#menu');
	} else {
		navigator.notification.alert(
		     'Falha na alteração do usuario!',  // message
		     null,         // callback
		     'Falha',            // title
		     'Ok'                  // buttonName
	     );
	}
}

function objetoLinkInJson(id, idUsuario, descricao, link){
	var json = {"id":id, "idUsuario":idUsuario, "descricao":descricao, "link":link};
	return JSON.stringify(json);
}

function objetoUsuarioInJson(id, nome, login, senha){
	var json = {"id":id, "nome":nome, "login":login, "senha":senha};
	return JSON.stringify(json);
}