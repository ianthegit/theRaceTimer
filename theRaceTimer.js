/*  Name WoodbridgeSurfers.js
 * 
 *   AuthorContact WoodbridgeSurfers@hopgood.co.uk
 * 
 *   Aims    So, not the usual header text, but it's an attempt at a shared environment so here goes.
 * 
 *   Realised Aims
 *    Cope with 2 use types
 *     1) Single laps on different bikes over a fixed-length course. Riders starting at
 *      different times on different bikes, results need to collate by user and by bike type.
 *     2)  Triathlon style.  Single-click-transition between laps (so no need to click to stop
 *      swim time then click again to start T1 etc)
 *    
 *    Ability to add users during event (We have a tandem user - so during an event there will be
 *    numerous 'Tandem Rider & UserX' users needing recording.
 * 
 *    Record time taken to drink a pint.
 * 
 *    Keep entire application in a state where it can be dropped into anyone website if they so want to use it.
 *    This means API points must be minimal & simple.
 * 
 *   Unrealised Aims
 * 
 *
 * 
 *    Better UI experience.  The current drop-downs to swap between lap times and the mass-start are a bit clunky
 * 
 */    

 courseLength=2.2;
    nameSort=true;
    laps=[];
    triEnabled=false;
    bespokeLapId=[];
    users=[];
    function woodbridgeSurfersTimerInit(){
     
     users = JSON.parse(localStorage.getItem('userdata'));
     if (users == null || users.length == 0) {
      users = new Array( 'Temp user' );
     }
        if (nameSort) {
            users.sort();
        }
  //if (!bikelist) {
         bikelist = new Array('Lap');
  //}
  bespokeLapId=bikelist;
  
  bikes = bikelist;

  woodbridgeSurfersTimerSetupRecordData();
  document.write("Course Length : <input type='text' id='courseLength' value='" + courseLength + "' onblur='return woodbridgeSurfersTimerSetCourseLengthFromUI(this);'/>");
  document.write(' velocity measured in : <select name="velocity" id="velocity"><option value="miles" selected>Miles</option><option value="kilometres">Kilometres</option><option value="London Buses">London Buses</option><option value="Pints">Pints</option></select>');
  document.write(' per:<select name="units" id="units"><option value="60" selected>Hour</option></select>');
  lapTypes = woodbridgeSurfersTimerTriLapTypes();
  document.write(woodbridgeSurfersTimerSetupLapType());
  document.write(woodbridgeSurfersTimerSetupLapIdentifier());
     document.write('<span id="massStart"></span>');

  document.write('<form id="results">');
  document.write('<table border="1" id="userTable">');
     var size = users.length;
  for (var i = 0 ; i < size ; i++) {
   document.write(woodbridgeSurfersTimerGetUserHtml(users[i]));
  }
     document.write('</table> <br/> ');
     document.write(woodbridgeSurfersTimerSetupLapIdentifierResults());
        document.write('</form>');
        document.write('<input type="button" value="Save results to new Window and Print" title="Once the new page pops up a print dialogue will appear and you can print the page to a file to save." onclick="woodbridgeSurfersTimerEmail()" /> ');
        document.write('<input type="button" value="Add Racer"  title="Add a racer." id="AddUser" onclick="woodbridgeSurfersTimerPopupGetUserName()" /><div id="errorText"></div>');
//        document.write('<p>Version  3 ('+ document.lastModified + ') Developed by <a href="http://www.woodbridgeSurfers.co.uk">Woodbridge Surfers</a>.  Need help:<a href="https://docs.google.com/document/d/1EmnWzeepYHdtDPq9aBzA0ffSsZU-yM8eHH0TYTBfL78/pub">Small help doc</a>. </p> ');
        woodbridgeSurfersTimerToggleTriMode();
    }

    function woodbridgeSurfersTimerTriLapTypes(){
     return new Array ('Ride', 'Run', 'Triathlon', 'Duathlon', 'Short Duathlon');
    }
    function woodbridgeSurfersTimerTriLaps(){
     if (document.getElementById("lapType").value == 'Bespoke') {
      return bespokeLapId;
     }
     if (document.getElementById("lapType").value == 'Triathlon') {
      return new Array('Swim', 'T1', 'Ride', 'T2', 'Run', '-' ,'Adnams', 'Guinness', 'Lager', 'Crabbes');
     }
     if (document.getElementById("lapType").value == 'Duathlon') {
      return new Array('Run1', 'T1', 'Ride', 'T2', 'Run2', '-' ,'Adnams', 'Guinness', 'Lager', 'Crabbes');
     }
     if (document.getElementById("lapType").value == 'Short Duathlon') {
      return new Array('Ride', 'T1', 'Run', '-' ,'Adnams', 'Guinness', 'Lager', 'Crabbes');
     }
     return new Array('Entire Race');
    }
    
    function woodbridgeSurfersTimerEmail(){
     var openWindow = window.open('Results '+ new Date(), 'Results '+ new Date(),'width=350,height=250'
          +',menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1');
     var resultData = document.getElementById("results").innerHTML;
     openWindow.document.writeln(
         '<html><head><title>Results ' + new Date() + '</title></head>'
          +'<body bgcolor=white onLoad="self.focus()">' +resultData +'</body></html>' );
        openWindow.print();
    }

    function woodbridgeSurfersTimerNameSortOff(){
        nameSort=false;
    }

    function woodbridgeSurfersTimerToggleTriMode(){
     if (document.getElementById("lapType").value == 'Bespoke') {
      triEnabled=false; 
      }
     else {
      triEnabled=true; 
     }
     bikes = woodbridgeSurfersTimerTriLaps();
     
     document.getElementById("lapIdDropDown").innerHTML=woodbridgeSurfersTimerSetupLapIdentifier();
     document.getElementById("lapResults").innerHTML=woodbridgeSurfersTimerSetupLapIdentifierResults();
     if (triEnabled) {
      document.getElementById("massStart").innerHTML='<input type="button" id="massStartBttn" value="Mass Start"  title="Mass Start" id="massStartBtn" onclick="woodbridgeSurfersTimerMassStart()" />';
     } else {
      document.getElementById("massStart").innerHTML='';
     }
     return;
    }

    function woodbridgeSurfersTimerMassStart(){
     var size = users.length;
  for (var i = 0 ; i < size ; i++) {
   if (document.getElementById(users[i]+'Btn') != null) {
    woodbridgeSurfersTimerUserBtnClick(document.getElementById(users[i]+'Btn'));
   }
  }
  document.getElementById("massStart").innerHTML='';
    }
    
    function woodbridgeSurfersTimerAddUser(userName) {
        var table = document.getElementById("userTable");
        table.innerHTML = table.innerHTML + woodbridgeSurfersTimerGetUserHtml(userName, table.length);
    }
 function woodbridgeSurfersTimerSetupLapIdentifier(){
  var retVal = "<span id='lapIdDropDown'>";

  retVal = retVal + 'Identify the lap (before starting timer): <select name="Lap Id" id="lapId">';

  lapIdCount =bikes.length;
  for (var i=0 ; i<lapIdCount ; i++){
   if (bikes[i]=='-') {
                retVal = retVal + '<optgroup label="----------"></optgroup>';   
            } else {
          retVal = retVal + '<option value="' + bikes[i] + '"' ;
       if (i==0){
        retVal = retVal+' selected' ;
       }
                retVal = retVal + '>' + bikes[i] + '</option>';
            }
  }
  retVal = retVal + '</select></span>';
  return retVal;
 }

 function woodbridgeSurfersTimerSetupLapType(){
  var retVal = "<br/>";
  retVal = retVal + '<span id="lapTypeSpan"> <select name="Lap Type" id="lapType" onchange="woodbridgeSurfersTimerToggleTriMode();" >';
  lapIdCount =lapTypes.length;
  for (var i=0 ; i<lapIdCount ; i++){
   if (lapTypes[i]=='-') {
                retVal = retVal + '<optgroup label="----------"></optgroup>';   
            } else {
          retVal = retVal + '<option value="' + lapTypes[i] + '"' ;
       if (i==0){
        retVal = retVal+' selected' ;
       }
                retVal = retVal + '>' + lapTypes[i] + '</option>';
            }
  }
  retVal = retVal + '</select></span>';
  return retVal;
 }

 function woodbridgeSurfersTimerPopupGetUserName(){
        var userName = prompt("Please enter the new user name");
        if (userName!='') {
            var tableElement=document.getElementById("userTable");
            var rowCount = tableElement.rows.length;    
            for(var i=0; i<rowCount; i++) {
             if (tableElement.rows[i].cells[1].childNodes[0].value==userName) {
                    document.getElementById("errorText").innerHTML=userName + " has already been used.";
                    return;
             }
            }
            woodbridgeSurfersTimerAddUser(userName);
            users.length = users.length+1;
            users[users.length-1]=userName;
            localStorage.setItem('userdata', JSON.stringify(users));
            document.getElementById("errorText").innerHTML="";
        }
    }

 function woodbridgeSurfersTimerSetupRecordData() {
  resultData = new Array(users.length);
     resultDateStart = new Array(users.length);
     overallDateStart= new Array(users.length);
  for (var i = 0 ; i < users.length ; i++) {
   resultData[i] = "";
      resultDateStart[i] = '';
      overallDateStart[i] = '';
  }
 }

    function woodbridgeSurfersTimerUserBtnDelClick(btnClicked) {
        var tableElement=document.getElementById("userTable");
     var rowCount = tableElement.rows.length;
        for(var i=0; i<rowCount; i++) {
         if (tableElement.rows[i].cells[0].childNodes[0].id==btnClicked.id) {
                var sure = window.confirm("Are you sure you want to delete " +  tableElement.rows[i].cells[1].childNodes[0].value+ "?");
                if (sure==true){

                 users.splice(users.indexOf(tableElement.rows[i].cells[1].childNodes[0].value),1);
                 localStorage.setItem('userdata', JSON.stringify(users));

           tableElement.deleteRow(i);
                }
         }
        }
    }

    function woodbridgeSurfersTimerUserBtnClick(btnClicked){
  var i=users.indexOf(btnClicked.value);
  if (btnClicked.className=='userBtnStop') {
   var diff=new Date() - resultDateStart[i] ;
   var correspondingMsgArea = document.getElementById(btnClicked.value+"Data");
   var timeTakenRounded=(diff/1000).toFixed(1);
   var lapIdInProgress = woodbridgeSurfersGetLapId(correspondingMsgArea.innerHTML);
   woodbridgeSurfersRecordLapTimes(lapIdInProgress, timeTakenRounded, btnClicked.value);
   correspondingMsgArea.innerHTML = correspondingMsgArea.innerHTML + '-' + timeTakenRounded + ' Secs ';
   if (!triEnabled) {
    var units = document.getElementById("units");
    var unitsEnglish='hour';
    numericalUnit=parseFloat(units.value);
    var velocity = document.getElementById("velocity").value;
    correspondingMsgArea.innerHTML = correspondingMsgArea.innerHTML + '(<em>' +
    (((numericalUnit/timeTakenRounded)*courseLength)*numericalUnit).toFixed(2) + '</em>' + velocity + '/' + unitsEnglish + ')';
   }
   if (triEnabled && (woodbridgeSurfersTimerGetNextLap(lapIdInProgress)!="-" && woodbridgeSurfersTimerGetNextLap(lapIdInProgress) != null && !woodbridgeSurfersTimerIsLapADrink(lapIdInProgress))) {
    correspondingMsgArea.innerHTML = correspondingMsgArea.innerHTML +  ', ' + woodbridgeSurfersTimerGetNextLap(lapIdInProgress);
    resultDateStart[i]=new Date();
    btnClicked.title="Stop recording time for " + btnClicked.value + " " + woodbridgeSurfersTimerGetNextLap(lapIdInProgress);
   } else {
    if (triEnabled){
     if (!woodbridgeSurfersTimerIsLapADrink(lapIdInProgress)) {
      var diff=new Date() - overallDateStart[i] ;
      var overallTimeTakenRounded=(diff/1000).toFixed(1);
      correspondingMsgArea.innerHTML = correspondingMsgArea.innerHTML + ', Overall-' + overallTimeTakenRounded;
      woodbridgeSurfersRecordLapTimes('Overall', overallTimeTakenRounded, btnClicked.value);
     }
    }
    btnClicked.className='userBtnGo';
    btnClicked.title="Start recording time for " + btnClicked.value;
   }
  } else {
   resultDateStart[i]=new Date();
   overallDateStart[i]=new Date();
   var correspondingMsgArea = document.getElementById(btnClicked.value+"Data");
   var lapIdInProgress = document.getElementById("lapId").value;
   if (correspondingMsgArea.innerHTML.length>0) {
    correspondingMsgArea.innerHTML=correspondingMsgArea.innerHTML + ', ';
   }
   correspondingMsgArea.innerHTML = correspondingMsgArea.innerHTML + lapIdInProgress;
   btnClicked.className='userBtnStop';
            btnClicked.title="Stop recording time for " + btnClicked.value;
  }
 }

    function woodbridgeSurfersTimerGetNextLap(currentLap){
     for (var i=0 ; i<bikes.length ; i++){
   if (bikes[i]==currentLap){
    if (i<bikes.length){
     return bikes[i+1];
    }
   }
     }
     return null;
    }
    function woodbridgeSurfersGetLapId(userResultsString) {
     var indexOfLastSpace=userResultsString.lastIndexOf(",");
     if (indexOfLastSpace==-1) {
      indexOfLastSpace = 0;
     } else {
      indexOfLastSpace = indexOfLastSpace + 2;
     }
     return userResultsString.substring(indexOfLastSpace);
    }

    function woodbridgeSurfersTimerGetUserHtml(userName){
        retVal='<tr><td>';
     retVal=retVal+'<input type="button" class="userBtnStop" value="x" title="Remove ' + userName + ' from result set" id="RowDel' + userName + '" onclick="woodbridgeSurfersTimerUserBtnDelClick(this)" />';
     retVal=retVal+'<br/></td><td>';
     retVal=retVal+'<input type="button" class="userBtnGo" value="' + userName + '" id="' + userName + 'Btn" onclick="woodbridgeSurfersTimerUserBtnClick(this)" title="Start recording time for '+userName+'" />';
     retVal=retVal+'<br/></td><td>';
     retVal=retVal+'<div id="' + userName+ 'Data"></div>';
     retVal=retVal+'</td></tr>';
     return retVal;
    }

 function woodbridgeSurfersTimerSetCourseLength(length){
  if (!isNaN(length)){
   courseLength=parseFloat(length);
   return true;
  }
  return false;
 }

 function woodbridgeSurfersTimerSetCourseLengthFromUI(length){
  if (!isNaN(length.value)){
   courseLength=parseFloat(length.value);
   return true;
  }
  length.focus();
  return false;
 }

 function woodbridgeSurfersRecordLapTimes(lapIdInProgress, timeTakenRounded, userName){
  if (lapIdInProgress==null){
   return;
  }
  var lapResultArea=document.getElementById("lap"+lapIdInProgress);
  laps.length = laps.length+1;
  laps[laps.length-1]={lapID: lapIdInProgress, name: userName, time: parseFloat(timeTakenRounded).toFixed(1)};
     laps.sort(function(a,b){
      return a.time-b.time;
     });
  innerHTML="";
  foundCount=0;
  for (var i=0 ; i<laps.length ; i++){
   if (laps[i].lapID==lapIdInProgress){
    if (foundCount>0) {
                    if (foundCount==1){
            innerHTML=innerHTML+", +" + parseFloat(laps[i].time-winnerTime).toFixed(1) + " <strong style='color:dimgrey'>" + laps[i].name + "</strong>" ;
                    }
                    else {
                        if (foundCount==2){
                innerHTML=innerHTML+", +" + parseFloat(laps[i].time-winnerTime).toFixed(1)  + " <strong style='color:darkgoldenrod'>" + laps[i].name + "</strong>" ;
                        }
                        else {
                            innerHTML=innerHTML+", +" + parseFloat(laps[i].time-winnerTime).toFixed(1) + " " + laps[i].name  ;
                        }
                    }
                } else {
                    winnerTime=laps[i].time;
           innerHTML = innerHTML + "<strong style='color:gold'>" + laps[i].name + " " + laps[i].time + "<em>Secs</em></strong> " ;
    }
    foundCount++;
   }
  }
  if (lapResultArea != null) {
   lapResultArea.innerHTML = innerHTML;
  }
 }

 function woodbridgeSurfersTimerSetupLapIdentifierResults(){
  lapIdCount =bikes.length;
  var retVal = '<div id="lapResults"> <table border="1" >';
  for (var i=0 ; i<lapIdCount ; i++){
   if (bikes[i]=='-') {
    if (triEnabled) {
        retVal = retVal + '<tr><td>Overall Time</td><td><div id="lapOverall"></div>';
    }
          retVal = retVal + '</table><br/>';
    retVal = retVal + '<table border="1" >';
   } else {
          retVal = retVal + '<tr><td>' + bikes[i] + '</td><td><div id="lap' + bikes[i] + '"></div>';
                retVal = retVal + '</td></tr>';
            };
  }
  retVal = retVal + '</table><br/></div>';
  return retVal;
 };

 function woodbridgeSurfersTimerIsLapADrink(lapId) {
  if (lapId=='Bitter' || lapId=='Adnams' || lapId == 'Lager' || lapId == 'Guinness' || lapId == 'Crabbes' || lapId == 'Cider' || lapId == 'Pint') {
   return true;
  }
  return false;
 }

