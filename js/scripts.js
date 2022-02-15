/** ========== Declaration ========== **/
var map;
var marker;
const fetchPkg = fetch("../js/package.json");
const fetchAPI = fetch("https://sheets.googleapis.com/v4/spreadsheets/13vCc8TwCt_vPUxuD7T8GrPO8eaHbW8ltEMvrylGeuaA/values/DB?key=AIzaSyC_NpYX_qUe_jEEd6khZlelktz6_sKexX8");
const ldb = document.getElementById("ldb");
const tdb = document.getElementById("tdb");

const mapConfig = {
  center: { lat: 36.578063, lng: 136.648188 }, // 地図の表示中心地を設定
  // 金沢駅: 8Q8RHJHX+67 36.578063,136.648188
  zoom: 12, // 地図のズームを指定
  mapId: "6f99372f7c64b8b1", // MapIDの使用
  mapTypeControl: false, // マップ切り替えのコントロールを表示するかどうか
  streetViewControl: true // ストリートビューのコントロールを表示するかどうか
};


/* ========== functions ========== */
// JSONをfetchするための関数
function encodeJSON() {
  fetchPkg
    // fetchしてJSONを呼び出すための準備
    .then (
      resp => {
        if (!resp.ok) {
          throw new Error("NG");
        }
        return resp.json() // fetchした中から呼び出すデータ方式をJSONとして設定する
      }
    ) // then
} // loadJSON




// Mapの基本設定を行う関数
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    mapConfig // #mapに地図を埋め込む
  });

  // マーカー配置の準備　（JSONを呼びに行き、ドキュメントに配架）
  const script = document.createElement("script");
  script.setAttribute("type", "application/json");
  script.setAttribute("src", "../js/package.json");
  document.getElementsByTagName("head")[0].appendChild(script);

  putMakers();

  // Transit Layer（おまけ）
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

} // initMap()

// マーカーをセットするための関数
function putMakers() {
  encodeJSON();
  fetchPkg.then (
    n => {
      // マップにマーカーを生成
      for (let i = 0; i < n.items.length; i++) { // JSON内「items」が尽きるまでfor文を実装

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
        var marker = new google.maps.Marker({
          map: map,
          position: area
        });

        // 吹き出しの中身の文言を引数で送る
        attachMessage(marker, n.items[i].name);
      } // /for
    } // n
  ) // then
} // putMarkers


// マーカーをクリックしたときに吹き出しを出す
function attachMessage(marker, msg) {
  google.maps.event.addListener(marker, "click", function(event) {
    new google.maps.InfoWindow({
      content: msg
    }).open(marker.getMap(), marker);
  });
} // /attachMessage


// 取得したJSONをノード吐き出し
function nodeJSON() {
  encodeJSON();
  fetchPkg.then (
    prom => { // function(prom){}と同義
      for (let a = 0; a < prom.items.length; a++) {

        // 変数宣言（識別可能なようにJSONに起因するリテラルな変数名に設定するべき）
        var _name = prom.items[a].name;
        var _site = prom.items[a].site;
        var _pluscode = prom.items[a].pluscode;
        var _url = prom.items[a].url;
        var _type = prom.items[a].type;
        // 変数を配列に格納
        var _materials = [_name, _site, _pluscode, _url, _type];

        // ノード生成
        var li = document.createElement("li");

        // 各変数に対し同一処理を行うためfor文で処理
        for (var y = 0; y < _materials.length; y++) {
          if (_materials != null) {
            // ノード追加
            var _elems = document.createTextNode(_materials[y]);
            li.appendChild(_elems);
            // 各項目に応じたクラスを追加
            _materials[y].classList.add("node-" + _materials[y]);
          } // if / null以外はノードを追加
        } // for

        ldb.appendChild(li);
      } // for
    } // prom
  ) // then

} // nodeJSON()


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
