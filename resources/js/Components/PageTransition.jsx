import React from 'react';
import { motion } from 'framer-motion';

// Different transition effects that can be used throughout the app
export const pageTransitionVariants = {
  fadeUp: {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  },
  fadeScale: {
    initial: {
      opacity: 0,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  },
  slideInRight: {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }
};

const PageTransition = ({ children, variant = 'fadeUp' }) => {
  // Get the variant from our predefined transitions or use fadeUp as default
  const selectedVariant = pageTransitionVariants[variant] || pageTransitionVariants.fadeUp;
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 