function leadHandler() {
  //Created by Kennen Lawrence and Sean Lowe
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var source = ss.getSheetByName("New Lead Activity");
  // change this upon change of month
  var sheetName = "June";
  var target = ss.getSheetByName(sheetName);
  ss.setActiveSheet(target);
  var input;
  
  var date = new Date().toLocaleDateString();
  var today = target.getRange(1, 14, 1, 2).getValues(); /*Logger.log(today);*/
  if (today[0][0] == 0) { // only if entry is first of day
    input = ui.prompt("Enter Row", "Enter the Row number where you would like the day to start.", ui.ButtonSet.OK_CANCEL);
    if (input.getSelectedButton() == ui.Button.CANCEL) { return; }
    //Logger.log(date); return;
    target.getRange(1, 15, 1, 2).setValues([[date,input.getResponseText()]]);
    input = parseInt(input.getResponseText());
  } else {  input = today[0][0];  }
  
  // pull info from source and put into array
  var range = source.getRange(5, 1, source.getLastRow()-4, 17).getValues();
  // info needed in col. 1, 2, 4, check (5, 7, 13), 15, check (16, 17)
  
  //Logger.log(range);
  var count;
  var current = target.getRange(input-1, 1).getValue();
  if (current != "") {
    count = current = parseInt(current);
  } else {
    count = 0;
    current = 0;
  }
  Logger.log("count = " + count + "           " + "current = " + current);
  
  var arr=[];
  var lost = false;
  for (var i = 0; i < range.length; i++) {
    if (range[i][15] == "Internet" || range[i][15] == "Phone Up") {
      arr[count-current]=[];
      //Logger.log("count val" + count);
      arr[count-current][0] = count+1;
      //Logger.log("array value" + arr[0]);
      arr[count-current][1] = range[i][0];    // date
      arr[count-current][2] = range[i][1];    // name
      arr[count-current][3] = range[i][14];   // advisor
      arr[count-current][4] = "";             // time in
      var stat = range[i][12].split(" ");     // status
      stat = parseInt(stat[0]);
      //Logger.log(stat);
      lost = false;
      // check contacted
      if (stat != 0) {
        arr[count-current][5] = "Yes";
        if (stat == 7) {
          lost = true;
        }
      } else {  arr[count-current][5] = "No";  }
      
      // check call
      if (range[i][4] != 0) {
        arr[count-current][6] = "Yes";
      } else {
        arr[count-current][6] = "No";
      }
      
      // check email
      if (range[i][6] != 0) {
        arr[count-current][7] = "Yes";
      } else {
        arr[count-current][7] = "No";
      }
      
      count++;
    } else {
      Logger.log("Not Internet or Phone");
    }
  }
  //Logger.log(arr);
  
  var previousDay = target.getRange(input-50, 3, 49, 1).getValues();
  var final = [];
  //Logger.log("final length " + final.length);
  count = 0;
  for (i = 0; i < arr.length; i++) {
    lost = false;
    if (arr[i][1].toLocaleDateString() != date) {
      if(current==0){
        //Logger.log("in if statement"); 
        count++;
        arr[i][1] = date;
        arr[i][4] = "8:00";
        for (var j = 0; j < previousDay.length; j++) {
          if (previousDay[j][0].toLowerCase() == arr[i][2].toLowerCase()) { // compare all previous names to 1 of today's names
            lost = true;
            //Logger.log(previousDay[j][0].toLowerCase());
            count--;
          }
        }
        if (lost == false) {
          final[final.length] = arr[i];
          final[final.length-1][0] = final.length + current;
        }
      }
    } else {
      final[final.length] = arr[i];
      final[final.length-1][0] = final.length + current;
    }
  }
  Logger.log(count);
  
  
  // check if a Manager updated Contacted/Call/Email and needs to run a report again
  var currentDay = target.getRange(input, 6, final.length, 3).getValues();
  for (i = 0; i < final.length; i++) {
    for (j = 0; j < 3; j++) {
      if (currentDay[i][j] != "No" && currentDay[i][j] != "") {
        final[i][5+j] = currentDay[i][j];
      }
    }
  }
  
  
  target.getRange(input, 1, final.length, final[0].length).setValues(final);
  target.getRange(1, 16, 1, 1).setValue(input+count);
}




// Google Chrome Store Extension link
// https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo