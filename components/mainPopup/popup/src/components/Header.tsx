import React from 'react'

interface Props {
    color: string;
}

export default function Header({color}:Props) {
  return (
    <div className="header">
        <button onClick={() => window.api?.setDetached()} className="glyph-button bi bi-x-square" style={{color: color, position: "absolute", left: "10px", top: "10px"}}></button>
        <button onClick={() => window.api?.setDetached()} className="glyph-button bi bi-window" style={{color: color, position: "absolute", right: "10px", top: "10px"}}></button>
      
    </div>
  )
}
