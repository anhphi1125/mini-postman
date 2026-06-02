import type { RefObject } from "react";
import type { tabItem } from "../types";

type Props = {
  tabs: tabItem[];
  activeTabID: number;
  activeRef: RefObject<HTMLDivElement | null>;
  setActiveTabID: (id: number) => void;
  closeTab: (id: number) => void;
  addTab: () => void;
};

function Tabs({
  tabs,
  activeTabID,
  activeRef,
  setActiveTabID,
  closeTab,
  addTab,
}: Props) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          ref={tab.id === activeTabID ? activeRef : null}
          className={`tab-item method-${tab.method}`}
          key={tab.id}
          onClick={() => setActiveTabID(tab.id)}
        >
          {tab.id === activeTabID && <span className="active" />}

          {tab.method}

          <p className="url">{tab.name}</p>

          <span
            className="close-tab"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            <p>x</p>
          </span>
        </div>
      ))}

      <button className="btn-addTab" onClick={addTab}>
        +
      </button>
    </div>
  );
}

export default Tabs;
