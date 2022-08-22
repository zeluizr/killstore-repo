$(document).ready(function () {
  $.ajaxSetup({
    complete: function () {
      $('.checkout-container .cart-template.active .cart-select-gift-placeholder').insertAfter(
        $('.table.table.cart-items')
      )
    },
  })
  function quitarDecimales(precio) {
    return precio.split(',').shift()
  }
  if (window.location.href.includes('cart')) {
    if (document.querySelectorAll('.item-link-remove') != null) {
      let remove = document.querySelectorAll('.item-link-remove')
      remove.forEach((itemremove) => {
        itemremove.children[0].className = 'icon icon-trash item-remove-ico'
      })
    }
  }

  var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = '/arquivos/favicon.ico'
  document.getElementsByTagName('head')[0].appendChild(link)

  let klaviyoNotified = false
  var e = document.createElement('script')
  ;(e.type = 'text/javascript'),
    (e.async = true),
    (e.src = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=SEgQdX')
  var t = document.getElementsByTagName('script')[0]
  t.parentNode.insertBefore(e, t)
  $(window).on('hashchange', function () {
    const { orderForm } = vtexjs.checkout
    if (orderForm.clientProfileData && !klaviyoNotified && _learnq) {
      _learnq.push([
        'identify',
        {
          $email: orderForm.clientProfileData.email,
          $first_name: orderForm.clientProfileData.firstName,
          $last_name: orderForm.clientProfileData.lastName,
        },
      ])
      let klaviyoItems = []
      let productNames = []
      let categories = []
      orderForm.items.forEach((item) => {
        productNames.push(item.name)
        const key = Object.keys(item.productCategories)[0]
        categories.push(item.productCategories[key])
        klaviyoItems.push({
          ProductID: item.productRefId,
          SKU: item.id,
          ProductName: item.name,
          Quantity: item.quantity,
          ItemPrice: item.sellingPrice / 100,
          RowTotal: item.price / 100,
          ProductURL: window.location.hostname + item.detailUrl,
          ImageURL: item.imageUrl,
          ProductCategories: Object.values(item.productCategories),
        })
      })
      _learnq.push([
        'track',
        'Started Checkout',
        {
          $event_id: orderForm.orderFormId,
          $value: orderForm.value / 100,
          ItemNames: productNames,
          CheckoutURL: window.location.hostname + '/checkout#/cart',
          Categories: categories,
          Items: klaviyoItems,
        },
      ])
      klaviyoNotified = true
    }
  })
})
