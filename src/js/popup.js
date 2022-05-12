function init () {
  $(document).ready(function () {
    getIsHuiduByCookies()
      .then((res) => {
        console.log('是不是灰度', res)
        if (res) {
          $('#huidu').addClass('active')
        } else {
          $('#huidu').removeClass('active')
        }
      })

    getIsDevStatus()
      .then(res => {
        console.log('是不是调试', res)
        if (res) {
          $('#dev').addClass('active')
        } else {
          $('#dev').removeClass('active')
        }
      })

    $('#huidu').click(function () {
      if ($(this).hasClass('active')) {
        $('#huidu').removeClass('active')
        removeHuiduCookies()
      } else {
        $('#huidu').addClass('active')
        setHuiDuCookies()
      }
    })

    $('#dev').click(function () {
      if ($(this).hasClass('active')) {
        setDevStatus(false)
        $('#dev').removeClass('active')
      } else {
        $('#dev').addClass('active')
        setDevStatus(true)
        sendHideZhidaElementMsg()
      }
    })
  })
}


function getIsDevStatus () {
  return new Promise(resolve => {
    chrome.storage.sync.get(['isDev'], function (result) {
      resolve(result.isDev)
    })
  })
}

async function getIsHuiduByCookies() {
  let cookie1
  let cookie2
  const p1 = function () {
    return new Promise (resolve => {
      const params = {
        url: 'https://b.pingan.com.cn',
        name: 'x-g-route-group'
      }
      chrome.cookies.get(
        params,
        function (data) {
          cookie1 = data
          resolve()
        }
      )
    })
  }
  const p2 = function () {
    return new Promise(resolve => {
      const params = {
        url: 'https://cdn.sdb.com.cn/',
        name: 'x-g-route-group'
      }
      chrome.cookies.get(
        params,
        function (data) {
          cookie2 = data
          resolve()
        }
      )
    })
  }
  await Promise.all([
    p1(),
    p2()
  ])
  const res = [cookie1, cookie2]
  console.log('灰度 cookie', res)
  return res.every(item => {
    return item?.value === 'always'
  })
}

function setHuiDuCookies(data) {
  const params1 = {
    domain: '.sdb.com.cn',
    httpOnly: false,
    name: 'x-g-route-group',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    storeId: '0',
    value: 'always',
    url: 'https://cdn.sdb.com.cn/'
  }
  const params2 = {
    domain: '.pingan.com.cn',
    httpOnly: false,
    name: 'x-g-route-group',
    path: '/',
    sameSite: 'unspecified',
    secure: true,
    storeId: '0',
    value: 'always',
    url: 'https://b.pingan.com.cn/'
  }
  console.log('params ==>', JSON.stringify(params1, null, 2))
  console.log('params ==>', JSON.stringify(params2, null, 2))
  chrome.cookies.set(
    params1,
    function () {
      console.log('cdn.sdb.com.cn 设置成功')
    },
  )
  chrome.cookies.set(
    params2,
    function () {
      console.log('.pingan.com.cn 设置成功')
    },
  )
}

function removeHuiduCookies () {
  const params1 = {
    name: 'x-g-route-group',
    url: 'https://b.pingan.com.cn/'
  }
  const params2 = {
    name: 'x-g-route-group',
    url: 'https://cdn.sdb.com.cn/'
  }
  console.log('params ==>', JSON.stringify(params1, null, 2))
  console.log('params ==>', JSON.stringify(params2, null, 2))
  chrome.cookies.remove(params1)
  chrome.cookies.remove(params2)
}

function sendHideZhidaElementMsg () {
  chrome.tabs.getSelected(null, function (tab) {
    console.log('cerrent tab', tab)
    chrome.tabs.sendMessage(tab.id, {
      isDev: true
    }, function (response) {
      console.log('chrome.tabs.sendMessage', response)
    });
  });
}

function setDevStatus(bool) {
  chrome.storage.sync.set({
    isDev: bool
  },
  function () {
    console.log('isDev is set to ' + bool)
  })
}

init()
