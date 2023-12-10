
import { getUser, resetUserSession } from '../../service/AuthService';
import { useState, useEffect, Fragment } from "react";
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { createPortal } from "react-dom";
import { Accordion } from "react-bootstrap";
import AudioPlayer from "react-h5-audio-player";
import ProgressBar from 'react-bootstrap/ProgressBar';


import Modal from "../../components/Modal/Modal";

const versesApi = 'https://4kk1d643zc.execute-api.us-east-1.amazonaws.com/prod/verses';
const verseApi = 'https://4kk1d643zc.execute-api.us-east-1.amazonaws.com/prod/verse';
function Profile() {
    const user = getUser();
    const [verses, setVerses] = useState([]);
    const [verse , setVerse] = useState([]);
    const [show, setShow] = useState(false);
    const [audio, setAudio] = useState("");
    const [size , setSize] = useState(0);
    const handleShow = async (Surah , Ayat, SurahNum) => {
      const requestConfig = {
        headers: {
          'x-api-key': 'fdh7do8qpa9z2q8ZOxYd05qPDWnHeoN82nbzc7Nu'
        },
        params: {
          Surah: encodeURIComponent(Surah),
          Ayat: parseInt(Ayat)
        }
      }
      axios.get(`https://4kk1d643zc.execute-api.us-east-1.amazonaws.com/prod/verse?Name=${Surah}&Ayat=${Ayat}`, requestConfig).then(response => {
        setVerse(response.data);
        console.log(response.data);
      } ).catch(error => { 
        console.log(error);

      })
      const ayat = await  fetch(
        `https://api.alquran.cloud/v1/ayah/${SurahNum}:${Ayat}/ar.alafasy`,
        {
          method: "GET",
        }
      );
      const result = await ayat.json();
      const audio = result.data.audioSecondary[0];
      setAudio(audio);

      setShow(true);
    
    }
    useEffect(() => {
      const requestConfig = {
        headers: {
          'x-api-key': 'fdh7do8qpa9z2q8ZOxYd05qPDWnHeoN82nbzc7Nu'
        }
      }
      axios.get(versesApi, requestConfig).then(response => {
        setVerses(response.data);
        setSize(response.data.length);
        console.log(response.data);
      } ).catch(error => {
        console.log(error);
      })
    }, []);

  

 
  return (
    <Fragment>
     <Card className='d-flex justify-content-center align-items-center '>
     <Card.Title>Profile</Card.Title>
      <Card.Body>Email : {user?.email} </Card.Body>
    </Card>
    <h3 style={{color:'#e3c0a4', fontSize:'32px'}} className="text-center ">Your progress in daily reading </h3>
    <ProgressBar variant="warning" now={(size/6237)*100} label={(size/6237) } className='m-4 d-flex justify-content-end' />
    <Table  responsive striped bordered hover>
      <thead>
        <tr className='text-center'>
          <th></th>
          <th>Ayat</th>
          <th>Aya Number</th>
          <th>Surah Number</th>
          <th>Surah Name </th>
        </tr>
      </thead>
      <tbody>
        {verses.map((item) => (
          <tr key={item.id}>
            <td><Button variant="secondary" onClick={() => handleShow(item.Name , item.Ayat , item.Surah)} size="sm">Action </Button></td>
            <td>{item.Arabic}</td>
            <td>{item.Ayat}</td>
            <td>{item.Surah}</td>
            <td>{item.Name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    {createPortal(
        <Modal show={show} setShow={setShow}>
          <Accordion style={{ width: "100%" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Listen to the verse - الإستماع الى الأية &nbsp;</Accordion.Header>
              <Accordion.Body>
                <AudioPlayer
                muted={true}
                  autoPlay={false}
                  showSkipControls={false}
                  showJumpControls={false}
                  showFilledVolume={false}
                  showFilledProgress={false}
                  src={audio}
                  onPlay={(e) => console.log("onPlay")}
                  // other props here
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>View explanation - عرض التفسير &nbsp;</Accordion.Header>
              <Accordion.Body>
                <p className="text-start">tafseer 1 : {verse.Tafaseer1}</p>
                <div ></div>
                <p className="text-start">tafseer 2 : {verse.Tafaseer2}</p>
               
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                عرض الترجمة - Translation &nbsp;
              </Accordion.Header>
              <Accordion.Body dir="ltr">
                <p className="text-start">
                Translation 1 : {verse.Translation1}
                </p>
                <p className="text-start">Translation 2 :{verse.Translation2}</p>
                <p className="text-start">Translation 3 :{verse.Translation3}</p>
                </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal>,
        document.getElementById("modal-root")
      )}
    </Fragment>
  );
}
export default Profile;