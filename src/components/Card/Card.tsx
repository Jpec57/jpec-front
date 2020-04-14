import React from 'react';
import './Card.scss';
import { useHistory } from "react-router-dom";

const defaultImg = "https://singularityhub.com/wp-content/uploads/2018/11/multicolored-brain-connections_shutterstock_347864354-1068x601.jpg";
const Card = (props: any) => {
    const {name, path, img} = props;
    const history = useHistory();

    return (
            <div className="card" onClick={()=>{history.push(path)}}>   
            <div>
                <img src={img ?? defaultImg} alt="img"/>
            </div>
            <div className="card-footer">
                <span>{name}</span>
            </div>
            </div>
    );
};

export default Card;