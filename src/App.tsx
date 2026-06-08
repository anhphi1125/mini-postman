import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "./services/axiosInstance";
import "./App.css";
import Tabs from "./components/Tabs";
import ConfirmModal from "./components/ConfirmModal";
import RequestSection from "./components/RequestSection";
import HistoryList from "./components/HistoryList";
import CollectionList from "./components/CollectonList";
import type { Collection, HistoryItem, tabItem } from "./types";

function App() {
  const api = axiosInstance();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const [keyword, setKeyword] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [expand, setExpand] = useState<Record<number, boolean>>({});
  const [activeCollectId, setActiveCollectId] = useState<number>(0);
  const [alertRequest, setAlertRequest] = useState(false);
  //tabs
  const [tabs, setTabs] = useState<tabItem[]>([
    {
      id: 1,
      name: "New Request",
      url: "",
      method: "GET",
      response: null,
      status: null,

      headers: [
        {
          key: "",
          value: "",
        },
      ],
      body: "",
      timeResponse: null,
    },
  ]);

  const [activeTabID, setActiveTabID] = useState(1);
  const activeTab = tabs.find((tab) => tab.id === activeTabID);

  //update tab
  const updateTab = (field: string, value: any) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabID ? { ...tab, [field]: value } : tab,
      ),
    );
  };

  const updateTabs = (field: string, value: any, tabId: number) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, [field]: value } : tab)),
    );
  };

  //thêm tab
  const addTab = (item?: HistoryItem | tabItem) => {
    const newTab = {
      id: item?.id || Date.now(),
      name: item?.name || "New Request",
      url: item?.url || "",
      method: item?.method || "GET",
      response: item?.response || null,
      status: item?.status || null,
      headers: item?.headers || [
        {
          key: "",
          value: "",
        },
      ],
      body: item?.body || "",
      timeResponse: item?.timeResponse || null,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabID(newTab.id);
  };

  // cập nhật headers request
  const updateHeaders = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newHeader = [...(activeTab?.headers || [])];

    newHeader[index] = {
      ...newHeader[index],
      [field]: value,
    };

    updateTab("headers", newHeader);
  };

  //thêm headers
  const addHeader = () => {
    const newHeaders = [
      ...(activeTab?.headers || []),
      {
        key: "",
        value: "",
      },
    ];

    updateTab("headers", newHeaders);
  };

  //xóa headers
  const deletedHeader = (indexH: number) => {
    if ((activeTab?.headers || []).length > 1) {
      const newH = activeTab?.headers.filter((_, index) => index !== indexH);
      updateTab("headers", newH);
    }
  };

  //close tab
  const closeTab = (id: number) => {
    if (tabs.length < 2) return;
    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== id);

      if (id === activeTabID) {
        setActiveTabID(newTabs[0].id);
      }

      return newTabs;
    });
  };

  //lấy danh sách history
  useEffect(() => {
    const saved = localStorage.getItem("history");
    const savedCollections = localStorage.getItem("collections");

    if (saved) {
      setHistory(JSON.parse(saved));
    }

    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, []);

  //load collection
  useEffect(() => {
    if (collections.length > 0 && activeCollectId === 0) {
      setActiveCollectId(collections[0].id);
    }
  }, [collections]);

  //cập nhật history vào asyncStorage
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  //cập nhật collections vào asyncStorage
  useEffect(() => {
    localStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  //hàm gửi request check
  const sendRequest = async () => {
    const tab = activeTab;
    setLoading(true);

    try {
      if (!tab?.url) {
        updateTab("response", "Please enter URL!!!");
        return;
      }

      if (tab.method !== "GET" && tab.body.trim()) {
        try {
          JSON.parse(tab.body);
        } catch (error: any) {
          updateTab("status", 400);
          updateTab("response", "Invalid JSON");
          return;
        }
      }
      const start = performance.now();
      const res = await api.post("/send-request", {
        url: tab.url,
        method: tab.method,
        headers: tab.headers,
        body: tab.body,
      });
      const end = performance.now();
      updateTab("response", res.data);
      updateTab("status", res.status);
      updateTab("timeResponse", end - start);

      const newH = {
        id: Date.now(),
        name: tab.url,
        url: tab.url,
        method: tab.method,
        headers: tab.headers,
        body: tab.body,
        response: res.data,
        status: res.status,
        timeResponse: end - start,
      };
      setHistory((prev) => [newH, ...prev]);
    } catch (err: any) {
      updateTab("status", err.response?.status || 500);
      updateTab("response", err.response?.data?.err || err.message);
    } finally {
      setLoading(false);
    }
  };

  //hàm xóa lịch sử
  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  //auto scroll tab
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "end",
    });
  }, [activeTabID]);

  //load item history
  const loadHistory = (item: HistoryItem | tabItem) => {
    const findItem = tabs.filter((it) => it.id === item.id);
    if (findItem.length === 1) {
      setActiveTabID(findItem[0].id);
    } else {
      addTab(item);
    }
  };

  //tìm kiếm lịch sử
  const filteredHistory = history.filter(
    (item) =>
      item.url.toLowerCase().includes(keyword.toLowerCase()) ||
      item.method.toLowerCase().includes(keyword.toLowerCase()),
  );

  //thêm collections
  const addCollection = () => {
    const newCollect: Collection = {
      id: Date.now(),
      name: "New Collection",
      request: [],
    };
    setCollections((prev) => [...prev, newCollect]);
  };

  const updateCollection = (
    field: string,
    value: any,
    collectionId: number,
  ) => {
    setCollections((prev) =>
      prev.map((item) =>
        item.id === collectionId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const updateRequest = (
    collectID: number,
    value: tabItem,
    isDelete = false,
  ) => {
    if (isDelete) {
      setCollections((prev) =>
        prev.map((item) => {
          if (item.id !== collectID) return item;
          const newR = item.request.filter((it) => it.id !== value.id);
          return {
            ...item,
            request: newR,
          };
        }),
      );
      return;
    }
    setCollections((prev) =>
      prev.map((item) => {
        if (item.id !== collectID) return item;
        const existed = item.request.find((i) => i.id === value.id);
        return {
          ...item,
          request: existed
            ? item.request.map((req) => (req.id === value.id ? value : req))
            : [...item.request, value],
        };
      }),
    );
  };

  const deleteCollection = (id: number) => {
    const newCollect = collections.filter((item) => item.id !== id);
    setCollections(newCollect);
  };

  //export collection
  const exportCollection = (collection: Collection) => {
    const data = JSON.stringify(collection, null, 2);

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${collection.name}.json`;

    a.click();

    URL.revokeObjectURL(url);
  };

  //import collections
  const importCollection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        const newCollect = {
          ...data,
          id: Date.now(),
          request: data.request.map((req: tabItem) => ({
            ...req,
            id: Date.now() + Math.random(),
          })),
        };

        setCollections((prev) => [...prev, newCollect]);
      } catch (error) {
        setAlertRequest(true);
        setShowModal(true);
      }
    };

    reader.readAsText(file);
  };
  return (
    <div className="container">
      <aside className="sidebar">
        <CollectionList
          collections={collections}
          expand={expand}
          setExpand={setExpand}
          addCollection={addCollection}
          loadHistory={loadHistory}
          updateCollection={updateCollection}
          updateRequest={updateRequest}
          addTab={addTab}
          deleteCollection={deleteCollection}
          updateTabs={updateTabs}
          exportCollection={exportCollection}
          importCollection={importCollection}
        />

        <HistoryList
          keyword={keyword}
          setKeyword={setKeyword}
          filteredHistory={filteredHistory}
          loadHistory={loadHistory}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      </aside>
      <main className="main">
        <Tabs
          tabs={tabs}
          activeTabID={activeTabID}
          activeRef={activeRef}
          setActiveTabID={setActiveTabID}
          closeTab={closeTab}
          addTab={() => addTab()}
        />
        <RequestSection
          activeTab={activeTab}
          activeCollectId={activeCollectId}
          collections={collections}
          setActiveCollectId={setActiveCollectId}
          updateRequest={updateRequest}
          updateTab={updateTab}
          sendRequest={sendRequest}
          loading={loading}
          updateHeaders={updateHeaders}
          deletedHeader={deletedHeader}
          addHeader={addHeader}
        />
      </main>
      {/* thông báo yes no */}
      <ConfirmModal
        showModal={showModal}
        message={
          alertRequest ? "Invalid collection file" : "Clear All History ?"
        }
        onConfirm={() => {
          if (alertRequest) {
            setAlertRequest(false);
          } else {
            setHistory([]);
          }
          setShowModal(false);
        }}
        onCancel={() => {
          if (alertRequest) setAlertRequest(false);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default App;
