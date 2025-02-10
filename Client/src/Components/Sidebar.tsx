import React, { useState, useEffect, useRef } from "react";
import { Menu, Divider, Button, Dropdown, message, Input, Upload } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  CameraOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getVisitorId } from "../utils/visitor";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const visitorId = getVisitorId();
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [textInput, setTextInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleTitleClick = () => {
    navigate("/home");
  };

  const handleClick = async (key: string) => {
    if (!visitorId) {
      message.error("Visitor ID is missing!");
      return;
    }
    try {
      let response;
      if (key === "reset") {
        response = {
          ok: true,
          json: async () => ({ message: "Preferences reset successfully" }),
        };
      } else if (key === "delete") {
        response = {
          ok: true,
          json: async () => ({ message: "Visitor data deleted successfully" }),
        };
      }
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        message.success(data.message || "Operation completed successfully!");
      } else {
        const data = await response.json();
        console.log(data);
        message.error(data.error || "An error occurred.");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while processing your request.");
    }
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    return false;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!textInput && !imageFile) {
      message.error("Please provide either an image or text input!");
      return;
    }
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    if (textInput) formData.append("query", textInput);

    try {
      const response = await fetch(
        "http://localhost:5000/api/recommendations",
        {
          method: "POST",
          body: formData,
        }
      );
      const recommendations = await response.json();
      if (response.ok) {
        console.log("Recommendations:", recommendations);
        message.success("Recommendations fetched successfully!");
      } else {
        message.error(
          recommendations.error || "Failed to fetch recommendations."
        );
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      message.error("An error occurred while fetching recommendations.");
    }
  };

  const userMenuItems = [
    { key: "reset", label: "Reset Preferences" },
    { key: "delete", label: "Delete Data" },
  ];

  const handleSearchBarToggle = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setSearchBarVisible(false);
      }
    };

    if (searchBarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarVisible]);

  return (
    <div
      style={{
        width: collapsed ? 80 : 256,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        backgroundColor: "#121212",
        color: "white",
      }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          transition: "all 0.3s ease",
        }}
      >
        {!collapsed && (
          <div
            style={{
              textAlign: "center",
              transition: "opacity 0.3s ease",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={handleTitleClick}
          >
            <i className="fa-solid fa-plane" /> Tourist Spotter
          </div>
        )}
        <Button
          type="text"
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ color: "#fff" }} />
            ) : (
              <MenuFoldOutlined style={{ color: "#fff" }} />
            )
          }
          onClick={toggleCollapse}
        />
      </div>
      <Divider style={{ margin: 0 }} />
      <Menu
        style={{ flex: 1, borderRight: 0 }}
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[]}
        onClick={() => {}}
      >
        <Menu.Item
          key="1"
          icon={<SearchOutlined style={{ color: "#fff" }} />}
          onClick={handleSearchBarToggle}
        >
          Search
        </Menu.Item>
        <Menu.Item key="2" icon={<CameraOutlined style={{ color: "#fff" }} />}>
          <Link to="/destinations" className="nav-text">
            Destinations
          </Link>
        </Menu.Item>
      </Menu>
      {searchBarVisible && (
        <div
          className="search-bar"
          ref={searchBarRef}
          style={{
            position: "absolute",
            top: 50,
            left: collapsed ? 80 : 256,
            width: collapsed ? "calc(100% - 80px)" : "calc(100% - 256px)",
            padding: "10px",
            backgroundColor: "#f2f2f2",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <Upload
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
            >
              <Button icon={<CameraOutlined />} style={{ flexShrink: 0 }}>
                Add Image
              </Button>
            </Upload>
            <Input
              placeholder="Enter text to search..."
              style={{ flexGrow: 1 }}
              value={textInput}
              onChange={handleTextChange}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ flexShrink: 0 }}
              onClick={handleSubmit}
            >
              Search
            </Button>
          </div>
        </div>
      )}
      <div style={{ padding: "16px", textAlign: "center" }}>
        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <UserOutlined
            style={{ color: "#fff", fontSize: "24px", cursor: "pointer" }}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;
