chrome.extension.onMessage.addListener(
  function (request, sender, sendMessage) {
    console.log('chrome.extension.onMessage request', request)
    console.log('chrome.extension.onMessage sender', sender)
    console.log('chrome.extension.onMessage sendMessage', sendMessage)
    hideZhidaElement()
    sendMessage(request)
  }
)

function hideZhidaElement () {
  chrome.storage.sync.get(['isDev'], function (result) {
    console.log('storage get isDev is', result)
    const urls = [
      'https://b.pingan.com.cn/node-ssr/base/paces-ccms-core/ssr/spend-earn/newExchange/home/',
      'https://test-b-fat.pingan.com.cn/node-ssr/base/paces-ccms-core/ssr/spend-earn/newExchange/home/',
      'https://test-b-uat.pingan.com.cn/node-ssr/base/paces-ccms-core/ssr/spend-earn/newExchange/home/',
      'https://test-b-dev.pingan.com.cn/node-ssr/base/paces-ccms-core/ssr/spend-earn/newExchange/home/',
      '127.0.0.1:3000/node-ssr/base/paces-ccms-core/ssr/spend-earn/newExchange/home/',
      'localhost:3000/node-ssr/base/paces-ccms-core/ssr/spend-earn/newExchange/home/',
    ]
    const isTrueUrl = urls.some(item => location.href.indexOf(item) > -1)
    console.log('isTrueUrl', isTrueUrl)
    if (result.isDev && isTrueUrl) {
      const el = document.querySelector('.backOn')
      console.log('backOn element'.el)
      if (el) {
        el.style.display = 'none'
      }
    }
  })
}

hideZhidaElement()
