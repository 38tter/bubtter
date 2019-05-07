const separateChar = ",";
const aoriChar = "でちゅ";

let regMatchExp = /^[-:\/a-zA-Z0-9\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf、。「」【】]+$/;

let regExp = [ /でちゅ/g, /つ/g, /す/g, /ま/g, /ふ/g, /る/g, /おう/g, /いう/g,  /、{2,}/g, /、。/g ];
let resTex = [ "", "ちゅ", "しゅ", "みゃ", "ひゅ", "ゆ", "おー", "ゆー",  "、", "。" ];

function getRandom(){
  return Math.floor(Math.random());
}

function doConvert(obj, flg) {
  let set = "";
  for (let i=0;i<obj.length;i++){
    if (i===obj.length-1){
      for(let k=0;k<obj[i].innerText.length;k++){
        if(obj[i].innerText[k].match(regMatchExp)){
          set += obj[i].innerText[k];
        }
      }
    } else {
      for(let k=0;k<obj[i].innerText.length;k++){
        if(obj[i].innerText[k].match(regMatchExp)){
          set += obj[i].innerText[k];
        }
      }
      set += separateChar;
    }
  }
  set = set.replace(/'でちゅ'/g, "");
  //console.log(set);
  chrome.runtime.sendMessage(
    {
      message: "do it",
      text: set
    },
    function(response){
      let arr = response.split(separateChar);
      for(let j=0;j<obj.length;j++){
        for (let regCnt=0;regCnt<regExp.length;regCnt++){
          arr[j] = arr[j].replace(regExp[regCnt], resTex[regCnt]);
        }
        if(flg == 'name'){
          obj[j].innerText = arr[j] + 'でしゅ';
        } else {
          obj[j].innerText = arr[j];
        }
      }
    }
  );
};

function doConvertDT(obj) {
  let set = "";
  for(let k=0;k<obj.innerText.length;k++){
    if(obj.innerText[k].match(regMatchExp)){
      set += obj.innerText[k];
    }
  }
  set = set.replace(/'でちゅ/g, "");
  chrome.runtime.sendMessage(
    {
      message: "do it",
      text: set
    },
    function(response){
      for (let regCnt=0;regCnt<regExp.length;regCnt++){
        response = response.replace(regExp[regCnt], resTex[regCnt]);
      }
      obj.innerText = response;
    }
  );
};

function convertLoop(obj){
  doConvert(obj);
};

function makeInfa() {
  const bubTitle = "ばぶったー";
  let pageTitle = document.title;
  if (pageTitle === bubTitle) {
    document.title = "Twitter";
    chrome.runtime.sendMessage(
      {
        message: "fix it",
      },
      function(resp){
        return;
      }
    );
  } else {
    document.title = bubTitle;
  }
  let trendsModule = document.getElementsByClassName("module Trends trends");
  let flexModule = document.getElementsByClassName("flex-module");
  while (trendsModule.length != 0) {
    trendsModule[0].parentNode.removeChild(trendsModule[0]);
  }
  while (flexModule.length != 0) {
    flexModule[0].parentNode.removeChild(flexModule[0]);
  }
  let tiModule = document.getElementsByClassName("TweetImpressionsModule");
  while (tiModule.length != 0){
    tiModule[0].parentNode.removeChild(tiModule[0]);
  }

  let darekaTweet = document.getElementsByClassName("TweetTextSize");
  for(let darekaTweetCnt=0;darekaTweetCnt<darekaTweet.length;darekaTweetCnt++){
    doConvertDT(darekaTweet[darekaTweetCnt]);
  }
  let darekaName = document.getElementsByClassName("fullname");
  convertLoop(darekaName, 'name');
  for(let drkCnt=0;drkCnt<darekaName.length;drkCnt++){

  }

  // let arrClassName = [ "_timestamp", "u-textInheritColor", "ProfileCardStats-statLabel", "search-input", "TwitterCard-title" ];
  // for (let arrCNcnt in arrClassName){
  //   var hogeObj = document.getElementsByClassName(arrCNcnt);
  //   convertLoop(hogeObj);
  // }
  let tweetTime = document.getElementsByClassName("_timestamp");
  convertLoop(tweetTime);
  let originName = document.getElementsByClassName("u-textInheritColor");
  convertLoop(originName);
  let profileLabel = document.getElementsByClassName("ProfileCardStats-statLabel");
  convertLoop(profileLabel);
  let searchLabel = document.getElementsByClassName("search-input");
  convertLoop(searchLabel);
  let cardtitleLabel = document.getElementsByClassName("TwitterCard-title");
  convertLoop(cardtitleLabel);
  let resetmarginLabel = document.getElementsByClassName("tcu-resetMargin");
  convertLoop(resetmarginLabel);
  let prettyLabel = document.getElementsByClassName("pretty-link");
  convertLoop(prettyLabel);
  let profnaviLabel = document.getElementsByClassName("ProfileNav-label");
  convertLoop(profnaviLabel);
  let buttonLabel = document.getElementsByClassName("button-text");
  convertLoop(buttonLabel);

  // let phLabel = document.getElementById("placeholder");
  // convertLoop(phLabel);

  let textLabel = document.getElementsByClassName("text");
  for(let textLabelCnt=0;textLabelCnt<textLabel.length;textLabelCnt++){
    doConvertDT(textLabel[textLabelCnt]);
  }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if( request == "myClick") {
    makeInfa();

    // function observeStream() {
    //   var observer = new MutationObserver(makeInfa);
    //   observer.observe(document.getElementsByClassName('stream-items')[0], {
    //     attributes: true,
    //     childList:  true
    //   });
    //   makeInfa();
    // }
    // let observer = new MutationObserver(observeStream);
    // observer.observe(document.getElementsByTagName("body")[0], {
    //   attributes: true
    // });
  }
});
