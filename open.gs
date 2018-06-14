function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Utilities').addSubMenu(ui.createMenu('Contact Kennen').addItem('By Phone','menuItem1').addItem('By Email','menuItem2')).addItem('Import Leads','leadHandler').addToUi();
  var sheetName = "June";
  var row = ss.getSheetByName(sheetName).getRange(1,16).getValue();
  var range = ss.getSheetByName(sheetName).getRange(row+27,1);
  ss.getSheetByName(sheetName).setActiveRange(range);
  range = ss.getSheetByName(sheetName).getRange(row,1);
  ss.getSheetByName(sheetName).setActiveRange(range);
}
function menuItem1() {
  SpreadsheetApp.getUi().alert('Call or text (720) 317-5427');
}
function menuItem2() {
  //Created By Kennen Larence
  var ui = SpreadsheetApp.getUi();
  var input = ui.prompt('Email Sheet Creator','Describe the issue you\'re having in the box below, then press "Ok" to submit your issue via email:',ui.ButtonSet.OK_CANCEL);
  if (input.getSelectedButton() == ui.Button.OK) {
    MailApp.sendEmail('kennen.lawrence@schomp.com','HELP Auto Notification',input.getResponseText());
  } else if (input.getSelectedButton() == ui.Button.CANCEL) {
    Logger.log('User cancelled');
  }
}