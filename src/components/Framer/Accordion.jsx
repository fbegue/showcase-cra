import * as React from "react";
import { useState,useEffect} from "react";
import { motion, AnimatePresence,useMotionValue } from "framer-motion";
//import { ContentPlaceholder } from "./ContentPlaceholder";
import './Accordion.css'
import RotateSpring from "../springs/RotateSpring";
import FilterListIcon from "@material-ui/icons/FilterList";
import InputIcon from "@material-ui/icons/Input";
import {TabControl} from "../../index";
const Accordion = ({infoBound,collapse, setCollapse,content }) => {
     // const i = 0;
    // const isOpen = i === collapse;
   // let isOpen = collapse;

    //const isOpen = collapse;
  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions

    //todo: I don't understand this - it's not animating the value?
  //   const scale = useMotionValue(1)
  //
  //   useEffect(() => {
  //       if(infoBound > 47){
  //           scale.set(1.5)
  //       }else{
  //           scale.set(1)
  //       }
  //
  //   }, [infoBound])

    //console.log("$x",x);


    let tabcontrol = TabControl.useContainer()

  return (
    <div className={'accordion'}>

      <AnimatePresence>
          initial={false}
        {!(collapse) && (
          <motion.section
            key="content"
            //todo: needed to set initial here in order to not have it re-animate the open sequence on tab switch
              //but this somehow messes up the collapse animation? tried to replicate in codesandbox but w/out tabs
            layout={true}
             initial="collapsed"
            //initial={collapse ? 'open':'collapsed'}
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: '0px' }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {content}
            {/* <ContentPlaceholder /> */}
          </motion.section>
        )}
      </AnimatePresence>
      <motion.header
        initial={false}
        //testing: testing in codesandbox, it seems like the 'layout' property should auto-animate
        //changes to inner content (like height) but couldn't get it to work = just change position w/ margin
        //testing: marginTop: collapse ? infoBound -70:0
        animate={{ backgroundColor: collapse ? "#FF0088" : "#0055FF",y: collapse ? 0:infoBound -80}}
        transition={{ duration: 0.3 }}
        // onClick={() => setcollapse(collapse ? false : i)}
        onClick={() => setCollapse(collapse ? false : true)}
      >
      <div style={{display:"flex"}}>
          <div style={{marginLeft:".5em"}}><RotateSpring vert={true} toggle={setCollapse} state={collapse} target={<InputIcon fontSize={'inherit'} style={{fontSize:"32px"}} color={'secondary'} />}/>
          </div>
          <div>
              {collapse ? 'expand':'collapse'} {tabcontrol.section === 2 ? 'friends':'summary'}
          </div>
      </div>
      </motion.header>
    </div>
  );
};

export default Accordion
