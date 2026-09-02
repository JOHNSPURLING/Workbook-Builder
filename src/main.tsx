import React from 'react';
import ReactDOM from 'react-dom/client';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import './styles.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type Crop = { x:number; y:number; width:number; height:number; page:number };

function App(){
 const [pdf,setPdf]=React.useState<any>(null);
 const [page,setPage]=React.useState(1);
 const [scale,setScale]=React.useState(1.25);
 const [crop,setCrop]=React.useState<Crop|null>(null);
 const canvasRef=React.useRef<HTMLCanvasElement>(null);
 const wrapRef=React.useRef<HTMLDivElement>(null);
 const drag=React.useRef<{x:number;y:number}|null>(null);

 async function loadFile(file:File){
  const bytes=await file.arrayBuffer();
  const doc=await pdfjsLib.getDocument({data:bytes}).promise;
  setPdf(doc); setPage(1); setCrop(null);
 }
 React.useEffect(()=>{(async()=>{
  if(!pdf||!canvasRef.current)return;
  const p=await pdf.getPage(page); const viewport=p.getViewport({scale});
  const canvas=canvasRef.current; const ctx=canvas.getContext('2d')!;
  canvas.width=viewport.width; canvas.height=viewport.height;
  await p.render({canvasContext:ctx,viewport}).promise;
 })()},[pdf,page,scale]);
 function point(e:React.PointerEvent){const r=wrapRef.current!.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
 function down(e:React.PointerEvent){if(!pdf)return;drag.current=point(e);setCrop(null);(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
 function move(e:React.PointerEvent){if(!drag.current)return;const p=point(e),s=drag.current;setCrop({x:Math.min(s.x,p.x),y:Math.min(s.y,p.y),width:Math.abs(p.x-s.x),height:Math.abs(p.y-s.y),page})}
 function up(){drag.current=null}
 function saveCrop(){if(!crop)return; const normalised={...crop,x:crop.x/scale,y:crop.y/scale,width:crop.width/scale,height:crop.height/scale}; localStorage.setItem('workbook:lastCrop',JSON.stringify(normalised)); alert('Selection saved as a workbook crop block.');}
 return <main>
  <header><div><strong>Workbook Builder</strong><span>PDF Question Picker</span></div><label className="upload">Add PDF<input type="file" accept="application/pdf" onChange={e=>e.target.files?.[0]&&loadFile(e.target.files[0])}/></label></header>
  <section className="toolbar">
   <button disabled={!pdf||page<=1} onClick={()=>setPage(p=>p-1)}>← Previous</button><span>Page {page}{pdf?` of ${pdf.numPages}`:''}</span><button disabled={!pdf||page>=pdf.numPages} onClick={()=>setPage(p=>p+1)}>Next →</button>
   <span className="spacer"/><button onClick={()=>setScale(s=>Math.max(.6,s-.15))}>−</button><span>{Math.round(scale*100)}%</span><button onClick={()=>setScale(s=>Math.min(2.5,s+.15))}>+</button>
  </section>
  <div className="workspace">
   <aside><h3>Select content</h3><p>Drag a box around a question, group of questions, worked example or worksheet section.</p><p>The selection is stored as page and crop coordinates, so the original PDF remains untouched.</p>{crop&&<div className="selection"><b>Current selection</b><span>Page {crop.page}</span><span>{Math.round(crop.width)} × {Math.round(crop.height)} px</span><button onClick={saveCrop}>Use selection</button><button className="secondary" onClick={()=>setCrop(null)}>Clear</button></div>}</aside>
   <div className="stage">{!pdf?<div className="empty"><h2>Add a worksheet PDF</h2><p>The file stays in your browser. It is not uploaded to a server.</p></div>:<div className="page" ref={wrapRef} onPointerDown={down} onPointerMove={move} onPointerUp={up}><canvas ref={canvasRef}/>{crop&&<div className="crop" style={{left:crop.x,top:crop.y,width:crop.width,height:crop.height}}/>}</div>}</div>
  </div>
 </main>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
