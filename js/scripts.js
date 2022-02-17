/** ========== Declaration ========== **/
let map;
let marker = [];
let infoWindow = [];
let acctiveWindow;
/* ========== CONFIG ========== */
const mapConfig = {
  center: { lat: 36.5649, lng: 136.6598 }, // 地図の表示中心地を設定
  // 金沢駅: 8Q8RHJHX+67 36.578063,136.648188
  zoom: 14, // 地図のズームを指定
  mapId: "6f99372f7c64b8b1", // MapIDの使用
  mapTypeControl: false, // マップ切り替えのコントロールを表示するかどうか
  streetViewControl: true // ストリートビューのコントロールを表示するかどうか
};
const fetchAPI = fetch("https://sheets.googleapis.com/v4/spreadsheets/13vCc8TwCt_vPUxuD7T8GrPO8eaHbW8ltEMvrylGeuaA/values/DB?key=AIzaSyC_NpYX_qUe_jEEd6khZlelktz6_sKexX8");


/* ========== icons ========== */
const svgToBase64DataURL = (size, color, path) => {
  const svg = `<svg width="${size}px" height="${size}px" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="${path}" fill="${color}"/></svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size)
  }
}


/* ========== functions ========== */
// Mapの基本設定を行う関数
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), mapConfig);

  putMarkers();

  // Transit Layer（おまけ）
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

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


} // initMap()


// Pluscodeをエンコードするための関数
function putMarkers() {
  fetchAPI
    .then (
      r => {
        if (!r.ok) {
          throw new Error("NG");
        }
        return r.json() // fetchした中から呼び出すデータ方式をJSONとして設定する
      }
    ) // then
    .then (
      n => {
        // マップにマーカーを生成
        for (let i = 1; i < n.values.length; i++) {
          // JSON内「items」が尽きるまでfor文を実装
          // i = 1にしているのは、取得しているJSONの[0]が表題で、0から取得開始するとエラーを起こすため

          let area = encodePluscode(n.values[i][4]);

          // Typeごとにマーカーを変えるための処理

          let svgConfig = {
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
          };

          let ICON_drm = {
            path: "M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z",
            fillColor: "#FFA726",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
          };

          let ICON_htl = {
            path: "M21,10.78V8c0-1.65-1.35-3-3-3h-4c-0.77,0-1.47,0.3-2,0.78C11.47,5.3,10.77,5,10,5H6C4.35,5,3,6.35,3,8v2.78 C2.39,11.33,2,12.12,2,13v6h2v-2h16v2h2v-6C22,12.12,21.61,11.33,21,10.78z M14,7h4c0.55,0,1,0.45,1,1v2h-6V8C13,7.45,13.45,7,14,7 z M5,8c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1v2H5V8z M4,15v-2c0-0.55,0.45-1,1-1h14c0.55,0,1,0.45,1,1v2H4z",
            fillColor: "#FF7043",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
          };

          let ICON_eat = {
            path: "M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z",
            fillColor: "#26A69A",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
          };

          let ICON_stc = {
            path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
            fillColor: "#EC407A",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
          };

          let ICON_oth = {
            path: "M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z",
            fillColor: "#8D6E63",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
          };
          // stc eat drm htl
          let icon_type = 'ICON_' + n.values[i][0]; // JSONからTypeを取得
          // console.log(icon_type);

          // ⑤ いよいよマーカーをつけます
          marker = new google.maps.Marker({
            map: map,
            position: area,
            icon: icon_type
          });


          //  TYpe別で処理を分けたい
          // setType();

          // 吹き出しの中身の文言を引数で送る
          sendInfo(marker, n.values[i][1], n.values[i][0]);


        } // /for
      } // n
    ) // then
} // putMarkers


// Pluscodeをエンコードするための関数
function encodePluscode(p) {
  // TL;DR PlusCodeを緯度経度に変換し、それをgoogle.maps.LatLng()メソッドに入れる
  // ① JSON内PlusCodeを一時的に「p」で呼び出し（fetchのfor文内だと「n.values[i][4]」で呼び出す）、変数に代入
  let pluscode = p;

  // ② PlusCodeをOpenlocationCode.decodeメソッドでデコードし、変数「decode」に返された連想配列を格納
  let decoded = OpenLocationCode.decode(pluscode);

  // ③ 緯度経度を連想配列より取り出し、各項目をMath.round()で小数点6位の四捨五入
  let latCtr = Math.round(decoded.latitudeCenter * 1000000) / 1000000;
  let lngCtr = Math.round(decoded.longitudeCenter * 1000000) / 1000000;

  // ④ google.maps.Markerメソッドに緯度経度を渡すため、変数「area」を準備
  let area = new google.maps.LatLng(latCtr, lngCtr);
  return area; // returnが重要！
}



// マーカーをクリックしたときに吹き出しを出す
function sendInfo(marker, name, type) {
  let contentStr =
    '<div class="node-pkg">' +
    '<span class="type-' + type + " " +
    'txt-name">' +
    name +
    '</span>' +
    '</div>';

  // もしTypeが「stc」なら、最初からピンを表示させておく
  if (type === "stc") {
    new google.maps.InfoWindow({
      content: contentStr
    }).open(map, marker);
  } else { // もしstc以外なら、クリックイベントを「一度だけ（=Once）」発火させ内容を表示させる
    google.maps.event.addListenerOnce(marker, "click",
      function(e) {
        new google.maps.InfoWindow({
          content: contentStr
        })
        .open(marker, marker);
        map.setZoom(15); // ズームする
        map.setCenter(
          new google.maps.LatLng(e.latLng.lat(), e.latLng.lng())
        ); // そのマーカーの座標をmap中心地としてセット
      }
    );
  } // else
} // /sendInfo



// 取得したJSONをノード吐き出し
function nodeJSON() {
  fetchAPI
    .then (
      h => {
        if (!h.ok) {
          throw new Error("NG");
        }
        return h.json() // fetchした中から呼び出すデータ方式をJSONとして設定する
      }
    ) // then
    .then (
      p => {
        for (let a = 1; a < p.values.length; a++) {

          const ldb = document.getElementById("ldb");
          const tdb = document.getElementById("tdb");

          // 変数宣言（識別可能なようにJSONに起因するリテラルな変数名に設定するべき）
          let _name = p.values[a][1];
          let _site = p.values[a][3];
          let _pluscode = p.values[a][4];
          let _url = p.values[a][5];
          let _type = p.values[a][0];
          // 変数を配列に格納
          let _materials = [_name, _site, _pluscode, _url, _type];

          // ノード生成
          let li = document.createElement("li");

          // 各変数に対し同一処理を行うためfor文で処理
          for (let y = 0; y < _materials.length; y++) {
            if (_materials[y] != "") {
              // ノード追加
              let _elems = document.createTextNode(_materials[y]);
              li.appendChild(_elems);
              // 各項目に応じたクラスを追加
              _materials[y].classList.add("node-" + _materials[y]);
            } // if / null以外はノードを追加
          } // for

          return ldb.appendChild(li);
        } // for
      } // p
    ) // then

} // nodeJSON()
// (() => nodeJSON() )(); // 関数実行



// 関数宣言
function traindelayinfo() {
  var url = 'https://tetsudo.rti-giken.jp/free/delay.json'; //遅延情報のJSON
  fetch(url)
  .then(function (data) {
    return data.json(); // 読み込むデータをJSONに設定
  })
  .then(function (json) {
    for (var i = 0; i < json.length; i++) {
      var train = json[i].name;
      var company = json[i].company;

      //表形式で遅延路線を表示する
      var row = document.getElementById('tdb').insertRow();
      row.insertCell().textContent = train;
      row.insertCell().textContent = company;
    }
  });
}
// 即時関数をアロー関数式で呼び出し、何を実行しているのか
(() => traindelayinfo() )(); // traindelayinfo(); と同じ。
