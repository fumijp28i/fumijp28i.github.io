// ========== DECLARATION ========== //
let map;
let area;
let activeWindow;

// ========== DATAS ========== //
const defaultCenter = { lat: 36.5648875, lng: 136.6597969 } // 8Q8RHM75+XW3
let kanazawaSta = "8Q8RHJHX+67";
let toyamaSta = "8Q8VP627+P3";

// ========== CONFIG ========== //
const fetchURL = "https://sheets.googleapis.com/v4/spreadsheets/13vCc8TwCt_vPUxuD7T8GrPO8eaHbW8ltEMvrylGeuaA/values/DB?key=AIzaSyC_NpYX_qUe_jEEd6khZlelktz6_sKexX8";
const fetchAPI = fetch(fetchURL);

const defaultZoom = 14;
const mapID = "6f99372f7c64b8b1";

const mapOpts = {
  center: defaultCenter, // 地図の表示中心地を設定
  // 金沢駅: 8Q8RHJHX+67 36.578063,136.648188
  zoom: defaultZoom, // 地図のズームを指定
  mapId: mapID, // MapIDの使用
  mapTypeControl: false, // マップ切り替えのコントロールを表示するかどうか
  streetViewControl: true, // ストリートビューのコントロールを表示するかどうか
  gestureHandling: 'greedy', // ズーム設定
  zoomControl: false
};


// ========== ICONS ========== //
const svgToBase64DataURL = (size, color, path) => {
  const svg = `<svg width="${size}px" height="${size}px" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="${path}" fill="${color}"/></svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size)
  }
}

const svgConfig = {
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 1
};

let ICON_drm = {
  path: "M21,10.78V8c0-1.65-1.35-3-3-3h-4c-0.77,0-1.47,0.3-2,0.78C11.47,5.3,10.77,5,10,5H6C4.35,5,3,6.35,3,8v2.78 C2.39,11.33,2,12.12,2,13v6h2v-2h16v2h2v-6C22,12.12,21.61,11.33,21,10.78z M14,7h4c0.55,0,1,0.45,1,1v2h-6V8C13,7.45,13.45,7,14,7 z M5,8c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1v2H5V8z M4,15v-2c0-0.55,0.45-1,1-1h14c0.55,0,1,0.45,1,1v2H4z",
  fillColor: "#FFA726",
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 1
};

let ICON_htl = {
  path: "M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm2 8h-8V9h6c1.1 0 2 .9 2 2v4z",
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
  path: "M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z",
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


/* ========== functions ========== */
// Mapの基本設定を行う関数
function putCircleOnMap(center = defaultCenter, rad) {
  new google.maps.Circle({
    center: center,       // 中心点(google.maps.LatLng)
    fillColor: '#FFF5E3',   // 塗りつぶし色
    fillOpacity: 0.3,       // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
    map: map,             // 表示させる地図（google.maps.Map）
    radius: rad*100,          // 半径（ｍ）
    strokeColor: '#C94476', // 外周色
    strokeOpacity: 1,       // 外周透過度（0: 透明 ⇔ 1:不透明）
    strokeWeight: 1         // 外周太さ（ピクセル）
   });
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), mapOpts);

  putMarkers();
  putCircleOnMap(100);


  // Transit Layer（おまけ）
  const transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  /* map.overlayMapTypes.insertAt(0, new textureMapType(new google.maps.Size(256, 256)));
  let monoType = new google.maps.StyledMapType(styleOptions, {
    name: 'Mono'
  });
  map.mapTypes.set('mono', monoType);
  map.setMapTypeId('mono');
  */



  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

} // initMap()

// Texture map
function textureMapType(tileSize) {
  this.tileSize = tileSize;
}

textureMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement("div");
  div.style.width = this.tileSize.width + "px";
  div.style.height = this.tileSize.height + "px";
  div.style.background = "url(../assets/img/suisai_gayoushi@2x.png)";
  div.style.backgroundSize = "256px 256px";
  return div;
};



// Pluscodeをエンコードするための関数
function putMarkers() {
  nodeJSON()
    .then (
      n => {
        // マップにマーカーを生成
        for (let i = 1; i < n.values.length; i++) {

          // JSON内「items」が尽きるまでfor文を実装
          // i = 1にしているのは、取得しているJSONの[0]が表題で、0から取得開始するとエラーを起こすため

          let area = encodePluscode(n.values[i][4]);

          let name = n.values[i][1];

          // Typeごとにマーカーを変えるための処理
          // stc eat drm htl
          let type = n.values[i][0];
          let img;
          if (type === "stc") {
            img = ICON_stc
          } else if (type === "eat") {
            img = ICON_eat
          } else if (type === "htl") {
            img = ICON_htl
          } else if (type === "drm") {
            img = ICON_drm
          } else {
            img = ICON_oth
          }


          // ⑤ いよいよマーカーをつけます
          marker = new google.maps.Marker({
            map: map,
            position: area,
            title: name,
            icon: img,
            animation: google.maps.Animation.DROP
          });

          // 吹き出しの中身の文言を引数で送る
          attachMsg(marker, n.values[i][1], i, n.values[i][0]);

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
} // encodePluscode



// マーカーをクリックしたときに吹き出しを出す
function attachMsg(marker, name, num, type) {
  let iw;

  let contentStr =
    '<div class="node-pkg">' +
      '<span class="pkg-txt type-' + type + '">' +
        '<span class="pkg-msg txt-num">' + num + '</span>' +
        '<h4 class="pkg-msg txt-name">' + name + '</h4>' +
      '</span>' +
    '</div>';
  // return contentStr;

  // もしTypeが「stc」なら、最初からピンを表示させておく
    iw = new google.maps.InfoWindow({
      content: contentStr
    }).open(map, marker);
    map.panTo(new google.maps.LatLng(defaultCenter));

    if (type !== "stc") {
    // もしstc以外なら、クリックイベントを「一度だけ（=Once）」発火させ内容を表示させる
      google.maps.event.addListenerOnce(marker, "click",
        e => { // クリックイベント発火時、すでに「.open」かどうか判断
          if (activeWindow !== undefined) {
            activeWindow.close();
          }
          activeWindow = new google.maps.InfoWindow({
            content: contentStr
          }).open(map, marker);

          // その他の挙動
          map.setZoom(15); // ズームする
          map.panTo(
            new google.maps.LatLng(e.latLng.lat(), e.latLng.lng())
          ); // そのマーカーの座標をmap中心地としてセット
        } // e
      );
  } // else
} // /attachMsg



// ========== 正規表現を用いて全角を半角にするための関数 ==========//
function convertHalfWidth(str) {
  return str.value.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function(s){
    return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
  });
}


// ========== async用の関数 ==========//
async function encodeJSON(url) {
  const opts = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify() // 本文のデータ型は "Content-Type" ヘッダーと一致させる必要があります
  }; // ヘッダー処理のためのopts

  try {
    const r = await fetch(url, opts);
    if (!r.ok) { // レスポンスが!r.okだった場合
      throw new Error("NG");
      console.log("Responce Error");
    } // if

    const encodedJSON = await r.json();
    return encodedJSON;

  } catch(err) { // 例外処理
    console.error(err);
  } // catch(err)
} // encodeJSON


async function nodeJSON(url = fetchURL) {
  const r = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify() // 本文のデータ型は "Content-Type" ヘッダーと一致させる必要があります
  })
  return r.json(); // JSON のレスポンスをネイティブのJavaScriptオブジェクトに解釈
}

// Databaseを作る
nodeJSON()
  .then (
    t => {
      const tdb = document.getElementById("tdb");

      // JSONからデータを取得し、for文で処理を行う
      for (let a = 1; a < t.values.length; a++) {

        // 情報を引数で送る
        // sendID(a, p.values[a][1], p.values[a][0], p.values[i][3], p.values[i][4], p.values[a][5]);

        // 変数宣言（識別可能なようにJSONに起因するリテラルな変数名に設定するべき）
        let _name = t.values[a][1];
        let _site = t.values[a][3];
        let _pluscode = t.values[a][4];
        let _url = t.values[a][5];
        let _type = t.values[a][0];

        // ノード生成の行程
        let tr = tdb.insertRow();
        let attacha = document.createElement("a");

        tr.id = "node-tr-" + a;
        tr.className = "node-tr-type-" + _type;

        let cell;
        let celltxt;

        cell = tr.insertCell();
        cell.className = "node-num";
        cell.appendChild(document.createTextNode(a))

        cell = tr.insertCell();
        cell.className = "node-name";
        cell.appendChild(document.createTextNode(_name));

        cell = tr.insertCell();
        cell.className = "node-site";
        cell.appendChild(document.createTextNode(_site));

        /*
        cell = tr.insertCell();
        cell.className = "node-pluscode";
        cell.appendChild(document.createTextNode(_pluscode));
        */

        cell = tr.insertCell();
        cell.className = "node-url";
        if (_url !== "") {
          attacha.href = "https://" + _url;
          attacha.setAttribute("target", "_blank") ;
          attacha.appendChild(document.createTextNode(_url));
          cell.appendChild(attacha);
        }

      } // for

      // 表題を作る
      let putTH = tdb.createTHead(); // <thead></thead>
      let th_cell;

      // 内容を追加
      th_row = putTH.insertRow(0); // <thead><tr></tr></thead>
      putTH.className = "th-node-header";

      th_cell = th_row.insertCell();
      th_cell.className = "th-node-num";
      th_cell.appendChild(document.createTextNode(""));

      th_cell = th_row.insertCell();
      th_cell.className = "th-node-name";
      th_cell.appendChild(document.createTextNode("名称"));

      th_cell = th_row.insertCell();
      th_cell.className = "th-node-site";
      th_cell.appendChild(document.createTextNode("住所"));

      /*
      th_cell = th_row.insertCell();
      th_cell.className = "th-node-pluscode";
      th_cell.appendChild(document.createTextNode("Pluscode"));
      */

      th_cell = th_row.insertCell();
      th_cell.className = "th-node-url";
      th_cell.appendChild(document.createTextNode("URL"));
    }
  ); // nodeJSON;



// ========= ボタンのための関数 ========= //
function resetMap() {
  initMap();
  map.setZoom(defaultZoom); // ズームする
  map.panTo(new google.maps.LatLng(defaultCenter));
}

// Pluscodeを引数に渡すことで中心地にセットするための関数
function setPluscodeAsCenter(p) {
  let area = encodePluscode(p);
  map.setZoom(defaultZoom); // ズームする
  map.panTo(new google.maps.LatLng(area));
}


function hideIW() {
  // 処理
}


let show;
const nowOnMap = document.getElementById("now-onmap");

// inputを使って制御するための関数
function tglStc() {
  const showstc = document.getElementById("showstc");
  showstc.onchange = function() {
    if (showstc.checked) {
      console.log("Is_checked");
    } else {
      console.log("Not_checked");
    }
  }
} // tglStc



// ========== 顔文字ランダム表示のための関数 ========== //
function emojiRandom() {
  let emoji = ["😀", "😂", "😕", "🧐", "🥰", "😅", "😎", "😊", "🥺", "😆"];
  let txt = emoji[Math.floor(Math.random() * emoji.length)]; // 配列からランダムに表示

  const place = document.getElementById("node-info");

  let div = document.createElement("div");
  let span = document.createElement("span");
  let i = document.createElement("i");

  div.className = "info-noselect";
  span.className = "node-info-txt";
  i.className = "node-i-emoji";

  let textNode = document.createTextNode(txt);
  i.appendChild(textNode);
  span.appendChild(i);
  div.appendChild(span);
  place.appendChild(div);

  let plzSelect = document.createTextNode("Nothing Selected");
  span.appendChild(plzSelect);
  div.appendChild(span);
  place.appendChild(div);
}
emojiRandom();



// ========== ズームスライダのための関数 ========== //
const zoomSlider = document.getElementById("zoomSlider");
const currentValue = document.getElementById("currentValue");
const setCurrentValue = (val) => {
  currentValue.innerText = val;
}

function rangeOnChange(e) {
  setCurrentValue(e.target.value);
}

function zoomSliderListener() {
  zoomSlider.addEventListener("change", rangeOnChange());
}

window.onload = () => {
  zoomSliderListener();
  setCurrentValue(zoomSlider.value);
}
