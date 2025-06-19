import React, { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const CategoryCard = ({ category, items }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
     className={`
  flex flex-col sm:flex-row items-start sm:items-center gap-4 
  cursor-pointer bg-gradient-to-r from-gray-800 to-black text-white 
  rounded-xl px-4 py-4 shadow-md hover:shadow-lg 
  overflow-hidden transition-all duration-500 ease-in-out
  ${expanded ? 'max-h-full' : 'max-h-[4.5rem]'}
`}
      style={{
        width: expanded ? 'fit-content' : '13rem',
        maxWidth: expanded ? '100%' : '13rem',
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <ChevronRightIcon
          className={`h-5 w-5 text-white transition-transform duration-300 ${
            expanded ? 'rotate-90' : ''
          }`}
        />
        <h2 className="text-md font-semibold text-blue-400">{category}</h2>
      </div>

      {/* Expandable content */}
      <div
  className={`transition-opacity duration-500 ease-in-out ${
    expanded ? 'opacity-100 ml-2' : 'opacity-0 pointer-events-none'
  }`}
>
  <div className="w-full overflow-x-auto pb-2">
    <div
      className={`
        flex gap-2
        ${expanded ? 'mt-2' : ''}
        flex-nowrap
        min-w-max
      `}
    >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg px-3 py-1 shadow-sm border-l-4 min-w-[160px] ${
                item.qty === 0
                  ? 'bg-red-100 border-red-500'
                  : 'bg-orange-100 border-orange-400'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">
                {item.name} — {item.qty} left
              </div>
              {item.barcode && (
                <div className="text-xs text-gray-600 font-semibold">
                  Expected: {item.dynamicThreshold}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};


const AlertsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/alerts`)
      .then((res) => res.json())
      .then((response) => {
        const arr = Object.entries(response).map(([category, items]) => ({
          category,
          items: items.map((item) => ({
            name: item.productName,
            qty: item.currentQuantity,
            barcode: item.barcode,
            dynamicThreshold: item.dynamicThreshold,
          })),
        }));
        setData(arr);
      })
      .catch((err) => console.error('Failed to fetch alerts', err));
  }, []);

  return (
    <>
    <div className='alert min-h-screen'>

    <div className="py-6 px-4">
    

      <h1 className="text-3xl font-bold mb-6 tracking-wider flex items-center">Low Stock Alerts
        <img src="alert.svg" className='h-[80px] w-[60px]'></img>
      </h1>
      


      <div className="flex flex-col space-y-4">
        {data.length === 0 ? (
          <p className="text-white">No alerts to display.</p>
        ) : (
          data.map((group, idx) => (
            <CategoryCard key={idx} category={group.category} items={group.items} />
          ))
        )}
      </div>
    </div>
    </div>
          </>
  );
};

export default AlertsPage;
