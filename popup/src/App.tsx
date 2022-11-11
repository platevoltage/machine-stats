import { useState, useEffect } from 'react';
import Item from './components/Item';
import { nativeImage } from 'electron';

import './App.css';

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
  PerCore?: [PerCore]
}
interface PerCore {
  request?: string,
  temperature?: string,
  frequency?: string,
  utilization?: string
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

var canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = 30;
canvas.height = 30;
ctx.imageSmoothingQuality = 'high';
// ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 30, 30);
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, canvas.width, canvas.height)
const graphData = canvas.toDataURL('image/png', 1);


function App() {
  const [data, setData] = useState<Data>({});


  useEffect(() => {
    window.api?.getData((event: any, state: Data) => {
      setData(state);
    });
    setInterval(() => {

      window.api?.sendWindowHeight(document.body.offsetHeight);
      // window.api?.sendGraph(JSON.stringify(graphData))
    }, 1000)
    
  },[])
  useEffect(() => {
    setInterval(() => {


      // window.api?.sendGraph(canvas)

      // console.log([canvas]);
    }, 1000)
    
  },[])

  return (
    <div>
      
      {/* <Item title={alias["package temperature"]} data={data["package temperature"]}/> */}
      {Object.keys(data).map((key, index) => {
        return (
          key in alias && <Item title={alias[key as keyof typeof alias]} data={data[key as keyof typeof data]} key={index}/>
        )
      })
      }
      <br />
      {data?.PerCore?.map( (item, index) => 
        <Item title={`core ${index} frequency`} data={item?.frequency} key={index}/>
        // <p>{item?.frequency}</p>
      )}

      <br />
      {data?.PerCore?.map( (item, index) => 
        <Item title={`core ${index} temperature`} data={item?.temperature} key={index}/>
        // <p>{item?.frequency}</p>
      )}  

    </div>
  );
}

export default App;
