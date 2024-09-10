import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const rows = [
  { id: 1, title: 'Event 1', date: '2024-11-15' },
  { id: 2, title: 'Event 2', date: '2024-11-20' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', width: 150 },
  { field: 'date', headerName: 'Date', width: 150 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: () => <Button variant="contained">Edit</Button>,
  },
];

const Events = () => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

export default Events;
