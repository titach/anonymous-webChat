import logo from "../assets/figma/00676.svg";
import clouds from "../assets/figma/2518c.svg";
import plus from "../assets/figma/94c37.svg";
import chat from "../assets/figma/fa1e6.svg";
import heart from "../assets/figma/13e9b.svg";
import shield from "../assets/figma/b0d65.svg";
import conversation from "../assets/figma/3216d.svg";

const assets = {
  logo: [logo, 46, 46],
  clouds: [clouds, 400, 267],
  plus: [plus, 24, 24],
  chat: [chat, 24, 24],
  heart: [heart, 28, 28],
  shield: [shield, 28, 28],
  conversation: [conversation, 28, 28],
};
export default function DesignAsset({ name, className = "", alt = "" }) {
  const [src, width, height] = assets[name];
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={`design-asset ${className}`}
      draggable="false"
    />
  );
}
