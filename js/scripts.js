// Declaration
var map;
var marker;

// マーカー配置の準備　（JSONを呼びに行き、ドキュメントに配架）
const script = document.createElement("script");
script.setAttribute("type", "type/javascript");
script.setAttribute("src", "../js/package.json");
document.getElementsByTagName("head")[0].appendChild(script);

// Init Map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), { // #mapに地図を埋め込む
    center: { lat: 36.578063, lng: 136.648188 }, // 地図の表示中心地を設定
    // 金沢駅: 8Q8RHJHX+67 36.578063,136.648188
    zoom: 12, // 地図のズームを指定
    mapId: "6f99372f7c64b8b1", // MapIDの使用
    mapTypeControl: false, // マップ切り替えのコントロールを表示するかどうか
    streetViewControl: true // ストリートビューのコントロールを表示するかどうか
  });

  dict(n);


  // Transit Layer（おまけ）
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

} // initMap()

// マーカーをクリックしたときに吹き出しを出す
function attachMessage(marker, msg) {
  google.maps.event.addListener(marker, "click", function(event) {
    new google.maps.InfoWindow({
      content: msg
    }).open(marker.getMap(), marker);
  });
} // /attachMessage

// JSON呼び出し
function dict(n) {
  for (var i = 0; i < n.items.length; i++) { // JSON内「items」が尽きるまでfor文を実装

    // TL;DR PlusCodeを緯度経度に変換し、それをgoogle.maps.LatLng()メソッドに入れる
    // ① JSON内PlusCodeを「n.items[i].plsucode」で呼び出し、変数に代入
    var pluscode = n.items[i].pluscode;

    // ② PlusCodeをOpenlocationCode.decodeメソッドでデコードし、変数「decode」に返された連想配列を格納
    var decoded = OpenLocationCode.decode(pluscode);

    // ③ 緯度経度を連想配列より取り出し、各項目をMath.round()で小数点6位の四捨五入
    var latCtr = Math.round(decoded.latitudeCenter * 1000000) / 1000000;
    var lngCtr = Math.round(decoded.longitudeCenter * 1000000) / 1000000;

    // ④ google.maps.Markerメソッドに緯度経度を渡すため、変数「area」を準備
    var area = new google.maps.LatLng(latCtr, lngCtr);

    // ⑤ いよいよマーカーをつけます
    var marker = new google.maps.Marker({ map: map, position: area });

    // 吹き出しの中身の文言を引数で送る
    attachMessage(marker, n.items[i].name);
  } // /for

  /*
    window.dict = function(n) { // } // /window.dict
  */

} // / dict(m)


/*
// JSON内データをノード吐き出し
function json2node(j) {
  for (var i = 0; i < i.items.length; i++) {

  }
}
*/

// Texture map
function TextureMapType(tileSize) {
  this.tileSize = tileSize;
}

TextureMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement("div");
  div.style.width = this.tileSize.width + "px";
  div.style.height = this.tileSize.height + "px";
  div.style.background = "url(../assets/img/suisai_gayoushi@2x.png)";
  div.style.backgroundSize = "256px 256px";
  return div;
};
