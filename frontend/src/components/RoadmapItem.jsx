// src/components/RoadmapItem.jsx
export default function RoadmapItem({ quarter, content }) {
    return (
      <li>
        <span className="font-medium text-white">{quarter}:</span> {content}
      </li>
    );
  }