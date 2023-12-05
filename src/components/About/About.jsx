import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function About() {
  return (
     <Row className='mt-2 mx-2' style={{ border:'1px', borderColor:'rgba(250,225,206,0.3218079468115371)'}}>
       
        <Col  lg="6" className="d-flex flex-column justify-content-center" style={{ textAlign: 'left' }}>
          <h3 style={{color:'#e3c0a4', fontSize:'40px'}}>About Quran</h3>
            <p style={{color:'black'}}>The Nobel Quran is the central religious text of Islam. Muslims believe the Quran is the book of Divine guidance and direction for mankind, and consider the original Arabic text the final revelation of Allah.
</p>
            <p style={{color:'black'}}>
All translations of the original Arabic text are thus interpretations of the original neamings and should be embraced as such.</p>
        </Col>
        <Col >
            <img src="/about2.png" alt="ndvj" />
        </Col>
      </Row>
  );
}

export default About;