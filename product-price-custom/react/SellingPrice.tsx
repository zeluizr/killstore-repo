import React from 'react'
import { defineMessages, FormattedNumber } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

import { getDefaultSeller } from './modules/seller'

const CSS_HANDLES = [
  'sellingPrice',
  'sellingPriceValue',
  'sellingPriceWithMultiplier',
  'sellingPriceWithTax',
  'sellingPriceWithUnitMultiplier',
  'taxPercentage',
  'taxValue',
  'measurementUnit',
  'unitMultiplier',
  'visibility',
  'visible',
  'hidden',
] as const

const messages = defineMessages({
  title: {
    id: 'admin/selling-price.title',
  },
  description: {
    id: 'admin/selling-price.description',
  },
  default: {
    id: 'store/selling-price.default',
  },
})

interface Props {
  message?: string
  markers?: string[]
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function SellingPrice({
  message = messages.default.id,
  markers = [],
  classes,
}: Props) {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES, {
    classes,
  })

  const productContextValue = useProduct()

  const seller = getDefaultSeller(productContextValue?.selectedItem?.sellers)

  const commercialOffer = seller?.commertialOffer

  if (!commercialOffer || commercialOffer?.AvailableQuantity <= 0) {
    return null
  }

  const sellingPriceValue = commercialOffer.Price
  const listPriceValue = commercialOffer.ListPrice
  const { taxPercentage } = commercialOffer
  const sellingPriceWithTax =
    sellingPriceValue + sellingPriceValue * taxPercentage

  const measurementUnit =
    productContextValue?.selectedItem?.measurementUnit ?? ''

  const unitMultiplier = productContextValue?.selectedItem?.unitMultiplier ?? 1
  const sellingPriceWithUnitMultiplier = commercialOffer.Price * unitMultiplier

  const taxValue = commercialOffer.Tax

  if (unitMultiplier != 1) {
    var meter = 'M²'
  } else {
    var meter = ''
  }

  const sellingPriceWithMultiplier = sellingPriceValue * unitMultiplier

  const hasListPrice = sellingPriceValue !== listPriceValue
  const hasMeasurementUnit = measurementUnit && measurementUnit !== 'un'
  const hasUnitMultiplier = unitMultiplier !== 1

  const containerClasses = withModifiers('sellingPrice', [
    hasListPrice ? 'hasListPrice' : '',
    hasMeasurementUnit ? 'hasMeasurementUnit' : '',
    hasUnitMultiplier ? 'hasUnitMultiplier' : '',
  ])

  if (sellingPriceWithMultiplier !== sellingPriceValue) {
    return (
      <span className={containerClasses}>
        <IOMessageWithMarkers
          message={message}
          markers={markers}
          handleBase="sellingPrice"
          values={{
            sellingPriceValue: (
              <span
                key="sellingPriceValue"
                className={handles.sellingPriceValue}
              >
                <span className={handles.sellingPriceValue}>
                  <FormattedCurrency value={sellingPriceValue} />
                  <strong>{meter}</strong>
                </span>
                <span className={handles.sellingPriceWithMultiplier}>
                  <FormattedCurrency value={sellingPriceWithMultiplier} /> CAJA
                </span>
              </span>
            ),
            sellingPriceWithTax: (
              <span
                key="sellingPriceWithTax"
                className={handles.sellingPriceWithTax}
              >
                <FormattedCurrency value={sellingPriceWithTax} />
              </span>
            ),
            sellingPriceWithUnitMultiplier: (
              <span
                key="sellingPriceWithUnitMultiplier"
                className={handles.sellingPriceWithUnitMultiplier}
              >
                <FormattedCurrency value={sellingPriceWithUnitMultiplier} />
              </span>
            ),
            taxPercentage: (
              <span key="taxPercentage" className={handles.taxPercentage}>
                <FormattedNumber value={taxPercentage} style="percent" />
              </span>
            ),
            taxValue: (
              <span key="taxValue" className={handles.taxValue}>
                <FormattedCurrency value={taxValue} />
              </span>
            ),
            hasMeasurementUnit,
            hasListPrice,
            hasUnitMultiplier,
            unitMultiplier: (
              <span key="unitMultiplier" className={handles.unitMultiplier}>
                <FormattedNumber value={unitMultiplier} />
              </span>
            ),
            measurementUnit: (
              <span key="measurementUnit" className={handles.measurementUnit}>
                {measurementUnit}
              </span>
            ),
          }}
        />
      </span>
    )
  }

  return (
    <span className={containerClasses}>
      <IOMessageWithMarkers
        message={message}
        markers={markers}
        handleBase="sellingPrice"
        values={{
          sellingPriceValue: (
            <span key="sellingPriceValue" className={handles.sellingPriceValue}>
              <span className={handles.sellingPriceValue}>
                <FormattedCurrency value={sellingPriceValue} />
                <strong>{meter}</strong>
              </span>
            </span>
          ),
          sellingPriceWithTax: (
            <span
              key="sellingPriceWithTax"
              className={handles.sellingPriceWithTax}
            >
              <FormattedCurrency value={sellingPriceWithTax} />
            </span>
          ),
          sellingPriceWithUnitMultiplier: (
            <span
              key="sellingPriceWithUnitMultiplier"
              className={handles.sellingPriceWithUnitMultiplier}
            >
              <FormattedCurrency value={sellingPriceWithUnitMultiplier} />
            </span>
          ),
          taxPercentage: (
            <span key="taxPercentage" className={handles.taxPercentage}>
              <FormattedNumber value={taxPercentage} style="percent" />
            </span>
          ),
          taxValue: (
            <span key="taxValue" className={handles.taxValue}>
              <FormattedCurrency value={taxValue} />
            </span>
          ),
          hasMeasurementUnit,
          hasListPrice,
          hasUnitMultiplier,
          unitMultiplier: (
            <span key="unitMultiplier" className={handles.unitMultiplier}>
              <FormattedNumber value={unitMultiplier} />
            </span>
          ),
          measurementUnit: (
            <span key="measurementUnit" className={handles.measurementUnit}>
              {measurementUnit}
            </span>
          ),
        }}
      />
    </span>
  )
}

SellingPrice.schema = {
  title: messages.title.id,
}

export default SellingPrice
