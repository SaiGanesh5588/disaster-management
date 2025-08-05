import { useState } from 'react';

const Us = () => {
    const [city, setCity] = useState("eluru");
    
    // if (city === "eluru")
    //     setCity("hyd")
    
    return (
        <div>{city}</div>
    );
};

export default Us;