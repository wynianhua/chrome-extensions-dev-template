const urlsAry = [
  {
    matchPrefixUrl: 'https://cdn.sdb.com.cn/widget/kfw/',
    forwardPrefixUrl: 'https://test-cdn-uat.sdb.com.cn/widget/kfw/'
  },
  {
  //   matchUrl: 'https://cdn.sdb.com.cn/widget/kfw/??billButtons/billButtons.min.js,billAdvertFloor/billAdvertFloor.min.js',
  //   forwardUrl: 'https://test-cdn-uat.pingan.com.cn/widget/kfw/??billButtons/billButtons.min.js,billAdvertFloor/billAdvertFloor.min.js'
  // }, {
  //   matchUrl: 'https://cdn.sdb.com.cn/widget/kfw/billAdvertFloor/billAdvertFloor.min.js',
  //   forwardUrl: 'https://test-cdn-uat.sdb.com.cn/widget/kfw/billAdvertFloor/billAdvertFloor.min.js'
  }
]
let isCdnHuiDu = false


function setIsCdnHuiDu () {
  chrome.storage.sync.get(['isCdnHuiDu'], (result) => {
    console.log('get storage result.isCdnHuiDu---', result.isCdnHuiDu)
    isCdnHuiDu = result.isCdnHuiDu
  })
}

setIsCdnHuiDu()
chrome.storage.onChanged.addListener((changes) => {
  setIsCdnHuiDu()
})

chrome.webRequest.onBeforeRequest.addListener(details => {
    if (!isCdnHuiDu) {
      return {
        cancel: false
      }
    }
    const matchPrefixUrlItem = urlsAry.find(item => details.url.indexOf(item.matchPrefixUrl) === 0)
    if (matchPrefixUrlItem) {
      console.log('matchPrefixUrlItem', matchPrefixUrlItem)
      const redirectUrl = details.url.replace(matchPrefixUrlItem.matchPrefixUrl, matchPrefixUrlItem.forwardPrefixUrl)
      return {
        redirectUrl
      }
    }
    const matchUrlItem = urlsAry.find(item => item.matchUrl === details.url)
    if (matchUrlItem) {
      console.log('matchUrlItem', matchUrlItem)
      return {
        redirectUrl: matchUrlItem.forwardUrl
      }
    }
  }, {
    urls: ["<all_urls>"]
  },
  ['blocking', "requestBody"]
)

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
  // console.log('onBeforeSendHeaders~~~~~~', JSON.stringify(details));
  var headers = details.requestHeaders
  if (headers && headers.length) {
    headers.map(item => {
      if (item.name.toLowerCase() === "access-control-request-method") {
        console.log('access-aontrol-request-method', item.value)
      }
    })
  }
  // if(details.url.indexOf('rap2api.alibaba-inc') > -1){
  //   headers.push({name: 'cros', value: 'true'})
  // }
  // console.log(JSON.stringify(headers));
  return {
    requestHeaders: headers
  };
}, {
  urls: ["<all_urls>"]
}, ['blocking', 'requestHeaders']);

chrome.webRequest.onSendHeaders.addListener(function (details) {
  // console.log('onSendHeaders---', JSON.stringify(details))
}, {
  urls: ["<all_urls>"]
})

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    // let headers = details.responseHeaders;
    // let temptOrigin = details.initiator || "*";
    // let domainMap = {}
    //   domainMapArr.map(item => {
    //     if(item){
    //       domainMap[item.domain] = item.id
    //     }
    //   })

    // let domain = details.url.split('/')[2]
    // console.log('onHeadersReceived--', domain, domainMap[domain])
    // if(domainMap[domain]){
    //   for( var i = 0, l = headers.length; i < l; ++i ) {
    //     if( headers[i].name.toLowerCase() == 'content-type' ) {
    //       headers[i].value = 'application/json; charset=utf-8';
    //       break;
    //     } else if(headers[i].name.toLowerCase() === 'referrer-policy'){
    //       headers[i].value = 'origin';
    //     } else if(headers[i].name.toLowerCase() === 'Access-Control-Allow-Origin'){
    //       temptOrigin = headers[i].value
    //     }
    //   }
    //   console.log('temptOrigin~~~~', temptOrigin)
    //   headers.push({ name: 'referrer-policy', value: 'origin' });
    //   headers.push({ name: 'Vary', value: 'Origin' });
    //   headers.push({ name: 'EagleEye-TraceId', value: '7f00000215555791515824985e05ab' });
    //   headers.push({ name: 'Timing-Allow-Origin', value: '*' });
    //   headers.push({ name: 'Server', value: 'Tengine/Aserver' });
    //   headers.push({ name: 'Connection', value: 'keep-alive' });
    //   headers.push({ name: 'Access-Control-Allow-Origin', value: 'https://portalpro.hemaos.com'});
    //   headers.push({ name: 'Access-Control-Allow-Credentials', value: 'true' });
    //   headers.push({ name: 'access-control-allow-methods', value:  "*" });
    //   headers.push({ name: 'access-control-allow-headers', value:  "Content-Type, access-control-allow-headers, Authorization, X-Requested-With, X-Referer" });
    //   headers.push({ name: 'Content-Type', value:  "application/json; charset=utf-8" });
    //   // console.log('resheaders--', JSON.stringify(headers));
    // }
    // return {responseHeaders: headers};
  },
  {
    urls: ["<all_urls>"]
  },
  ['blocking', 'responseHeaders']
)
