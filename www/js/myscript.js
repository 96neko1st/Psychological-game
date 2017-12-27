(function() {
    "use strict";
    
    // グローバル変数
    let syncerWatchPosition = {
        map: null,
        marker: null,
    };
    
    //成功した時の関数
    const successFunc = (position) => {
        // 位置情報
        const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // Google Mapsに書き出し
        if (syncerWatchPosition.map == null) {
            // 地図の新規出力
            syncerWatchPosition.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15, // ズーム値
                center: latlng, // 中心座標 [latlng]
            });
            // マーカーの新規出力
            syncerWatchPosition.marker = new google.maps.Marker({
                map: syncerWatchPosition.map,
                position: latlng,
                animation: google.maps.Animation.BOUNCE
            });
        } else {
            // 地図の中心を変更
            syncerWatchPosition.map.setCenter(latlng);
            // マーカーの場所を変更
            syncerWatchPosition.marker.setPosition(latlng);
        }
    }
    
    // 失敗した時の関数
    const errorFunc = (error)=> {
        // エラーコードのメッセージを定義
        var errorMessage = {
            0: "原因不明のエラーが発生しました…。",
            1: "位置情報の取得が許可されませんでした…。",
            2: "電波状況などで位置情報が取得できませんでした…。",
            3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。",
        };
        // エラーコードに合わせたエラー内容を表示
        alert(errorMessage[error.code]);
    }
    // オプション・オブジェクト
    const optionObj = {
        "enableHighAccuracy": false,
        "timeout": 1000000,
        "maximumAge": 0,
    };
    
    //google mapを表示して位置情報を取得する
    navigator.geolocation.watchPosition(successFunc, errorFunc, optionObj);
})();