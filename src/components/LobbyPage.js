import "../index.css";
import CodeBlockItem from "./CodeBlockItem";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const URL = "https://moveo-coding-server-production.up.railway.app";
export default function LobbyPage() {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    const fetchCodeBlocks = async () => {
      try {
        const response = await fetch(`${URL}/codeblocks`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCodeBlocks(data);
      } catch (error) {
        console.error("Error fetching code blocks:", error);
      }
    };

    fetchCodeBlocks();
  }, []);

  return (
    <div className="container">
      <Header />
      <Menu codeBlocksData={codeBlocks} />
    </div>
  );
}

function Header() {
  return (
    <header className="second-header">
      <h1>Choose code block</h1>
    </header>
  );
}

function Menu(props) {
  const numOfCodeBlocks = props.codeBlocksData.length;
  const navigate = useNavigate();

  const handleNavigateToCodeBlock = (id, data) => {
    navigate(`/codeblock/${id}`, { state: { data } });
  };

  return (
    <main className="menu">
      {numOfCodeBlocks > 0 ? (
        <ul className="blocks">
          {props.codeBlocksData.map((block) => (
            <CodeBlockItem
              item={block}
              onClick={() => handleNavigateToCodeBlock(block.id, block)}
              key={block.name}
            />
          ))}
        </ul>
      ) : (
        <p>Loading Code blocks</p>
      )}
    </main>
  );
}
