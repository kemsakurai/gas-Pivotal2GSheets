import Utils from "../Utils";
import { node } from "webpack";

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

    // ProjectId
    response = ui.prompt(":::PivotalTracker の ProjectId を入力してください。");
    responseText = response.getResponseText();
    // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
    if (responseText == "" || response.getSelectedButton() == ui.Button.CLOSE) {
        return;
    }
    PropertiesService.getScriptProperties().setProperty("PROJECT_ID", responseText);
    ui.alert("PivotalTracker の ProjectId を設定しました。");

    // doGetFourKeysData
    const button = ui.alert(":::Four Keysに関わる値も取得しますか？\n※取得するとAPIの呼び出し回数が増えて、パフォーマンスは悪くなります。", ui.ButtonSet.YES_NO);
    if (button == ui.Button.CLOSE) {
        return;
    } else if (button == ui.Button.NO) {
        PropertiesService.getScriptProperties().setProperty("DO_GET_FOUR_KEYS_DATA", String(false));
        ui.alert("Four Keysに関わる値は取得しないようにしました。");
    } else if (button == ui.Button.YES) {
        PropertiesService.getScriptProperties().setProperty("DO_GET_FOUR_KEYS_DATA", String(true));
    } else {
        // Do Nothing....
    }
    const doGetFourKeysData = Utils.convertStrToBool(PropertiesService.getScriptProperties().getProperty("DO_GET_FOUR_KEYS_DATA") ?? "false");
    if(!doGetFourKeysData) {
        return;
    }
    // Defective release ticket Identification string
    response = ui.prompt(":::不具合混入リリースチケットを識別する文字列を指定してください。\n※ブランクの場合はデフォルト値を使用します。");
    responseText = response.getResponseText();
    // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
    if (response.getSelectedButton() == ui.Button.CLOSE) {
        return;
    }
    PropertiesService.getScriptProperties().setProperty("DEFECTIVE_TICKET_IDENTIFICATION_STRING", responseText);
    ui.alert("不具合混入リリースチケットの識別文字列を設定しました。");/* Failure Datetime Identification string */

    response = ui.prompt(":::障害発生日時を識別する文字列を指定してください。\n※ブランクの場合はデフォルト値を使用します。");
    responseText = response.getResponseText();
    // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
    if (response.getSelectedButton() == ui.Button.CLOSE) {
        return;
    }
    PropertiesService.getScriptProperties().setProperty("FAILURE_DATETIME_IDENTIFICATION_STRING", responseText);
    ui.alert("障害発生日時の識別文字列を設定しました。");/* Failure Datetime Identification string */

    // Failure resolution Datetime Identification string
    response = ui.prompt(":::障害解消日時を識別する文字列を指定してください。\n※ブランクの場合はデフォルト値を使用します。");
    responseText = response.getResponseText();
    // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
    if (response.getSelectedButton() == ui.Button.CLOSE) {
        return;
    }
    PropertiesService.getScriptProperties().setProperty("FAILURE_RESOLUTION_DATETIME_IDENTIFICATION_STRING", responseText);
    ui.alert("障害解消時刻の日時文字列を設定しました。");/* Failure Datetime Identification string */
    return;
}