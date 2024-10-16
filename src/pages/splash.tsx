import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '../index.css';

const Splash = () => {
  const [exit, setExit] = useState(false);

  // Trigger the exit animation after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
    }, 6000); // 10 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // const handleExit = () => {
  //   setExit(true);
  // };

  return (
    <div className="w-screen h-screen h_style  relative z-[999] bg-white" >
      {/* Left Black Background */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={exit ? { x: '-100%' } : { x: 0 }}
        transition={{ delay: 1, duration: 1, ease: [0.6, 0.05, -0.01, 0.9] }}
        className="h-full absolute left-0 bg-black w-[50%]"
      />

      {/* Right Black Background */}
      <motion.div
        initial={{ x: '100%' }}
        // animate={{ x: 0 }}
        // transition={{ delay: 1, duration: 1 }}
        animate={exit ? { x: '100%' } : { x: 0 }}
        transition={{ delay: 1, duration: 1, ease: [0.6, 0.05, -0.01, 0.9] }}
        exit={{ y: '-100%', transition: { duration: 1, ease: [0.6, 0.05, -0.01, 0.9] } }} // Exit animation
        className="h-full absolute right-0 bg-black w-[50%]"
      />

      {/* Text Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: exit ? 0 : 2,
          duration: 0.5,
        }}
        className="absolute top-[50%] left-[49%] transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-6xl uppercase"
      >

        <motion.span
          initial={{ opacity: 0, y: 50 }}
          animate={exit ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={exit ? { delay: 0.5 } : { delay: 2.5, duration: 1, ease: "easeIn" }}
          className='h_style inline-block mr-2 '
        >i </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 50 }}
          animate={exit ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={exit ? { delay: 0.5 } : { delay: 3.1, duration: 1, ease: "easeIn" }}
          className='h_style inline-block '
        >am </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 50 }}
          animate={exit ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={exit ? { delay: 0.5 } : { delay: 3.7, duration: 1, ease: "easeIn" }}

          className="text-red-500 h_style inline-block ml-2"
        >david</motion.span>


      </motion.div>
    </div>
  );
};

export default Splash;
