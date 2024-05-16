import { Avatar, Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import HandymanIcon from '@mui/icons-material/Handyman';
import { lightBlue, blue, cyan } from '@mui/material/colors';
import GraficaDona from "../components/GraficoDona";
import '../css/Hojavida.css';
import '../css/TextView.css';
import TarjetaGestionar from "../components/TarjetaGestionar";
import { useEffect, useState } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export default function HojaVidaView() {
    const [habitaciones, setHabitaciones] = useState(0);
    const [disponibles, setDisponibles] = useState(0);
    const [desocupadas, setDesocupadas] = useState(0);
    const [data, setData] = useState([]);
    const [datasucur, setDatasucur] = useState([]);
    const [global, setGlobal] = useState([]);

    const getData = () => {
        onSnapshot(doc(db, "informacion", "principal"), (doc) => {
            const habitacionesData = doc.data().habitaciones;
            setHabitaciones(habitacionesData.length);
            setDisponibles(habitacionesData.filter(item => item.disponible === true).length);
            setDesocupadas(habitacionesData.filter(item => item.disponible === false).length);
        });
        console.log("esto se lee",habitaciones)
    };

    const getDatos = () => {
        const registroRef = collection(db, "registro");
        onSnapshot(registroRef, (snapshot) => {
            const registros = snapshot.docs.map(doc => doc.data());
            setData(registros);
        });

        const registroSucur = collection(db, "registroSucursal");
        onSnapshot(registroSucur, (snapshot) => {
            const registrosucur = snapshot.docs.map(doc => doc.data());
            setDatasucur(registrosucur);
        });
    };

    useEffect(() => {
        getData();
        getDatos();
    }, []);

    useEffect(() => {
        const ordenesUnidas = [...data, ...datasucur];
        setGlobal(ordenesUnidas);
        console.log(ordenesUnidas);
    }, [data, datasucur]);

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

    return (
        <>
            <div className="container-test-2">
                <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={12} sm={6} md={3.5}>
                        <Grid container spacing={{ xs: 3, md: 3 }}>
                            <Grid item xs={12} sm={6} md={12}>
                                <div className="card12" style={{ height: "100%" }} >
                                    <div className="header-tarjeta-8">
                                        <h5 className="titui-ges">Información Hotel</h5>
                                        <Avatar sx={{ bgcolor: lightBlue[100] }} >
                                            <WorkHistoryIcon />
                                        </Avatar>
                                        </div>
                                    <div className="card-body-info small">
                                        <div className="borde-codigo">Zahir Wyndham Hotel</div>
                                        <h1 className="informacion"><b>Dirección:</b> Av. del Estadio y Florencia Astudillo</h1>
                                        <h1 className="informacion"><b>Número de habitaciones:</b> {habitaciones}</h1>
                                        <h1 className="informacion"><b>Categoría:</b> 4 Estrellas</h1>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <div className="card12" >
                                    <div className="card-body12 small ">
                                        <GraficaDona labels={["Disponibles", "Ocupadas"]} info={[disponibles, desocupadas]} />
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={8.5}>
                        <Grid container spacing={{ xs: 3 }} >
                            <Grid item xs={6} sm={6} md={5}>
                                <TarjetaGestionar
                                    icon={<WorkHistoryIcon />}
                                    headerColor={"#ffff"}
                                    avatarColor={cyan[700]}
                                    title={'Disponibles'}
                                    value={disponibles}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={5}>
                                <TarjetaGestionar
                                    icon={<WorkHistoryIcon />}
                                    headerColor={"#ffff"}
                                    avatarColor={cyan[700]}
                                    title={'Ocupadas'}
                                    value={desocupadas}
                                />
                            </Grid>
                           
                        </Grid>

                        <div className="card-tabla-hv"  >
                            <div className="header-ev">
                                <h5 className="titulo-ev">Hoja de Vida</h5>
                                <Avatar sx={{ bgcolor: blue[700] }} >
                                    <HandymanIcon />
                                </Avatar>
                            </div>
                            <div className="card-tabla-hojav" style={{ overflow: "scroll", height: "535px", }}>
                                <div >
                                    <table className='table table-light table-hover'>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th style={{ textAlign: "center" }}>Hotel</th>
                                                <th style={{ textAlign: "center" }}>Habitación</th>
                                                <th style={{ textAlign: "center" }}>Estado</th>
                                                <th style={{ textAlign: "center" }}>Fecha Ingreso</th>
                                                <th style={{ textAlign: "center" }}>Fecha Salida</th>
                                                <th style={{ textAlign: "center" }}>Cliente</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {global.map((item, i) => {
                                                const currentIndex = i + 1;
                                                return (
                                                    <tr key={currentIndex}>
                                                        <td style={{ textAlign: "center" }}>{currentIndex}</td>
                                                        <td style={{ textAlign: "center" }}>{item.hotel}</td>
                                                        <td style={{ textAlign: "center" }}>{item.habitacion ? item.habitacion.codigo : ''}</td>
                                                        <td className={`center ${claseEstado(item.estado)}`}>{item.estado}</td>
                                                        <td style={{ textAlign: "center" }}>{(new Date(item.Fingreso).toLocaleDateString('es', { day: "numeric", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' }))}</td>
                                                        <td style={{ textAlign: "center" }}>{(new Date(item.Fsalida).toLocaleDateString('es', { day: "numeric", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' }))}</td>
                                                        <td style={{ textAlign: "center" }}>{item.usuario}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div style={{ height: 40 }}>
            </div>
        </>
    );
}