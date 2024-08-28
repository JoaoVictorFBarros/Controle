import './App.css';
import SideBar from './components/sidebar/sidebar';
import TransferFunction from './components/transferfunction/transferfunction'
import Graph from './components/graph/graph';

function App() {
  return (
    <div className="App">
      <SideBar/>
      <div className='workspace'>
        <div className='transferfunctions'>
          <TransferFunction title='Função de transferência do sistema original' num="16" den='s² + 0.8s + 16' bg="#2191ED"/>
          <TransferFunction title='Função de transferência controlada em malha fechada' num="3.2s² + 8s + 1.6" den='s³ + 4s² + 24s + 1.6' bg="#ED9C21"/>
        </div>
        <div className='graphs'>
          <Graph 
            className="graph"
            title="Gráfico 1"
            xAxisLabel="Eixo X"
            yAxisLabel="Eixo Y"
            xScale={{ min: 0, max: 15 }}
            yScale={{ min: 0, max: 100 }}
            windowSize={15}
            updateInterval={1000}
            lineColor='rgba(255,0,0,1)'
          />
          <Graph 
            className="graph"
            title="Gráfico 2"
            xAxisLabel="Eixo X"
            yAxisLabel="Eixo Y"
            xScale={{ min: 0, max: 10 }}
            yScale={{ min: 0, max: 100 }}
            windowSize={10}
            updateInterval={300}
            lineColor='rgba(0,255,0,1)'
          />
          <Graph 
            className="graph"
            title="Gráfico 3"
            xAxisLabel="Eixo X"
            yAxisLabel="Eixo Y"
            xScale={{ min: 0, max: 20 }}
            yScale={{ min: 0, max: 100 }}
            windowSize={20}
            updateInterval={2000}
            lineColor='rgba(0,0,255,1)'
          />

        </div>
        <button className='downloadbutton'>Download</button>
      </div>
    </div>
  );
}

export default App;
