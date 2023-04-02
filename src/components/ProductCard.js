import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
  

const ProductCard = ({product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component="img"
        object-fit="cover"
        image={product.image}
        title="image"
      />
      <CardContent>
        <Typography>
          {product.name}
        </Typography>
        <Typography>
          <b>${product.cost}</b>
        </Typography>
        <Rating
        name="half-rating-read"
        value={product.rating}
        precision={0.5}
        readOnly
        />
      </CardContent>
      <CardActions className="card-actions">
        <Button className="card-button" variant="contained" onClick={handleAddToCart}
        >ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
