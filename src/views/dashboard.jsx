import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Grid from "@mui/material/Grid";
import Stack from '@mui/material/Stack';
import Registro from "./registro";


const columns = [
    { field: 'id', headerName: 'Id', width: 130 },
    { field: 'usuario', headerName: 'Huésped', width: 130 },
    { field: 'ci', headerName: 'Identificación', width: 130 },
    { field: 'habitacion', headerName: 'Habitación', width: 130 },
    {
      field: 'ingreso',
      headerName: 'Ingreso',
      type: 'number',
      width: 130,
    },
    {
      field: 'salida',
      headerName: 'Salida',
      type: 'number',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

export default function Dashboard(){

    const navigate = useNavigate();
    const regresar = () => {
            navigate('/registro')

    }
    return(
        <>
       <div style={{ height: 500, width: '90%', margin:'auto' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
      />
    </div>


</>

    );
}