// Declaration
var map;
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

// Texture map
function TextureMapType(tileSize) {
  this.tileSize = tileSize;
}

TextureMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('div');
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.background = 'url(../assets/img/suisai_gayoushi@2x.png)';
  div.style.backgroundSize = '256px 256px';
  return div;
};

// Init Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), { // #mapに地図を埋め込む
    center: mapCenter, // 地図の表示中心地を設定（今回は緯度経度を変数に格納しそれを呼び出し）
    zoom: 12, // 地図のズームを指定
    mapId: '6f99372f7c64b8b1', // MapIDの使用
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

// Transit Layer（おまけ）
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);


// マーカー配置の準備　（①JSONを呼びに行き、ドキュメントに配架）
  const script = document.createElement("script");
  script.setAttribute("src", "../js/package.json");
  document.getElementsByTagName("head")[0].appendChild(script);

// 呼び出し
  window.db_callback = function(results) {
      // マップにマーカーを生成
      for (var i = 0; i < results.features.length; i++) {
        var coords = results.features[i].geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1],coords[0]);
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        });
        //吹き出しの中身の文言を引数で送る
        attachMessage(marker, results.features[i].properties.name);
      } // /for
    }

    // マーカーをクリックしたときに吹き出しを出す
    function attachMessage(marker, msg) {
      google.maps.event.addListener(marker, 'click', function(event) {
        new google.maps.InfoWindow({
          content: msg
        }).open(marker.getMap(), marker);
      });
    }

} // initMap()


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
