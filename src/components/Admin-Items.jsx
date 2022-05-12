import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AdminItems = (props) => {
  const { subCategories, mainCategories, items } = props;
  const [currentItem, setCurrentItem] = useState(0);
  console.log(items);
  return (
    <div>
      <p>hi there</p>
      <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
        <InputLabel id="item-category">Categories</InputLabel>
        <Select
          labelId="category-filter"
          id="item-category-select"
          label="Categories"
          value={currentItem}
          // onChange={(event) => catSearch(parseInt(event.target.value))}
        >
          <MenuItem value={0}>None</MenuItem>
          {items.map((items) => (
            <MenuItem value={items.id}>{items.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
    /* <div className="connect-category">
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
                  <option key={item.id}value={item.id}>{item.name}</option>
                ))}
            </select>
            <button type="submit">Submit</button>
          </form>
          </div> */
  );
};

export default AdminItems;
