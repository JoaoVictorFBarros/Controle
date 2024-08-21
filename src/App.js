import './App.css';
import SideBar from './components/sidebar/sidebar';
import TransferFunction from './components/transferfunction/transferfunction'

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
          <img alt='grafico 1'className='graph'/>
          <img alt='grafico 2'className='graph'/>
          <img alt='grafico 3'className='graph'/>

        </div>
        <button className='downloadbutton'>Download</button>
      </div>
    </div>
  );
}

export default App;
