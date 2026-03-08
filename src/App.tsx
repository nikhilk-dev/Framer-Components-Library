import './framer/styles.css'

import MasonryGridFramerComponent from './framer/masonry-grid'

export default function App() {
  return (
    <div className='flex flex-col items-center gap-3 bg-[rgb(245,_245,_245)]'>
      <MasonryGridFramerComponent.Responsive />
    </div>
  );
};