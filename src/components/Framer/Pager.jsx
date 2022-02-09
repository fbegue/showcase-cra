import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './Pager.css'
import Stats from "../Stats";
import ContextStats from "../ContextStats";
import EventsList from "../Events/EventsList";
import {TabControl} from '../../index'
// import { images } from "./image-data";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset,velocity) => {
  return Math.abs(offset) * velocity;
};

const Pager = () => {

  let tabcontrol = TabControl.useContainer()
  const [[page, direction], setPage] = useState([tabcontrol.page, 0]);


  // We only have 3 pages, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

   const height = "40em"
   const width = "10em"
  // const height = "100%"
  // const width =  "100%"
  const contents = [
    <div className="content" style={{background:'blue',height:height,width:width}}>content</div>,
    <div  className="content" style={{background:'pink',height:height,width:width}}>content</div>,
    <div  className="content" style={{background:'orange',height:height,width:width}}>content</div>
  ]

  const pages = [
    {
      content:
          <div >
            <Stats/>
          </div>
    },
    {
      content:
          <div >
            <ContextStats/>
          </div>
    },
    {
      content:
          <div >
            <EventsList data={[]} />
          </div>
    },
  ]

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
         // src={images[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >{pages[page].content}</motion.div>
      </AnimatePresence>
      {/* <div className="next" onClick={() => paginate(1)}>
        {"‣"}
      </div>
      <div className="prev" onClick={() => paginate(-1)}>
        {"‣"}
      </div> */}
    </>
  );
};
export default Pager;
