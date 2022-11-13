import React from 'react'

interface Props {
    color: string;
}

export default function Header({color}:Props) {
  return (
    <div className="header">
      <i className="bi bi-window" style={{color: color, position: "absolute", right: "10px", top: "6px"}}></i>
    </div>
  )
}
