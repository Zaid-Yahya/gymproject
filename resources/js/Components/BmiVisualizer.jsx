import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BmiVisualizer = ({ bmi }) => {
  // BMI categories
  const categories = [
    { range: '<18.5', label: 'Trop maigre', color: '#d3ebfa' },
    { range: '18,5-24,9', label: 'Normal', color: '#aac754' },
    { range: '25-29,9', label: 'Surpoids', color: '#fbf5c6' },
    { range: '30-39,9', label: 'Obèse', color: '#fbe2ce' },
    { range: '40<', label: 'Obésité morbide', color: '#ffd5d5' },
  ];
  
  // Determine which category the BMI falls into
  const getBmiCategory = (bmiValue) => {
    if (!bmiValue) return null;
    
    if (bmiValue < 18.5) return 0;
    if (bmiValue >= 18.5 && bmiValue < 25) return 1;
    if (bmiValue >= 25 && bmiValue < 30) return 2;
    if (bmiValue >= 30 && bmiValue < 40) return 3;
    return 4;
  };
  
  const activeIndex = getBmiCategory(bmi);
  
  return (
    <div className="w-full max-w-3xl mx-auto mt-2">
      {/* Simple rectangles design */}
      <div className="flex w-full h-72 mb-2">
        {categories.map((category, index) => (
          <motion.div 
            key={index} 
            className="flex-1"
            style={{ backgroundColor: category.color }}
            animate={activeIndex === index ? 
              { scale: [1, 1.02, 1], boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : 
              { scale: 1, boxShadow: 'none' }
            }
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>

      {/* BMI ranges */}
      <div className="flex w-full mb-1">
        {categories.map((category, index) => (
          <motion.div 
            key={index} 
            className="flex-1 py-2 text-center text-sm font-semibold text-gray-700"
            style={{ backgroundColor: category.color }}
            animate={activeIndex === index ? 
              { y: [0, -5, 0], backgroundColor: category.color } : 
              { y: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            {category.range}
          </motion.div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex w-full">
        {categories.map((category, index) => (
          <motion.div 
            key={index} 
            className="flex-1 py-2 text-center text-sm border border-gray-200"
            animate={activeIndex === index ? 
              { 
                fontWeight: 700,
                borderColor: category.color,
                borderWidth: '2px'
              } : 
              { 
                fontWeight: 400,
                borderColor: 'rgba(229, 231, 235, 1)' // gray-200
              }
            }
            transition={{ duration: 0.3 }}
          >
            {category.label}
          </motion.div>
        ))}
      </div>

      {/* BMI Result */}
      <AnimatePresence>
        {bmi && (
          <motion.div 
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 relative overflow-hidden"
          >
            <div className="h-1 w-full bg-gray-200 mb-5">
              <motion.div 
                className="h-full"
                style={{ backgroundColor: categories[activeIndex]?.color || '#aac754' }}
                initial={{ width: '0%' }}
                animate={{ 
                  width: `${Math.min(Math.max(bmi / 40 * 100, 5), 100)}%`
                }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            
            <motion.div 
              className="p-6 rounded-xl border-2 flex flex-col items-center"
              style={{ 
                borderColor: categories[activeIndex]?.color || '#aac754',
                backgroundColor: `${categories[activeIndex]?.color}20` || '#aac75420'
              }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="mb-3 text-lg font-medium text-gray-600">Votre indice de masse corporelle est</div>
              <div className="text-5xl font-bold mb-3">{bmi}</div>
              <div className="px-4 py-1 rounded-full text-sm font-medium" 
                style={{ 
                  backgroundColor: categories[activeIndex]?.color,
                  color: activeIndex === 1 ? 'white' : 'rgba(55, 65, 81, 1)' // text-gray-700 or white
                }}
              >
                {categories[activeIndex]?.label}
              </div>
              
              <div className="mt-4 text-center text-gray-500 text-sm">
                {activeIndex === 1 ? (
                  "Félicitations! Votre poids est dans la plage normale."
                ) : activeIndex === 0 ? (
                  "Votre IMC indique que vous pourriez être en insuffisance pondérale."
                ) : (
                  "Votre IMC indique un excès de poids. Consultez un médecin pour des conseils."
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BmiVisualizer; 