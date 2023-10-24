export function initialize() {
    const ui = SpreadsheetApp.getUi();
    // メッセージと「OK」「キャンセル」ボタン
    const response = ui.alert("スプレッドシートを初期化して初期状態にします。よろしいですか?", ui.ButtonSet.OK_CANCEL);
    if (ui.Button.CANCEL == response) {
        /*処理終了*/
        return;
    }
    //CANCELではない場合は処理続行
    //シート削除
    const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    let isExistChangeLogSheet, isExistReleasesSheet = false;
    for (const sheet of sheets) {
        if (sheet.getName() == "ChangeLogs") {
            isExistChangeLogSheet = true;
        }
        if (sheet.getName() == 'Releases') {
            isExistReleasesSheet = true;
        }
    }
    if (!isExistChangeLogSheet) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
        sheet.setName("ChangeLogs");
    } else {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ChangeLogs");
        sheet?.clear();
    }
    if (!isExistReleasesSheet) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
        sheet.setName("Releases");
    } else {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Releases");
        sheet?.clear();
    }
    for (const sheet of sheets) {
        if (sheet.getName() != "ChangeLogs" && sheet.getName() != "Releases") {
            SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
        }
    }
    //プロパティを初期化する
    PropertiesService.getScriptProperties().setProperty("PROJECT_ID", "");
    PropertiesService.getScriptProperties().setProperty("API_TOKEN", "");

    // メッセージと「OK」「キャンセル」ボタン
    ui.alert("初期化が完了しました。", ui.ButtonSet.OK);
    /* 終了*/
}