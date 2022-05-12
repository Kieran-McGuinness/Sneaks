import React, { useState, useEffect } from "react";
import { callApi } from "../api";

const AdminCategories = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [conectedCategories, setConnectCategories] = useState([]);
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [mainSelect, setMainSelect] = useState(1);
  const [subSelect, setSubSelect] = useState(1);
  useEffect(() => {
    // console.log(subCats);
    // console.log(connectedCats);
    const getConnectedCategories = async () => {
      const connectedCats = await callApi({
        url: "/main-sub",
      });
      setConnectCategories(connectedCats);
      console.log(connectedCats);
    };
    getConnectedCategories();
    const getSubCategories = async () => {
      const subCats = await callApi({
        url: "/sub-categories",
      });
      setSubCategories(subCats);
    };
    getSubCategories();
    const getMainCategories = async () => {
      const mainCats = await callApi({
        url: "/main-categories",
      });
      setMainCategories(mainCats);
    };
    getMainCategories();
  }, []);

  const handleSubmitNewMainCategory = async (event) => {
    event.preventDefault();
    console.log(mainCategoryName);
    setMainCategoryName("");
    const data = { name: mainCategoryName };
    const newMainCat = await callApi({
      url: "/main-categories",
      method: "POST",
      body: data,
    });
  };

  const handleSubmitNewSubCategory = async (event) => {
    event.preventDefault();
    console.log(subCategoryName);
    setSubCategoryName("");
    const data = { name: subCategoryName };
    const newSubCat = await callApi({
      url: "/sub-categories",
      method: "POST",
      body: data,
    });
    setSubCategories([...subCategories, newSubCat]);
  };

  const handleMainSelect = (event) => {
    setMainSelect(event.target.value);
    console.log(mainSelect);
  };

  const handleSubSelect = (event) => {
    setSubSelect(event.target.value);
    console.log(subSelect);
  };

  const handleSubmitConnectedCategory = async (event) => {
    event.preventDefault();
    console.log(mainSelect);
    console.log(subSelect);
    const data = { mainid: mainSelect, subcatsid: subSelect };
    const newConCat = await callApi({
      url: "/main-sub",
      method: "POST",
      body: data,
    });
    // setConnectCategories(...conectedCategories, newConCat)
  };
  return (
    <div>
      <h1>Admin Categories</h1>
      <div className="create-main-category">
        <h2>Create new Main</h2>
        <form onSubmit={handleSubmitNewMainCategory}>
          <label htmlFor="category-name">Main Name:</label>
          <input
            type="text"
            name="category-name"
            value={mainCategoryName}
            onChange={(event) => setMainCategoryName(event.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="create-sub-category">
        <h2>Create new Sub</h2>
        <form onSubmit={handleSubmitNewSubCategory}>
          <label htmlFor="category-name">Sub Name:</label>
          <input
            type="text"
            name="category-name"
            value={subCategoryName}
            onChange={(event) => setSubCategoryName(event.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        <div className="connect-category">
          <h2>Connect Categories</h2>
          <form onSubmit={handleSubmitConnectedCategory}>
            <p>Main Category</p>
            <select onChange={handleMainSelect}>
              {mainCategories.length &&
                mainCategories.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
            </select>
            <p>Sub Category</p>
            <select onChange={handleSubSelect}>
              {subCategories.length &&
                subCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            <button type="submit">Submit</button>
          </form>
          <div>
            <h2>Currently Connected Categories</h2>
            {conectedCategories.length &&
              conectedCategories.map((maincats) => (
                <>
                  <h2>{maincats.name}</h2>
                  {maincats.subname.map((subname, index) => (
                    <p key={index++ + maincats.subname}>{subname}</p>
                  ))}
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
