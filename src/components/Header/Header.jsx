import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function Header() {
  return (
     <Row className='mb-3 mx-2'>
        <Col >
            <img src="/header.png" alt="ndvj" />
        </Col>
        <Col  lg="6" className="d-flex flex-column justify-content-center" style={{ textAlign: 'left' }}>
          <h3 style={{color:'#e3c0a4', fontSize:'40px'}}>Read Quran Everyday
Add Your Daily Routine</h3>
            <p style={{color:'black'}}>The quran is the central religious text of islam. Muslim's believe the Quran is the book of divine guidance and direction for mankind</p>
            <div className="d-flex ">

            <Button className='m-2' variant="secondary" href='/register'>Subscribe </Button>
            <Button className='m-2' variant="outline-secondary" href='/surahs'>Read Quran</Button>
            </div>
        </Col>
      </Row>
  );
}

export default Header;