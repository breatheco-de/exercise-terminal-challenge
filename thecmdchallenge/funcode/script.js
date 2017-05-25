var runtimeTime = 0;


function myGenericListener(event)
{
	//milisecond timer
	setInterval(function(){ runtimeTime++; }, 1);

	printEventLog(event.type);
}

function printEventLog(eventType)
{
	var message = runtimeTime+"mil> ";
	switch(eventType)
	{
		default:
			message += eventType;
		break;
	}
	console.log(message);
}

$(document).ready(function(){
	printEventLog("ready");
	doAjax();

});

function doAjax(){

	console.log('Starting ajax requests...');
	$.ajax({
		url: "https://4geeksacademy.github.io/exercise-assets/json/zips.json",
		success: function(){
			printEventLog("huge ajax success");
		},
		error: function(objError,errorMsg){
			printEventLog("huge ajax error: "+errorMsg);
		}
	});

	$.ajax({
		url: "https://4geeksacademy.github.io/exercise-assets/json/project1.json",
		success: function(){
			printEventLog("project1 ajax success");
		},
		error: function(){
			printEventLog("project1 ajax error");
		}
	});

	$.ajax({
		url: "https://4geeksacademy.github.io/exercise-assets/json/project_list.json",
		success: function(){
			printEventLog("project_list ajax success");
		},
		error: function(){
			printEventLog("project_list ajax error");
		}
	});
}

function startCounter()
{	
	var seconds = parseInt($('#seconds').val());
	var intervalCounter = 0;

	var myInterval = setInterval(function(){ 
		printEventLog('interval'+intervalCounter++); 
	}, seconds*1000);

	$('#stopBtn').click(function(){
		clearInterval(myInterval);
	});
}
