import React from 'react';

import Navbar from './Navbar';
import ReviewSection from './ReviewSection';
import Footer from './Footer';
import HotDeals from './HotDeals';

import s from '../styles/Home.module.scss';

import { connect } from 'react-redux';

import { setPage } from '../redux/action';

import PizzaIcon from '../images/Pizza_icon_white.png';
import MoneyIcon from '../images/Money_icon.png';
import TruckIcon from '../images/truck_icon.png';
import ArrowDown from '../images/arrow-down.png';


export class Home extends React.Component{
    componentWillMount(){
        this.props.dispatch(setPage('Home'));
    }
    
    render(){
        return(
            <div>
                <Hero />
                <About />
                <HotDeals />
                <ReviewSection />
                <Footer />
                <Copyright />
            </div>
        )
    }
}

const Hero = () => {
    return(
        <section className={s.hero}>
            <div className={s.darken}>
                <Navbar />
                <p className={s.heroTitle}>Best Pizza in Town</p>
                <button className={s.heroButton}>View Menu</button>
                <img className={s.heroArrow} src={ArrowDown} alt="ArrowDown Icon"/>
            </div>
        </section>
    )
}

const About = () => {
    return(
        <section className={s.about}>
            <AboutTitle />
            <div className={s.flexContainer} >
                <Unit 
                img={PizzaIcon}
                title={'Great Pizza'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '}
                />
                <Unit 
                img={MoneyIcon}
                title={'Low Prices'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '}
                />
                <Unit 
                img={TruckIcon}
                title={'Fast Service'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '}
                />
            </div>
        </section>
    )
}

const AboutTitle = () => {
    return(
        <div>
            <h2 className={s.aboutTitle}>About Us</h2>
            <p className={s.aboutDesc} >Lorem ipsum dolor sit amet, consectetur</p> 
        </div>
    )
}

export const Unit = ({ img, title, desc }) => {
    return(
        <div className={s.AboutUnits}>
            <img className={s.aboutUnitImg} src={img} alt="Icon"/>
            <span className={s.aboutUnitTitle} >{title}</span>
            <p className={s.aboutUnitDesc}>{desc}</p>
        </div>
    )
}

const Copyright = () => {
    return(
        <div className={s.copyright}>
            <p className={s.copyrightText}>Copyright ©2019 All rights reserved</p>
        </div>
    )
}

export default connect()(Home);