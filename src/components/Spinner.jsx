import React, { useState, useEffect } from "react";
import {
  BarLoader,
  BeatLoader,
  BounceLoader,
  CircleLoader,
  ClimbingBoxLoader,
  ClipLoader,
  ClockLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  PacmanLoader,
  PropagateLoader,
  PuffLoader,
  PulseLoader,
  RingLoader,
  RiseLoader,
  RotateLoader,
  ScaleLoader,
  SyncLoader,
} from "react-spinners";

import "./../App.css"

const LoaderList = [
  <BarLoader key="BarLoader" color="#0d6efd" size={100} />,
  <BeatLoader key="BeatLoader" color="#0d6efd" size={15} />,
  <BounceLoader key="BounceLoader" color="#0d6efd" size={60} />,
  <CircleLoader key="CircleLoader" color="#0d6efd" size={50} />,
  <ClimbingBoxLoader key="ClimbingBoxLoader" color="#0d6efd" size={15} />,
  <ClipLoader key="ClipLoader" color="#0d6efd" size={35} />,
  <ClockLoader key="ClockLoader" color="#0d6efd" size={50} />,
  <DotLoader key="DotLoader" color="#0d6efd" size={60} />,
  <FadeLoader key="FadeLoader" color="#0d6efd" size={15} />,
  <GridLoader key="GridLoader" color="#0d6efd" size={15} />,
  <HashLoader key="HashLoader" color="#0d6efd" size={50} />,
  <MoonLoader key="MoonLoader" color="#0d6efd" size={60} />,
  <PacmanLoader key="PacmanLoader" color="#0d6efd" size={25} />,
  <PropagateLoader key="PropagateLoader" color="#0d6efd" size={15} />,
  <PuffLoader key="PuffLoader" color="#0d6efd" size={60} />,
  <PulseLoader key="PulseLoader" color="#0d6efd" size={15} />,
  <RingLoader key="RingLoader" color="#0d6efd" size={60} />,
  <RiseLoader key="RiseLoader" color="#0d6efd" size={15} />,
  <RotateLoader key="RotateLoader" color="#0d6efd" size={15} />,
  <ScaleLoader key="ScaleLoader" color="#0d6efd" size={35} />,
  <SyncLoader key="SyncLoader" color="#0d6efd" />,
];

function RandomLoader() {
  const [randomLoader, setRandomLoader] = useState(null);

  useEffect(() => {
    // Generate a random index to select a loader
    const randomIndex = Math.floor(Math.random() * LoaderList.length);
    setRandomLoader(LoaderList[randomIndex]);
  }, []);

  return <div className="overlay">{randomLoader}</div>;
}

export default RandomLoader;
