ons.bootstrap().controller('MainCtrl', function($scope) { 
    $scope.tabbar_hide = false;
    
    //Tabbarの表示切替
    $scope.switchTab = function(){
        $scope.tabbar_hide = !$scope.tabbar_hide;
    }
    
    const jp = jpPrefecture;
    $scope.hokaido = jp.prefFindByRegion("北海道", "name");
    $scope.touhoku = jp.prefFindByRegion("東北", "name");
    $scope.kanto = jp.prefFindByRegion("関東", "name");
    $scope.tyubu = jp.prefFindByRegion("中部", "name");
    $scope.kinki = jp.prefFindByRegion("近畿", "name");
    $scope.tyugoku = jp.prefFindByRegion("中国", "name");
    $scope.sikoku = jp.prefFindByRegion("四国", "name");
    $scope.kyusyu = jp.prefFindByRegion("九州", "name");
});

$(function() {
    "use strict";
    
    document.addEventListener('prechange', function(event) {
        //2つめのCameraタグ
        if(event.index === 1){
            if(video == null)
                initVideo();
            else
                cameraId = setInterval(drawCanvas, 50);
        }else{
            if(cameraId != null){
                clearInterval(cameraId);
                cameraId = null;
            }
        }
        //3つ目のMapタグ
        if(event.index === 2){
            //google mapを表示して位置情報を取得する
            syncerWatchPosition.timeId = navigator.geolocation.watchPosition(successFunc, errorFunc, optionObj);
        }else{
            if(syncerWatchPosition.timeId != null){
                navigator.geolocation.clearWatch(syncerWatchPosition.timeId);
                syncerWatchPosition.timeId = null;
            }
        }
    });
    
    /*
        写真に関する処理 
    */
    
    let canvas;
    let ctx;
    let video;
    let cameraId = null;
    
    const initVideo = () => {
        //videoの初期化
        video = document.getElementById("video");
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        navigator.getUserMedia({
            audio: false,
            /*音声使用の有無*/
            video: true /*カメラ使用の有無*/
        }, function(stream) {
            video.src = URL.createObjectURL(stream);
            initCanvas();
        }, function(error) {
            console.error(error);
        });
    }
    
    const initCanvas = () => {
        canvas = document.getElementById("mycanvas");
        canvas.width = $(document).width();
        canvas.height = $(document).height();
        ctx = canvas.getContext("2d");
        cameraId = setInterval(drawCanvas, 50);
    }
    
    const drawCanvas = ()=>{
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    
    
    /*
        地図に関する処理
    */
    let syncerWatchPosition = {
        map: null,
        marker: null,
        timeId:null,
    };
    
    //成功した時の関数
    const successFunc = (position)=>{
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
    };
    
    // 失敗した時の関数
    const errorFunc = (error)=>{
        // エラーコードのメッセージを定義
        var errorMessage = {
            0: "原因不明のエラーが発生しました…。",
            1: "位置情報の取得が許可されませんでした…。",
            2: "電波状況などで位置情報が取得できませんでした…。",
            3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。",
        };
        // エラーコードに合わせたエラー内容を表示
        alert(errorMessage[error.code]);
    };
    // オプション・オブジェクト
    const optionObj = {
        "enableHighAccuracy": false,
        "timeout": 1000000,
        "maximumAge": 0,
    };
});