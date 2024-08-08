import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter for client-side routing
import { useReactTable, ColumnDef, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import Sidenav from '../components/Sidenav/Sidenav';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, CircularProgress, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
`;

const Th = styled.th`
  padding: 16px;
  background-color: #1E1E1E;
  border-bottom: 2px solid #ddd;
  text-align: left;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #ddd;
  &:nth-of-type(3) {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Tr = styled.tr`
  background-color: #F5F5F5;
  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }
`;

const HeaderRow = styled.tr`
  background-color: #1E1E1E;
  color: #fff;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const TebleTitle = styled.h1`
  font-size: 22px;
  margin: 0px;
`;

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  // Define table columns
  const columns: ColumnDef<Product, any>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Description', accessorKey: 'description' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Price', accessorKey: 'price' },
    { header: 'Discount %', accessorKey: 'discountPercentage' },
    { header: 'Rating', accessorKey: 'rating' },
    { header: 'Stock', accessorKey: 'stock' },
    { header: 'Tags', accessorKey: 'tags' },
    { header: 'Brand', accessorKey: 'brand' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: any) => (
        <Button variant="contained" color="primary" onClick={() => handleViewReviews(row.original.id)}>
          View Reviews
        </Button>
      ),
    },
  ];

  // Initialize React Table with pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  // Fetch products from the API
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

  // Handle viewing reviews of a product
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

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Sidenav />
      <div style={{ paddingLeft: '280px' }}>
        <TebleTitle>Products</TebleTitle>
        <Table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <HeaderRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</Th>
                ))}
              </HeaderRow>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </Table>
        <PaginationContainer>
          <IconButton
            onClick={() => table.setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </IconButton>
          <Typography>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Typography>
          <IconButton
            onClick={() => table.setPageIndex((prev) => Math.min(prev + 1, table.getPageCount() - 1))}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </IconButton>
        </PaginationContainer>
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
      </div>
    </>
  );
};

export default Dashboard;
