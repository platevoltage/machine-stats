import {useState} from 'react'

interface Props {
    color: string;
}

export default function Header({color}:Props) {
    const [detached, setDetached] = useState(false);
  return (
    <div className="header">
        {detached ? 
        <button onClick={() => window.api?.closeWindow()} className="glyph-button bi bi-x-square" style={{color: color, position: "absolute", left: "3px", top: "8px"}}></button>
        :
        <button onClick={() => {
            window.api?.setDetached();
            setDetached(true);
            }} className="glyph-button bi bi-window" style={{color: color, position: "absolute", right: "3px", top: "8px"}}></button>
        }
      
    </div>
  )
}
