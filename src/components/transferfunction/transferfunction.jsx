import './transferfunction.css'

export default function TransferFunction(props){
    return(
        <div className='transferfunction' style={{backgroundColor: props.bg}}>{props.title}
            <div className='fraction'>
                <div className='numerator'>{props.num}</div>
                <div>{props.den}</div>
            </div>
        </div>
    )
}