import React ,{useEffect, useState} from 'react'
import axios from 'axios'
import { Page, Text, Document, StyleSheet , Font  } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';

export const Interfaz = () => {

    let texto = "";

    const styles = StyleSheet.create({

        tamano:{
            width: 800,
            height: 500
        },  
        body: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
          },
          title: {
            fontSize: 24,
            textAlign: 'center',
            fontFamily: 'Oswald'
          },
          text: {
            margin: 12,
            fontSize: 14,
            textAlign: 'justify',
            fontFamily: 'Times-Roman'
          },
          image: {
            marginVertical: 15,
            marginHorizontal: 100,
          },
          pageNumber: {
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
          }
      });

      Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
      });
      

    const [listProveedores, setlistProveedores] = useState([]);
    const [Proveedores, setProveedores] = useState([]); 
    const [nota, setnota] = useState(0);
    const [text, settext] = useState("");
    
    useEffect(() => {
        updateProviders();
        
    },[])

    const updateProviders = () => {
        cargarCombos().then((newProvider)=>{
            setlistProveedores(newProvider);
        }).catch((error)=>{
            alert('Este proveedor no tiene aun alguna evaluación');
            console.log(error);
        })
    }

    const cargarCombos = async () => {

        const data = await fetch('http://localhost:4000/api/proveedores/');
        const pr = await data.json();
        return(pr.docs);
    }

    const handledChange  =(e)=>{
        setProveedores(e.target.value);
    }

    const consultarEvaluacion = ()=>{

        axios({
            method: 'post',
            url: 'http://localhost:4000/api/evaluaciones/acumuladototal',
            data: {"proveedor": Proveedores}
          }).then(function (response) {
              setnota(parseFloat(response.data.promedio));
              completarPdf(nota);
          })
          .catch(function (error) {
            console.log(error)
          });

    }

        const completarPdf = (nota) => {

            let evaluar = nota;
            console.log(evaluar)

            if(evaluar => 4){
                texto = "cumpliendo satisfactoriamente, con sus compromisos  y servicios prestados a " +
                " nuestra empresa, Lo invitamos a seguir cumpliendo su excelente trabajo y en nombre de TECHEDGE COLOMBIA" +
                " reconocemos su excelente  labor, le informamos que según nuestras metricas internas su evaluacion es de: "
                settext(texto)
            }else{
                 texto = "El motivo del comunicado tiene la finalidad de informar que la prestación del servicio o producto  " +
                " puede mejorar, Lo invitamos a seguir mejorando para lograr realizar un excelente trabajo y en nombre de TECHEDGE COLOMBIA" +
                " lo invitamos a ello, le informamos que según nuestras metricas internas su evaluacion es de: "
                settext(texto)
            }

        }    


      const MyDocument = () => (

        <Document>
          <Page style={styles.body}>
                <Text style={styles.title}> NOTIFICACION DESEMPEÑO </Text>
                <Text style={styles.text}> TECHEDGE COLOMBIA S.A.S con nit 830088697-2. Certifica que la organización {Proveedores} mantiene relaciones comerciales con nuestra organización como proveedor, 
                {text}{nota} 
                </Text>

                <Text style={styles.text}> 
                    Se expide la presente certificación en Bogotá, con destino a {Proveedores},
                </Text>
                
                <Text style={styles.pageNumber}>
                Atentamente, 
                Talento Humano
                </Text>

          </Page>
        </Document>
      );

    return (
        <div>
            <p> Escoger proveedor para generar el PDF: </p>
            <select value={Proveedores} onChange={handledChange}> 
                {
                    listProveedores.map(({nombre , _id})=>{
                       return (
                        <option key={_id} value={nombre}> {nombre} </option>
                       );   
                    })
                }
            </select>

            <button onClick={consultarEvaluacion} >
                Generar PDF
            </button> <br/>


            <PDFViewer style={styles.tamano}>
                <MyDocument />
            </PDFViewer>

            

        </div>
    )
}
