import React, {  } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productStock from './queries/productStock.graphql'

interface ProductStockProps {
}

const ProductStock: StorefrontFunctionComponent<ProductStockProps> = ({}) => {

  const CSS_HANDLES = ['container', 'title', 'list', 'item', 'value', 'valueConStock', 'valueSinStock']
  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct()
  const { data, loading, error } = useQuery(productStock, {
    variables: {
      sku: product?.productId
    },
    context:{
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-VTEX-API-AppKey": "vtexappkey-killstorecl-HIYLZC",
        "X-VTEX-API-AppToken": "HUUGZRNCPVXLPMNRZCIRZFUCYXUVXQROAWXYDNFEUWONIOFIMJXOSZJCARHCXRFYDJLTOOOMXEXDQGTKRLINTDWAMVYLGDGDQPKZDLTXVLROCGLTXWKMJREZNKHTQCFT",
        "Accept": "application/json"
      }
    },
    ssr: false
  })
  const depositos = data ? data.inventoryProducts.products : [];
  if (!product) {
    return (
      <div className={handles.container}>
        <span>No es pagina de producto.</span>
      </div>
    )
  }
  if (loading) {
    return (
      <div className={handles.container}>
        <span>Cargando el stock en tiendas...</span>
      </div>
    )
  }
  if (error) {
    console.error(error)
    return (
      <div className={handles.container}>
        <span>Error!</span>
      </div>
    )
  }
  
  const lista = depositos.map((deposito: { warehouseName: any,  quantity: number}) => {
    if(!deposito.warehouseName.includes('[INACTIVA]')){ 
      if(deposito.quantity > 0){
        return `<li class="${handles.item}">${deposito.warehouseName} <span class="${handles.value} ${handles.valueConStock}">${deposito.quantity}</span></li>`
      }else{
        return `<li class="${handles.item}">${deposito.warehouseName} <span class="${handles.value} ${handles.valueSinStock}">${deposito.quantity}</span></li>`
      }
    }else{
      return null
    }
  })
    
  return (
    <div className={handles.container}>
      <p className={handles.title}>Stock en tiendas</p>
      <ul className={handles.list} dangerouslySetInnerHTML={{__html: lista.join('')}}></ul>
    </div>
  )
  

  return (
    <div className={`${handles.container} db tc`}>

    </div>
  )

}

ProductStock.schema = {
  title: 'product-stock.title',
  description: 'product-stock.description',
  type: 'object',
  properties: {
  },
}

export default ProductStock
