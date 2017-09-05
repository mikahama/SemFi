function lookupButton(event){
	var lemma = $("#lemmaInput").val();
	var pos = $("#posSelector option:selected" ).text();
	lookup(lemma, pos);
}

var lookedUpLemma;
function lookup(lemma, pos) {
	lookedUpLemma = lemma;
	$.ajax({
	  type: "POST",
	  url: "api",
	  data: {"lemma": lemma, "pos": pos},
	  success: lookupReady
	}).fail(function() {
    $('.error').fadeIn(400).delay(3000).fadeOut(400);
  });
}
$(document).ready(function() {
    $('input').bind('keypress', function(e){
       if(e.keyCode == 13) { e.preventDefault();lookupButton(event); }
    });
});

function lookupReady(data){
	$('body').scrollTop(0);
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
		items = items.slice(0, 100);
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
	$("#lemma").text(lookedUpLemma);
	$("#resultsTableContainer").html(html);
}


var translations = {"dir": "direct objects", "indir": "indirect objects"}
function _(text){
	if(text in translations){
		return translations[text];
	}else{
		return text;
	}
}
var poses = {"nouns": "noun", "verbs": "verb", "dir": "noun", "indir": "noun", "subjects": "noun"};
function getPos(text){
	if(text in poses){
		return poses[text];
	}else{
		return null;
	}
}