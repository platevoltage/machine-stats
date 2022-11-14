import { useState, useEffect } from 'react';
import Item from './components/Item';
import Header from './components/Header';

import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { PerCore, IPerCore } from './components/PerCore';

declare global {
  interface Window {
      api? : any
  }
}

interface Data {
  'Num Packages'?: string,
  'Using Package'?: string,
  'Num Cores'?: string,
  'GT Available'?: string,
  'IA Energy Available'?: string,
  'DRAM Energy Available'?: string,
  'Max Temperature'?: string,
  'IA Base Frequency'?: string,
  'IA Max Frequency'?: string,
  TDP?: string,
  'package temperature'?: string,
  'IA temperature'?: string,
  'IA frequency'?: string,
  'package power'?: string,
  'IA power'?: string,
  'DRAM power'?: string,
  'IA utilization'?: string,
  PerCore?: IPerCore[]
}

const alias = {
  // 'Num Packages': "string",
  // 'Using Package': "string",
  // 'Num Cores': "string",
  // 'GT Available': "string",
  // 'IA Energy Available': "string",
  // 'DRAM Energy Available': "string",
  // 'Max Temperature': "string",
  'IA Base Frequency': "Base Frequency",
  'IA Max Frequency': "Max Frequency",
  // TDP: "string",
  'package temperature': "CPU temperature",
  'IA temperature': "CPU proximity",
  'IA frequency': "CPU frequency",
  'package power': "CPU Power",
  'IA power': "Power Draw",
  'DRAM power': "DRAM Power",
  'IA utilization': "Utilization",
}
const suffix = {
  // 'Num Packages': "string",
  // 'Using Package': "string",
  // 'Num Cores': "string",
  // 'GT Available': "string",
  // 'IA Energy Available': "string",
  // 'DRAM Energy Available': "string",
  // 'Max Temperature': "string",
  'IA Base Frequency': " mhz",
  'IA Max Frequency': " mhz",
  // TDP: "string",
  'package temperature': "°C",
  'IA temperature': "°C",
  'IA frequency': " mhz",
  'package power': "W",
  'IA power': "W",
  'DRAM power': "W",
  'IA utilization': "%",
}




function App() {
  const [color, setColor] = useState("#00ff00")
  const [data, setData] = useState<Data>({});
  const [showFreq, setShowFreq] = useState(false);
  const [showTemp, setShowTemp] = useState(false);
  const [showUtilization, setShowUtilization] = useState(false);

  useEffect(() => {
    window.api?.getData((event: any, {data, color}:{data: Data, color: string}) => {
      setData(data);
      setColor(color);
    });    
  },[])
  useEffect(() => {
      window.api?.sendWindowHeight(document.body.offsetHeight);
  },[data, showTemp, showFreq, showUtilization])



  return (
    <div>
      <Header color={color}/>
      {/* <Item title={alias["package temperature"]} data={data["package temperature"]}/> */}
      { Object.keys(data).map((key, index) => {
          return (
            key in alias && 
              <Item 
                title={alias[key as keyof typeof alias]} 
                data={data[key as keyof typeof data]} 
                isInt={true} 
                suffix={suffix[key as keyof typeof suffix]} 
                key={index}
              />
          )
        })
      }
      <p>
        <button style={{color: `${color}`}} className="glyph-button" onClick={() => setShowFreq(!showFreq)}>
          <i className={`bi bi-caret-${showFreq ? "down" : "right"}-fill`}></i>
          {!showFreq && <> Per Core Frequency</>}
        </button>
        {showFreq && <PerCore data={data.PerCore} property={"frequency"} title={`freq`} suffix={" mhz"} />}
      </p>
      <p>
        <button style={{color: `${color}`}} className="glyph-button" onClick={() => setShowTemp(!showTemp)}>
          <i className={`bi bi-caret-${showTemp ? "down" : "right"}-fill`}></i>
          {!showTemp && <> Per Core Temperature</>}
        </button>
        {showTemp && <PerCore data={data.PerCore} property={"temperature"} title={`temp`} suffix={"°C"} />}
      </p>
      <p>
        <button style={{color: `${color}`}} className="glyph-button" onClick={() => setShowUtilization(!showUtilization)}>
          <i className={`bi bi-caret-${showUtilization ? "down" : "right"}-fill`}></i>
          {!showUtilization && <> Per Core Utilization</>}
        </button>
        {showUtilization && <PerCore data={data.PerCore} property={"utilization"} title={`utilization`} suffix={"%"} />}
      </p>
      

    </div>
  );
}

export default App;
