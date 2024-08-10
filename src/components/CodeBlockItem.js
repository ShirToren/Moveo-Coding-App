import "../index.css";

export default function CodeBlockItem(props) {
  return (
    <li className="block" onClick={props.onClick}>
      <img src={props.item.photoName} alt={props.item.title}></img>
      <div>
        <h3>{props.item.title}</h3>
        <p>{props.item.challenge}</p>
      </div>
    </li>
  );
}
