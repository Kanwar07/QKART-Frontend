import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Button
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart"
import { SettingsRemote } from "@mui/icons-material";
import { WindowSharp } from "@mui/icons-material";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [ products, setProducts] = useState([]);
  const [ FilteredProducts, setFilteredProducts] = useState([]);
  const [ isloading, setisloading ] = useState(false);
  const [ setSearch, issetSearch ] = useState("");
  const [ debounceTimeout, setdebounceTimeout ] = useState("");
  const [ item, setitems ] = useState([]);
  const token = localStorage.getItem("token");
  // const token = localStorage.getItem("token");
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setisloading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setisloading(false);
      setProducts(response.data);
      setFilteredProducts(response.data);
      return response.data;
      
    } catch (e) {
      setisloading(false);
      if(e.response && e.response.status === 500)
      {
        enqueueSnackbar("Something went wrong. Check the backend console for more details", { varient: "error" });
      }
    }
  };


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
      try {
        const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
        setFilteredProducts(response.data);
        return response.data;
      } catch(e) {
        if(e.response) {
          if(e.response.status === 404) {
            setFilteredProducts([]);
          }
          if (e.response.status === 500) {
            setFilteredProducts(products);
            enqueueSnackbar(e.message, { varient : "error" });
          }
        } else {
          enqueueSnackbar("Could not fetch products. check the backend is running, reachable and return a valid JSON", { varient : "error"});
        }
      }
  };
  // useEffect(() => {
  //   performSearch(setSearch);
  // }, [setSearch])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if(debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      performSearch(value)
    }, 500);

    setdebounceTimeout(timeout);

//  const handleInputChange = (e) => {
//   issetSearch(e.target.value);
//  }
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers : {
          Authorization : `Bearer ${token}`,
        },
      })
      return response.data;
      

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };
  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    if(items)
    return items.findIndex((item) => item.productId === productId) !== -1;
  };


  // const updatecartItems = (cartData, products) => {
  //   const update = generateCartItemsFrom(cartData, products);
  //   setitems(update);
  // }
  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  useEffect(() => {
    const onLoaderHandler = async () => {
      const productData = await performAPICall();
      const cartData = await fetchCart(token);
      const cartDetails = await generateCartItemsFrom(cartData, productData);
      setitems(cartDetails);
    };
    onLoaderHandler();
  }, [])





  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token) {
      enqueueSnackbar("Login to add an item to the Cart", {varient:"error"});
      return;
    }
    if(options.preventDuplicate && isItemInCart(items, productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {variant : "warning"});
      return;
    }
    try {
      const response = await axios.post(`${config.endpoint}/cart`,
      { productId, qty },
      {
        headers : {
          Authorization : `Bearer ${token}`
        }
      }
      );
      const update = generateCartItemsFrom(response.data, products);
    setitems(update);
      // updatecartItems(response.data, products);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        {<TextField
          fullWidth
          sx={{width: '400px'}}
          className="search-desktop"
          size="small"
          type="text"
          placeholder="Search for items/categories"
          name="search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />
      <Grid container>
       <Grid item md={token && products.length ? 9 : 12}>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>

         {isloading ? (
          <Box className="loading">
          <CircularProgress />
          <h4>Loading Products
          </h4>
          </Box>
         ) : (
          <Grid container padding="1rem" spacing={2}>
            {FilteredProducts.length ? (
              FilteredProducts.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
               <ProductCard
               product={product}
               handleAddToCart={() =>
                addToCart(
                token,
                item,
                products,
                product._id,
                1,
                { 
                  preventDuplicate: true,
                }
              )
            }
               />
               </Grid>
              ))
            ) : (
              <Box className="loading">
                <SentimentDissatisfied color="action" />
                <h4>No products found </h4>
              </Box>
            )
            }
       </Grid>
  )}
  </Grid>
  {token && (<Grid item xs={12} md={3} bgcolor='#E9F5E1'>
    <Cart 
    products={products}
    items = {item}
    handleQuantity = {addToCart}
    />
  </Grid>)}
  </Grid>
      <Footer />
    </div>
      )
};

export default Products;
