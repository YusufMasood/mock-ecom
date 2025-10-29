import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductList = ({ products, onAdd }) => {
  return (
    <Box sx={{ padding: 4, background: "#f7f8fa", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        🛍️ Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography color="text.secondary">
                  ₹{product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  fullWidth
                  onClick={() => onAdd(product.id)}  
                  sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#125ea3" },
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
