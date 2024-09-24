import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";


const Users = () => {
  const USERS_URL = "users/fetch";

  const [users, setUsers] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(USERS_URL, {
          signal: controller.signal,
        });

        isMounted && setUsers(response.data.users);
      } catch (err) {
        console.log(err.message);
      }
    };
    
    getUsers();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  
  return (
    <article>
      <h2>Users List</h2>
      {users.length ? (
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user?.firstName}</li>
          ))}
        </ul>
      ) : (
        <p>No users</p>
      )}
      
    </article>
  );
};

export default Users;
