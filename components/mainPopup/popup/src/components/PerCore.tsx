import React from 'react'
import Item from './Item'

interface Props {
    property: keyof IPerCore
    data?: IPerCore[]
    suffix?: string
    title?: string
}

export interface IPerCore {
    request?: string,
    temperature?: string,
    frequency?: string,
    utilization?: string
  }

export function PerCore({ property, data, title, suffix }:Props) {
  return (
    <>
        <br />
        { data?.map( (item, index) => {
          return <Item title={`core ${index} ${title}`} data={item[property]} suffix={suffix} key={index}/>
        }
 
      )}
    </>
  )
}
