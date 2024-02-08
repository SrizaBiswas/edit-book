import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const Adddbook = () => {
  const navigate = useNavigate();
  const [bkCon, setBkCon] = useState(null);
  const [bkImg, setBkImg] = useState(null);
  const [book, setBook] = useState({
    bkname: "",
    role: "admin",
    authname: "",
    bkgenre: "",
    desp: "",
  });
  //dropdown list
  const options = [
    "Adventure",
    "Children's literature",
    "Fiction",
    "Historical Fiction",
    "Horror",
    "Humor",
    "Mythology",
    " Nonfiction",
    "Poetry",
    "Paranormal",
    "Romance",
    "Self Help",
    "Thriller",
  ];
  const [selectedOption, setSelectedOption] = useState("");
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  // console.log(book);

  const addbook = (e) => {
    e.preventDefault();

    const data = new FormData();

    if (
      book.bkname &&
      book.authname &&
      book.role &&
      // bkImg &&
      // book.bkgenre &&
      book.desp
      // bkCon
    ) {
      data.set("bkname", book.bkname);
      data.set("role", book.role);
      data.set("authname", book.authname);
      data.set("bkImg", bkImg);
      data.set("bkgenre", selectedOption);
      data.set("desp", book.desp);
      data.set("bkCon", bkCon);

      axios.post("http://localhost:3001/addbook", data).then((res) => {
        alert(res.data.message);
        navigate("/books");
      });
    } else {
      alert("Invlid input");
    }
  };

  return (
    <main className="main-bk">
      <div className="inbk">
        <div className="headbk">
          <img src="/assests/logoExplore.png" alt="Logo Image" />
          <span className="line">
            <h2>Upload a Book</h2>
          </span>
        </div>
        <form
          encType="multipart/form-data"
          onSubmit={addbook}
          className="input-form"
        >
          <div className="outbk">
            <div className="innerbk">
              <div className="inputbk">
                <label htmlFor="bkname">Book Title</label>
                <div className="input-flexbk">
                  <input
                    type="text"
                    name="bkname"
                    value={book.bkname}
                    required
                    placeholder="Enter book name"
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div className="inputbk">
                <label htmlFor="authname">Author Name</label>
                <div className="input-flexbk">
                  <input
                    type="text"
                    name="authname"
                    value={book.authname}
                    required
                    placeholder="Author name"
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
            </div>
            <div className="innerbk">
              <div className="inputbk">
                <label htmlFor="bkimage">Book Cover Image</label>
                <div className="input-flexbk">
                  <input
                    type="file"
                    name="bkImg"
                    // value={bkImg}
                    required
                    accept=".jpg, .jpeg, .png"
                    placeholder="Book Image Cover"
                    onChange={(e) => setBkImg(e.target.files[0])}
                  ></input>
                </div>
              </div>
              <div className="inputbk">
                <label htmlFor="bkgenre">Books Content</label>
                <div className="input-flexbk">
                  <input
                    type="file"
                    name="bkCon"
                    // value={bkCon}
                    accept=".pdf"
                    required
                    placeholder=" Add your books pdf"
                    onChange={(e) => setBkCon(e.target.files[0])}
                  ></input>
                </div>
              </div>
            </div>
            <div className="innerbk">
              <div className="innbk">
                <div className="inputbk">
                  <label htmlFor="bkimage">Book Description</label>
                  <div className="input-flexbk">
                    <textarea
                      name="desp"
                      value={book.desp}
                      id="myTextarea"
                      rows={2} // Set the number of visible rows
                      cols={55} // Set the number of visible columns
                      placeholder="Write books Description" // Placeholder text
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
                <div className="inputbk">
                  <label htmlFor="bkgenre">Book Genre</label>
                  <div className="dp-flexbk">
                    {/* <input
                    type="text"
                    name="bkgenre"
                    value={book.bkgenre}
                    required
                    placeholder="Books Category"
                    onChange={handleChange}
                  ></input> */}
                    <select
                      id="dropdown"
                      value={selectedOption}
                      onChange={handleSelectChange}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="adbtn">
            <span>Add</span>
          </button>
        </form>
      </div>
    </main>
  );
};

export default Adddbook;
