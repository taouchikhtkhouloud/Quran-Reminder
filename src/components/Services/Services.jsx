import React from 'react';
import './Service.css'
const Services = () => {
  return (
    <section className='section-service'>
      <h3 className='service-title'>Our Services</h3>
      <div className="services-grid">
        <div className="service service1">
          <i className="ti-bar-chart"></i>
          <h4>Interactive Quranic Study</h4>
          <p>Explore the Quran with Tafseer and Translation</p>
          <a href="#" className="cta">Read More <span className="ti-angle-right"></span></a>
        </div>

        <div className="service service2">
          <i className="ti-light-bulb"></i>
          <h4>Personalized Learning Experience</h4>
          <p>Receive a Verse to Your Email for Continuous Quranic Progress.</p>
          <a href="#" className="cta">Read More <span className="ti-angle-right"></span></a>
        </div>

        <div className="service service3">
          <i className="ti-money"></i>
          <h4>Knowledge Assessment</h4>
          <p>Engage in Quranic Quizzes to Strengthen Your Understanding.</p>
          <a href="#" className="cta">Read more <span className="ti-angle-right"></span></a>
        </div>
      </div>
    </section>
  );
};

export default Services;