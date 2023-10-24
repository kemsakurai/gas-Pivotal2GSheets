export function setProperties() {
    const ui = SpreadsheetApp.getUi();
    let response = ui.prompt(":::PivotalTracker の API Token を入力してください。");
    let responseText = response.getResponseText();
    // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
    if (responseText == "" || response.getSelectedButton() == ui.Button.CLOSE) {
        return;
    }
    PropertiesService.getScriptProperties().setProperty("API_TOKEN", responseText);
    ui.alert("PivotalTracker の API Token を設定しました。");
    response = ui.prompt(":::PivotalTracker の ProjectId を入力してください。");
    responseText = response.getResponseText();
    // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
    if (responseText == "" || response.getSelectedButton() == ui.Button.CLOSE) {
        return;
    }
    PropertiesService.getScriptProperties().setProperty("PROJECT_ID", responseText);
    ui.alert("PivotalTracker の ProjectId を設定しました。");
    return;
}