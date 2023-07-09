import { useState, useEffect, useCallback } from "react";

interface Props {
  name: string;
  entries: number;
}

const Rank = (props: Props) => {
  const [emoji, setEmoji] = useState("");

  const generateEmoji = useCallback(async (entries: number) => {
    try {
      const response = await fetch(
        `https://igmf9hvng9.execute-api.eu-central-1.amazonaws.com/dev/rank?rank=${entries}`
      );

      const data = await response.json();

      setEmoji(data.input);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateEmoji(props.entries);
  }, [props.name, props.entries, generateEmoji]);

  return (
    <>
      <div className="white f3">
        {`${props.name}, your current entry count is...`}
      </div>
      <div className="white f1">{props.entries}</div>
      <div className="white f3">{`Rank Badge: ${emoji}`}</div>
    </>
  );
}

export default Rank;
