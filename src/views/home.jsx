import Grid from "@mui/material/Grid";
import { Container } from "reactstrap";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import '../css/Home.css'
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
                                    {/* <div className="cards-Home">
                                       <MyCard libres={1} ocupadas={1} />
                                    </div> */}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Container>
                </>
    );
};