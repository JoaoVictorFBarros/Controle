import React, { useState, useEffect, useRef } from 'react';
import './sidebar.css';
import logo from '../../assets/images/logo.svg';
import { opensubmenu, opensubsubmenu, restartmenu } from './managementfunctions';

function SideBar(props) {
    const [discrete, setDiscrete] = useState(false);
    const [sampling, setSampling] = useState(0.1);
    const [gain, setGain] = useState(1);
    const [tau, setTau] = useState(1);
    const [controlType, setControlType] = useState('P');
    
    const gainRef = useRef(null);
    const tauRef = useRef(null);
    const samplingRef = useRef(null);

    const sendRequest = () => {
        fetch('http://localhost:5011/graficos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                K: parseFloat(gain),
                tau: parseFloat(tau),
                T: discrete ? parseFloat(sampling) : null,
                Kp: parseFloat(props.kp),
                Ki: parseFloat(props.ki),
                Kd: parseFloat(props.kd),
                type: controlType
            }),
        })
        .then(response => response.json())
        .then(data => {
            props.set_step_x(data.step_response.time);
            props.set_step_y(data.step_response.response);
            props.set_bode_x(data.bode.frequency);
            props.set_bode_mag(data.bode.magnitude);
            props.set_bode_phase(data.bode.phase);
            props.set_func1_num(data.closed.num);
            props.set_func1_den(data.closed.den);
            props.set_func2_num(data.system.num);
            props.set_func2_den(data.system.den);
            
            let root_x = [];
            let root_y = [];
            let symbols = [];

            data.root_locus.poles.forEach(pole => {
                let x = pole[0];
                let y = pole.length === 1 ? 0 : pole[1];
                root_x.push(x);
                root_y.push(y);
                symbols.push('X');
            });

            data.root_locus.zeros.forEach(zero => {
                let x = zero[0];
                let y = zero.length === 1 ? 0 : zero[1];
                root_x.push(x);
                root_y.push(y);
                symbols.push('O');
            });

            props.set_root_x(root_x);
            props.set_root_y(root_y);
            props.set_symbols(symbols);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };

    useEffect(() => {
        sendRequest();
        // eslint-disable-next-line
    }, [gain, tau, sampling, controlType, discrete, props.kp, props.ki, props.kd]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newGain = parseFloat(gainRef.current.value) || 0;
            const newTau = parseFloat(tauRef.current.value) || 0;
            const newSampling = parseFloat(samplingRef.current.value) || 0;

            setGain(newGain);
            setTau(newTau);
            setSampling(newSampling);

        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (e, setValue) => {
        const value = e.target.value;
        const numberValue = parseFloat(value);
        setValue(isNaN(numberValue) ? 0 : numberValue);
    };

    const handleControlTypeChange = (type) => {
        setControlType(type);
    };

    const handleKeyDown = (event, openFunction, submenuId, id) => {
        if (event.key === 'Delete') {
            openFunction(submenuId, id);
        }
    };

    return (
        <div className='sidebar'>
            <img
                src={logo}
                className='logo'
                alt='logo'
                onClick={() => { restartmenu('activesidebaroption', 'sidebaroption'); }}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, restartmenu, 'activesidebaroption', 'sidebaroption')}
            />
            <div className='sidebaroptions'>
                <div
                    className='sidebaroption'
                    id='analysis'
                    onClick={() => { opensubmenu('analysissubmenu', 'analysis'); }}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, opensubmenu, 'analysissubmenu', 'analysis')}
                >
                    Análise
                    <div
                        className={`sidebaroptionsubtitle analysissubmenu ${discrete ? '' : 'activesidebaroptionsubtitle'}`}
                        id='continuous'
                        onClick={() => { opensubsubmenu('', 'continuous'); setDiscrete(false); props.set_plot_radius(false); }}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Delete') { opensubsubmenu('', 'continuous'); setDiscrete(false); props.set_plot_radius(false); } else handleKeyDown(e, opensubsubmenu, '', 'continuous'); }}
                    >
                        Contínua
                    </div>
                    <div
                        className={`sidebaroptionsubtitle analysissubmenu ${discrete ? 'activesidebaroptionsubtitle' : ''}`}
                        id='discrete'
                        onClick={() => { opensubsubmenu('discretesidebarparameter', 'discrete'); setDiscrete(true); props.set_plot_radius(true); }}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Delete') { opensubsubmenu('discretesidebarparameter', 'discrete'); setDiscrete(true); props.set_plot_radius(true); } else handleKeyDown(e, opensubsubmenu, 'discretesidebarparameter', 'discrete'); }}
                    >
                        Discreta
                        <div className='sidebarparameter discretesidebarparameter'>
                            Amostragem:
                            <input
                                type='text'
                                defaultValue={sampling}
                                onChange={(e) => handleInputChange(e, setSampling)}
                                className='sidebarinput'
                                tabIndex={0}
                                ref={samplingRef}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className='sidebaroption'
                    id='transfer'
                    onClick={() => { opensubmenu('transfersubmenu', 'transfer'); }}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, opensubmenu, 'transfersubmenu', 'transfer')}
                >
                    Função de transferência
                    <div
                        className='sidebaroptionsubtitle transfersubmenu'
                        id='firstorder'
                        onClick={() => { opensubsubmenu('firstordersidebarparameter', 'firstorder'); }}
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, opensubsubmenu, 'firstordersidebarparameter', 'firstorder')}
                    >
                        Primeira Ordem
                        <div className='sidebarparameter firstordersidebarparameter'>
                            Ganho:
                            <input
                                type='text'
                                defaultValue={gain}
                                onChange={(e) => handleInputChange(e, setGain)}
                                className='sidebarinput'
                                tabIndex={0}
                                ref={gainRef}
                            />
                        </div>
                        <div className='sidebarparameter firstordersidebarparameter'>
                            Tau:
                            <input
                                type='text'
                                defaultValue={tau}
                                onChange={(e) => handleInputChange(e, setTau)}
                                className='sidebarinput'
                                tabIndex={0}
                                ref={tauRef}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className='sidebaroption'
                    id='control'
                    onClick={() => { opensubmenu('controlsubmenu', 'control'); }}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, opensubmenu, 'controlsubmenu', 'control')}
                >
                    Controladores
                    <div className='sidebarparameter controlsubmenu'>
                        Kp:
                        <input
                            type='number'
                            value={props.kp}
                            readOnly
                            className='sidebarinput'
                            tabIndex={-1}
                        />
                    </div>
                    <div className='sidebarparameter controlsubmenu'>
                        Ki:
                        <input
                            type='number'
                            value={props.ki}
                            readOnly
                            className='sidebarinput'
                            tabIndex={-1}
                        />
                    </div>
                    <div className='sidebarparameter controlsubmenu'>
                        Kd:
                        <input
                            type='number'
                            value={props.kd}
                            readOnly
                            className='sidebarinput'
                            tabIndex={-1}
                        />
                    </div>
                    <div
                        className={`sidebaroptionsubtitle controlsubmenu ${controlType === 'P' ? 'activesidebaroptionsubtitle' : ''}`}
                        id='p'
                        onClick={() => { handleControlTypeChange('P'); }}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Delete') { handleControlTypeChange('P'); } else handleKeyDown(e, opensubsubmenu, '', 'p'); }}
                    >
                        Proporcional
                    </div>
                    <div
                        className={`sidebaroptionsubtitle controlsubmenu ${controlType === 'PI' ? 'activesidebaroptionsubtitle' : ''}`}
                        id='pi'
                        onClick={() => { handleControlTypeChange('PI'); }}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Delete') { handleControlTypeChange('PI'); } else handleKeyDown(e, opensubsubmenu, '', 'pi'); }}
                    >
                        Proporcional-Integral
                    </div>
                    <div
                        className={`sidebaroptionsubtitle controlsubmenu ${controlType === 'PD' ? 'activesidebaroptionsubtitle' : ''}`}
                        id='pd'
                        onClick={() => { handleControlTypeChange('PD'); }}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Delete') { handleControlTypeChange('PD'); } else handleKeyDown(e, opensubsubmenu, '', 'pd'); }}
                    >
                        Proporcional-Derivativo
                    </div>
                    <div
                        className={`sidebaroptionsubtitle controlsubmenu ${controlType === 'PID' ? 'activesidebaroptionsubtitle' : ''}`}
                        id='pid'
                        onClick={() => { handleControlTypeChange('PID'); }}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Delete') { handleControlTypeChange('PID'); } else handleKeyDown(e, opensubsubmenu, '', 'pid'); }}
                    >
                        Proporcional-Integral-Derivativo
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
