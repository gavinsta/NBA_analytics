import React from 'react'
import NBAcourt from "../tmp/NBA_court.svg"
/*
const Court = ({ usableWidth, height, comp }) => {
  return (
    <svg
      width={usableWidth}
      height={height}
      viewBox={`0 0 ${usableWidth} ${height}`}
    >
      <g>
        <path
          style={{
            fill: "orange.100",//`${comp === "Heatmap" ? "#fff" : "#000000"}`, 

            stroke: "orange", strokeWidth: "5",
          }}
          d="M 0,235 
          V 0 
          H 250 500 
          V 235 470 
          H 250 0 
          Z 
          m 187.80588, 228.7426 
          c 2.11624,-23.76794 16.97409, -43.61655 39.11036,-52.2475 10.74518,-4.1896 23.95509,-5.19874 35.44582,-2.70782 19.97733,4.33064 36.64358,18.40597 44.01404,37.17168 2.41756,6.15529 3.05156,9.00183 4.27056,19.17418 
          l 0.20235,1.6885 h 92.97549 92.97546 
          v -92.76839 -92.76838 
          h -13.79998 -13.8 
          v -1.58918 -1.58918 
          h 13.8 13.79998 
          v -67.93744 -67.93745 
          h -13.1159 -13.11588 
          l -1.54364,3.67498 
          c -0.84896,2.02123 -3.20852,7.07185 -5.24344,11.22357 -32.51948,66.34806 -95.13035,114.1028 -168.47151,128.49709 -30.05356,5.89847 -62.17185,5.8927 -92.3096,-0.0166 -30.45216,-5.97094 -60.67909,-18.37546 -86.8,-35.62097 
          C 86.44178,230.34277 61.10051,203.62105 42.83167,172.62468 38.96394,166.06237 32.10524,152.54087 29.5833,146.50635 
          l -1.7833,-4.2671 -12.3,-0.004 -12.3,-0.004 
          v 67.93745 67.93744 h 13 13 v 1.58918 1.58918 h -13 -13 v 92.76839 92.76838 h 92.16587 92.16587 z m 39.95132,2.4506 c 0.13353,-0.34565 0.2428,-0.97703 0.2428,-1.40305 0,-1.6098 1.7408,-5.81568 3.48868,-8.42886 6.01021,-8.98557 18.22249,-11.7968 28.26212,-6.50585 5.04966,2.66124 9.81131,9.23932 10.55567,14.58243 l 0.30441,2.18512 18.55009,0.10334 18.55009,0.10333 -0.27491,-3.08304 c -2.04968,-22.9861 -17.24558,-42.43223 -39.1608,-50.11388 -6.6719,-2.3386 -10.8294,-2.99036 -19.07536,-2.99036 -6.13615,0 -8.09603,0.14985 -11.47536,0.87746 -16.73193,3.60256 -30.31525,13.25042 -38.95748,27.67049 -4.52857,7.5562 -7.9249,18.62638 -7.95923,25.94281 l -0.008,1.6885 h 18.3572 c 16.37037,0 18.38349,-0.068 18.6,-0.62844 z m 39.84279,0.31461 c 0,-0.92132 -1.31027,-5.09733 -2.05312,-6.5436 -0.47132,-0.91759 -1.92129,-2.76931 -3.22216,-4.11487 -5.11788,-5.29367 -12.81309,-7.07037 -19.6209,-4.53015 -5.84157,2.17973 -10.54025,7.81178 -11.71763,14.04529 l -0.27522,1.45716 h 18.44451 c 10.14449,0 18.44452,-0.14124 18.44452,-0.31383 z M 259.55158,286.8371 c 31.1033,-1.49922 60.93104,-8.76359 88.98605,-21.67201 52.03567,-23.94221 94.10607,-66.7548 117.01163,-119.07594 l 2.05071,-4.6843 V 72.29161 3.17836 h -53.39999 -53.39999 v 4.1716 4.1716 h -1.60001 -1.6 v -4.1716 -4.1716 h -13.39999 -13.4 v 33.17413 33.17414 h 4.2 4.19999 v 1.58917 1.58918 h -4.19999 -4.2 v 3.37702 3.37701 h 4.2 4.19999 v 1.58917 1.58918 h -4.19999 -4.2 v 13.30939 13.30938 h 4.2 4.19999 v 1.58918 1.58918 h -4.19999 -4.2 v 13.30938 13.30938 h 4.2 4.19999 v 1.58918 1.58919 h -4.19999 -4.2 v 24.83093 24.83094 h -9.9755 -9.97548 l -0.21083,1.68851 c -0.11595,0.92867 -0.32366,2.91698 -0.46155,4.41847 -1.07482,11.70327 -7.43726,25.07355 -16.32794,34.31219 -5.85399,6.08308 -10.83202,9.65223 -18.6487,13.37075 -17.97648,8.55169 -39.86458,7.52302 -57.3447,-2.695 -16.63338,-9.72307 -27.75681,-26.8285 -29.81326,-45.84634 -0.24312,-2.24832 -0.44204,-4.34902 -0.44204,-4.66822 0,-0.49347 -1.4971,-0.58036 -10,-0.58036 h -10 v -24.83094 -24.83093 h -4.2 -4.2 v -1.58919 -1.58918 h 4.2 4.2 v -13.30938 -13.30938 h -4.2 -4.2 v -1.58918 -1.58918 h 4.2 4.2 V 95.94675 82.63736 h -4.2 -4.2 v -1.58918 -1.58917 h 4.2 4.2 V 76.082 72.70498 h -4.2 -4.2 V 71.1158 69.52663 h 4.2 4.2 V 36.35249 3.17836 H 154.2 140.8 v 4.1716 4.1716 h -1.60001 -1.6 V 7.34996 3.17836 H 84.19668 30.79338 l 0.10331,69.62595 0.10332,69.62595 3.51411,7.5486 c 9.1581,19.67231 20.0447,36.78329 34.12436,53.63483 5.54053,6.63131 21.64671,22.63286 28.36152,28.17727 15.08195,12.45318 29.92619,22.1061 46.8,30.43316 11.21427,5.53414 19.22193,8.81747 30.99999,12.71072 28.1157,9.29368 56.41581,13.26806 84.75159,11.90226 z m 1.24841,-39.51217 c 11.61293,-2.55193 21.15492,-7.70216 29.43445,-15.88706 6.20926,-6.13829 10.03998,-11.78807 13.07404,-19.28234 2.29525,-5.66939 4.2915,-14.46113 4.2915,-18.90025 v -1.36179 h -58.459 -58.459 l 0.26345,3.40433 c 1.0423,13.46827 6.96587,25.97014 17.0296,35.9415 9.19898,9.11452 19.06144,14.19631 32.02496,16.50135 4.11922,0.73244 16.72132,0.48056 20.8,-0.41574 z m -73.2,-151.37818 V 3.17836 h -8.4 H 170.8 v 92.76839 92.76838 h 8.39999 8.4 z m 119.79919,89.68935 c -2.00881,-22.98814 -17.17865,-42.41769 -39.12383,-50.10987 -6.6719,-2.33862 -10.8294,-2.99038 -19.07536,-2.99038 -6.13615,0 -8.09603,0.14987 -11.47536,0.87747 -16.73193,3.60254 -30.31525,13.25043 -38.95748,27.67049 -4.52857,7.5562 -7.9249,18.62641 -7.95923,25.94282 l -0.008,1.6885 h 58.43412 58.43413 z m 20.2008,-89.68935 V 3.17836 h -8.4 -8.39999 v 92.76839 92.76838 h 8.39999 8.4 z m -133.29043,66.72439 c 8.02415,-15.84541 23.50318,-27.89489 40.83259,-31.7857 26.82147,-6.02197 53.84385,5.63144 67.44122,29.08402 1.03208,1.78012 2.5775,4.90881 3.43427,6.95266 l 1.55776,3.71609 0.0124,-83.72992 0.0123,-83.72993 h -58.39999 -58.4 l 0.0196,83.72993 0.0196,83.72992 0.9251,-2.38378 c 0.50881,-1.31106 1.65422,-3.82355 2.54535,-5.58329 z M 246.09554,62.24227 c -6.40663,-2.30778 -7.92907,-10.74415 -2.75343,-15.2577 0.7641,-0.66634 2.03471,-1.42311 2.82357,-1.68169 1.12074,-0.36738 1.43431,-0.68057 1.43431,-1.43259 v -0.96243 h -14.2 -14.2 V 41.31868 39.7295 h 30 29.99999 v 1.58918 1.58918 h -14.19999 -14.2 v 0.96243 c 0,0.73968 0.31054,1.06421 1.34181,1.40226 2.06244,0.67607 4.50956,2.98297 5.27443,4.97221 1.04357,2.71406 0.67965,6.47254 -0.83715,8.64605 -2.22064,3.18207 -6.8475,4.66122 -10.48354,3.35146 z m 6.33585,-3.55144 c 1.74902,-1.17069 2.98152,-4.0028 2.60636,-5.98907 -0.5762,-3.0506 -4.26925,-5.39246 -7.22534,-4.58177 -5.15931,1.41492 -6.19521,7.96915 -1.69069,10.69715 1.78966,1.08384 4.58531,1.02788 6.30967,-0.12631 z M 27.6,71.1158 V 3.17836 H 15.40001 3.2 V 71.1158 139.05325 H 15.40001 27.6 Z m 469.19996,0 V 3.17836 h -12.99998 -13 v 67.93744 67.93745 h 13 12.99998 z"
          id="path2553" />
      </g>
    </svg>
  )
}
*/

const Court = ({ usableWidth: number, height, comp }) => {
  return (
    <img src={NBAcourt}></img>
  )
}
export default Court