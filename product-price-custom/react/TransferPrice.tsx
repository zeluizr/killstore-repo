import React from 'react'
import { useProduct } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

import { getDefaultSeller } from './modules/seller'

const CSS_HANDLES = [
  'spotPrice',
  'spotPriceValue',
  'transferPricePLP',
  'webPayPrice',
  'mercadolibrePrice',
  'containerTransferPriceTextPLP',
  'transferPriceTextPLP',
  'webPayPriceImg',
  'mercadolibrePriceImg',
  'cssimagen',
  'discountPrice',
] as const

interface Props {
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function TransferPrice({ classes }: Props) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const productContextValue = useProduct()

  const seller = getDefaultSeller(productContextValue?.selectedItem?.sellers)

  const commercialOffer: any = seller?.commertialOffer

  const branName: any = productContextValue?.product?.brand

  /* 
        Se oculta para que aparezca en los productos no disponibles
        
        if (!commercialOffer || commercialOffer?.AvailableQuantity <= 0) {
        return null
    } */

  // CONDICIONAL PARA MARCAS SIN DESCUENTO
  if (branName === 'DJI') {
    const sellingPriceValue = commercialOffer.Price
    const transferPrice = sellingPriceValue
    return (
      <span className={handles.spotPrice}>
        <>
          <span key="transferPrice" className={handles.transferPricePLP}>
            <div className={handles.containerTransferPriceTextPLP}>
              <div className={handles.transferPriceTextPLP}> Todo medio</div>
              <div className={handles.transferPriceTextPLP}> de pago: </div>
            </div>
            <div className={handles.discountPrice}>
              <FormattedCurrency value={transferPrice} />
            </div>
          </span>
        </>
      </span>
    )
  }

  const sellingPriceValue = commercialOffer.Price
  const transferPrice = sellingPriceValue * 0.96

  return (
    <span className={handles.spotPrice}>
      <>
        <span key="transferPrice" className={handles.transferPricePLP}>
          <div className={handles.containerTransferPriceTextPLP}>
            <div className={handles.transferPriceTextPLP}>Efectivo o </div>
            <div className={handles.transferPriceTextPLP}>Transferencia: </div>
          </div>
          <div className={handles.discountPrice}>
            <FormattedCurrency value={transferPrice} />
          </div>
        </span>
      </>
    </span>
  )
}

export default TransferPrice
