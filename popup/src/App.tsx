import { useState } from 'react';

import './App.css';

declare global {
  interface Window {
      electron? : any
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


function App() {

  const [data, setData] = useState<Data>({});

  window.electron.getData((event: any, state: Data) => {
    setData(state);
    // window.document.getElementById("output")!.innerText = state["package temperature"].split(".")[0] + "°";
    // console.log(state);
  })

  return (
    <div>
      <p>{ data["package temperature"] }</p>
      {data?.PerCore?.map( item => 
        <p>{item?.frequency}</p>
      )}

    </div>
  );
}

export default App;
