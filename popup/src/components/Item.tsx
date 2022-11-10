
import './Item.css';
interface Props {
  title: string | undefined;
  data: any;
}
export default function Items({title, data}:Props) {
  return (
    <div className="item">
      <div className="title">{title}</div>
      <div style={{width: "100%"}}></div>
      <div className="data">{data}</div>
    </div>
  )
}
