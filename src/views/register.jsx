import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Container, Modal, ModalHeader, ModalBody } from "reactstrap";
import '../css/Dashboard.css';
import CloseIcon from '@mui/icons-material/Close';
import '../css/Tabla.css';
import 'bootstrap/dist/css/bootstrap.css';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { Autocomplete, Button, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import TablePagination from '@mui/material/TablePagination';
import { onSnapshot, setDoc, doc, updateDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";


export default function DashboardView() {
    const Swal = require('sweetalert2');
    const [modalPrincipal, setModalPrincipal] = useState(false);
    const [modalSucursal, setModalSucursal] = useState(false);
    const [ingreso, setIngreso] = useState(dayjs(new Date()));
    const [salida, setSalida] = useState(dayjs(new Date()));
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [habitacionesSucursal, setHabitacionesSucursal] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [reset, setReset] = useState(false);


    const getDatos = () => {
        const registroRef = collection(db, "registro");
        onSnapshot(registroRef, (snapshot) => {
            const registros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(registros);
        });
    };

    const getData = () => {
        onSnapshot(doc(db, "informacion", "principal"), (doc) => {
            setHabitaciones(doc.data().habitaciones);
        });
    };

    const getSucursal = () => {
        onSnapshot(doc(db, "informacion", "sucursal"), (doc) => {
            setHabitacionesSucursal(doc.data().habitaciones);
        });
    };

    const [formClient, setFormClient] = useState({
        id: uuidv4(),
        usuario: "",
        ci: "",
        habitacion: null,
        Fingreso: ingreso.toISOString(),
        Fsalida: salida.toISOString(),
        estado: 'OCUPADO',
        hotel:"",
    });

    const handleCode = (e) => {
        const { name, value } = e.target;
        setFormClient((prevFormClient) => ({
            ...prevFormClient,
            [name]: value
        }));
    };

    useEffect(() => {
        setFormClient((prevFormClient) => ({
            ...prevFormClient,
            habitacion: habitacionSeleccionada,
            Fingreso: ingreso.toISOString(),
            Fsalida: salida.toISOString(),
        }));
    }, [habitacionSeleccionada, ingreso, salida]);

    const handleClick = async () => {
        const updatedFormClient = {
            ...formClient,
            habitacion: habitacionSeleccionada,
            Fingreso: ingreso.toISOString(),
            Fsalida: salida.toISOString(),
            hotel:"PRINCIPAL"
            
        };
        await sendFirestore(updatedFormClient);
        if (habitacionSeleccionada) {
            await actualizarDisponibilidadHabitacion(habitacionSeleccionada.codigo, false);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Registro Exitoso!",
                showConfirmButton: false,
                timer: 1500
            });
            setModalPrincipal(true);
            setFormClient({});
        } 
        navigate('/dashboard');
    };

    const handleClickSucursal = async () => {
        const updatedFormClient = {
            ...formClient,
            habitacion: habitacionSeleccionada,
            Fingreso: ingreso.toISOString(),
            Fsalida: salida.toISOString(),
            hotel:"SUCURSAL"
        };
        console.log(updatedFormClient);
        await sendFirestoreSucursal(updatedFormClient);
        if (habitacionSeleccionada) {
            await actualizarDisponibilidadSucursal(habitacionSeleccionada.codigo, false);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Registro Exitoso!",
                showConfirmButton: false,
                timer: 1500
            });
            setModalSucursal(true);
            setFormClient({});
        }
    }; 

    const actualizarDisponibilidadHabitacion = async (codigo, disponible) => {
        try {
            const habitacionesRef = doc(db, "informacion", "principal");
            const docSnapshot = await getDoc(habitacionesRef);
            const habitacionesData = docSnapshot.data().habitaciones;
            const updatedHabitaciones = habitacionesData.map(habitacion =>
                habitacion.codigo === codigo ? { ...habitacion, disponible } : habitacion
            );
            await updateDoc(habitacionesRef, { habitaciones: updatedHabitaciones });
            console.log(`Habitación ${codigo} actualizada a disponible: ${disponible}`);
        } catch (e) {
            console.error("Error", e);
        }
    };

    const actualizarDisponibilidadSucursal = async (codigo, disponible) => {
        try {
            const habitacionesRef = doc(db, "informacion", "sucursal");
            const docSnapshot = await getDoc(habitacionesRef);
            const habitacionesData = docSnapshot.data().habitaciones;
            const updatedHabitaciones = habitacionesData.map(habitacion =>
                habitacion.codigo === codigo ? { ...habitacion, disponible } : habitacion
            );
            await updateDoc(habitacionesRef, { habitaciones: updatedHabitaciones });
            console.log(`Habitación ${codigo} actualizada a disponible: ${disponible}`);
        } catch (e) {
            console.error("Error", e);
        }
    };

    const sendFirestore = async (_orden) => {
        try {
            console.log(_orden);
            await setDoc(doc(db, "registro", _orden.id), _orden);
            console.log("Registro correcto");
        } catch (e) {
            console.error("Error adding document: ", e);
            console.log("Error");
        }
    };

    const sendFirestoreSucursal = async (_orden) => {
        try {
            console.log(_orden);
            await setDoc(doc(db, "registroSucursal", _orden.id), _orden);
            console.log("Registro correcto");
        } catch (e) {
            console.error("Error adding document: ", e);
            console.log("Error");
        }
    };

    const abrirModal = () => {
      console.log(habitaciones.filter(habitacion => habitacion.disponible))
      if (habitaciones.filter(habitacion => habitacion.disponible).length !== 0) {
        setModalPrincipal(true);
    } else {
        getSucursal();
        setModalSucursal(true);
    } 
    };

    const cerrarModalPrincipal = () => {
        setModalPrincipal(false);
    };

    const cerrarModalSucursal = () => {
        setModalSucursal(false);
    };

    const handleIngreso = (date) => {
        setIngreso(date);
    };

    const handleSalida = (date) => {
        setSalida(date);
    };

    const handleHabitacion = (e, value) => {
        setHabitacionSeleccionada(value ? value : null);
        console.log(value);
    };

    const handleNavigateDashboard = () => {
        navigate('/dashboard');
    };

    const handleNavigateAuditoria = () => {
        navigate('/');
    };

    const claseEstado = (idEstado) => {
        let sColor = 'blanco';
        switch (idEstado) {
            case 'OCUPADO':
                sColor = 'tomate';
                break;
            case 'FINALIZADO':
                sColor = 'verde';
                break;
            default:
                break;
        }
        return sColor;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const salidaHab = async (itemId) => {
        try {
            const item = data.find(item => item.id === itemId);
            if (!item || !item.habitacion) {
                throw new Error("No se ha seleccionado una habitación");
            }
            Swal.fire({
                title: "¿Confirmar CheckIn?",
                text: "¡No podrás revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, finalizar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await actualizarDisponibilidadHabitacion(item.habitacion.codigo, true);
                    const updatedFormClient = {
                        ...item,
                        estado: 'FINALIZADO'
                    };
                    await setDoc(doc(db, "registro", itemId), updatedFormClient);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "¡Checkout Exitoso!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        } catch (error) {
            console.error("Error al realizar el checkout:", error);
            Swal.fire({
                title: "Error!",
                text: error.message || "Ocurrió un error al realizar el checkout",
                icon: "error"
            });
        }
    };
    
    useEffect(() => {
        getDatos();
        getData();
    }, []);

    return (
        <>
            <Container fluid className='contenedorDashboard'>
                <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={2} className='botones'>
                        <Grid item xs={12} sm={12} md={4}>
                            <Button variant="contained" className="buscardashboard1" onClick={abrirModal}>
                                REGISTRAR HUESPED
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Button variant="contained" className="buscardashboard2" onClick={handleNavigateDashboard}>
                                INFORMACION GENERAL
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Button variant="contained" className="buscardashboard3" onClick={handleNavigateAuditoria}>
                                AUDITORIA
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <div className="Scroll">
                        <table className="table table-light table-hover">
                            <thead>
                                <tr>
                                    <th className="t-encargados">#</th>
                                    <th style={{ textAlign: "center" }}>Habitación</th>
                                    <th style={{ textAlign: "center" }}>Usuario</th>
                                    <th style={{ textAlign: "center" }}>Estado</th>
                                    <th style={{ textAlign: "center" }}>Ingreso</th>
                                    <th style={{ textAlign: "center" }}>Salida</th>
                                    <th style={{ textAlign: "center" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                               { console.log(data.filter(item => item.estado === 'Ocupado'))}
                            {data.filter(item => item.estado === 'OCUPADO').map((item, i) => {
                                    const currentIndex = i + 1;
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: "center" }}>{currentIndex}</td>
                                            <td style={{ textAlign: "center" }}>{item.habitacion ? item.habitacion.codigo : ''}</td>
                                            <td style={{ textAlign: "center" }}>{item.usuario}</td>
                                            <td className={`center ${claseEstado(item.estado)}`}>{item.estado}</td>
                                            <td style={{ textAlign: "center" }}>{(new Date(item.Fingreso).toLocaleDateString('es', { day: "numeric", month: "short", year: "numeric", hour:'2-digit', minute:'2-digit' }))}</td>
                                            <td style={{ textAlign: "center" }}>{(new Date(item.Fsalida).toLocaleDateString('es', { day: "numeric", month: "short", year: "numeric", hour:'2-digit', minute:'2-digit' }))}</td>
                                            <td style={{ textAlign: "center" }}>
                                            <Button onClick={() => salidaHab(item.id)}>CHECK OUT</Button>


                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <TablePagination
                            component="div"
                            count={(data.filter(item => item.estado === 'OCUPADO')).length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[]}
                        />
                    </div>
                </Grid>
            </Container>
            <Modal isOpen={modalPrincipal} size="sm">
                <ModalHeader className="modal-titulo">
                    <Stack direction="row" alignItems={"center"} justifyContent={"space-between"} spacing={2}>
                        <strong>Registrar Huesped Zahir</strong>
                        <IconButton aria-label="delete" className="btn-clos" sx={{ color: '#1B365D', opacity: 0.8 }} onClick={cerrarModalPrincipal}>
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Stack>
                </ModalHeader>
                <ModalBody>
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                key={reset}
                                    label="Usuario"
                                    name="usuario"
                                    value={formClient.usuario}
                                    onChange={handleCode}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                key={reset}
                                    label="CI"
                                    name="ci"
                                    value={formClient.ci}
                                    onChange={handleCode}
                                    inputProps={{ maxLength: 13 }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker
                                            label="Fecha de ingreso"
                                            value={ingreso}
                                            onChange={handleIngreso}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker
                                            label="Fecha de salida"
                                            value={salida}
                                            onChange={handleSalida}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Autocomplete
                                key={reset}
                                    options={habitaciones.filter(habitacion => habitacion.disponible)}
                                    getOptionLabel={(option) => option.codigo.toString()}
                                    onChange={handleHabitacion}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar Habitación" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Button
                                    variant="contained"
                                    className="btn-registrar"
                                    onClick={handleClick}
                                >
                                    Registrar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </ModalBody>
            </Modal>


            <Modal isOpen={modalSucursal} size="sm">
                <ModalHeader className="modal-titulo">
                    <Stack direction="row" alignItems={"center"} justifyContent={"space-between"} spacing={2}>
                        <strong>Registrar Huesped Sucursal</strong>
                        <IconButton aria-label="delete" className="btn-clos" sx={{ color: '#1B365D', opacity: 0.8 }} onClick={cerrarModalSucursal}>
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Stack>
                </ModalHeader>
                <ModalBody>
                    <Grid item xs={12} sm={12} md={12}>
                        <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                key={reset}
                                    label="Usuario"
                                    name="usuario"
                                    value={formClient.usuario}
                                    onChange={handleCode}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <TextField
                                key={reset}
                                    label="CI"
                                    name="ci"
                                    value={formClient.ci}
                                    onChange={handleCode}
                                    inputProps={{ maxLength: 13 }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker
                                            label="Fecha de ingreso"
                                            value={ingreso}
                                            onChange={handleIngreso}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker
                                            label="Fecha de salida"
                                            value={salida}
                                            onChange={handleSalida}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Autocomplete
                                key={reset}
                                    options={habitacionesSucursal.filter(habitacion => habitacion.disponible)}
                                    getOptionLabel={(option) => option.codigo.toString()}
                                    onChange={handleHabitacion}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar Habitación" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Button
                                    variant="contained"
                                    className="btn-registrar"
                                    onClick={handleClickSucursal}
                                >
                                    Registrar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </ModalBody>
            </Modal>
        </>
    );
}
