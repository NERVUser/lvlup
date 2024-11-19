import React from 'react';
import '.\recommendations.css';
import all from '@mui'

 const getrecs = async () =>
 {
    const response = await fetch('api here')
    if (!response)
    {
        break;
    }
 }

return (
    <div className = "Holder">
        {recommendations.map(recommendations) =>
            <div key = recommendation.id} className = recommendations_list>
                <h1>
                    {actual_recommendation}
                </h1>
                    
            
            </div>}
    </div>
    
)




export default recommendations;
