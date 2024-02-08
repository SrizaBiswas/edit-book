import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
//import Loading from "../loading";

const Books = () => {
  //table
  const { bkname } = useParams();
  // const [bookDetail, setBookDetail] = useState();
  const [bookdata, setBookdata] = useState();
  const [bkByAdmin, setBkByAdmin] = useState([]);
  const [bkByUser, setBkByUser] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const books = "books"; //books come from index.js

  const [book, setBook] = useState({
    bkname: "",
    authname: "",
    bkgenre: "",
    desp: "",
  });
  const [bkCon, setBkCon] = useState(null);
  const [bkImg, setBkImg] = useState(null);

  const fetchbooks = async () => {
    const bookColl = books;

    try {
      axios
        .post("http://localhost:3001/get-dbcollections", bookColl)
        .then((res) => {
          const databook = res.data.data; //data.data??
          // alert(res.data.message);
          setBookdata(databook);
          setBookdata(
            databook.filter(
              (book) => book.bkname === decodeURIComponent(bkname)
            )
          );
          setBkByAdmin(databook.length);
          setBkByAdmin(databook.filter((book) => book.role === "admin"));
          setBkByUser(databook.filter((book) => book.role === "user"));
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!bookdata) {
      fetchbooks();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  const adminCount = bkByAdmin.length;
  const userCount = bkByUser.length;
  console.log(bookdata);
  console.log(bkByAdmin && bkByAdmin.length);
  console.log(bkByUser.length);
  console.log(bkByUser && bkByUser.length);
  console.log(adminCount);

  const editbook = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set("bkname", bookdata[0]?.bkname);
    data.set("authname", bookdata[0]?.authname);
    data.set("bkImg", bkImg);
    data.set("bkgenre", book.bkgenre);
    data.set("desp", book.desp);
    data.set("bkCon", bkCon);

    axios.post("http://localhost:3001/edit-book", data).then((res) => {
      alert(res.data.message);
      if (res.data.status == "ok") {
        fetchbooks();
        setBook({
          bkname: "",
          authname: "",
          bkgenre: "",
          desp: "",
        });
        setEditOpen(!editOpen);
      }
    });
  };
  // const delbook = () => {
  //   axios
  //     .post("http://localhost:3001/delbook", { bkname: bookdata[0]?.bkname })
  //     .then((res) => {
  //       alert(res.data.message);
  //       if (res.data.status == "del") {
  //         return (window.location.href = "/admin/books");
  //       }
  //     });
  // };

  return (
    <div className="main-book">
      <div className="bcards">
        <div className="bkcard">
          <h2>BOOKS UPLOADED BY ADMIN</h2>
          <h3>{adminCount}</h3>
        </div>
        <div className="bkcard">
          <h2>BOOKS UPLOADED BY USER</h2>
          <h3>{userCount}</h3>
        </div>
      </div>
      <div className="table">
        <h1 className="tbhead"> Book Table</h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>By</th>
              <th>Book Cover</th>
              <th>Book Description</th>
              <th>Book Content</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {bookdata == undefined}
            {bookdata != undefined &&
              //  do both the line above will work
              bookdata.map((i) => (
                <tr key={i._id}>
                  {/* <BooksCard i={i} /> */}
                  {/* what i is doing?? */}
                  <td>{i.bkname}</td>
                  <td>{i.authname}</td>
                  <td>{i.bkgenre}</td>
                  <td>{i.role}</td>
                  <td className="tbimg">{i.bkimage}</td>
                  <td className="tbdesp">{i.desp}</td>
                  <td className="tbcon">{i.bkcon}</td>
                  <td>
                    {/* <div>
                      {!bookDetail ? (
                        <div className="w-full h-screen text-center text-3xl p-4">
                          Loading...
                        </div>
                      ) : (
                        <> */}
                    <div className="absolute w-full h-auto p-8 flex flex-col justify-center gap-5  text-white">
                      <FaRegEdit
                        size={30}
                        // onClick={() => setEditOpen(!editOpen)}
                        className="active:scale-90 cursor-pointer ease-in-out duration-200"
                      />
                      <AiTwotoneDelete
                        size={30}
                        // onClick={delbook}
                        className="active:scale-90 cursor-pointer ease-in-out duration-200"
                      />
                    </div>
                    {/* <div
                      className={`${
                        editOpen ? "opacity-100" : "opacity-0 hidden"
                      } absolute mt-20 w-full h-full backdrop-blur-sm flex justify-center z-50`}
                    >
                      <form className="w-[50%] h-[40rem] shadow-2xl rounded-xl flex flex-col gap-2 items-center justify-center border">
                        <span className="text-4xl text-black mb-2">
                          Edit book details
                        </span>
                        <input
                          type="text"
                          className="w-[80%] h-[3rem] border shadow-xl rounded-lg  placeholder:text-black text-black p-2"
                          disabled
                          placeholder={bookDetail[0]?.bkname ?? "book-name"}
                        />
                        <input
                          type="text"
                          className="w-[80%] h-[3rem] border shadow-xl rounded-lg  placeholder:text-black text-black p-2"
                          disabled
                          placeholder={bookDetail[0]?.authname ?? "book-author"}
                        />
                        <input
                          type="text"
                          name="bkgenre"
                          value={book.bkgenre}
                          onChange={handleChange}
                          className="w-[80%] h-[3rem] border shadow-xl rounded-lg bg-[#FAEBD7] placeholder:text-black text-black p-2 outline-none focus:scale-105"
                          placeholder={bookDetail[0]?.bkgenre ?? "book-genre"}
                        />
                        <textarea
                          rows={5}
                          name="desp"
                          value={book.desp}
                          onChange={handleChange}
                          className="w-[80%] h-auto border shadow-xl rounded-lg bg-[#FAEBD7] placeholder:text-black text-black p-2 outline-none focus:scale-105"
                          placeholder={
                            bookDetail[0]?.desp ?? "book-description"
                          }
                        ></textarea>
                        <div className="w-[80%] h-[3rem] flex gap-2 border shadow-xl rounded-lg text-black p-2 bg-[#FAEBD7]">
                          <span className="w-[35%]">Update Cover Image : </span>
                          <input
                            type="file"
                            name="bkCon"
                            // value={bkCon}
                            accept=".jpg, .jpeg, .png"
                            required
                            placeholder="Add your books pdf"
                            onChange={(e) => setBkImg(e.target.files[0])}
                            className="w-full h-full"
                          ></input>
                        </div>
                        <div className="w-[80%] h-[3rem] flex gap-2 border shadow-xl rounded-lg text-black p-2 bg-[#FAEBD7]">
                          <span className="w-[35%]">Update Content : </span>
                          <input
                            type="file"
                            name="bkCon"
                            // value={bkCon}
                            accept=".pdf"
                            required
                            placeholder="Add your books pdf"
                            onChange={(e) => setBkCon(e.target.files[0])}
                            className="w-full h-full"
                          ></input>
                        </div>
                        <button
                          type="submit"
                          onClick={editbook}
                          className="w-[20%] h-[3rem] bg-primary mt-2 rounded-md hover:scale-110 active:scale-90 ease-in-out duration-200"
                        >
                          Update
                        </button>
                      </form>
                    </div> */}
                    {/* </>
                      )}
                    </div> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Books;
