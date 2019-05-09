const APIKEY1=`dj00aiZpPUpoRDFhR1EwalFEciZzPWNvbnN1bWVyc2VjcmV0Jng9ZjQ-`;
const APIKEY2=`dj00aiZpPXg2aHVXb013QjBvUiZzPWNvbnN1bWVyc2VjcmV0Jng9ZmI-`;
const URL=`https://jlp.yahooapis.jp/MAService/V1/parse`;

let youjiTxt = {
  "ママ":"まま",
  "パパ":"ぱぱ",
  "おじいちゃん":"じぃじ",
  "おばあちゃん":"ばぁば",
  "おにいちゃん":"にぃに",
  "おねえちゃん":"ねぇね",
  "おじさん":"おーたん",
  "おばさん":"おーたん",
  "犬":"わんわん",
  "猫":"にゃんにゃん",
  "ねこ":"にゃんにゃん",
  "ねずみ":"ちゅーちゅー",
  "鳩":"ぽっぽ",
  "すずめ":"ちゅんちゅん",
  "カラス":"かーかー",
  "あひる":"がーが",
  "鶏":"こっこ",
  "馬":"おんま",
  "牛":"モーモー",
  "猿":"あいあい",
  "羊":"メーメー",
  "ライオン":"がおー",
  "虫":"むいむい",
  "蜂":"ぶんぶん",
  "魚":"おっとっと",
  "帽子":"しょっぽ",
  "洋服":"おべべ",
  "靴下":"たった",
  "靴":"くっく",
  "おっぱい":"ぱいぱい",
  "お腹":"ぽんぽん、ぽんぽ",
  "目":"おめめ、めんめ",
  "手":"てって、おてて",
  "ごはん":"まんま",
  "お菓子":"まんま、んまんま",
  "ラーメン":"ちゅるちゅる",
  "牛乳":"にゅーにゅー",
  "ジュース":"じゅーちゅ",
  "お風呂":"たんたん",
  "歯磨き":"はーみー",
  "お水":"おみじゅ",
  "お湯":"おぶ",
  "泡":"あわあわ",
  "抱っこ":"あっこ",
  "おんぶ":"おんも",
  "降りる":"おんり",
  "いたずら":"おいた",
  "外":"おんも",
  "夜":"くらいくらい",
  "自動車":"ぶーぶ",
  "電車":"がたんごとん",
  "パトカー":"ぴーぽー",
  "飛行機":"ブーン",
  "料理":"とんとん",
  "給料":"おちんぎん",
  "自炊":"じぶんでとんとん",
  "草":"おもちろい",
  "狂気":"あたまおかち",
  "令和":"黄金の新時代「令☆和」",
  "平成":"俺を産み俺を育てた偉大なる時代「平☆成」",
  "無駄":"無駄無駄無駄無駄無駄無駄"
}

function parseXML(response) {
  return response.text().then((stringContainingXMLSource) => {
    const parser = new DOMParser();
    return parser.parseFromString(stringContainingXMLSource, "text/xml");
  });
};

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.sendMessage(tab.id, "myClick");
});

function tabUpdate() {
  chrome.tabs.update(tab.id, {url: "https://twitter.com/"});
};

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "do it") {
      const sentence = request.text;

      let APIKEY;
      if(Math.random()>0.5){
        APIKEY = APIKEY1;
      } else {
        APIKEY = APIKEY2;
      }

      let lastURL = URL + `?appid=` + APIKEY + `&sentence=` + encodeURI(sentence);
      const method = 'POST';
      const headers = {
        'Accept': 'application/json',
        'Content-Type': `application/x-www-form-urlencoded; charset=utf-8`
      };
      const obj = JSON.stringify({
        appid: APIKEY,
        sentence: sentence,
        results: "ma"
      });
      const body = Object.keys(obj).map((key)=>key+"="+encodeURIComponent(obj[key])).join("&");
      fetch(lastURL,
        {
          method,
          headers,
          body
        }
      ).then(
        function(res){
          if(res.ok){
            return res;
          } else {
            sendResponse("しっぱいでちゅ");
            throw "error";
          }
        }
      ).then(res => res.text())
      .then(function(text){
        let dom = new DOMParser().parseFromString(text, 'text/xml');
        return dom;
      })
      .then(function(dom){
        let responseSent = "";
        let text = dom.querySelectorAll("reading");
        let kind = dom.querySelectorAll("pos");
        let surf = dom.querySelectorAll("surface");

        for(let cnt=0;cnt<text.length;cnt++){
          if(kind[cnt].innerHTML === "助動詞" && cnt === text.length-1){
            responseSent += text[cnt].innerHTML + 'でちゅ。';
          } else if (kind[cnt].innerHTML === "名詞") {
            let matchFlg = 0;
            for(let nameCnt in Object.keys(youjiTxt)){
              if(surf[cnt].innerHTML === Object.keys(youjiTxt)[nameCnt]){
                responseSent += "" + youjiTxt[Object.keys(youjiTxt)[nameCnt]] + "";
                ++matchFlg;
                break;
              }
            }
            if (!matchFlg) responseSent += "" + text[cnt].innerHTML + "";
            if (cnt === text.length-1) responseSent += "でしゅ";
          } else if (kind[cnt].innerHTML === "助詞") {
            responseSent += text[cnt].innerHTML + '、';
            //responseSent += "にょ";
          } else if (kind[cnt].innerHTML === "動詞" && cnt === text.length-1) {
            //responseSent += 'ばぶ';
            responseSent += text[cnt].innerHTML + 'だっちゃ。';
          } else if (kind[cnt].innerHTML === "形容詞") {
            //responseSent += 'ばぶ';
            let bufEnd = text[cnt].innerHTML.slice(-1,0);
            responseSent += text[cnt].innerHTML.slice(0,-1) + 'ー' + bufEnd;
          } else if (kind[cnt].innerHTML === "形容動詞") {
            responseSent += text[cnt].innerHTML + 'でちゅ';
          } else if (kind[cnt].innerHTML === "感動詞") {
            responseSent += text[cnt].innerHTML + '！';
          } else {
            responseSent += text[cnt].innerHTML;
          }
        }
        sendResponse(responseSent);
      });
    } else {
      chrome.tabs.getSelected(null, function(tab){
        let newURL = tab.url
        chrome.tabs.update(tab.id, {url: newURL});
      });
      sendResponse("hoge");
    }
    return true;
  });
