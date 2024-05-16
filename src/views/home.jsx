import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Container } from "reactstrap";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TextField from "@mui/material/TextField";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import '../css/Home.css';
import FotoEdif from '../assets/edificios.jpeg';
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();
    const checkin = () => {    
        navigate('/registro')
      };
    const datos = () => {    
        navigate('/dashboard')
      };

      const [habitacionesPrincipal, setHabitacionesPrincipal] = useState("");
      const [habitacionesSucursal, setHabitacionesSucursal] = useState("");
    
      const handleHabitaciones = (e) => {
        setHabitacionesPrincipal(e.target.value);
      };
    
      
    
      const crearHabitaciones = async () => {
        const unidades = parseInt(habitacionesPrincipal);
        if (isNaN(unidades) || unidades <= 0) {
          console.error("Ingrese un número válido de habitaciones.");
          return;
        }
    
        const habitaciones = Array.from({ length: unidades }, (_, i) => ({
          codigo: i + 1,
          disponible: true,
        }));
    
        await sendFirestore(habitaciones);
      };
    
      const sendFirestore = async (habitaciones) => {
        try {
          await setDoc(doc(db, "informacion", "principal"), {
            habitaciones: habitaciones,
          });
          console.log("Document successfully written!");
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      };
    
      const handleHabitacionesSucursal = (e) => {
        setHabitacionesSucursal(e.target.value);
      };
    
      const crearHabitacionesSucursal = async () => {
        const unidades = parseInt(habitacionesSucursal);
        if (isNaN(unidades) || unidades <= 0) {
          console.error("Ingrese un número válido de habitaciones.");
          return;
        }
    
        const habitaciones = Array.from({ length: unidades }, (_, i) => ({
          codigo: i + 1,
          disponible: true,
        }));
    
        await sendFirestoreSucursal(habitaciones);
      };
    
      const sendFirestoreSucursal = async (habitaciones) => {
        try {
          await setDoc(doc(db, "informacion", "sucursal"), {
            habitaciones: habitaciones,
          });
          console.log("Document successfully written!");
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      };
      
    return (
        <>
             <Container className="container-home" fluid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={7}>
                         <div className="container-imageHome">
                            <img className="image-home" src={FotoEdif} alt="" />
                        </div> 
                    </Grid>
                    <Grid item xs={12} sm={12} md={5}>
                        <div className="container-rightHome">
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography component="div" className="title-home" style={{ textAlign: "center" }}>
                                        Bienvenidos a la APP HOTELES
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography component="div" className="textoInicio" style={{ textAlign: "center" }}>
                                        Plataforma para el manejo y control hotelero.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                        <Button variant="outlined" onClick = {checkin} className="video" startIcon={<PlayArrowIcon fontSize="large" />}>
                                            CHECK IN
                                        </Button>
                                        <Button variant="contained" onClick = {datos} className="button-disystem" >
                                            DASHBOARD
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Cantidad Habitaciones"
                  name="cantidad"
                  onChange={handleHabitaciones}
                  fullWidth
                />
              </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                <Button variant="contained" className="button-disystem" onClick={crearHabitaciones}>
                  CREAR HABITACIONES
                </Button>
              </Grid>


              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  label="Cantidad Habitaciones Sucursal"
                  name="habitaciones"
                  onChange={handleHabitacionesSucursal}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button variant="contained" className="button-disystem" onClick={crearHabitacionesSucursal}>
                  CREAR HABITACIONES SUCURSAL
                </Button>
              </Grid>
                               
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Container>
                </>
    );
};