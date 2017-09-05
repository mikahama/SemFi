function lookupButton(event){
	var lemma = $("#lemmaInput").val();
	var pos = $("#posSelector option:selected" ).text();
	lookup(lemma, pos);
}

function lookup(lemma, pos) {
	$.ajax({
	  type: "POST",
	  url: "api",
	  data: {"lemma": lemma, "pos": pos},
	  success: lookupReady
	});
}

function lookupReady(data){
	console.log(data);
}