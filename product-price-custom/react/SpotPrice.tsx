import React, { useMemo, useContext, useState, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { useProduct, ProductContext } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'
import { IOMessageWithMarkers } from 'vtex.native-types'

import { getDefaultSeller } from './modules/seller'

const CSS_HANDLES = [
  'spotPrice',
  'spotPriceValue',
  'transferPrice',
  'webPayPrice',
  'mercadolibrePrice',
  'transferPriceImg',
  'webPayPriceImg',
  'mercadolibrePriceImg',
  'cssimagen',
] as const

const messages = defineMessages({
  title: {
    id: 'admin/spot-price.title',
  },
  description: {
    id: 'admin/spot-price.description',
  },
  default: {
    id: 'store/spot-price.default',
  },
})

interface Props {
  message?: string
  markers?: string[]
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
  isShow: boolean
  arraySucursales: any[]
}

function SpotPrice({
  message = messages.default.id,
  markers = [],
  classes,
  isShow,
  arraySucursales,
}: Props) {
  const { product } = useContext<any>(ProductContext)
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const productContextValue = useProduct()
  const [sinDescuento, setSinDescuento] = useState(false)

  const seller = getDefaultSeller(productContextValue?.selectedItem?.sellers)

  const commercialOffer: any = seller?.commertialOffer

  if (!commercialOffer || commercialOffer?.AvailableQuantity <= 0) {
    return null
  }

  // const spotPriceValue = commercialOffer.spotPrice
  const sellingPriceValue = commercialOffer.Price
  const mercadolibrePrice = sellingPriceValue * 1
  const webPayPrice = sellingPriceValue * 0.98
  const transferPrice = sellingPriceValue * 0.96

  const validatedSeller = () => {
    const brand = product.brand

    const validated =
      arraySucursales && arraySucursales.length
        ? arraySucursales.find(
            (name: any) =>
              name.__editorItemTitle.toLowerCase() === brand.toLowerCase()
          )
        : ''

    if (validated) {
      setSinDescuento(true)
    }
  }

  // if (spotPriceValue === sellingPriceValue) {
  //   return null
  // }
  useEffect(() => {
    validatedSeller()
  }, [product])

  return useMemo(() => {
    if (sinDescuento) {
      return (
        <span className={handles.spotPrice}>
          <IOMessageWithMarkers
            message={message}
            markers={markers}
            handleBase="spotPrice"
            values={{
              spotPriceValue: (
                <>
                  <span key="transferPrice" className={handles.transferPrice}>
                    <div className={handles.transferPriceImg} />
                    <FormattedCurrency value={sellingPriceValue} />
                  </span>
                  <span key="webPayPrice" className={handles.webPayPrice}>
                    <div className={handles.webPayPriceImg} />{' '}
                    <FormattedCurrency value={sellingPriceValue} />
                  </span>
                  <span
                    key="mercadolibrePrice"
                    className={handles.mercadolibrePrice}
                  >
                    <div className={handles.mercadolibrePriceImg} />{' '}
                    <FormattedCurrency value={sellingPriceValue} />
                  </span>
                </>
              ),
            }}
          />
        </span>
      )
    }

    return (
      <span className={handles.spotPrice}>
        <IOMessageWithMarkers
          message={message}
          markers={markers}
          handleBase="spotPrice"
          values={{
            spotPriceValue: (
              <>
                <span key="transferPrice" className={handles.transferPrice}>
                  <div className={handles.transferPriceImg} />
                  <FormattedCurrency value={transferPrice} />
                </span>
                <span key="webPayPrice" className={handles.webPayPrice}>
                  <div className={handles.webPayPriceImg} />{' '}
                  <FormattedCurrency value={webPayPrice} />
                </span>
                <span
                  key="mercadolibrePrice"
                  className={handles.mercadolibrePrice}
                >
                  <div className={handles.mercadolibrePriceImg} />{' '}
                  <FormattedCurrency value={mercadolibrePrice} />
                </span>
              </>
            ),
          }}
        />
      </span>
    )
  }, [
    isShow,
    arraySucursales,
    sinDescuento,
    mercadolibrePrice,
    webPayPrice,
    transferPrice,
  ])
}

SpotPrice.schema = {
  title: messages.title.id,
  type: 'object',
  properties: {
    isShow: {
      title: 'Ocultar el componente?',
      type: 'boolean',
      default: true,
    },
    arraySucursales: {
      title: 'Sucursales',
      type: 'array',
      minItems: 0,
      items: {
        title: 'Lista de sucursales',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Nombre de la sucursal',
            type: 'string',
            default: '',
            description:
              'Agregar nombre del brand al que no se le debe aplicar el descuento de metodos de pago. Ej: DJI',
          },
        },
      },
    },
  },
}

export default SpotPrice
