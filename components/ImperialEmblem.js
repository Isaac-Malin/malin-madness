// components/ImperialEmblem.js
export default function ImperialEmblem({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#1e90ff" strokeWidth="1.5" opacity="0.6"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#1e90ff" strokeWidth="1" opacity="0.4"/>
      <circle cx="50" cy="50" r="18" fill="none" stroke="#4db8ff" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="8"  fill="#1e90ff" opacity="0.8"/>
      <circle cx="50" cy="50" r="3"  fill="#4db8ff"/>
      <g fill="#1e90ff">
        <polygon points="50,4 55,18 45,18"   opacity="0.9"/>
        <polygon points="50,96 55,82 45,82"  opacity="0.9"/>
        <polygon points="4,50 18,55 18,45"   opacity="0.9"/>
        <polygon points="96,50 82,55 82,45"  opacity="0.9"/>
        <polygon points="17,17 27,28 17,28"  opacity="0.7"/>
        <polygon points="83,17 83,28 73,28"  opacity="0.7"/>
        <polygon points="17,83 27,72 17,72"  opacity="0.7"/>
        <polygon points="83,83 83,72 73,72"  opacity="0.7"/>
      </g>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#4db8ff" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.3"/>
    </svg>
  );
}
