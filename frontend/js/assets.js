function include(file)
{
  var script  = document.createElement('script');
  script.src  = file;  script.type = 'text/javascript';  script.defer = true;
  document.getElementsByTagName('head').item(0).appendChild(script);
}

include("js/jquery.jsontotable.js");

var image = "img/uploads/someguy.jpg";

console.log("loading");
$(document).ready ( function () {
    $("#trigger").click( function(){
        var api = $("#endpoint").val();
        var bucket = $("#bucket").val();
        performRequest(api+"/getinfo",JSON.stringify({ "bucket": bucket,"key": image}) );
    });

    function performRequest(urlPost,payload){
        console.log("Posting to backend");
        $.ajax({
            type: 'POST',
            url: urlPost,
            crossDomain: true,
            contentType: 'application/json',
            xhrFields: {
                withCredentials: false
            },
            data: payload,
            dataType: 'json',
            success: function(responseData, textStatus, jqXHR) {
                console.log(responseData);
                $("#td-labels").removeAttr('hidden');
                var counter = 0;
                if(responseData.hasOwnProperty("Labels")){
                    var row = "";
                    for(var i=0;i<responseData["Labels"].Labels.length;i++){
                        row = row + "<tr ><td style='padding: 5px;'>"+ responseData["Labels"].Labels[i]["Name"]+"</td></tr>";
                    }
                    row = row + "</tr>"; 
                    $('#table-results > tbody:last-child').append(row);
                    counter++;
                }
                if(responseData.hasOwnProperty("CelebrityFaces")){
                    var iter = 0;
                    var counterRow= 0;
                    $("#td-celebrities").removeAttr('hidden');
                    $('#table-results').find("tr").each(function(){
                        if (counterRow != 0){
                            var trow = $(this);
                            if(iter < responseData["CelebrityFaces"].length){
                                trow.append("<td style='padding: 5px;'>"+ responseData["CelebrityFaces"][iter]["Name"]+"</td>");
                            }
                            else{
                                trow.append("<td></td>");
                            }
                            iter +=1;
                        }
                        counterRow += 1;
                    });
                    counter++;
                }
                if(responseData.hasOwnProperty("TextDetections")){
                    var iter = 0;
                    var counterRow= 0;
                    $("#td-text").removeAttr('hidden');
                    $('#table-results').find("tr").each(function(){
                        if (counterRow != 0){
                            var trow = $(this);
                            if(iter < responseData["TextDetections"].TextDetections.length){
                                console.log(iter);
                                trow.append("<td style='padding: 5px;'>"+ responseData["TextDetections"].TextDetections[iter]["DetectedText"]+"</td>");
                            }
                            else{
                                trow.append("<td></td>");
                            }
                            iter +=1;
                        }
                        counterRow += 1;
                    });
                    counter++;
                }
            },
            error: function (responseData, textStatus, errorThrown) {
                console.log('POST failed.');
            }
        });
    }
    
});