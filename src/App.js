import './App.css';
import SideBar from './components/sidebar/sidebar';
import TransferFunction from './components/transferfunction/transferfunction';
import Graph from './components/graph/graph';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { emulateKey } from 'emulate-key-in-browser';
import GeneratePDF from './components/file/file';

function App() {
  const [kp, setKp] = useState(1.0);
  const [ki, setKi] = useState(0.5);
  const [kd, setKd] = useState(0.2);

  const [step_x, set_step_x] = useState([0, 0, 0]);
  const [step_y, set_step_y] = useState([0, 0, 0]);

  const [bode_x, set_bode_x] = useState([0, 0, 0]);
  const [bode_mag, set_bode_mag] = useState([0, 0, 0]);
  const [bode_phase, set_bode_phase] = useState([0, 0, 0]);

  const [root_x, set_root_x] = useState([]);
  const [root_y, set_root_y] = useState([]);

  const [symbols, set_symbols] = useState([]);

  const [func1_num, set_func1_num] = useState();
  const [func1_den, set_func1_den] = useState();
  const [func2_num, set_func2_num] = useState();
  const [func2_den, set_func2_den] = useState();

  const [plot_radius, set_plot_radius] = useState(false);

  function simulateKeyInput(key) {
    if (key === "A") {
      emulateKey.shiftTab();
    } else if (key === "B") {
      emulateKey.tab();
    } else if (key === "C") {
      emulateKey.backspace();
    } else if (key === "D") {
      emulateKey.delete();
    } else if (key === "#") {
      emulateKey.writeText('.');
    } else if (key === "*") {
      emulateKey.writeText('.');
    } else if ("0123456789".includes(key)) {
      emulateKey.writeText(key);
    } else {
      console.log('unexpected entry');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/leituras');
        setKp(response.data.P[0]);
        setKi(response.data.P[1]);
        setKd(response.data.P[2]);

        let key = response.data.T;
        if (typeof(key) === 'string'){
          simulateKeyInput(key);
        }
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
      }
    };

    const intervalId = setInterval(fetchData, 100);
    return () => clearInterval(intervalId);
  }, []);

  // Styles for visibility
  const circleStyle = plot_radius ? {} : { display: 'none' };
  const nonCircleStyle = plot_radius ? { display: 'none' } : {};

  return (
    <div className="App">
      <SideBar 
        kp={kp} 
        ki={ki} 
        kd={kd} 
        set_step_x={set_step_x} 
        set_step_y={set_step_y} 
        set_bode_x={set_bode_x} 
        set_bode_mag={set_bode_mag} 
        set_bode_phase={set_bode_phase} 
        set_func1_num={set_func1_num} 
        set_func1_den={set_func1_den} 
        set_func2_num={set_func2_num} 
        set_func2_den={set_func2_den} 
        set_root_x={set_root_x} 
        set_root_y={set_root_y} 
        set_symbols={set_symbols} 
        set_plot_radius={set_plot_radius} 
      />
      <div className='workspace'>
        <div className='transferfunctions'>
          <TransferFunction 
            title='Função de transferência do sistema original' 
            num={func2_num} 
            den={func2_den} 
            bg="#2191ED"
          />
          <TransferFunction 
            title='Função de transferência controlada em malha fechada' 
            num={func1_num} 
            den={func1_den} 
            bg="#ED9C21"
          />
        </div>
        <div className='graphs'>
          <Graph 
            className="highgraph"
            title="Resposta ao degrau"
            xAxisLabel="Tempo (s)"
            yAxisLabel="Amplitude"
            lineColor='rgba(255,0,0,1)'
            xData={step_x}
            yData={step_y}
          />
          <div style={circleStyle}>
            <Graph 
              className="highgraph"
              title="Lugar das raízes"
              xAxisLabel="Real"
              yAxisLabel="Imaginário"
              lineColor='rgba(255,0,0,0)'
              pointRadius={2}
              xData={root_x}
              yData={root_y}
              radius={true}
              printLine={false}
              scale={false}
              pointLabels={symbols}
            />
          </div>
          <div style={nonCircleStyle}>
            <Graph 
              className="highgraph"
              title="Lugar das raízes"
              xAxisLabel="Real"
              yAxisLabel="Imaginário"
              lineColor='rgba(255,0,0,0)'
              pointRadius={2}
              xData={root_x}
              yData={root_y}
              radius={false}
              printLine={false}
              scale={false}
              pointLabels={symbols}
            />
          </div>
          <div className='bode'>
            <Graph 
              className="graph"
              title="Diagrama de Bode"
              xAxisLabel=""
              yAxisLabel="Magnitude (dB)"
              lineColor='rgba(0,0,255,1)'
              xData={bode_x}
              yData={bode_mag}
            />
            <Graph 
              className="graph"
              title=""
              xAxisLabel="Frequência (rad/s)"
              yAxisLabel="Fase (deg)"
              lineColor='rgba(0,0,255,1)'
              xData={bode_x}
              yData={bode_phase}
            />
          </div>
        </div>
        <GeneratePDF/>
      </div>
    </div>
  );
}

export default App;
