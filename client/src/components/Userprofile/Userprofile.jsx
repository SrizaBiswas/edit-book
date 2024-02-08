import React, { useState } from 'react';

const UserProfile = () => {
  const uData = JSON.parse(window.localStorage.getItem("user"));
  // console.log(uData);
  // Assume userReadingList is an array of book objects
  const [userReadingList, setUserReadingList] = useState([
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' },
    // Add more books as needed
  ]);

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <h3>Reading List</h3>
        <ul>
          {userReadingList.map(book => (
            <li key={book.id}>
              {book.title} by {book.author}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;