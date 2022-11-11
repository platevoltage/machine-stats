import { useState, useEffect } from 'react';
import Item from './components/Item';


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
  PerCore?: PerCore[]
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




function App() {
  const [data, setData] = useState<Data>({});

  useEffect(() => {
    window.api?.getData((event: any, data: Data) => {
      setData(data);
    });    
  },[])
  useEffect(() => {
      // console.log(data);

      window.api?.sendWindowHeight(document.body.offsetHeight);
  },[data])



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
      <br />
      {data?.PerCore?.map( (item, index) => 
        <Item title={`core ${index} utilization`} data={item?.utilization} key={index}/>
        // <p>{item?.frequency}</p>
      )}  

    </div>
  );
}

export default App;
