import React from 'react';
import Navbar from './Navbar';
import s from '../styles/Home.module.scss';

import { connect } from 'react-redux';

import { setPage } from '../redux/action';

import PizzaIcon from '../images/Pizza_icon_white.png';

class Home extends React.Component{
    componentWillMount(){
        this.props.dispatch(setPage('Home'));
    }
    
    render(){
        return(
            <div>
                <Hero />
                <About />
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
            </div>
        </section>
    )
}

const About = () => {
    return(
        <section className={s.about}>
            <h2 className={s.aboutTitle}>About Us</h2>
            <p className={s.aboutDesc} >Lorem ipsum dolor sit amet, consectetur</p>
            <div className={s.flexContainer} >
                <div className={s.AboutUnits}>
                    <img className={s.aboutUnitImg} src={PizzaIcon} alt="Pizza Icon"/>
                    <span className={s.aboutUnitTitle} >Great Pizza</span>
                    <p className={s.aboutUnitDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                </div>
                <div className={s.AboutUnits}>
                    <img className={s.aboutUnitImg} src={PizzaIcon} alt="Pizza Icon"/>
                    <span className={s.aboutUnitTitle}>Great Pizza</span>
                    <p className={s.aboutUnitDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                </div>
                <div className={s.AboutUnits}>
                    <img className={s.aboutUnitImg} src={PizzaIcon} alt="Pizza Icon"/>
                    <span className={s.aboutUnitTitle}>Great Pizza</span>
                    <p className={s.aboutUnitDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                </div>
            </div>
        </section>
    )
}

Home = connect()(Home);
export default Home;