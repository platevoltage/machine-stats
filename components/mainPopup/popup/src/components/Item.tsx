

interface Props {
  title: string | undefined;
  data: any;
  isInt?: boolean;
  suffix?: string;
}
export default function Items({title, data, isInt, suffix}:Props) {
  return (
    <div className="item">
      <div className="title">{title}</div>
      <div style={{width: "100%"}}></div>
      <div className="data">{isInt? Math.floor(data) : data}{suffix}</div>
    </div>
  )
}
