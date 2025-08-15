import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:4000";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchName, searchEmail, searchRole, users]);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await axios.get(`${BASE_URL}/users/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const applyFilters = () => {
    const filtered = users.filter((user) => {
      const matchesName = user.userName
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesEmail = user.userEmail
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const matchesRole = user.userRole
        .toLowerCase()
        .includes(searchRole.toLowerCase());
      return matchesName && matchesEmail && matchesRole;
    });
    setFilteredUsers(filtered);
  };

  const handleToggleStatus = async (userId, newStatus) => {
    const confirmText = newStatus === 0 ? "deactivate" : "activate";
    if (
      !window.confirm(`Are you sure you want to ${confirmText} this user?`)
    )
      return;

    try {
      const token = localStorage.getItem("Token");
      await axios.patch(
        `${BASE_URL}/users/toggle-status/${userId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllUsers();
    } catch (error) {
      console.error("Error toggling user status", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.heading}>All Users</h2>
        <button
          onClick={() => (window.location.href = "/dashboard/top-buyers")}
          style={styles.topBuyersBtn}
        >
          Top Buyers
        </button>
      </div>

      {/* Search Panel */}
      <div style={styles.searchPanel}>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          style={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Search by Role"
          value={searchRole}
          onChange={(e) => setSearchRole(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Created At</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
              <th style={styles.th}>Reviews</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.userId} style={styles.tr}>
                <td>{user.userId}</td>
                <td>{user.userName}</td>
                <td>{user.userEmail}</td>
                <td>{user.userRole}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor:
                        user.status === 1 ? "#d1fae5" : "#fee2e2",
                      color: user.status === 1 ? "#065f46" : "#991b1b",
                    }}
                  >
                    {user.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  {user.userRole === "customer" && (
                    <button
                      onClick={() =>
                        handleToggleStatus(
                          user.userId,
                          user.status === 1 ? 0 : 1
                        )
                      }
                      style={{
                        ...styles.actionBtn,
                        backgroundColor:
                          user.status === 1 ? "#f87171" : "#34d399",
                      }}
                    >
                      {user.status === 1 ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </td>
                <td>
                  <Link to={`/dashboard/reviews/${user.userId}`}>
                    <button style={styles.viewBtn}>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={styles.pageBtn}
        >
          Previous
        </button>
        <span style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "sans-serif" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    alignItems: "center",
  },
  heading: { fontSize: "24px", fontWeight: "bold" },
  topBuyersBtn: {
    padding: "8px 14px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  searchPanel: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    flex: "1",
  },
  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  th: {
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    fontWeight: "600",
  },
  tr: {
    borderBottom: "1px solid #e5e7eb",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  actionBtn: {
    padding: "6px 10px",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  viewBtn: {
    padding: "6px 10px",
    backgroundColor: "#60a5fa",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  pageBtn: {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
  },
  pageInfo: { fontSize: "14px" },
};

export default Users;
