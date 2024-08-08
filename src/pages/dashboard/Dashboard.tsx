import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Sidenav from '../components/Sidenav/Sidenav';
import styles from '@/styles/Home.module.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
}



const Dashboard: React.FC = () => {


  // State variables for products, selected product, dialog open state, and loading state
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Column definitions for the DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'discountPercentage', headerName: 'Discount %', width: 150 },
    { field: 'rating', headerName: 'Rating', width: 120 },
    { field: 'stock', headerName: 'Stock', width: 120 },
    { field: 'tags', headerName: 'Tags', width: 180 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className={styles.fixedColumn}>
          <Button variant="contained" color="primary" onClick={() => handleViewReviews(params.row.id)}>
            View Reviews
          </Button>
        </div>
      ),
    },
  ];

  // useEffect hook to fetch products when the component mounts
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  // Function to handle viewing reviews of a product
  const handleViewReviews = async (productId: number) => {
    setLoading(true);
    setIsDialogOpen(true);
    try {
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
      const product = await response.json();
      setSelectedProduct(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/'); // Redirect to login page if token is not present
    }
  }, [router]);

  return (
    <>
      <Sidenav />
      <div className={styles.MainBody}>
        <div className={styles.MainBodyContainer}>
          <div style={{ height: 600, width: '100%' }}>
            <h2 className={styles.TableTitle}>Products</h2>
            <DataGrid rows={products} columns={columns} />
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Product Reviews</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : selectedProduct ? (
            <>
              <Typography variant="h6">{selectedProduct.title}</Typography>
              <Typography variant="body1">{selectedProduct.description}</Typography>
            </>
          ) : (
            <Typography>No product selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;
