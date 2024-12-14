import React, { useState, useEffect, useRef } from "react";
import { Menu, Divider, Button, Dropdown, message, Input, Upload } from "antd";
import { Link } from "react-router-dom";
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
  const searchBarRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleClick = async (key: string) => {
    if (!visitorId) {
      message.error("Visitor ID is missing!");
      return;
    }

    try {
      let response;
      let data;

      if (key === "reset") {
        // Reset preferences
        response = await fetch("http://localhost:5000/reset-preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitorId }),
        });
      } else if (key === "delete") {
        // Delete data
        response = await fetch("http://localhost:5000/delete-visitor-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitorId }),
        });
      }

      // Check if the response is successful
      if (response.ok) {
        data = await response.json();
        message.success(data.message || "Operation completed successfully!");
      } else {
        data = await response.json();
        message.error(data.error || "An error occurred.");
      }
    } catch (error) {
      message.error("An error occurred while processing your request.");
    }
  };

  const userMenu = (
    <Menu onClick={handleClick}>
      <Menu.Item key="reset">Reset Preferences</Menu.Item>
      <Menu.Item key="delete">Delete Data</Menu.Item>
    </Menu>
  );

  const handleSearchBarToggle = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  // Close search bar on outside click
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
      {/* Header with Logo, Collapse Button, and Avatar */}
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
            }}
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

      {/* Menu items */}
      <Menu
        style={{
          flex: 1,
          borderRight: 0,
        }}
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

      {/* Search Bar Popup */}
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
            {/* Add Image Button */}
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                console.log(file);
                return false;
              }}
            >
              <Button icon={<CameraOutlined />} style={{ flexShrink: 0 }}>
                Add Image
              </Button>
            </Upload>

            {/* Search Input */}
            <Input
              placeholder="Enter text to search..."
              style={{ flexGrow: 1 }}
            />

            {/* Search Button */}
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ flexShrink: 0 }}
            >
              Search
            </Button>
          </div>
        </div>
      )}

      {/* User Avatar with Dropdown */}
      <div style={{ padding: "16px", textAlign: "center" }}>
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <UserOutlined
            style={{ color: "#fff", fontSize: "24px", cursor: "pointer" }}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;
