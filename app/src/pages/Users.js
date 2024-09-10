import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const rows = [
  { id: 1, name: 'Admin User', role: 'Admin' },
  { id: 2, name: 'Regular User', role: 'User' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'role', headerName: 'Role', width: 150 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: () => <Button variant="contained">Edit</Button>,
  },
];

const Users = () => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

export default Users;
