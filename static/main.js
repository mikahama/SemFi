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
	var html = "<table class='table'><thead><tr><th>Relation</th><th>Words and Frequencies</th></tr></thead><tbody>";
	for(var key in data){
		html = html + "<tr><th scope='row'>"+_(key)+"</th>";
		var items = Object.keys(data[key]).map(function(k) {
		    return [k, data[key][k]];
		});

		// Sort the array based on the second element
		items.sort(function(first, second) {
		    return second[1] - first[1];
		});
		html = html + "<td>";
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var lemma = item[0];
			var freq = item[1];
			var pos = getPos(key);

			var text = lemma + ":" + freq;
			if(pos != null){
				text = "<a href='javascript:lookup(\""+ lemma +"\", \""+ pos+"\")'>" + text + "</a>";
			}
			html = html + text +" ";
		}
		html = html + "</td></tr>";
	}
	html = html + "</tbody></table>";
	$("#resultsTableContainer").html(html);
}


var translations = {}
function _(text){
	if(text in translations){
		return translations[text];
	}else{
		return text;
	}
}
var poses = {};
function getPos(text){
	if(text in poses){
		return poses[text];
	}else{
		return null;
	}
}