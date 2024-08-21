import './sidebar.css'
import logo from '../../assets/images/logo.svg' 
import {opensubmenu, opensubsubmenu, restartmenu} from './managementfunctions'

function SideBar(){
    return(
        <div className='sidebar' >
            <img src={logo} className='logo' alt='logo' onClick={()=>{restartmenu('activesidebaroption','sidebaroption')}}></img>
            <div className='sidebaroptions'>
                <div className='sidebaroption' id='analysis' onClick={()=>{opensubmenu('analysissubmenu', 'analysis')}}>Análise
                    <div className='sidebaroptionsubtitle analysissubmenu' id='continuous' onClick={()=>{opensubsubmenu('','continuous')}}>Contínua</div>
                    <div className='sidebaroptionsubtitle analysissubmenu' id='discrete' onClick={()=>{opensubsubmenu('discretesidebarparameter','discrete')}}>Discreta
                        <div className='sidebarparameter discretesidebarparameter'>Amostragem:
                            <input type='number' defaultValue = '0.001' className='sidebarinput'></input>
                        </div>
                    </div>
                </div>
                
                <div className='sidebaroption' id='transfer' onClick={()=>{opensubmenu('transfersubmenu', 'transfer')}}>Função de transferência
                    <div className='sidebaroptionsubtitle transfersubmenu' id='firstorder' onClick={()=>{opensubsubmenu('firstordersidebarparameter','firstorder')}}>Primeira Ordem
                        <div className='sidebarparameter firstordersidebarparameter'>Ganho:
                            <input type='number' defaultValue = '0.001' className='sidebarinput'></input>
                        </div>
                        <div className='sidebarparameter firstordersidebarparameter'>Tau:
                            <input type='number' defaultValue = '0.001' className='sidebarinput'></input>
                        </div>
                    </div>
                </div>
                <div className='sidebaroption' id="control" onClick={()=>{opensubmenu('controlsubmenu','control')}}>Controladores
                    <div className='sidebarparameter controlsubmenu'>Kp:
                        <input type='number' defaultValue = '1.0' className='sidebarinput'></input>
                    </div>
                    <div className='sidebarparameter controlsubmenu'>Ki:
                        <input type='number' defaultValue = '0.5' className='sidebarinput'></input>
                    </div>
                    <div className='sidebarparameter controlsubmenu'>Kd:
                        <input type='number' defaultValue = '0.2' className='sidebarinput'></input>
                    </div>
                    <div className='sidebaroptionsubtitle controlsubmenu' id='p'  onClick={()=>{opensubsubmenu('','p')}}>Proporcional</div>
                    <div className='sidebaroptionsubtitle controlsubmenu' id='pi'  onClick={()=>{opensubsubmenu('','pi')}}>Proporcional-Integral</div>
                    <div className='sidebaroptionsubtitle controlsubmenu' id='pd'  onClick={()=>{opensubsubmenu('','pd')}}>Proprocional-Derivativo</div>
                    <div className='sidebaroptionsubtitle controlsubmenu' id='pid'  onClick={()=>{opensubsubmenu('','pid')}}>Proporcional-Integral-Derivativo</div>
                </div>
            </div>
        </div>
    )
}

export default SideBar