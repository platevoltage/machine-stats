
import './Item.css';
interface Props {
  title: string | undefined;
  data: any;
}
export default function Items({title, data}:Props) {
  return (
    <div className="item">
      <div style={{whiteSpace: "nowrap"}}>{title}</div>
      <div style={{width: "100%"}}></div>
      <div style={{whiteSpace: "nowrap"}}>{data}</div>
    </div>
  )
}
