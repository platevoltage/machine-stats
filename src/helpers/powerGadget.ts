import * as util from 'util';
import * as child_process from 'child_process';

const exec = util.promisify(child_process.exec);

const parsedObject = {PerCore: new Array(20)};
async function getSample() {
    const { stdout } = await exec(`/Applications/"Intel Power Gadget"/PowerLog -resolution 300 -duration 1 -verbose -file /dev/null`);

    const text = stdout.split("--------------------------");

    for (let block of text) {
  
    
      const lines = [];
      for (const line of block.split("\n")) {
          if (line.startsWith("\t")) lines.push(line.slice(1));
          else if (!line.startsWith("-") && !line.startsWith("Done") && line !== "") lines.push(line);
      }
      let count = 0;
      for (let line of lines) {
        
        if(line.startsWith("core")) {
          const array = line.split(/MHz |Celcius /g).map(x => x.replace(/(core \d+ )/, ""))
          if (typeof parsedObject.PerCore[count] !== "object") parsedObject.PerCore[count] = {};
          const object = parsedObject.PerCore[count];
          count++;
          for (const item of array) {
            const keyValuePair = item.split(":");
            const key = keyValuePair[0]
            if(!key.startsWith("core")) object[key] = +(keyValuePair[1]?.trim().split(' ')[0]);
          }
   
        } else {
          const keyValuePair = line.split(/:|\?/g);
          if (keyValuePair[1]) parsedObject[keyValuePair[0]] = +(keyValuePair[1]?.trim().split(' ')[0]);
        }
      }
    }
  
    return parsedObject;
  }

export default getSample ;