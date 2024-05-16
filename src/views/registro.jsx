import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector} from 'react-redux';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import { v4 as uuidv4 } from 'uuid';
import { onSnapshot, setDoc, doc, updateDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase-config";




export default function Registro(){

  
  const navigate = useNavigate();



    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mostrarAlertaN, setMostrarAlertaN] = useState(false);
    const [habOcupadas,setHabOcupadas] = useState([]);

// TIEMPO PARA ALERTAS
  useEffect(() => {
    console.log(formClient)
    const timeout = setTimeout(() => {
      setMostrarAlerta(false);
      setMostrarAlertaN(false);
    },9000)

  })
  //DATOS DE CLIENTE
    const [formClient, setFormClient] = useState({
     id: uuidv4(),
        usuario:"",
        ci:"",
        habitacion:0,
        ingreso:0,
        salida:0
    });

//PASO A DASHBOARD
    const dashboard = () => {    
      navigate('/dashboard')
    };

//ALARMA REGISTRO CORRECTO
    const mostrarAlarmaPosi = () => {
      setMostrarAlerta(true)
      };
      
 //ALARMA HABITACION NO DISPONIBLE
      const mostrarAlarmaNegi = () =>{
        setMostrarAlertaN(true)
      };
//GUARDAR DATOS DE CLIENTE      
    const handleCode= (e) => {
      const{name,value} = e.target;           
      setFormClient ((prevFormClient)=> ({
        ...prevFormClient,
        [name]: value
      }));
             
    }
//COMPARACION HABITACIONES DISPONIBLES    
    const handleClick = async ()=>{
      for (let key in formClient) {
        console.log(`${key}:${formClient[key]}`)
        
      }
        if(!
          habOcupadas.includes(formClient.habitacion)){
            setHabOcupadas([...habOcupadas, formClient.habitacion]);
            mostrarAlarmaPosi();         
               await sendFirestore(formClient);    
            
          } else  {
            mostrarAlarmaNegi();
          }  
             
   
      } ;
      const sendFirestore = async (_orden) => {
        try {
          console.log(_orden);
          await setDoc(doc(db, "registro", _orden.id), _orden);
          console.log("orden enviada o registro luego va una alerta aqui");
        } catch (e) {
          console.error("Error adding document: ", e);
          console.log("error");
        }
      };
    
      
    return(
<>
<Stack  spacing={2}>
      <Alert variant="filled" severity="success" sx={{ display: mostrarAlerta ? 'block':'none'}}>Registro Exitoso</Alert>
      <Alert variant="filled" severity="warning" sx={{ display: mostrarAlertaN ? 'block':'none'}}>Habitación Ocupada. Por favor , seleccione otra habitación.</Alert>
    </Stack>

      <Container fluid className="container-grid">
        <div className="container-supplier">
          <Grid container >          
        
              <div className="text-register">
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography component="div" variant="h7" className="title-register" style={{ textAlign: "center" }} >
                      REGISTRO DE HUÉSPEDES
                    </Typography>
                  </Grid>
                 
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography component="div" variant="h7" className="title-item" style={{ textAlign: "left" }}   >
                      Nombre
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField className="inputregistro" inputProps={{ style: { textTransform: "uppercase" } }} required name='usuario' onChange = {handleCode} fullWidth label="Nombre del Huésped" type="text" />
                  </Grid>
                  
                  
             
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography component="div" variant="h7" className="title-item" style={{ textAlign: "left" }}>
                      Identificación
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField className="inputregistro" required name='ci' fullWidth label="CI/RUC" onChange = {handleCode} type="text" />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                  <Typography component="div" variant="h7" className="title-item" style={{ textAlign: "left" }}>
                      Habitación Asignada
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField className="inputregistro" required name='habitacion' fullWidth label="Número de Habitación" onChange = {handleCode} type="number" />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                  <Typography component="div" variant="h7" className="title-item" style={{ textAlign: "left" }}>
                      Ingreso
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField className="inputregistro" required name='ingreso' fullWidth label="Fecha y Hora" onChange = {handleCode} type="number" />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                  <Typography component="div" variant="h7" className="title-item" style={{ textAlign: "left" }}>
                      Salida
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField className="inputregistro" required name='salida' fullWidth label="Fecha y Hora" onChange = {handleCode} type="number" />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>

                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <Button onClick= {handleClick} variant="contained" className="register">
                        Registrar Huésped
                      </Button>
                      <Button onClick={dashboard}variant="contained" className="register">
                        Datos Registrados
                      </Button>
                      <Button variant="contained" className="register">
                        Información General
                      </Button>
                      
                    </Stack>
                  </Grid>
                  </Grid>
                  </div>
                </Grid>
               </div>
               </Container>
               </>   
  );
}
