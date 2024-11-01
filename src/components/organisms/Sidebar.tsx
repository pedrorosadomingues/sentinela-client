import React from "react";

export default function Sidebar(): JSX.Element {
  return (
    <div className="w-40 h-screen bg-transparent fixed left-0 mt-[85px]">
      <div className={`overflow-hidden`}>
        <ul>
          <li>
            <a href="#">Studio</a>
          </li>
          <li>
            <a href="#">My Images</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </div>

      <style jsx>{`
        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          padding: 10px 0;
          text-align: center;
        }

        a {
          color: white;
          text-decoration: none;
        }

        a:hover {
          color: #f0f0f0;
        }
      `}</style>
    </div>
  );
}
