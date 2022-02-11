// Declaration
const map;
const mapCenter = {
  // 金沢駅: HJHX+67 36.578063,136.648188
  lat: 36.578063, // 緯度
  lng: 136.648188 // 経度
}
var marker;
var infoKanazawaSta;

/*
const input = document.getElementById("latlng").value;
const latlngStr = input.split(",", 2);
const latlng = {
  lat: parseFloat(latlngStr[0]),
  lng: parseFloat(latlngStr[1])
}
*/

/*
var markerData = [
  {
    "name": "金沢駅",
    "site": "〒920-0858 石川県金沢市木ノ新保町1番1号",
    "pluscode": "HJHX+67",
    "latlng": "36.57809597446637, 136.6481606694275",
    "url": "null",
    "type": "sta"
  },

  {
    "name": "兼六園",
    "site": "〒920-0936 石川県金沢市兼六町１",
    "pluscode": "HM67+V3",
    "latlng": "36.562323505378785, 136.66256630309994",
    "url": "null",
    "type": "plc"
  }

]
*/

// Init Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), { // #mapに地図を埋め込む
    center: mapCenter, // 地図の表示中心地を設定（今回は緯度経度を変数に格納しそれを呼び出し）
    zoom: 14, // 地図のズームを指定
    mapTypeControl: false, // マップ切り替えのコントロールを表示するかどうか
    streetViewControl: true // ストリートビューのコントロールを表示するかどうか
  });

/*
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  document.getElementById("submit").addEventListener("click", () => {
    geocodeLatLng(geocoder, map, infowindow);
  });
*/

/*
  // マーカー
  marker = new google.maps.Marker({ // マーカーの追加
    position: kanazawaStaCenter, // マーカーを立てる位置を指定
    map: map // マーカーを立てる地図を指定
  });


  // マーカー毎の処理（for文）
  for (var i = 0; i < markerData.length; i++) {
    markerLatLng = new google.maps.LatLng({
      lat: markerData[i]['lat'],
      lng: markerData[i]['lng']
    }); // 緯度経度のデータ作成
    marker[i] = new google.maps.Marker({ // マーカーの追加
      position: markerLatLng, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
    });

    infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
      content: '<div class="sample">' + markerData[i]['name'] + '</div>' // 吹き出しに表示する内容
    });

    markerEvent(i); // マーカーにクリックイベントを追加
  }

  marker[0].setOptions({ // TAM 東京のマーカーのオプション設定
    icon: {
      url: markerData[0]['icon'] // マーカーの画像を変更
    }
  });
*/

} // initMap()

/*
// マーカーにクリックイベントを追加
function markerEvent(i) {
  marker[i].addListener('click', function() { // マーカーをクリックしたとき
    infoWindow[i].open(map, marker[i]); // 吹き出しの表示
  });
}
*/

/*
// JSON li 吐き出し
$(function() {
  json = "./package.json";
  target = $('#ldb');
  $.getJSON(json, function(data, status) {
    for (var n in data) {
      var text = '<li>';
      if (data[n].url) {
        line = '<a href="' + data[n].url + '" target="_blank"><span>' + data[n].name + '</span></a>';
      } else {
        line = '<li><span>' + data[n].name + '</span></li>';
      }
      text = text + line + '</li>';
      $(target).append(text);
    }
  });
});
*/
